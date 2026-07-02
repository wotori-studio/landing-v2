"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Click / tap anywhere on the hero -> a burst of low-poly debris
 * (cubes, torii, cones, icosahedrons...) explodes from the cursor,
 * with gravity, ground bounces, a shockwave ring, sparks, a light
 * flash and a tiny camera FOV punch.
 */

const SHAPE_COUNT = 6;
const POOL_PER_SHAPE = 28;
const SPARK_POOL = 120;
const RING_POOL = 6;
const GRAVITY = 9.4;
const KILL_Z = 7.2;

const PALETTE = [
  "#5dc7ff",
  "#ffd84a",
  "#ff5a6e",
  "#c66bff",
  "#7dffb2",
  "#ff9a3c",
  "#8ea2ff"
];

type Shard = {
  alive: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  angularVelocity: THREE.Vector3;
  size: number;
  age: number;
  life: number;
  resting: boolean;
};

type Spark = {
  alive: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  age: number;
  life: number;
};

type Ring = {
  alive: boolean;
  position: THREE.Vector3;
  age: number;
  life: number;
  maxRadius: number;
};

function makeShard(): Shard {
  return {
    alive: false,
    position: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    rotation: new THREE.Euler(),
    angularVelocity: new THREE.Vector3(),
    size: 1,
    age: 0,
    life: 1,
    resting: false
  };
}

function makeSpark(): Spark {
  return {
    alive: false,
    position: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    size: 0.04,
    age: 0,
    life: 1
  };
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const rayCaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

/* ------------------------------------------------------------------ */
/* Synthesized burst sound (no audio assets): pitched-down thump +    */
/* band-passed noise crackle + a couple of high sparkle blips.        */
/* ------------------------------------------------------------------ */

let audioContext: AudioContext | null = null;
let audioOut: DynamicsCompressorNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

function getAudio() {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) {
    audioContext = new Ctor();
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 20;
    compressor.ratio.value = 8;
    compressor.connect(audioContext.destination);
    audioOut = compressor;

    const length = Math.floor(audioContext.sampleRate * 0.4);
    noiseBuffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function playBurstSound() {
  const ctx = getAudio();
  if (!ctx || !audioOut || !noiseBuffer) return;
  const now = ctx.currentTime;
  const vary = 0.9 + Math.random() * 0.25;

  // Low thump with a fast pitch drop.
  const thump = ctx.createOscillator();
  thump.type = "triangle";
  thump.frequency.setValueAtTime(190 * vary, now);
  thump.frequency.exponentialRampToValueAtTime(44, now + 0.22);
  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(0.5, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  thump.connect(thumpGain).connect(audioOut);
  thump.start(now);
  thump.stop(now + 0.32);

  // Noise crackle sweeping down through a bandpass.
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.Q.value = 0.9;
  bandpass.frequency.setValueAtTime(2600 * vary, now);
  bandpass.frequency.exponentialRampToValueAtTime(320, now + 0.28);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.32, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  noise.connect(bandpass).connect(noiseGain).connect(audioOut);
  noise.start(now);
  noise.stop(now + 0.35);

  // Two tiny pentatonic sparkles on top.
  const scale = [0, 3, 5, 7, 10, 12];
  for (let i = 0; i < 2; i += 1) {
    const start = now + 0.02 + i * 0.055;
    const step = scale[Math.floor(Math.random() * scale.length)];
    const blip = ctx.createOscillator();
    blip.type = "sine";
    blip.frequency.setValueAtTime(880 * Math.pow(2, step / 12) * vary, start);
    const blipGain = ctx.createGain();
    blipGain.gain.setValueAtTime(0.09, start);
    blipGain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
    blip.connect(blipGain).connect(audioOut);
    blip.start(start);
    blip.stop(start + 0.18);
  }
}

let lastBounceAt = 0;

/**
 * Quiet thud when a shard hits the grass. Pitch follows shard size,
 * volume follows impact speed, panned by world x. Throttled so a
 * dozen simultaneous bounces don't turn into mush.
 */
function playBounceSound(impact: number, size: number, x: number) {
  if (!audioContext || !audioOut || audioContext.state !== "running") return;
  const ctx = audioContext;
  const now = ctx.currentTime;
  if (now - lastBounceAt < 0.035) return;
  lastBounceAt = now;

  const strength = THREE.MathUtils.clamp(impact / 5, 0.12, 1);
  // Small shards knock higher, big ones lower.
  const baseFreq = (250 - size * 320) * (0.92 + Math.random() * 0.16);

  const pan = ctx.createStereoPanner
    ? ctx.createStereoPanner()
    : null;
  if (pan) pan.pan.value = THREE.MathUtils.clamp(x / 9, -0.8, 0.8);
  const out: AudioNode = pan ? (pan.connect(audioOut), pan) : audioOut;

  const thud = ctx.createOscillator();
  thud.type = "sine";
  thud.frequency.setValueAtTime(baseFreq, now);
  thud.frequency.exponentialRampToValueAtTime(baseFreq * 0.55, now + 0.09);
  const thudGain = ctx.createGain();
  thudGain.gain.setValueAtTime(0.055 * strength, now);
  thudGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.12);
  thud.connect(thudGain).connect(out);
  thud.start(now);
  thud.stop(now + 0.14);

  // Tiny high tick for texture.
  if (noiseBuffer) {
    const tick = ctx.createBufferSource();
    tick.buffer = noiseBuffer;
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 2800;
    const tickGain = ctx.createGain();
    tickGain.gain.setValueAtTime(0.02 * strength, now);
    tickGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.05);
    tick.connect(highpass).connect(tickGain).connect(out);
    tick.start(now);
    tick.stop(now + 0.06);
  }
}

export function ClickBursts({ flightSpeed }: { flightSpeed: number }) {
  const { camera, gl } = useThree();

  const geometries = useMemo(
    () => [
      new THREE.BoxGeometry(0.72, 0.72, 0.72),
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.ConeGeometry(0.42, 0.86, 5),
      new THREE.TorusGeometry(0.4, 0.16, 5, 7),
      new THREE.OctahedronGeometry(0.52, 0),
      new THREE.TetrahedronGeometry(0.6, 0)
    ],
    []
  );

  const shardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        flatShading: true,
        roughness: 0.38,
        metalness: 0.12,
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.05
      }),
    []
  );

  const sparkMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        toneMapped: false,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }),
    []
  );

  useEffect(
    () => () => {
      geometries.forEach((g) => g.dispose());
      shardMaterial.dispose();
      sparkMaterial.dispose();
    },
    [geometries, shardMaterial, sparkMaterial]
  );

  const shardMeshes = useRef<(THREE.InstancedMesh | null)[]>(
    Array.from({ length: SHAPE_COUNT }, () => null)
  );
  const sparkMesh = useRef<THREE.InstancedMesh>(null);
  const ringMeshes = useRef<(THREE.Mesh | null)[]>(
    Array.from({ length: RING_POOL }, () => null)
  );
  const ringMaterials = useRef<(THREE.MeshBasicMaterial | null)[]>(
    Array.from({ length: RING_POOL }, () => null)
  );
  const flashLight = useRef<THREE.PointLight>(null);

  const shards = useMemo<Shard[][]>(
    () =>
      Array.from({ length: SHAPE_COUNT }, () =>
        Array.from({ length: POOL_PER_SHAPE }, makeShard)
      ),
    []
  );
  const sparks = useMemo<Spark[]>(
    () => Array.from({ length: SPARK_POOL }, makeSpark),
    []
  );
  const rings = useMemo<Ring[]>(
    () =>
      Array.from({ length: RING_POOL }, () => ({
        alive: false,
        position: new THREE.Vector3(),
        age: 0,
        life: 0.6,
        maxRadius: 2.4
      })),
    []
  );

  const kick = useRef(0);
  const baseFov = useRef<number | null>(null);
  const cursor = useRef({ shard: 0, spark: 0, ring: 0 });
  const reducedMotion = useRef(false);

  // Allocate instance color buffers once.
  useLayoutEffect(() => {
    tempColor.set("#ffffff");
    shardMeshes.current.forEach((mesh) => {
      if (!mesh) return;
      for (let i = 0; i < POOL_PER_SHAPE; i += 1) mesh.setColorAt(i, tempColor);
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
    if (sparkMesh.current) {
      for (let i = 0; i < SPARK_POOL; i += 1)
        sparkMesh.current.setColorAt(i, tempColor);
      if (sparkMesh.current.instanceColor)
        sparkMesh.current.instanceColor.needsUpdate = true;
    }
  }, []);

  useEffect(() => {
    reducedMotion.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const spawnBurst = (clientX: number, clientY: number) => {
      const rect = gl.domElement.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      )
        return;

      ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      rayCaster.setFromCamera(ndc, camera);
      const origin = rayCaster.ray.origin;
      const dir = rayCaster.ray.direction;

      // Aim at the grass when pointing down, otherwise fixed depth in the air.
      let distance = 8;
      if (dir.y < -0.02) {
        distance = THREE.MathUtils.clamp((0.4 - origin.y) / dir.y, 3.5, 14);
      }
      const px = origin.x + dir.x * distance;
      const py = Math.max(origin.y + dir.y * distance, 0.35);
      const pz = origin.z + dir.z * distance;

      const base = new THREE.Color(
        PALETTE[Math.floor(Math.random() * PALETTE.length)]
      );

      const shardCount = reducedMotion.current ? 7 : 13;
      for (let i = 0; i < shardCount; i += 1) {
        const type = Math.floor(Math.random() * SHAPE_COUNT);
        const pool = shards[type];
        const slot = cursor.current.shard % POOL_PER_SHAPE;
        cursor.current.shard += 1;
        const shard = pool[slot];

        shard.alive = true;
        shard.resting = false;
        shard.age = 0;
        shard.life = 3.2 + Math.random() * 1.6;
        shard.size = 0.16 + Math.random() * 0.3;
        shard.position.set(px, py, pz);

        // Radial blast with upward bias + slight push away from the camera.
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 2.4 + Math.random() * 4.0;
        shard.velocity.set(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.abs(Math.cos(phi)) * speed * 0.9 + 1.4,
          Math.sin(phi) * Math.sin(theta) * speed
        );
        shard.velocity.addScaledVector(dir, 1.3);

        shard.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        shard.angularVelocity.set(
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 9
        );

        const mesh = shardMeshes.current[type];
        if (mesh) {
          tempColor
            .copy(base)
            .offsetHSL(
              (Math.random() - 0.5) * 0.14,
              0,
              (Math.random() - 0.35) * 0.24
            );
          if (Math.random() < 0.18) tempColor.set("#ffffff");
          mesh.setColorAt(slot, tempColor);
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }
      }

      const sparkCount = reducedMotion.current ? 10 : 22;
      for (let i = 0; i < sparkCount; i += 1) {
        const slot = cursor.current.spark % SPARK_POOL;
        cursor.current.spark += 1;
        const spark = sparks[slot];
        spark.alive = true;
        spark.age = 0;
        spark.life = 0.45 + Math.random() * 0.5;
        spark.size = 0.028 + Math.random() * 0.05;
        spark.position.set(px, py, pz);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 4.5 + Math.random() * 7.5;
        spark.velocity.set(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.cos(phi) * speed,
          Math.sin(phi) * Math.sin(theta) * speed
        );
        if (sparkMesh.current) {
          tempColor.copy(base).lerp(new THREE.Color("#ffffff"), Math.random() * 0.7);
          sparkMesh.current.setColorAt(slot, tempColor);
          if (sparkMesh.current.instanceColor)
            sparkMesh.current.instanceColor.needsUpdate = true;
        }
      }

      const ringSlot = cursor.current.ring % RING_POOL;
      cursor.current.ring += 1;
      const ring = rings[ringSlot];
      ring.alive = true;
      ring.age = 0;
      ring.life = 0.55;
      ring.maxRadius = 2.1 + Math.random() * 0.8;
      ring.position.set(px, py, pz);
      const ringMaterial = ringMaterials.current[ringSlot];
      if (ringMaterial) ringMaterial.color.copy(base).lerp(new THREE.Color("#ffffff"), 0.4);

      if (flashLight.current) {
        flashLight.current.position.set(px, py + 0.4, pz);
        flashLight.current.color.copy(base).lerp(new THREE.Color("#ffffff"), 0.55);
        flashLight.current.intensity = Math.min(
          flashLight.current.intensity + 26,
          40
        );
      }

      if (!reducedMotion.current) {
        kick.current = Math.min(kick.current + 1, 1.6);
      }

      playBurstSound();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select, [role='button']"))
        return;
      spawnBurst(event.clientX, event.clientY);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [camera, gl, rings, shards, sparks]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);

    for (let type = 0; type < SHAPE_COUNT; type += 1) {
      const mesh = shardMeshes.current[type];
      if (!mesh) continue;
      const pool = shards[type];
      for (let i = 0; i < POOL_PER_SHAPE; i += 1) {
        const shard = pool[i];
        if (!shard.alive) {
          tempObject.position.set(0, -50, 0);
          tempObject.scale.setScalar(0.0001);
          tempObject.rotation.set(0, 0, 0);
          tempObject.updateMatrix();
          mesh.setMatrixAt(i, tempObject.matrix);
          continue;
        }

        shard.age += dt;
        if (shard.age >= shard.life || shard.position.z > KILL_Z) {
          shard.alive = false;
          continue;
        }

        shard.velocity.y -= GRAVITY * dt;
        shard.position.addScaledVector(shard.velocity, dt);
        // Ride the world flow toward the camera, like the grass does.
        shard.position.z += flightSpeed * dt;

        shard.rotation.x += shard.angularVelocity.x * dt;
        shard.rotation.y += shard.angularVelocity.y * dt;
        shard.rotation.z += shard.angularVelocity.z * dt;

        const floor = shard.size * 0.55;
        if (shard.position.y < floor && shard.velocity.y < 0) {
          shard.position.y = floor;
          const impact = -shard.velocity.y;
          if (impact > 0.9) {
            playBounceSound(impact, shard.size, shard.position.x);
          }
          shard.velocity.y *= -0.42;
          shard.velocity.x *= 0.72;
          shard.velocity.z *= 0.72;
          shard.angularVelocity.multiplyScalar(0.55);
          if (Math.abs(shard.velocity.y) < 0.6) {
            shard.velocity.y = 0;
            shard.resting = true;
          }
        }
        if (shard.resting) {
          shard.angularVelocity.multiplyScalar(1 - Math.min(1, dt * 6));
        }

        // Pop in with a little overshoot, shrink out at the end of life.
        const popIn =
          shard.age < 0.18
            ? (() => {
                const k = shard.age / 0.18;
                return (1 - Math.pow(1 - k, 3)) * (1 + 0.4 * Math.sin(k * Math.PI));
              })()
            : 1;
        const remaining = shard.life - shard.age;
        const fadeOut = remaining < 0.55 ? Math.max(remaining / 0.55, 0) : 1;
        const scale = shard.size * popIn * fadeOut;

        tempObject.position.copy(shard.position);
        tempObject.rotation.copy(shard.rotation);
        tempObject.scale.setScalar(scale);
        tempObject.updateMatrix();
        mesh.setMatrixAt(i, tempObject.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    if (sparkMesh.current) {
      for (let i = 0; i < SPARK_POOL; i += 1) {
        const spark = sparks[i];
        if (!spark.alive) {
          tempObject.position.set(0, -50, 0);
          tempObject.scale.setScalar(0.0001);
          tempObject.updateMatrix();
          sparkMesh.current.setMatrixAt(i, tempObject.matrix);
          continue;
        }
        spark.age += dt;
        if (spark.age >= spark.life) {
          spark.alive = false;
          continue;
        }
        spark.velocity.y -= GRAVITY * 0.45 * dt;
        spark.velocity.multiplyScalar(1 - Math.min(1, dt * 1.8));
        spark.position.addScaledVector(spark.velocity, dt);
        spark.position.z += flightSpeed * dt;

        const t = spark.age / spark.life;
        const scale = spark.size * (1 - t) * (1 + t * 2.2);
        tempObject.position.copy(spark.position);
        tempObject.rotation.set(0, 0, 0);
        tempObject.scale.set(scale, scale, scale * (1 + t * 3));
        tempObject.updateMatrix();
        sparkMesh.current.setMatrixAt(i, tempObject.matrix);
      }
      sparkMesh.current.instanceMatrix.needsUpdate = true;
    }

    for (let i = 0; i < RING_POOL; i += 1) {
      const ring = rings[i];
      const mesh = ringMeshes.current[i];
      const material = ringMaterials.current[i];
      if (!mesh || !material) continue;
      if (!ring.alive) {
        mesh.visible = false;
        continue;
      }
      ring.age += dt;
      if (ring.age >= ring.life) {
        ring.alive = false;
        mesh.visible = false;
        continue;
      }
      const t = ring.age / ring.life;
      const eased = 1 - Math.pow(1 - t, 2.4);
      mesh.visible = true;
      mesh.position.copy(ring.position);
      mesh.quaternion.copy(camera.quaternion);
      mesh.scale.setScalar(0.25 + eased * ring.maxRadius);
      material.opacity = Math.pow(1 - t, 1.8) * 0.8;
    }

    if (flashLight.current && flashLight.current.intensity > 0.01) {
      flashLight.current.intensity *= Math.exp(-dt * 7.5);
    }

    if (baseFov.current === null) {
      baseFov.current = (camera as THREE.PerspectiveCamera).fov;
    }
    if (kick.current > 0.001) {
      kick.current *= Math.exp(-dt * 6.5);
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov = baseFov.current - kick.current * 2.4;
      cam.updateProjectionMatrix();
    } else if (kick.current !== 0) {
      kick.current = 0;
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov = baseFov.current;
      cam.updateProjectionMatrix();
    }
  });

  return (
    <group>
      {geometries.map((geometry, type) => (
        <instancedMesh
          key={type}
          ref={(node) => {
            shardMeshes.current[type] = node;
          }}
          args={[geometry, shardMaterial, POOL_PER_SHAPE]}
          frustumCulled={false}
        />
      ))}
      <instancedMesh
        ref={sparkMesh}
        args={[undefined, sparkMaterial, SPARK_POOL]}
        frustumCulled={false}
        renderOrder={11}
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      {rings.map((_, i) => (
        <mesh
          key={`ring-${i}`}
          ref={(node) => {
            ringMeshes.current[i] = node;
          }}
          visible={false}
          renderOrder={13}
          frustumCulled={false}
        >
          <ringGeometry args={[0.82, 1, 48]} />
          <meshBasicMaterial
            ref={(node) => {
              ringMaterials.current[i] = node;
            }}
            transparent
            opacity={0}
            toneMapped={false}
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <pointLight ref={flashLight} intensity={0} distance={14} decay={2} />
    </group>
  );
}
