"use client";

import { useMemo } from "react";
import { GlobeCanvas } from "@/components/sphere/GlobeCanvas";
import {
  AxisLine,
  GlobeShell,
  NativeLine,
  PointMarker,
} from "@/components/sphere/GlobePrimitives";
import { equatorCircle, lonLatToCart, meridianCircle } from "@/lib/astronomy/sphereGeom";

export function ObserverGlobe({
  lat,
  lon,
  iss,
}: {
  lat: number;
  lon: number;
  iss?: { lat: number; lon: number } | null;
}) {
  const observer = useMemo(() => lonLatToCart(lon, lat, 1.025), [lat, lon]);
  const issPos = useMemo(
    () => (iss ? lonLatToCart(iss.lon, iss.lat, 1.07) : null),
    [iss],
  );
  const equator = useMemo(() => equatorCircle(120), []);
  const mer0 = useMemo(() => meridianCircle(0, 80), []);
  const merObs = useMemo(() => meridianCircle(lon, 80), [lon]);

  return (
    <GlobeCanvas className="h-[320px] w-full">
      <GlobeShell translucent={false} />
      <AxisLine poles />
      <NativeLine pts={equator} color="#ffd56a" />
      <NativeLine pts={mer0} color="#8eb4d4" />
      <NativeLine pts={merObs} color="#7ec8c8" />
      <group position={observer}>
        <mesh>
          <sphereGeometry args={[0.048, 20, 20]} />
          <meshBasicMaterial color="#ffe9a8" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshBasicMaterial color="#ffe9a8" transparent opacity={0.32} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshBasicMaterial color="#c9a227" transparent opacity={0.16} />
        </mesh>
      </group>
      <PointMarker
        pos={observer}
        label="شما"
        color="#ffe9a8"
        sublabel={`${lat.toFixed(3)}°, ${lon.toFixed(3)}°`}
      />
      {issPos ? (
        <>
          <mesh position={issPos}>
            <sphereGeometry args={[0.032, 12, 12]} />
            <meshBasicMaterial color="#7ec8c8" />
          </mesh>
          <PointMarker pos={issPos} label="ISS" color="#7ec8c8" />
        </>
      ) : null}
    </GlobeCanvas>
  );
}
