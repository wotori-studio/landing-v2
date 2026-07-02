"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ClickBursts } from "./click-bursts";

export type Theme = "day" | "night";

type ThemeConfig = {
  sky: { top: string; middle: string; horizon: string; ground: string };
  fog: { color: string; density: number };
  hemi: { sky: string; ground: string; intensity: number };
  keyLight: { position: Vec3; color: string; intensity: number };
  fillLight: { position: Vec3; color: string; intensity: number };
  ground: string;
  grassStops: { t: number; c: [number, number, number] }[];
  exposure: number;
};

const THEMES: Record<Theme, ThemeConfig> = {
  day: {
    sky: { top: "#0a6fcf", middle: "#5bb8ff", horizon: "#e8f7ff", ground: "#1d5478" },
    fog: { color: "#bfe1f3", density: 0.018 },
    hemi: { sky: "#e6f4ff", ground: "#1e5a3e", intensity: 1.8 },
    keyLight: { position: [5, 9, 3], color: "#fff5d8", intensity: 2.8 },
    fillLight: { position: [-4, 3, -7], color: "#9bccef", intensity: 0.7 },
    ground: "#1d4a32",
    grassStops: [
      { t: 0.0, c: [0.04, 0.12, 0.05] },
      { t: 0.4, c: [0.14, 0.38, 0.18] },
      { t: 0.75, c: [0.36, 0.66, 0.34] },
      { t: 1.0, c: [0.82, 0.96, 0.68] }
    ],
    exposure: 1.08
  },
  night: {
    sky: { top: "#061b4d", middle: "#1f5fb8", horizon: "#7fb3d8", ground: "#0a1830" },
    fog: { color: "#7aa4c8", density: 0.03 },
    hemi: { sky: "#a8c8ff", ground: "#040a1c", intensity: 0.9 },
    keyLight: { position: [5, 9, 3], color: "#e8f0ff", intensity: 1.4 },
    fillLight: { position: [-4, 3, -7], color: "#3a6da8", intensity: 0.3 },
    ground: "#040a1d",
    grassStops: [
      { t: 0.0, c: [0.02, 0.04, 0.1] },
      { t: 0.4, c: [0.06, 0.12, 0.26] },
      { t: 0.75, c: [0.22, 0.36, 0.6] },
      { t: 1.0, c: [0.55, 0.74, 0.95] }
    ],
    exposure: 1.05
  }
};

const ThemeContext = createContext<Theme>("night");
const useThemeConfig = () => THEMES[useContext(ThemeContext)];

type Vec3 = [number, number, number];

type CubeSpec = {
  dy: number;
  sx: number;
  sy: number;
  sz: number;
  t: number;
  swayWeight: number;
};

type GrassTemplate = {
  cubes: CubeSpec[];
  height: number;
};

type Blade = {
  x: number;
  z: number;
  yaw: number;
  templateIdx: number;
  brightness: number;
  swayPhase: number;
  swayAmp: number;
};

type GrassInstance = {
  bladeIdx: number;
  cubeIdx: number;
};

type FlowerInstance = {
  x: number;
  z: number;
  y: number;
  size: number;
  color: THREE.Color;
  phase: number;
  glow: boolean;
};

type GlowPoint = {
  color: string;
  phase: number;
  size: number;
  x: number;
  y: number;
  z: number;
};

type CloudVoxel = {
  color: THREE.Color;
  position: Vec3;
};

const FLIGHT_SPEED = 0.62;
const FIELD_REPEAT_Z = 72;
const FIELD_HALF_Z = FIELD_REPEAT_Z / 2;
const FIELD_HALF_X = 50;
const CLOUD_REPEAT_Z = 150;
const CLOUD_HALF_Z = CLOUD_REPEAT_Z / 2;

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

function randomFrom(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function wrapZ(baseZ: number, offset: number, repeat = FIELD_REPEAT_Z) {
  const half = repeat / 2;
  return ((baseZ - offset) % repeat + repeat) % repeat - half;
}

function hash3(x: number, y: number, z: number, seed: number) {
  let h = seed | 0;
  h = Math.imul(h ^ x, 0x27d4eb2d);
  h = Math.imul(h ^ y, 0x165667b1);
  h = Math.imul(h ^ z, 0x1b873593);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function valueNoise3D(x: number, y: number, z: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);

  const c000 = hash3(xi, yi, zi, seed);
  const c100 = hash3(xi + 1, yi, zi, seed);
  const c010 = hash3(xi, yi + 1, zi, seed);
  const c110 = hash3(xi + 1, yi + 1, zi, seed);
  const c001 = hash3(xi, yi, zi + 1, seed);
  const c101 = hash3(xi + 1, yi, zi + 1, seed);
  const c011 = hash3(xi, yi + 1, zi + 1, seed);
  const c111 = hash3(xi + 1, yi + 1, zi + 1, seed);

  const x00 = c000 * (1 - u) + c100 * u;
  const x10 = c010 * (1 - u) + c110 * u;
  const x01 = c001 * (1 - u) + c101 * u;
  const x11 = c011 * (1 - u) + c111 * u;

  const y0 = x00 * (1 - v) + x10 * v;
  const y1 = x01 * (1 - v) + x11 * v;

  return y0 * (1 - w) + y1 * w;
}

function fbm3(x: number, y: number, z: number, seed: number, octaves = 4) {
  let total = 0;
  let amp = 1;
  let freq = 1;
  let max = 0;
  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise3D(x * freq, y * freq, z * freq, seed + i * 17) * amp;
    max += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return total / max;
}

function generateVoxelCloud({
  seed,
  width,
  height,
  depth,
  grid,
  density,
  noiseScale,
  flatten = 0,
  puffCount = 4,
  sunDir = [0.6, 0.72, 0.35]
}: {
  seed: number;
  width: number;
  height: number;
  depth: number;
  grid: number;
  density: number;
  noiseScale: number;
  flatten?: number;
  puffCount?: number;
  sunDir?: Vec3;
}): CloudVoxel[] {
  const rx = width / 2;
  const ry = height / 2;
  const rz = depth / 2;
  const random = randomFrom(seed * 7919 + 1);

  const puffs: { cx: number; cy: number; cz: number; rx: number; ry: number; rz: number }[] = [];
  for (let i = 0; i < puffCount; i += 1) {
    puffs.push({
      cx: (random() - 0.5) * width * 0.7,
      cy: (random() - 0.45) * height * 0.6,
      cz: (random() - 0.5) * depth * 0.55,
      rx: rx * (0.42 + random() * 0.42),
      ry: ry * (0.55 + random() * 0.35),
      rz: rz * (0.45 + random() * 0.42)
    });
  }

  const sx = Math.ceil(width / grid) + 1;
  const sy = Math.ceil(height / grid) + 1;
  const sz = Math.ceil(depth / grid) + 1;

  const occupied = new Set<string>();
  const keyOf = (ix: number, iy: number, iz: number) => `${ix}|${iy}|${iz}`;

  for (let ix = -sx; ix <= sx; ix += 1) {
    for (let iy = -sy; iy <= sy; iy += 1) {
      for (let iz = -sz; iz <= sz; iz += 1) {
        const x = ix * grid;
        const y = iy * grid;
        const z = iz * grid;

        let blob = -2;
        for (const p of puffs) {
          const fx = (x - p.cx) / p.rx;
          const fy = (y - p.cy) / p.ry;
          const fz = (z - p.cz) / p.rz;
          const d = Math.sqrt(fx * fx + fy * fy + fz * fz);
          const v = 1 - d;
          if (v > blob) blob = v;
        }
        if (blob <= -0.4) continue;

        const n = fbm3(x * noiseScale, y * noiseScale, z * noiseScale, seed);
        const bottomBias =
          flatten > 0 && y < 0 ? flatten * Math.pow(-y / ry, 1.6) : 0;
        const value = blob * 0.78 + n * 0.6 - bottomBias;

        if (value > density) occupied.add(keyOf(ix, iy, iz));
      }
    }
  }

  const sunMag = Math.sqrt(sunDir[0] ** 2 + sunDir[1] ** 2 + sunDir[2] ** 2);
  const sDx = sunDir[0] / sunMag;
  const sDy = sunDir[1] / sunMag;
  const sDz = sunDir[2] / sunMag;

  const palette: { t: number; c: [number, number, number] }[] = [
    { t: 0.0, c: [0.34, 0.44, 0.74] },
    { t: 0.28, c: [0.58, 0.7, 0.95] },
    { t: 0.55, c: [0.9, 0.95, 1.05] },
    { t: 0.78, c: [1.18, 1.16, 1.08] },
    { t: 1.0, c: [1.55, 1.42, 1.18] }
  ];
  const sampleCloud = (t: number, out: THREE.Color) => {
    const clamped = THREE.MathUtils.clamp(t, 0, 1);
    for (let i = 0; i < palette.length - 1; i += 1) {
      const a = palette[i];
      const b = palette[i + 1];
      if (clamped <= b.t) {
        const span = b.t - a.t || 1;
        const u = (clamped - a.t) / span;
        out.setRGB(
          a.c[0] + (b.c[0] - a.c[0]) * u,
          a.c[1] + (b.c[1] - a.c[1]) * u,
          a.c[2] + (b.c[2] - a.c[2]) * u
        );
        return;
      }
    }
    const last = palette[palette.length - 1].c;
    out.setRGB(last[0], last[1], last[2]);
  };
  const skyTint = new THREE.Color(1.05, 1.12, 1.22);
  const warmRim = new THREE.Color(1.45, 1.3, 1.05);

  const sixNbrs: Vec3[] = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
  ];

  const voxels: CloudVoxel[] = [];

  for (const key of occupied) {
    const [ixStr, iyStr, izStr] = key.split("|");
    const ix = parseInt(ixStr, 10);
    const iy = parseInt(iyStr, 10);
    const iz = parseInt(izStr, 10);

    let exposed = 0;
    for (const [dx, dy, dz] of sixNbrs) {
      if (!occupied.has(keyOf(ix + dx, iy + dy, iz + dz))) exposed += 1;
    }
    if (exposed === 0) continue;

    let lit = 1;
    for (let s = 1; s <= 6; s += 1) {
      const ox = ix + Math.round(s * sDx);
      const oy = iy + Math.round(s * sDy);
      const oz = iz + Math.round(s * sDz);
      if (occupied.has(keyOf(ox, oy, oz))) {
        lit -= 0.35;
        if (lit <= 0) {
          lit = 0;
          break;
        }
      }
    }

    let sky = 0;
    for (let s = 1; s <= 5; s += 1) {
      if (!occupied.has(keyOf(ix, iy + s, iz))) sky += 1;
    }
    sky /= 5;

    let ao = 0;
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dz = -1; dz <= 1; dz += 1) {
          if (dx === 0 && dy === 0 && dz === 0) continue;
          if (occupied.has(keyOf(ix + dx, iy + dy, iz + dz))) ao += 1;
        }
      }
    }
    const aoFactor = 1 - (ao / 26) * 0.55;

    const sunTerm = lit * 0.5;
    const skyTerm = sky * 0.32;
    const aoTerm = aoFactor * 0.18;
    const t = THREE.MathUtils.clamp(sunTerm + skyTerm + aoTerm, 0, 1);

    const color = new THREE.Color();
    sampleCloud(t, color);

    if (sky > 0.75 && lit > 0.6) color.lerp(warmRim, 0.22);
    if (sky < 0.2 && lit < 0.4) color.lerp(skyTint, 0.08);

    const hueShift = (lit - 0.5) * 0.04;
    color.offsetHSL(hueShift, 0, 0);

    const jitter = (random() - 0.5) * 0.045;
    color.r = Math.max(0, color.r + jitter);
    color.g = Math.max(0, color.g + jitter);
    color.b = Math.max(0, color.b + jitter);

    voxels.push({
      color,
      position: [ix * grid, iy * grid, iz * grid]
    });
  }

  return voxels;
}

function CameraRig() {
  const { camera } = useThree();
  const baseTarget = useMemo(() => new THREE.Vector3(0, 0.55, -18), []);
  const smoothTarget = useMemo(() => new THREE.Vector3(0, 0.55, -18), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const upAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const tiltAxis = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, pointer }) => {
    const time = clock.elapsedTime;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.04);
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      1.18 + Math.sin(time * 0.32) * 0.04,
      0.04
    );
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.0, 0.04);

    dir.copy(baseTarget).sub(camera.position);
    dir.applyAxisAngle(upAxis, -pointer.x * 0.22);
    tiltAxis.copy(dir).cross(upAxis).normalize();
    if (tiltAxis.lengthSq() > 1e-6) {
      dir.applyAxisAngle(tiltAxis, pointer.y * 0.12);
    }
    desired.copy(camera.position).add(dir);
    smoothTarget.lerp(desired, 0.08);
    camera.lookAt(smoothTarget);
  });

  return null;
}

function SkyDome() {
  const cfg = useThemeConfig();
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color() },
      middleColor: { value: new THREE.Color() },
      horizonColor: { value: new THREE.Color() },
      groundColor: { value: new THREE.Color() }
    }),
    []
  );

  useEffect(() => {
    uniforms.topColor.value.set(cfg.sky.top);
    uniforms.middleColor.value.set(cfg.sky.middle);
    uniforms.horizonColor.value.set(cfg.sky.horizon);
    uniforms.groundColor.value.set(cfg.sky.ground);
  }, [cfg, uniforms]);

  return (
    <mesh renderOrder={-10}>
      <sphereGeometry args={[140, 48, 24]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPosition;

          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 topColor;
          uniform vec3 middleColor;
          uniform vec3 horizonColor;
          uniform vec3 groundColor;
          varying vec3 vWorldPosition;

          void main() {
            vec3 direction = normalize(vWorldPosition);
            float h = direction.y;
            float lower = smoothstep(-0.18, 0.02, h);
            float mid = smoothstep(0.0, 0.35, h);
            float high = smoothstep(0.25, 0.85, h);
            vec3 color = mix(groundColor, horizonColor, lower);
            color = mix(color, middleColor, mid);
            color = mix(color, topColor, high);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

type CelestialVoxel = { position: Vec3; color: THREE.Color };

function buildCelestialVoxels(theme: Theme): { voxels: CelestialVoxel[]; cube: number } {
  const isDay = theme === "day";
  const cube = 0.5;
  const radius = isDay ? 2.9 : 2.6;
  const random = randomFrom(isDay ? 4242 : 7777);
  const voxels: CelestialVoxel[] = [];
  const steps = Math.ceil((radius + cube) / cube);

  const craters: { cx: number; cy: number; r: number }[] = [];
  if (!isDay) {
    for (let i = 0; i < 5; i += 1) {
      const angle = random() * Math.PI * 2;
      const dist = random() * radius * 0.72;
      craters.push({
        cx: Math.cos(angle) * dist,
        cy: Math.sin(angle) * dist,
        r: 0.38 + random() * 0.55
      });
    }
  }

  const inner = new THREE.Color(isDay ? "#fff9d6" : "#eef3fb");
  const mid = new THREE.Color(isDay ? "#ffe36a" : "#d5e0f0");
  const edge = new THREE.Color(isDay ? "#ff9440" : "#b9c8e0");
  const craterColor = new THREE.Color("#9fb0cc");

  for (let ix = -steps; ix <= steps; ix += 1) {
    for (let iy = -steps; iy <= steps; iy += 1) {
      const x = ix * cube;
      const y = iy * cube;
      const d = Math.sqrt(x * x + y * y);
      if (d > radius + cube * 0.2) continue;

      const t = THREE.MathUtils.clamp(d / radius, 0, 1);
      const color = new THREE.Color();
      if (t < 0.55) color.lerpColors(inner, mid, t / 0.55);
      else color.lerpColors(mid, edge, (t - 0.55) / 0.45);

      if (!isDay) {
        // Fake sphere shading: light from the left.
        color.multiplyScalar(1 - 0.2 * ((x / radius + 1) / 2));
        for (const crater of craters) {
          const dx = x - crater.cx;
          const dy = y - crater.cy;
          if (dx * dx + dy * dy < crater.r * crater.r) {
            color.lerp(craterColor, 0.55);
            break;
          }
        }
      }

      const jitter = (random() - 0.5) * 0.05;
      color.r = Math.max(0, color.r + jitter);
      color.g = Math.max(0, color.g + jitter);
      color.b = Math.max(0, color.b + jitter);

      voxels.push({ position: [x, y, 0], color });
    }
  }

  if (isDay) {
    // Pixel-art rays: 8 directions, longer on the cardinals.
    const rayColor = new THREE.Color("#ffdf5e");
    for (let k = 0; k < 8; k += 1) {
      const angle = (k * Math.PI) / 4;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const cardinal = k % 2 === 0;
      const stops = cardinal ? [1.4, 1.75, 2.1] : [1.45, 1.8];
      for (const s of stops) {
        voxels.push({
          position: [dx * radius * s, dy * radius * s, 0],
          color: rayColor.clone()
        });
      }
    }
  }

  return { voxels, cube };
}

function CelestialBody() {
  const theme = useContext(ThemeContext);
  const isDay = theme === "day";
  const { voxels, cube } = useMemo(() => buildCelestialVoxels(theme), [theme]);
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const haloMaterial = useRef<THREE.SpriteMaterial>(null);

  const glowTexture = useMemo(
    () => (typeof document === "undefined" ? null : makeGlowTexture()),
    []
  );

  const basePosition: Vec3 = isDay ? [15, 14.5, -50] : [-13, 15.5, -48];
  const haloColor = isDay ? "#ffca4d" : "#a9c4ef";
  const haloScale = isDay ? 17 : 12;
  const haloOpacity = isDay ? 0.5 : 0.38;

  useLayoutEffect(() => {
    if (!mesh.current) return;
    voxels.forEach((voxel, index) => {
      tempObject.position.set(voxel.position[0], voxel.position[1], voxel.position[2]);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.setScalar(cube * 0.96);
      tempObject.updateMatrix();
      mesh.current?.setMatrixAt(index, tempObject.matrix);
      mesh.current?.setColorAt(index, voxel.color);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) {
      mesh.current.instanceColor.needsUpdate = true;
    }
  }, [cube, voxels]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (group.current) {
      group.current.position.set(
        basePosition[0],
        basePosition[1] + Math.sin(time * 0.26) * 0.35,
        basePosition[2]
      );
    }
    if (body.current) {
      body.current.rotation.z = isDay ? time * 0.055 : Math.sin(time * 0.1) * 0.02;
    }
    if (haloMaterial.current) {
      haloMaterial.current.opacity =
        haloOpacity * (1 + Math.sin(time * (isDay ? 1.4 : 0.8)) * 0.08);
    }
  });

  return (
    <group ref={group} position={basePosition}>
      <sprite position={[0, 0, -1.4]} scale={[haloScale, haloScale, 1]}>
        <spriteMaterial
          ref={haloMaterial}
          map={glowTexture ?? undefined}
          color={haloColor}
          transparent
          opacity={haloOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          fog={false}
        />
      </sprite>
      <group ref={body}>
        <instancedMesh
          key={theme}
          ref={mesh}
          args={[undefined, undefined, voxels.length]}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} fog={false} />
        </instancedMesh>
      </group>
    </group>
  );
}

function buildGrassTemplates(): GrassTemplate[] {
  const make = (
    cubes: Array<[number, number, number, number, number, number]>
  ): GrassTemplate => {
    let height = 0;
    const cubeSpecs: CubeSpec[] = cubes.map(([dy, sx, sy, sz, t, sw]) => {
      height = Math.max(height, dy + sy * 0.5);
      return { dy, sx, sy, sz, t, swayWeight: sw };
    });
    return { cubes: cubeSpecs, height };
  };

  return [
    make([
      [0.06, 0.06, 0.12, 0.06, 0.0, 0.05],
      [0.20, 0.058, 0.14, 0.058, 0.45, 0.4],
      [0.36, 0.044, 0.14, 0.044, 0.95, 0.95]
    ]),
    make([
      [0.06, 0.06, 0.12, 0.06, 0.0, 0.05],
      [0.20, 0.058, 0.14, 0.058, 0.32, 0.3],
      [0.36, 0.052, 0.14, 0.052, 0.65, 0.65],
      [0.52, 0.04, 0.14, 0.04, 0.95, 0.95]
    ]),
    make([
      [0.06, 0.06, 0.12, 0.06, 0.0, 0.05],
      [0.20, 0.046, 0.14, 0.046, 0.85, 0.85]
    ]),
    make([
      [0.06, 0.062, 0.12, 0.062, 0.0, 0.05],
      [0.20, 0.06, 0.14, 0.06, 0.25, 0.22],
      [0.34, 0.054, 0.14, 0.054, 0.5, 0.5],
      [0.48, 0.046, 0.14, 0.046, 0.75, 0.78],
      [0.62, 0.04, 0.14, 0.04, 0.95, 0.95]
    ]),
    make([
      [0.06, 0.07, 0.12, 0.07, 0.0, 0.05],
      [0.18, 0.06, 0.14, 0.06, 0.5, 0.5],
      [0.32, 0.05, 0.14, 0.05, 0.9, 0.9]
    ]),
    make([
      [0.06, 0.056, 0.12, 0.056, 0.0, 0.05],
      [0.20, 0.05, 0.14, 0.05, 0.4, 0.35],
      [0.34, 0.046, 0.14, 0.046, 0.7, 0.7],
      [0.48, 0.04, 0.14, 0.04, 0.95, 0.95]
    ])
  ];
}

function sampleGradient(
  stops: { t: number; c: [number, number, number] }[],
  t: number,
  out: THREE.Color
) {
  const clamped = THREE.MathUtils.clamp(t, 0, 1);
  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i];
    const b = stops[i + 1];
    if (clamped <= b.t) {
      const span = b.t - a.t || 1;
      const u = (clamped - a.t) / span;
      out.setRGB(
        a.c[0] + (b.c[0] - a.c[0]) * u,
        a.c[1] + (b.c[1] - a.c[1]) * u,
        a.c[2] + (b.c[2] - a.c[2]) * u
      );
      return;
    }
  }
  const last = stops[stops.length - 1].c;
  out.setRGB(last[0], last[1], last[2]);
}

const FLOWER_PALETTE: { color: string; weight: number }[] = [
  { color: "#5dc7ff", weight: 0.4 },
  { color: "#9ee5ff", weight: 0.14 },
  { color: "#ffffff", weight: 0.08 },
  { color: "#ffd84a", weight: 0.16 },
  { color: "#ff9a3c", weight: 0.07 },
  { color: "#ff5a6e", weight: 0.1 },
  { color: "#c66bff", weight: 0.05 }
];

function pickFlowerColor(rand: number) {
  let acc = 0;
  for (const entry of FLOWER_PALETTE) {
    acc += entry.weight;
    if (rand <= acc) return entry.color;
  }
  return FLOWER_PALETTE[0].color;
}

function GrassField() {
  const cfg = useThemeConfig();
  const templates = useMemo(buildGrassTemplates, []);

  const { blades, instances, flowers, instanceData } = useMemo(() => {
    const random = randomFrom(1209);
    const bladesArr: Blade[] = [];
    const flowersArr: FlowerInstance[] = [];
    const instArr: GrassInstance[] = [];

    const count = 6800;
    for (let i = 0; i < count; i += 1) {
      const x = (random() - 0.5) * FIELD_HALF_X * 2;
      const z = (random() - 0.5) * FIELD_REPEAT_Z;
      const templateIdx = Math.floor(random() * templates.length);
      const tmpl = templates[templateIdx];
      const brightness = 0.65 + random() * 0.5;
      const swayPhase = random() * Math.PI * 2;
      const swayAmp = 0.6 + random() * 0.8;
      const yaw = random() * Math.PI;
      const bladeIdx = bladesArr.length;
      bladesArr.push({ x, z, yaw, templateIdx, brightness, swayPhase, swayAmp });

      for (let c = 0; c < tmpl.cubes.length; c += 1) {
        instArr.push({ bladeIdx, cubeIdx: c });
      }

      if (random() < 0.08) {
        const color = new THREE.Color(pickFlowerColor(random()));
        const tipY = tmpl.height + 0.04;
        flowersArr.push({
          x,
          z,
          y: tipY,
          size: 0.07 + random() * 0.05,
          color,
          phase: random() * Math.PI * 2,
          glow: random() < 0.55
        });
      }
    }

    // Flat per-instance lookups so the hot frame loop never touches objects.
    const bladeIdxOf = new Int32Array(instArr.length);
    const swayWeightOf = new Float32Array(instArr.length);
    instArr.forEach((inst, i) => {
      bladeIdxOf[i] = inst.bladeIdx;
      const blade = bladesArr[inst.bladeIdx];
      swayWeightOf[i] = templates[blade.templateIdx].cubes[inst.cubeIdx].swayWeight;
    });

    return {
      blades: bladesArr,
      instances: instArr,
      flowers: flowersArr,
      instanceData: {
        bladeIdxOf,
        swayWeightOf,
        bladeZ: new Float32Array(bladesArr.length),
        bladeGust: new Float32Array(bladesArr.length)
      }
    };
  }, [templates]);

  const grassMesh = useRef<THREE.InstancedMesh>(null);
  const flowerMesh = useRef<THREE.InstancedMesh>(null);

  // Bake rotation + scale + x/y into static matrices once. The frame loop
  // only rewrites the translation floats directly in the attribute buffer.
  useLayoutEffect(() => {
    if (!grassMesh.current) return;
    const c = new THREE.Color();
    instances.forEach((inst, idx) => {
      const blade = blades[inst.bladeIdx];
      const cube = templates[blade.templateIdx].cubes[inst.cubeIdx];
      tempObject.position.set(blade.x, cube.dy, blade.z);
      tempObject.rotation.set(0, blade.yaw, 0);
      tempObject.scale.set(cube.sx, cube.sy, cube.sz);
      tempObject.updateMatrix();
      grassMesh.current?.setMatrixAt(idx, tempObject.matrix);
      sampleGradient(cfg.grassStops, cube.t, c);
      const bright = blade.brightness;
      c.r *= bright;
      c.g *= bright;
      c.b *= bright;
      grassMesh.current?.setColorAt(idx, c);
    });
    grassMesh.current.instanceMatrix.needsUpdate = true;
    if (grassMesh.current.instanceColor) {
      grassMesh.current.instanceColor.needsUpdate = true;
    }
  }, [blades, instances, templates, cfg]);

  useLayoutEffect(() => {
    if (!flowerMesh.current) return;
    flowers.forEach((flower, idx) => {
      flowerMesh.current?.setColorAt(idx, flower.color);
    });
    if (flowerMesh.current.instanceColor) {
      flowerMesh.current.instanceColor.needsUpdate = true;
    }
  }, [flowers]);

  useFrame(({ clock }) => {
    if (!grassMesh.current) return;
    const time = clock.elapsedTime;
    const offset = time * FLIGHT_SPEED;
    const swayBase = time * 1.6;

    const { bladeIdxOf, swayWeightOf, bladeZ, bladeGust } = instanceData;

    // One wrap + one sin per blade instead of per cube.
    for (let b = 0; b < blades.length; b += 1) {
      const blade = blades[b];
      bladeZ[b] = wrapZ(blade.z, offset);
      bladeGust[b] = Math.sin(swayBase + blade.swayPhase) * blade.swayAmp;
    }

    const matrices = grassMesh.current.instanceMatrix.array as Float32Array;
    for (let i = 0; i < instances.length; i += 1) {
      const b = bladeIdxOf[i];
      const gust = bladeGust[b] * swayWeightOf[i];
      const base = i * 16;
      matrices[base + 12] = blades[b].x + gust * 0.05;
      matrices[base + 14] = bladeZ[b] + gust * 0.02;
    }
    grassMesh.current.instanceMatrix.needsUpdate = true;

    if (flowerMesh.current) {
      for (let i = 0; i < flowers.length; i += 1) {
        const flower = flowers[i];
        const zWrapped = wrapZ(flower.z, offset);
        const pulse = 1 + Math.sin(time * 2.4 + flower.phase) * 0.32;
        const bob = Math.sin(time * 1.3 + flower.phase * 1.7) * 0.02;
        const s = flower.size * pulse;
        tempObject.position.set(flower.x, flower.y + bob, zWrapped);
        tempObject.rotation.set(0, time * 0.3 + flower.phase, 0);
        tempObject.scale.set(s, s, s);
        tempObject.updateMatrix();
        flowerMesh.current.setMatrixAt(i, tempObject.matrix);
      }
      flowerMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh
        ref={grassMesh}
        args={[undefined, undefined, instances.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} fog />
      </instancedMesh>
      <instancedMesh
        ref={flowerMesh}
        args={[undefined, undefined, flowers.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} fog />
      </instancedMesh>
    </>
  );
}

function Ground() {
  const cfg = useThemeConfig();
  return (
    <mesh position={[0, -0.06, -FIELD_HALF_Z + 4]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[FIELD_HALF_X * 2 + 12, FIELD_REPEAT_Z + 12, 1, 1]} />
      <meshBasicMaterial color={cfg.ground} fog />
    </mesh>
  );
}

function makeGlowTexture() {
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,255,255,0.55)");
    gradient.addColorStop(0.55, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function GlowAmbient() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const points = useMemo<GlowPoint[]>(() => {
    const random = randomFrom(8412);
    return Array.from({ length: 320 }, () => {
      const z = (random() - 0.5) * FIELD_REPEAT_Z;
      return {
        color: pickFlowerColor(random()),
        phase: random() * Math.PI * 2,
        size: 0.025 + random() * 0.06,
        x: (random() - 0.5) * FIELD_HALF_X * 2,
        y: 0.04 + random() * 0.42,
        z
      };
    });
  }, []);

  const glowTexture = useMemo(
    () => (typeof document === "undefined" ? null : makeGlowTexture()),
    []
  );

  const colors = useMemo(() => points.map((p) => new THREE.Color(p.color)), [points]);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    points.forEach((_p, index) => {
      mesh.current?.setColorAt(index, colors[index]);
    });
    if (mesh.current.instanceColor) {
      mesh.current.instanceColor.needsUpdate = true;
    }
  }, [colors, points]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.elapsedTime;
    const offset = time * FLIGHT_SPEED;
    points.forEach((point, index) => {
      const zWrapped = wrapZ(point.z, offset);
      const pulse = 1 + Math.sin(time * 2.0 + point.phase) * 0.22;
      tempObject.position.set(point.x, point.y, zWrapped);
      tempObject.rotation.set(0, point.phase + time * 0.18, 0);
      const s = point.size * pulse;
      tempObject.scale.set(s, s, s);
      tempObject.updateMatrix();
      mesh.current!.setMatrixAt(index, tempObject.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  const SpriteCloud = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
      if (!groupRef.current) return;
      const offset = clock.elapsedTime * FLIGHT_SPEED;
      groupRef.current.children.forEach((child, i) => {
        const point = points[i];
        if (!point) return;
        child.position.set(point.x, point.y, wrapZ(point.z, offset));
      });
    });
    return (
      <group ref={groupRef}>
        {points.slice(0, 48).map((point, index) => (
          <sprite
            key={index}
            position={[point.x, point.y, point.z]}
            scale={[point.size * 5.4, point.size * 5.4, 1]}
            renderOrder={12}
          >
            <spriteMaterial
              map={glowTexture ?? undefined}
              color={point.color}
              transparent
              opacity={0.55}
              depthWrite={false}
              depthTest={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>
        ))}
      </group>
    );
  };

  return (
    <>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, points.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} fog />
      </instancedMesh>
      <SpriteCloud />
    </>
  );
}

function PixelCloud({
  density = 0.22,
  depth = 2.2,
  flatten = 0.35,
  grid = 0.22,
  height = 1.4,
  noiseScale = 0.55,
  position,
  puffCount = 4,
  seed,
  width = 4.4,
  driftSpeed = 0.18
}: {
  density?: number;
  depth?: number;
  flatten?: number;
  grid?: number;
  height?: number;
  noiseScale?: number;
  position: Vec3;
  puffCount?: number;
  seed: number;
  width?: number;
  driftSpeed?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const voxels = useMemo<CloudVoxel[]>(
    () =>
      generateVoxelCloud({
        seed,
        width,
        height,
        depth,
        grid,
        density,
        noiseScale,
        flatten,
        puffCount
      }),
    [density, depth, flatten, grid, height, noiseScale, puffCount, seed, width]
  );

  useLayoutEffect(() => {
    if (!mesh.current) return;
    voxels.forEach((voxel, index) => {
      tempObject.position.set(voxel.position[0], voxel.position[1], voxel.position[2]);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.setScalar(grid);
      tempObject.updateMatrix();
      mesh.current?.setMatrixAt(index, tempObject.matrix);
      mesh.current?.setColorAt(index, voxel.color);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) {
      mesh.current.instanceColor.needsUpdate = true;
    }
  }, [grid, voxels]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const time = clock.elapsedTime;
    const flightOffset = time * FLIGHT_SPEED * 0.55;
    const driftOffset = time * driftSpeed;
    const baseZ = position[2];
    group.current.position.x = position[0] + driftOffset * 0.4;
    group.current.position.y = position[1] + Math.sin(time * 0.18 + seed * 0.013) * 0.06;
    group.current.position.z = wrapZ(baseZ, flightOffset, CLOUD_REPEAT_Z);
  });

  return (
    <group ref={group} position={position}>
      <instancedMesh ref={mesh} args={[undefined, undefined, voxels.length]} castShadow={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} fog />
      </instancedMesh>
    </group>
  );
}

function CloudField() {
  const farClouds = useMemo(() => {
    const random = randomFrom(7311);
    const arr: {
      position: Vec3;
      width: number;
      height: number;
      depth: number;
      grid: number;
      density: number;
      noiseScale: number;
      flatten: number;
      puffCount: number;
      seed: number;
      driftSpeed: number;
    }[] = [];
    for (let i = 0; i < 54; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 22 + random() * 50;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.85 - 6;
      const y = 2.4 + random() * 8.6;
      const w = 1.6 + random() * 4.2;
      arr.push({
        position: [x, y, z],
        width: w,
        height: 0.32 + random() * 0.55,
        depth: 0.8 + random() * 1.1,
        grid: 0.14 + random() * 0.06,
        density: 0.28 + random() * 0.1,
        noiseScale: 1.0 + random() * 0.4,
        flatten: 0.3 + random() * 0.4,
        puffCount: 2 + Math.floor(random() * 4),
        seed: 900 + i * 23,
        driftSpeed: 0.06 + random() * 0.12
      });
    }
    return arr;
  }, []);

  return (
    <>
      <PixelCloud
        position={[-9.2, 4.6, -14]}
        width={8.5}
        height={0.9}
        depth={1.8}
        grid={0.2}
        density={0.26}
        noiseScale={0.95}
        flatten={0.55}
        puffCount={5}
        seed={14}
      />
      <PixelCloud
        position={[7.4, 5.8, -16]}
        width={10}
        height={1.0}
        depth={2.0}
        grid={0.22}
        density={0.26}
        noiseScale={0.85}
        flatten={0.5}
        puffCount={6}
        seed={31}
      />
      <PixelCloud
        position={[-2.1, 6.9, -19]}
        width={5.5}
        height={0.75}
        depth={1.5}
        grid={0.18}
        density={0.28}
        noiseScale={1.0}
        flatten={0.4}
        puffCount={3}
        seed={56}
      />
      <PixelCloud
        position={[14.8, 3.6, -20.5]}
        width={6.5}
        height={0.7}
        depth={1.4}
        grid={0.18}
        density={0.3}
        noiseScale={1.05}
        flatten={0.6}
        puffCount={4}
        seed={97}
      />
      <PixelCloud
        position={[-15.2, 3.2, -19]}
        width={7.0}
        height={0.7}
        depth={1.4}
        grid={0.18}
        density={0.3}
        noiseScale={1.0}
        flatten={0.6}
        puffCount={4}
        seed={211}
      />
      <PixelCloud
        position={[3.4, 8.2, -24]}
        width={3.0}
        height={0.5}
        depth={1.0}
        grid={0.16}
        density={0.32}
        noiseScale={1.2}
        flatten={0.3}
        puffCount={2}
        seed={373}
      />
      <PixelCloud
        position={[18, 6.4, -26]}
        width={4.2}
        height={0.6}
        depth={1.2}
        grid={0.16}
        density={0.32}
        noiseScale={1.1}
        flatten={0.4}
        puffCount={3}
        seed={502}
      />
      <PixelCloud
        position={[-18.5, 7.0, -25]}
        width={3.6}
        height={0.55}
        depth={1.1}
        grid={0.16}
        density={0.3}
        noiseScale={1.15}
        flatten={0.35}
        puffCount={3}
        seed={627}
      />
      <PixelCloud
        position={[-5.5, 2.8, -22]}
        width={5.5}
        height={0.5}
        depth={1.2}
        grid={0.16}
        density={0.34}
        noiseScale={1.1}
        flatten={0.7}
        puffCount={3}
        seed={733}
      />
      <PixelCloud
        position={[11, 2.6, -23]}
        width={4.8}
        height={0.5}
        depth={1.1}
        grid={0.16}
        density={0.34}
        noiseScale={1.1}
        flatten={0.7}
        puffCount={3}
        seed={841}
      />
      {farClouds.map((c, i) => (
        <PixelCloud key={`far-${i}`} {...c} />
      ))}
      <PixelCloud
        position={[-26, 5.2, -22]}
        width={14}
        height={1.2}
        depth={2.4}
        grid={0.26}
        density={0.24}
        noiseScale={0.75}
        flatten={0.5}
        puffCount={7}
        seed={1411}
      />
      <PixelCloud
        position={[24, 4.4, -24]}
        width={15}
        height={1.1}
        depth={2.4}
        grid={0.26}
        density={0.24}
        noiseScale={0.75}
        flatten={0.55}
        puffCount={7}
        seed={1623}
      />
      <PixelCloud
        position={[-30, 7.6, -32]}
        width={11}
        height={0.95}
        depth={2}
        grid={0.24}
        density={0.26}
        noiseScale={0.85}
        flatten={0.45}
        puffCount={5}
        seed={1809}
      />
      <PixelCloud
        position={[30, 7.2, -34]}
        width={11.5}
        height={0.95}
        depth={2}
        grid={0.24}
        density={0.26}
        noiseScale={0.85}
        flatten={0.45}
        puffCount={5}
        seed={1973}
      />
    </>
  );
}

function LightSetup() {
  const cfg = useThemeConfig();
  return (
    <>
      <hemisphereLight args={[cfg.hemi.sky, cfg.hemi.ground, cfg.hemi.intensity]} />
      <directionalLight
        position={cfg.keyLight.position}
        intensity={cfg.keyLight.intensity}
        color={cfg.keyLight.color}
      />
      <directionalLight
        position={cfg.fillLight.position}
        intensity={cfg.fillLight.intensity}
        color={cfg.fillLight.color}
      />
    </>
  );
}

function SceneTuning() {
  const { gl, scene } = useThree();
  const cfg = useThemeConfig();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = cfg.exposure;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    scene.fog = new THREE.FogExp2(cfg.fog.color, cfg.fog.density);
  }, [cfg, gl, scene]);
  return null;
}

export function VoxelScene({ theme = "night" }: { theme?: Theme }) {
  return (
    <ThemeContext.Provider value={theme}>
      <Canvas
        className="voxel-canvas"
        camera={{ position: [0, 1.18, 5.4], fov: 74, near: 0.1, far: 180 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <SceneTuning />
        <SkyDome />
        <CelestialBody />
        <LightSetup />
        <CloudField />
        <Ground />
        <GrassField />
        <GlowAmbient />
        <ClickBursts flightSpeed={FLIGHT_SPEED} />
        <CameraRig />
      </Canvas>
    </ThemeContext.Provider>
  );
}
