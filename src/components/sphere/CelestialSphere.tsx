"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  angularDistanceDeg,
  equatorCircle,
  greatArc,
  lonLatToCart,
  meridianCircle,
  parallelCircle,
  smallCircle,
  sphericalAngleDeg,
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
    <div className={className}>
      <Canvas
        camera={{ position: [2.4, 1.4, 2.4], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#070d18"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 2]} intensity={1.1} />
        <Stars radius={40} depth={30} count={1200} factor={2} saturation={0} fade speed={0.4} />
        <SphereMesh state={state} />
        <OrbitControls
          enablePan={false}
          minDistance={1.6}
          maxDistance={5}
          rotateSpeed={0.75}
          zoomSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}

function SphereMesh({ state }: { state: SphereViewState }) {
  const globe = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (globe.current && !state.showTriangle) {
      globe.current.rotation.y += dt * 0.03;
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
    // Horizon pole = zenith at (0, observerLat) in lon=0 frame for demo
    const zenith = lonLatToCart(0, state.observerLat);
    return smallCircle(zenith, 90, 128);
  }, [state.observerLat]);
  const ecliptic = useMemo(() => {
    // Tilted great circle ~23.4°
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

  const metrics = useMemo(() => {
    const a = angularDistanceDeg(B, C);
    const b = angularDistanceDeg(A, C);
    const c = angularDistanceDeg(A, B);
    const angA = sphericalAngleDeg(B, A, C);
    const angB = sphericalAngleDeg(A, B, C);
    const angC = sphericalAngleDeg(A, C, B);
    return { a, b, c, angA, angB, angC };
  }, [A, B, C]);

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

      {/* Axes hint */}
      <Line points={[[0, -1.15, 0], [0, 1.15, 0]]} color="#e6d39a" lineWidth={1.5} />
      <Html position={[0, 1.22, 0]} center>
        <span className="sphere-label">N</span>
      </Html>
      <Html position={[0, -1.22, 0]} center>
        <span className="sphere-label">S</span>
      </Html>

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
      {state.showHorizon && (
        <PolyLine pts={horizon} color="#8b4557" width={2} />
      )}
      {state.showEcliptic && (
        <PolyLine pts={ecliptic} color="#6f9e7a" width={2} />
      )}
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
          <Html position={[0, -1.45, 0]} center>
            <div className="sphere-metrics">
              a={fmt(metrics.a)} b={fmt(metrics.b)} c={fmt(metrics.c)} · A=
              {fmt(metrics.angA)} B={fmt(metrics.angB)} C={fmt(metrics.angC)}
            </div>
          </Html>
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
      <Html distanceFactor={6} position={[0.06, 0.06, 0]}>
        <span className="sphere-point">{label}</span>
      </Html>
    </group>
  );
}

function fmt(n: number) {
  return n.toFixed(1) + "°";
}
