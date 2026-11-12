"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Line, OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  equatorCircle,
  greatArc,
  lonLatToCart,
  meridianCircle,
  parallelCircle,
  smallCircle,
  type Vec3,
} from "@/lib/astronomy/sphereGeom";

export type SphereViewState = {
  showEquator: boolean;
  showMeridians: boolean;
  showParallels: boolean;
  showHorizon: boolean;
  showEcliptic: boolean;
  showTriangle: boolean;
  showSmallDemo: boolean;
  smallRadius: number;
  observerLat: number;
  pointA: { lon: number; lat: number };
  pointB: { lon: number; lat: number };
  pointC: { lon: number; lat: number };
  highlight: "none" | "great" | "small" | "triangle";
};

type Props = {
  state: SphereViewState;
  className?: string;
};

export function CelestialSphere({ state, className }: Props) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Canvas
        camera={{ position: [2.4, 1.4, 2.4], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#070d18"), 1);
          gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 2]} intensity={1.1} />
        <Stars radius={40} depth={30} count={900} factor={2} saturation={0} fade speed={0.25} />
        <SphereMesh state={state} />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={1.6}
          maxDistance={5}
          rotateSpeed={0.75}
          zoomSpeed={0.7}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
        <span className="sphere-label">N · قطب</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <span className="sphere-label">S</span>
      </div>
    </div>
  );
}

function SphereMesh({ state }: { state: SphereViewState }) {
  const globe = useRef<THREE.Mesh>(null);
  const dragging = useRef(false);

  useFrame((ctx, dt) => {
    const controls = ctx.controls as { enabled?: boolean; state?: number } | null;
    // state 0 = NONE in OrbitControls internals when idle; avoid fighting user drag
    if (controls && "state" in controls && typeof controls.state === "number") {
      dragging.current = controls.state !== -1 && controls.state !== 0;
    }
    if (globe.current && !state.showTriangle && !dragging.current) {
      globe.current.rotation.y += dt * 0.025;
    }
  });

  const A = useMemo(
    () => lonLatToCart(state.pointA.lon, state.pointA.lat),
    [state.pointA],
  );
  const B = useMemo(
    () => lonLatToCart(state.pointB.lon, state.pointB.lat),
    [state.pointB],
  );
  const C = useMemo(
    () => lonLatToCart(state.pointC.lon, state.pointC.lat),
    [state.pointC],
  );

  const equator = useMemo(() => equatorCircle(160), []);
  const meridians = useMemo(
    () => [0, 45, 90, 135].map((λ) => meridianCircle(λ, 120)),
    [],
  );
  const parallels = useMemo(
    () => [-60, -30, 30, 60].map((φ) => parallelCircle(φ, 96)),
    [],
  );
  const horizon = useMemo(() => {
    const zenith = lonLatToCart(0, state.observerLat);
    return smallCircle(zenith, 90, 128);
  }, [state.observerLat]);
  const ecliptic = useMemo(() => {
    const pole = lonLatToCart(90, 90 - 23.44);
    return smallCircle(pole, 90, 160);
  }, []);
  const smallDemo = useMemo(
    () => smallCircle(A, state.smallRadius, 120),
    [A, state.smallRadius],
  );
  const arcs = useMemo(
    () => ({
      ab: greatArc(A, B, 72),
      bc: greatArc(B, C, 72),
      ca: greatArc(C, A, 72),
    }),
    [A, B, C],
  );

  return (
    <group>
      <mesh ref={globe}>
        <sphereGeometry args={[0.995, 64, 64]} />
        <meshStandardMaterial
          color="#121c30"
          transparent
          opacity={0.55}
          metalness={0.15}
          roughness={0.85}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.002, 48, 48]} />
        <meshBasicMaterial
          color="#c9a227"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      <Line points={[[0, -1.15, 0], [0, 1.15, 0]]} color="#e6d39a" lineWidth={1.5} />

      {state.showEquator && (
        <PolyLine pts={equator} color="#c9a227" width={2} glow={state.highlight === "great"} />
      )}
      {state.showMeridians &&
        meridians.map((m, i) => (
          <PolyLine key={i} pts={m} color="#5b7c99" width={1} />
        ))}
      {state.showParallels &&
        parallels.map((p, i) => (
          <PolyLine
            key={i}
            pts={p}
            color="#3d7a7a"
            width={1.25}
            dashed
            glow={state.highlight === "small"}
          />
        ))}
      {state.showHorizon && <PolyLine pts={horizon} color="#8b4557" width={2} />}
      {state.showEcliptic && <PolyLine pts={ecliptic} color="#6f9e7a" width={2} />}
      {state.showSmallDemo && (
        <PolyLine
          pts={smallDemo}
          color="#e6d39a"
          width={2.5}
          glow={state.highlight === "small"}
        />
      )}

      {state.showTriangle && (
        <>
          <PolyLine pts={arcs.ab} color="#e6d39a" width={3} glow={state.highlight === "triangle"} />
          <PolyLine pts={arcs.bc} color="#3d7a7a" width={3} glow={state.highlight === "triangle"} />
          <PolyLine pts={arcs.ca} color="#5b7c99" width={3} glow={state.highlight === "triangle"} />
          <PointMarker pos={A} label="A" color="#e6d39a" />
          <PointMarker pos={B} label="B" color="#e6d39a" />
          <PointMarker pos={C} label="C" color="#e6d39a" />
        </>
      )}
    </group>
  );
}

function PolyLine({
  pts,
  color,
  width = 1.5,
  dashed,
  glow,
}: {
  pts: Vec3[];
  color: string;
  width?: number;
  dashed?: boolean;
  glow?: boolean;
}) {
  const points = useMemo(
    () => pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
    [pts],
  );
  return (
    <Line
      points={points}
      color={color}
      lineWidth={glow ? width + 1.5 : width}
      dashed={dashed}
      dashSize={0.05}
      gapSize={0.04}
      transparent
      opacity={glow ? 1 : 0.92}
    />
  );
}

function PointMarker({
  pos,
  label,
  color,
}: {
  pos: Vec3;
  label: string;
  color: string;
}) {
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <Billboard position={[0.08, 0.08, 0]}>
        <Text
          fontSize={0.09}
          color="#e6d39a"
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.006}
          outlineColor="#070d18"
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
}
