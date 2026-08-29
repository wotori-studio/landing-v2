"use client";

import dynamic from "next/dynamic";
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import type {
  Group,
  Material,
  Mesh,
  Object3D,
  PerspectiveCamera,
  WebGLRenderer,
} from "three";
import type { AvatarSpatialBounds } from "@ekza/avatar-renderer/model";
// Type-only, therefore erased at build time: it registers the R3F
// JSX.IntrinsicElements augmentation without pulling three into the page chunk.
import type {} from "@react-three/fiber";

/**
 * The canvas clear colour. `mirror.deep` as a literal on purpose: WebGL cannot
 * read a CSS custom property, and this must match the ground the section sits on.
 */
const BACKGROUND = "#0C0F0C";

/** Give up waiting for the VRM upgrade / retargeted clips and show what we have. */
const SETTLE_TIMEOUT_MS = 10_000;
/** Auto-rotate stays parked for this long after the visitor drags or zooms. */
const AUTOROTATE_RESUME_MS = 2_500;
/** Painted frames the avatar must survive before we call it "loaded". */
const FRAMES_BEFORE_READY = 2;

const NO_ANIMATIONS: string[] = [];

export type Avatar3DProps = {
  url: string;
  label: string;
  /** exact clip name from onAnimations; "tpose" stops motion */
  animation?: string;
  /** fires with the clip names available for the loaded model */
  onAnimations?: (names: string[]) => void;
  /** true from the moment a url starts loading until that model is on screen */
  onLoadingChange?: (loading: boolean) => void;
  fallback?: ReactNode;
};

type AvatarCanvasProps = {
  url: string;
  animation?: string;
  autoRotate: boolean;
  onAnimations: (names: string[]) => void;
  onReady: () => void;
};

/** Camera framing handed from the load probe to the rig, without re-rendering. */
type ViewerFraming = {
  bounds: AvatarSpatialBounds | null;
  version: number;
};

/**
 * Lazy boundary around three.js, @react-three/fiber and @ekza/avatar-renderer.
 * None of that is fetched until this component mounts, i.e. after the visitor
 * opens the 3D view, so the landing stays light for everyone who never does.
 *
 * Everything WebGL lives inside this factory closure precisely to keep those
 * heavy imports out of the page chunk; the module scope above must stay free of
 * value imports from three.
 */
const AvatarCanvas = dynamic<AvatarCanvasProps>(
  async () => {
    const [fiber, modelApi, previewApi, controlsApi, loaderApi, three] =
      await Promise.all([
        import("@react-three/fiber"),
        import("@ekza/avatar-renderer/model"),
        import("@ekza/avatar-renderer/preview"),
        import("three/examples/jsm/controls/OrbitControls.js"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("three"),
      ]);

    const { Canvas, useFrame, useLoader, useThree } = fiber;
    const {
      AvatarModel,
      configureAvatarGltfLoader,
      detectVrmKind,
      measureAvatarSpatialBounds,
    } = modelApi;
    const {
      DEFAULT_AVATAR_PREVIEW_FOV,
      DEFAULT_AVATAR_PREVIEW_HEIGHT,
      fitAvatarPreviewCamera,
    } = previewApi;
    const { OrbitControls } = controlsApi;
    const { GLTFLoader } = loaderApi;

    function disposeMaterial(material: Material) {
      const values = Object.values(
        material as unknown as Record<string, unknown>,
      );
      for (const value of values) {
        if (value instanceof three.Texture) value.dispose();
      }
      material.dispose();
    }

    /** Free the GPU side of a scene graph nothing owns any more. */
    function disposeObject3D(root: Object3D) {
      root.traverse((object) => {
        const mesh = object as Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach(disposeMaterial);
      });
    }

    // useLoader caches the parsed glTF forever, and AvatarModel's clone shares
    // its geometries and materials. Browsing avatars would otherwise keep every
    // visited model resident, so the last consumer of a url releases both.
    const retained = new Map<string, number>();

    function retainModel(url: string) {
      retained.set(url, (retained.get(url) ?? 0) + 1);
    }

    function releaseModel(url: string, scene: Object3D) {
      const next = Math.max(0, (retained.get(url) ?? 1) - 1);
      retained.set(url, next);
      if (next > 0) return;
      // React StrictMode unmounts and immediately remounts the same tree with
      // this exact glTF instance, so disposal waits for the next task.
      window.setTimeout(() => {
        if ((retained.get(url) ?? 0) > 0) return;
        retained.delete(url);
        try {
          useLoader.clear(GLTFLoader, url);
        } catch (error) {
          console.warn("[avatar-3d] could not clear the loader cache", error);
        }
        disposeObject3D(scene);
      }, 0);
    }

    /**
     * Camera, orbit controls and framing.
     *
     * The framing repeats AvatarPreview's maths so every avatar sits in frame
     * the same way at any aspect ratio, and re-runs whenever the load probe
     * publishes fresh bounds or the canvas is resized.
     */
    function Rig({
      autoRotate,
      framing,
    }: {
      autoRotate: boolean;
      framing: MutableRefObject<ViewerFraming>;
    }) {
      const camera = useThree((state) => state.camera) as PerspectiveCamera;
      const domElement = useThree((state) => state.gl.domElement);
      const size = useThree((state) => state.size);

      const controls = useMemo(() => {
        const orbit = new OrbitControls(camera, domElement);
        orbit.enablePan = false;
        orbit.enableZoom = true;
        orbit.enableDamping = true;
        orbit.dampingFactor = 0.08;
        orbit.rotateSpeed = 0.85;
        orbit.autoRotateSpeed = 0.8;
        orbit.minPolarAngle = 0.2;
        orbit.maxPolarAngle = Math.PI - 0.35;
        orbit.target.set(0, DEFAULT_AVATAR_PREVIEW_HEIGHT / 2, 0);
        return orbit;
      }, [camera, domElement]);

      const lastInput = useRef(0);
      const applied = useRef({ version: -1, width: 0, height: 0 });

      useEffect(() => {
        const mark = () => {
          lastInput.current = performance.now();
        };
        controls.addEventListener("start", mark);
        controls.addEventListener("end", mark);
        return () => {
          controls.removeEventListener("start", mark);
          controls.removeEventListener("end", mark);
          controls.dispose();
        };
      }, [controls]);

      useFrame(() => {
        const target = framing.current;
        const stale =
          target.version !== applied.current.version ||
          size.width !== applied.current.width ||
          size.height !== applied.current.height;

        if (stale && target.bounds) {
          applied.current = {
            version: target.version,
            width: size.width,
            height: size.height,
          };
          const fitted = fitAvatarPreviewCamera({
            bounds: target.bounds,
            aspect: camera.aspect,
            verticalFovDegrees: camera.fov,
          });
          // Keep whatever angle the visitor orbited to; only the pivot and the
          // distance are recomputed for the new model.
          const direction = camera.position.clone().sub(controls.target);
          if (direction.lengthSq() < 1e-8) direction.set(0, 0.06, 1);
          direction.normalize();
          controls.target.set(fitted.target.x, fitted.target.y, fitted.target.z);
          controls.minDistance = fitted.minDistance;
          controls.maxDistance = fitted.maxDistance;
          camera.near = fitted.near;
          camera.far = fitted.far;
          camera.position
            .copy(controls.target)
            .addScaledVector(direction, fitted.distance);
          camera.updateProjectionMatrix();
        }

        controls.autoRotate =
          autoRotate &&
          performance.now() - lastInput.current > AUTOROTATE_RESUME_MS;
        controls.update();
      });

      return null;
    }

    /**
     * The honest part of the loading state.
     *
     * It shares AvatarModel's `useLoader` cache entry (same loader class, same
     * url, one fetch) so it suspends on the same download, then watches the
     * real scene graph:
     *
     * 1. Suspense resolves: the multi-megabyte file is downloaded and parsed.
     * 2. For a VRM, AvatarModel swaps its plain-glTF clone for the true VRM
     *    parse and the retargeted clips arrive. The primitive under the holder
     *    changes identity, which is what `swapped` waits for.
     * 3. Bounds are measured and published, giving the rig one frame to frame
     *    the camera before anything is shown.
     * 4. The avatar is revealed, and only after it has actually been painted
     *    for a couple of frames does `onReady` fire.
     */
    function Ready({
      clipsSeen,
      framing,
      holder,
      onReady,
      url,
    }: {
      clipsSeen: MutableRefObject<boolean>;
      framing: MutableRefObject<ViewerFraming>;
      holder: MutableRefObject<Group | null>;
      onReady: () => void;
      url: string;
    }) {
      // Same loader class and same url as AvatarModel, so this shares its
      // cache entry: one fetch, one parse, two consumers of the result.
      const loaded = useLoader(GLTFLoader, url, (loader) =>
        configureAvatarGltfLoader(loader as InstanceType<typeof GLTFLoader>),
      );

      const expectsVrm = useMemo(() => {
        const source = loaded as unknown as {
          parser?: { json?: Parameters<typeof detectVrmKind>[0] };
        };
        return detectVrmKind(source.parser?.json) !== "none";
      }, [loaded]);

      const scene = (loaded as unknown as { scene: Object3D }).scene;

      useEffect(() => {
        retainModel(url);
        return () => releaseModel(url, scene);
      }, [scene, url]);

      const progress = useRef({
        startedAt: 0,
        firstUuid: "",
        swapped: false,
        measured: false,
        frames: 0,
        done: false,
      });
      if (progress.current.startedAt === 0) {
        progress.current.startedAt = performance.now();
      }

      useFrame(() => {
        const step = progress.current;
        if (step.done) return;

        const group = holder.current;
        if (!group) return;
        // AvatarModel renders <group><primitive object={model} /></group>.
        const inner = group.children.length > 0 ? group.children[0] : null;
        const rendered =
          inner && inner.children.length > 0 ? inner.children[0] : null;

        if (rendered) {
          if (!step.firstUuid) step.firstUuid = rendered.uuid;
          else if (rendered.uuid !== step.firstUuid) step.swapped = true;
        }

        if (!step.measured) {
          // React unhides a resolved Suspense subtree by walking it and
          // restoring `visible`, so keep asserting the hidden state.
          if (group.visible) group.visible = false;
          const expired = performance.now() - step.startedAt > SETTLE_TIMEOUT_MS;
          const settled =
            rendered !== null &&
            (!expectsVrm || (step.swapped && clipsSeen.current));
          if (!settled && !expired) return;
          if (!inner) return;
          // The holder is hidden and `traverseVisible` stops at an invisible
          // root, so the still-visible normalization group is what we measure.
          framing.current = {
            bounds: measureAvatarSpatialBounds(inner),
            version: framing.current.version + 1,
          };
          step.measured = true;
          return;
        }

        if (!group.visible) {
          group.visible = true;
          return;
        }

        step.frames += 1;
        if (step.frames < FRAMES_BEFORE_READY) return;
        step.done = true;
        onReady();
      });

      return null;
    }

    function AvatarCanvasInner({
      animation,
      autoRotate,
      onAnimations,
      onReady,
      url,
    }: AvatarCanvasProps) {
      const holder = useRef<Group | null>(null);
      const framing = useRef<ViewerFraming>({ bounds: null, version: 0 });
      const clipsSeen = useRef(false);

      // Hidden imperatively rather than through a `visible` prop: the probe
      // flips it back on outside React, and a re-render must not undo that.
      const attachHolder = useCallback((group: Group | null) => {
        holder.current = group;
        if (group) group.visible = false;
      }, []);

      const handleAnimations = useCallback(
        (names: string[]) => {
          if (names.length > 0) clipsSeen.current = true;
          onAnimations(names);
        },
        [onAnimations],
      );

      const handleCreated = useCallback((state: { gl: WebGLRenderer }) => {
        state.gl.setClearColor(new three.Color(BACKGROUND), 1);
        // Match AvatarPreview across the r139 to r152 colour-space rename.
        const output = state.gl as unknown as {
          outputColorSpace?: string;
          outputEncoding?: number;
        };
        if (typeof output.outputColorSpace === "string") {
          output.outputColorSpace = "srgb";
        } else {
          output.outputEncoding = 3001;
        }
      }, []);

      useEffect(() => {
        clipsSeen.current = false;
      }, [url]);

      return (
        <Canvas
          flat
          dpr={[1, 2]}
          gl={{
            alpha: false,
            antialias: true,
            powerPreference: "high-performance",
          }}
          camera={{
            far: 100,
            fov: DEFAULT_AVATAR_PREVIEW_FOV,
            near: 0.01,
            position: [0, DEFAULT_AVATAR_PREVIEW_HEIGHT * 0.55, 2.6],
          }}
          onCreated={handleCreated}
        >
          <ambientLight intensity={0.9} />
          <directionalLight intensity={1.25} position={[2, 3, 3]} />
          <directionalLight intensity={0.45} position={[-2, 1, -2]} />
          <Rig autoRotate={autoRotate} framing={framing} />
          <Suspense fallback={null}>
            {/* Keyed so a new url tears the old avatar down instead of
                re-suspending it, which is also what frees its GPU memory. */}
            <group key={`model:${url}`} ref={attachHolder}>
              <AvatarModel
                animation={animation}
                castShadow={false}
                onAnimationsChange={handleAnimations}
                sharedHipsPosition={false}
                targetHeight={DEFAULT_AVATAR_PREVIEW_HEIGHT}
                url={url}
              />
            </group>
            <Ready
              clipsSeen={clipsSeen}
              framing={framing}
              holder={holder}
              key={`ready:${url}`}
              onReady={onReady}
              url={url}
            />
          </Suspense>
        </Canvas>
      );
    }

    return AvatarCanvasInner;
  },
  { ssr: false },
);

type BoundaryProps = {
  children: ReactNode;
  onError: (error: unknown) => void;
  /** Changing this clears a previous failure without remounting the canvas. */
  resetKey: string;
};

type BoundaryState = { failedKey: string | null };

/**
 * A 404, a malformed VRM or a refused WebGL context throws out of the R3F
 * canvas. Catch it here so the section gets a fallback instead of a blank box
 * or a torn-down page.
 */
class CanvasErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  override state: BoundaryState = { failedKey: null };

  override componentDidCatch(error: unknown) {
    this.setState({ failedKey: this.props.resetKey });
    this.props.onError(error);
  }

  override render() {
    return this.state.failedKey === this.props.resetKey
      ? null
      : this.props.children;
  }
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const update = () => setReduced(query.matches);
    update();
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }
    // Safari below 14.
    const legacy = query as unknown as {
      addListener: (listener: () => void) => void;
      removeListener: (listener: () => void) => void;
    };
    legacy.addListener(update);
    return () => legacy.removeListener(update);
  }, []);

  return reduced;
}

/**
 * The canvas, and nothing else. Every visible affordance -- the animation
 * picker, the loading overlay, the avatar rail -- belongs to the section; this
 * component only renders the avatar and reports its state upward.
 */
export function Avatar3D({
  animation,
  fallback,
  label,
  onAnimations,
  onLoadingChange,
  url,
}: Avatar3DProps) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // The section may pass inline callbacks; keep their identity out of the
  // effects below so a parent re-render can never restart a load.
  const animationsRef = useRef(onAnimations);
  const loadingRef = useRef(onLoadingChange);
  useEffect(() => {
    animationsRef.current = onAnimations;
    loadingRef.current = onLoadingChange;
  });

  const reportedNames = useRef<string | null>(null);
  const reportedLoading = useRef<boolean | null>(null);

  const reportAnimations = useCallback((names: string[]) => {
    const signature = names.join(" ");
    if (reportedNames.current === signature) return;
    reportedNames.current = signature;
    animationsRef.current?.(names);
  }, []);

  const reportLoading = useCallback((loading: boolean) => {
    if (reportedLoading.current === loading) return;
    reportedLoading.current = loading;
    loadingRef.current?.(loading);
  }, []);

  // Loading starts with the url, before a single byte has been requested.
  useEffect(() => {
    setFailed(false);
    setReady(false);
    reportAnimations(NO_ANIMATIONS);
    reportLoading(true);
  }, [reportAnimations, reportLoading, url]);

  // Never leave the section holding a spinner for a viewer that is gone.
  useEffect(() => () => reportLoading(false), [reportLoading]);

  const handleReady = useCallback(() => {
    setReady(true);
    reportLoading(false);
  }, [reportLoading]);

  const handleError = useCallback(
    (error: unknown) => {
      console.warn("[avatar-3d] 3D preview failed", url, error);
      setFailed(true);
      setReady(false);
      reportAnimations(NO_ANIMATIONS);
      reportLoading(false);
    },
    [reportAnimations, reportLoading, url],
  );

  const showCanvas = Boolean(url) && !failed;

  return (
    <div
      aria-label={label}
      data-avatar-render-state={failed ? "failed" : ready ? "ready" : "loading"}
      role="img"
      style={{ height: "100%", position: "relative", width: "100%" }}
    >
      {fallback ? (
        <div style={{ inset: 0, position: "absolute" }}>{fallback}</div>
      ) : null}
      {showCanvas ? (
        <div style={{ inset: 0, position: "absolute" }}>
          <CanvasErrorBoundary onError={handleError} resetKey={url}>
            <AvatarCanvas
              animation={animation}
              autoRotate={!reducedMotion}
              onAnimations={reportAnimations}
              onReady={handleReady}
              url={url}
            />
          </CanvasErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}
