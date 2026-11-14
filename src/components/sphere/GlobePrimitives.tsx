"use client";

import { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Vec3 } from "@/lib/astronomy/sphereGeom";

/** High-contrast teaching globe — readable wires/labels on dark UI. */
export function GlobeShell({ translucent = true }: { translucent?: boolean }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.988, 72, 56]} />
        <meshStandardMaterial
          color={translucent ? "#6fa3d4" : "#4d7eab"}
          roughness={0.42}
          metalness={0.02}
          emissive="#1e4a72"
          emissiveIntensity={0.55}
          transparent={translucent}
          opacity={translucent ? 0.78 : 1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.006, 36, 28]} />
        <meshBasicMaterial color="#f0d78a" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export function AxisLine({ poles = false }: { poles?: boolean }) {
  return (
    <>
      <TubeArc
        pts={[
          [0, -1.2, 0],
          [0, 1.2, 0],
        ]}
        color="#ffe9a8"
        radius={0.008}
      />
      {poles ? (
        <>
          <PointMarker pos={[0, 1.02, 0]} label="N" color="#ffe9a8" sublabel="قطب شمال" />
          <PointMarker pos={[0, -1.02, 0]} label="S" color="#c9d6e8" sublabel="قطب جنوب" />
        </>
      ) : null}
    </>
  );
}

function nearlyEqual(a: Vec3, b: Vec3, eps = 1e-4) {
  return (
    Math.abs(a[0] - b[0]) < eps &&
    Math.abs(a[1] - b[1]) < eps &&
    Math.abs(a[2] - b[2]) < eps
  );
}

/** Thick tube arc — much more readable than 1px GL lines. */
export function TubeArc({
  pts,
  color,
  radius = 0.012,
  dashed,
}: {
  pts: Vec3[];
  color: string;
  radius?: number;
  dashed?: boolean;
}) {
  const mesh = useMemo(() => {
    if (pts.length < 2) return null;
    const closed = pts.length > 3 && nearlyEqual(pts[0], pts[pts.length - 1]);
    const sample = closed ? pts.slice(0, -1) : pts;
    const curve = new THREE.CatmullRomCurve3(
      sample.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
      closed,
      "catmullrom",
      0.02,
    );
    const tubular = Math.max(32, Math.min(180, sample.length * 2));
    const geom = new THREE.TubeGeometry(curve, tubular, radius, 7, closed);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: Boolean(dashed),
      opacity: dashed ? 0.7 : 1,
    });
    return new THREE.Mesh(geom, mat);
  }, [pts, color, radius, dashed]);

  if (!mesh) return null;
  return <primitive object={mesh} />;
}

/** Back-compat alias used by older call sites. */
export function NativeLine({
  pts,
  color,
  dashed,
}: {
  pts: Vec3[];
  color: string;
  dashed?: boolean;
}) {
  return (
    <TubeArc pts={pts} color={color} dashed={dashed} radius={dashed ? 0.009 : 0.013} />
  );
}

export function PointMarker({
  pos,
  label,
  color,
  sublabel,
}: {
  pos: Vec3;
  label: string;
  color: string;
  sublabel?: string;
}) {
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.048, 18, 18]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html
        position={[0.11, 0.11, 0]}
        style={{ pointerEvents: "none" }}
        zIndexRange={[40, 0]}
        center={false}
      >
        <div
          style={{
            background: "rgba(7,13,24,0.9)",
            border: "1px solid rgba(240,215,138,0.6)",
            borderRadius: 6,
            padding: "2px 8px",
            color: "#ffe9a8",
            fontSize: 13,
            fontFamily: "Georgia, 'Times New Roman', serif",
            whiteSpace: "nowrap",
            lineHeight: 1.35,
            boxShadow: "0 2px 10px rgba(0,0,0,0.45)",
          }}
        >
          <strong style={{ letterSpacing: "0.02em" }}>{label}</strong>
          {sublabel ? (
            <span style={{ display: "block", color: "#b8c4d6", fontSize: 10 }}>{sublabel}</span>
          ) : null}
        </div>
      </Html>
    </group>
  );
}

export function ArcLabel({ pos, text }: { pos: Vec3; text: string }) {
  return (
    <Html position={pos} style={{ pointerEvents: "none" }} center zIndexRange={[30, 0]}>
      <span
        style={{
          background: "rgba(12,20,36,0.92)",
          border: "1px solid rgba(126,200,200,0.5)",
          color: "#9fe0e0",
          fontSize: 11,
          padding: "1px 6px",
          borderRadius: 4,
          fontFamily: "ui-monospace, monospace",
          direction: "ltr",
        }}
      >
        {text}
      </span>
    </Html>
  );
}
