"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { GlobeCanvas } from "@/components/sphere/GlobeCanvas";
import {
  ArcLabel,
  AxisLine,
  GlobeShell,
  NativeLine,
  PointMarker,
} from "@/components/sphere/GlobePrimitives";
import {
  equatorCircle,
  greatArc,
  lonLatToCart,
  meridianCircle,
  parallelCircle,
  smallCircle,
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
      <GlobeCanvas className="h-full w-full">
        <Stars radius={40} depth={30} count={900} factor={2.4} saturation={0} fade speed={0.25} />
        <SphereMesh state={state} />
      </GlobeCanvas>
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
  const globe = useRef<THREE.Group>(null);
  const dragging = useRef(false);

  useFrame((ctx, dt) => {
    const controls = ctx.controls as { enabled?: boolean; state?: number } | null;
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
    <group ref={globe}>
      <GlobeShell />
      <AxisLine poles />

      {state.showEquator && (
        <>
          <NativeLine pts={equator} color={state.highlight === "great" ? "#f0d48a" : "#ffd56a"} />
          <ArcLabel pos={[1.08, 0.02, 0]} text="استوا EQ" />
        </>
      )}
      {state.showMeridians &&
        meridians.map((m, i) => <NativeLine key={i} pts={m} color="#9ec4e6" />)}
      {state.showParallels &&
        parallels.map((p, i) => (
          <NativeLine
            key={i}
            pts={p}
            color={state.highlight === "small" ? "#7ec8c8" : "#5aa3a3"}
            dashed
          />
        ))}
      {state.showHorizon && (
        <>
          <NativeLine pts={horizon} color="#ff9eb0" />
          <ArcLabel pos={horizon[0]} text="افق" />
        </>
      )}
      {state.showEcliptic && (
        <>
          <NativeLine pts={ecliptic} color="#8fd4a4" />
          <ArcLabel pos={ecliptic[12]} text="دایرة‌البروج" />
        </>
      )}
      {state.showSmallDemo && (
        <NativeLine
          pts={smallDemo}
          color={state.highlight === "small" ? "#ffe9a8" : "#e6d39a"}
        />
      )}

      {state.showTriangle && (
        <>
          <NativeLine pts={arcs.ab} color="#ffe9a8" />
          <NativeLine pts={arcs.bc} color="#7ec8c8" />
          <NativeLine pts={arcs.ca} color="#8eb4d4" />
          <ArcLabel pos={arcs.ab[Math.floor(arcs.ab.length / 2)]} text="c = AB" />
          <ArcLabel pos={arcs.bc[Math.floor(arcs.bc.length / 2)]} text="a = BC" />
          <ArcLabel pos={arcs.ca[Math.floor(arcs.ca.length / 2)]} text="b = CA" />
          <PointMarker pos={A} label="A" color="#ffe9a8" sublabel="رأس" />
          <PointMarker pos={B} label="B" color="#7ec8c8" sublabel="رأس" />
          <PointMarker pos={C} label="C" color="#8eb4d4" sublabel="رأس" />
        </>
      )}
    </group>
  );
}
