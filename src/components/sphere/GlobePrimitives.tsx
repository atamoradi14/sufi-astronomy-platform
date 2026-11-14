"use client";

import { useEffect, useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Vec3 } from "@/lib/astronomy/sphereGeom";

export function GlobeShell() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.992, 64, 48]} />
        <meshStandardMaterial
          color="#3a5f8a"
          roughness={0.52}
          metalness={0.04}
          emissive="#163050"
          emissiveIntensity={0.45}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.004, 32, 24]} />
        <meshBasicMaterial color="#e6d39a" wireframe transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

export function AxisLine() {
  return (
    <NativeLine
      pts={[
        [0, -1.18, 0],
        [0, 1.18, 0],
      ]}
      color="#e6d39a"
    />
  );
}

export function NativeLine({
  pts,
  color,
  dashed,
}: {
  pts: Vec3[];
  color: string;
  dashed?: boolean;
}) {
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
    );
    const material = dashed
      ? new THREE.LineDashedMaterial({
          color,
          dashSize: 0.05,
          gapSize: 0.035,
        })
      : new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(geometry, material);
    if (dashed) line.computeLineDistances();
    return line;
  }, [pts, color, dashed]);

  useEffect(() => {
    return () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    };
  }, [line]);

  return <primitive object={line} />;
}

export function PointMarker({
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
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html position={[0.08, 0.09, 0]} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
        <span
          style={{
            color: "#f3e6b8",
            fontSize: 12,
            fontFamily: "serif",
            whiteSpace: "nowrap",
            textShadow: "0 0 6px #070d18",
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  );
}
