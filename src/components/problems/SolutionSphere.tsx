"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { GlobeCanvas } from "@/components/sphere/GlobeCanvas";
import {
  AxisLine,
  GlobeShell,
  NativeLine,
  PointMarker,
} from "@/components/sphere/GlobePrimitives";
import type { SphereDiagram } from "@/lib/content/problems";
import { deg } from "@/lib/astronomy/sphericalTrig";
import {
  angularDistanceDeg,
  equatorCircle,
  greatArc,
  lonLatToCart,
  meridianCircle,
  parallelCircle,
  placeEquilateral,
  placePZX,
  placeTriangleFromSides,
  placeTriangleSAS,
  sideFromNapier,
  smallCircle,
  type Vec3,
} from "@/lib/astronomy/sphereGeom";
import { toPersianDigits } from "@/lib/utils";

const DEG = Math.PI / 180;

function clamp(x: number, lo = -1, hi = 1) {
  return Math.min(hi, Math.max(lo, x));
}

/** Sides from three angles (degrees) via polar cosine rearrangement. */
function sidesFromAngles(A: number, B: number, C: number) {
  const Ar = A * DEG;
  const Br = B * DEG;
  const Cr = C * DEG;
  const a =
    (Math.acos(
      clamp(
        (Math.cos(Ar) + Math.cos(Br) * Math.cos(Cr)) /
          (Math.sin(Br) * Math.sin(Cr) + 1e-15),
      ),
    ) *
      180) /
    Math.PI;
  const b =
    (Math.acos(
      clamp(
        (Math.cos(Br) + Math.cos(Ar) * Math.cos(Cr)) /
          (Math.sin(Ar) * Math.sin(Cr) + 1e-15),
      ),
    ) *
      180) /
    Math.PI;
  const c =
    (Math.acos(
      clamp(
        (Math.cos(Cr) + Math.cos(Ar) * Math.cos(Br)) /
          (Math.sin(Ar) * Math.sin(Br) + 1e-15),
      ),
    ) *
      180) /
    Math.PI;
  return { a, b, c };
}

function acuteAsin(x: number) {
  return (Math.asin(clamp(x)) * 180) / Math.PI;
}

type Built = {
  caption: string;
  metric?: string;
  equator?: boolean;
  meridians?: number[];
  parallels?: number[];
  small?: { pole: Vec3; radius: number; color?: string; dashed?: boolean }[];
  arcs?: { pts: Vec3[]; color: string; width?: number }[];
  points?: { pos: Vec3; label: string; color: string }[];
  fill?: [Vec3, Vec3, Vec3];
  axis?: boolean;
};

function buildScene(diagram: SphereDiagram): Built {
  switch (diagram.kind) {
    case "small-circle": {
      const N = lonLatToCart(0, 90);
      const onParallel = lonLatToCart(0, diagram.delta);
      return {
        caption: diagram.caption,
        metric: `۹۰°−δ = ${toPersianDigits(90 - diagram.delta)}°`,
        equator: true,
        axis: true,
        meridians: [0, 90],
        small: [
          {
            pole: N,
            radius: 90 - diagram.delta,
            color: "#3d7a7a",
            dashed: true,
          },
        ],
        arcs: [
          {
            pts: greatArc(N, onParallel, 48),
            color: "#e6d39a",
            width: 2.5,
          },
        ],
        points: [
          { pos: N, label: "N", color: "#e6d39a" },
          { pos: onParallel, label: `δ=+${diagram.delta}°`, color: "#7ec8c8" },
        ],
      };
    }
    case "star-distance": {
      const ra1 = diagram.ra1h * 15;
      const ra2 = diagram.ra2h * 15;
      const S1 = lonLatToCart(ra1, diagram.dec1);
      const S2 = lonLatToCart(ra2, diagram.dec2);
      const d = angularDistanceDeg(S1, S2);
      return {
        caption: diagram.caption,
        metric: `d ≈ ${toPersianDigits(d.toFixed(2))}°`,
        equator: true,
        axis: true,
        meridians: [ra1, ra2],
        parallels: [diagram.dec1, diagram.dec2],
        arcs: [{ pts: greatArc(S1, S2, 64), color: "#e6d39a", width: 3 }],
        points: [
          { pos: S1, label: "S₁", color: "#e6d39a" },
          { pos: S2, label: "S₂", color: "#e6d39a" },
        ],
      };
    }
    case "triangle-ssa": {
      const { a, A, b } = diagram;
      const sinB = (Math.sin(b * DEG) * Math.sin(A * DEG)) / Math.sin(a * DEG);
      const B = acuteAsin(sinB); // acute branch (olympiad answer)
      const c = sideFromNapier(a, b, A, B);
      const placed = placeTriangleFromSides(a, b, c);
      return {
        caption: diagram.caption,
        metric: `B ≈ ${toPersianDigits(B.toFixed(1))}° · c ≈ ${toPersianDigits(c.toFixed(1))}°`,
        equator: true,
        axis: true,
        arcs: triangleArcs(placed.A, placed.B, placed.C),
        points: [
          { pos: placed.A, label: "A", color: "#e6d39a" },
          { pos: placed.B, label: "B", color: "#e6d39a" },
          { pos: placed.C, label: "C", color: "#e6d39a" },
        ],
        fill: [placed.A, placed.B, placed.C],
      };
    }
    case "triangle-sas": {
      const placed = placeTriangleSAS(diagram.b, diagram.C, diagram.a);
      return {
        caption: diagram.caption,
        metric: `c ≈ ${toPersianDigits(placed.sideC.toFixed(1))}°`,
        equator: true,
        axis: true,
        arcs: triangleArcs(placed.A, placed.B, placed.C),
        points: [
          { pos: placed.A, label: "A", color: "#e6d39a" },
          { pos: placed.B, label: "B", color: "#e6d39a" },
          { pos: placed.C, label: "C", color: "#e6d39a" },
        ],
        fill: [placed.A, placed.B, placed.C],
      };
    }
    case "triangle-right": {
      // C = 90°, known side a and angle B → tan a = cos B tan c
      const { a, B } = diagram;
      const c =
        (Math.atan2(Math.tan(a * DEG), Math.cos(B * DEG)) * 180) / Math.PI;
      const bSide = acuteAsin(Math.sin(B * DEG) * Math.sin(c * DEG));
      const right = placeTriangleSAS(bSide, 90, a);
      return {
        caption: diagram.caption,
        metric: `c ≈ ${toPersianDigits(c.toFixed(1))}° · b ≈ ${toPersianDigits(bSide.toFixed(1))}°`,
        equator: true,
        axis: true,
        arcs: triangleArcs(right.A, right.B, right.C),
        points: [
          { pos: right.A, label: "A", color: "#e6d39a" },
          { pos: right.B, label: "B", color: "#e6d39a" },
          { pos: right.C, label: "C=90°", color: "#7ec8c8" },
        ],
        fill: [right.A, right.B, right.C],
      };
    }
    case "triangle-angles": {
      const { a, b, c } = sidesFromAngles(diagram.A, diagram.B, diagram.C);
      const placed = placeTriangleFromSides(a, b, c);
      const E = deg.excess(diagram.A, diagram.B, diagram.C);
      return {
        caption: diagram.caption,
        metric: `E = ${toPersianDigits(E.toFixed(1))}° · Area ≈ ${toPersianDigits((E * DEG).toFixed(3))} sr`,
        equator: true,
        axis: true,
        arcs: triangleArcs(placed.A, placed.B, placed.C),
        points: [
          { pos: placed.A, label: `A=${diagram.A}°`, color: "#e6d39a" },
          { pos: placed.B, label: `B=${diagram.B}°`, color: "#e6d39a" },
          { pos: placed.C, label: `C=${diagram.C}°`, color: "#e6d39a" },
        ],
        fill: [placed.A, placed.B, placed.C],
      };
    }
    case "triangle-equilateral": {
      const placed = placeEquilateral(diagram.side);
      const E = deg.excessLHuilier(diagram.side, diagram.side, diagram.side);
      const ang = (180 + E) / 3;
      return {
        caption: diagram.caption,
        metric: `E ≈ ${toPersianDigits(E.toFixed(1))}° · A=B=C ≈ ${toPersianDigits(ang.toFixed(1))}°`,
        equator: true,
        axis: true,
        arcs: triangleArcs(placed.A, placed.B, placed.C),
        points: [
          { pos: placed.A, label: "A", color: "#e6d39a" },
          { pos: placed.B, label: "B", color: "#e6d39a" },
          { pos: placed.C, label: "C", color: "#e6d39a" },
        ],
        fill: [placed.A, placed.B, placed.C],
      };
    }
    case "polar-dual": {
      const prim = placeTriangleFromSides(diagram.a, diagram.b, diagram.c);
      // Polar vertices = poles of opposite sides (oriented toward the primary vertex)
      const Ap = poleOfSide(prim.B, prim.C, prim.A);
      const Bp = poleOfSide(prim.C, prim.A, prim.B);
      const Cp = poleOfSide(prim.A, prim.B, prim.C);
      return {
        caption: diagram.caption,
        metric: `a′=۱۸۰°−A · cos C = −cos A cos B + sin A sin B cos c`,
        equator: true,
        axis: true,
        arcs: [
          ...triangleArcs(prim.A, prim.B, prim.C),
          { pts: greatArc(Ap, Bp, 48), color: "#3d7a7a", width: 2 },
          { pts: greatArc(Bp, Cp, 48), color: "#3d7a7a", width: 2 },
          { pts: greatArc(Cp, Ap, 48), color: "#3d7a7a", width: 2 },
        ],
        points: [
          { pos: prim.A, label: "A", color: "#e6d39a" },
          { pos: prim.B, label: "B", color: "#e6d39a" },
          { pos: prim.C, label: "C", color: "#e6d39a" },
          { pos: Ap, label: "A′", color: "#7ec8c8" },
          { pos: Bp, label: "B′", color: "#7ec8c8" },
          { pos: Cp, label: "C′", color: "#7ec8c8" },
        ],
        fill: [prim.A, prim.B, prim.C],
      };
    }
    case "pzx": {
      const H0 =
        diagram.rising != null && diagram.rising
          ? (Math.acos(
              clamp(
                -Math.tan(diagram.phi * DEG) * Math.tan(diagram.delta * DEG),
              ),
            ) *
              180) /
            Math.PI
          : (diagram.H ?? 45);
      const tri = placePZX(diagram.phi, diagram.delta, H0);
      const z = tri.ZX;
      const alt = 90 - z;
      const N = lonLatToCart(0, 90);
      const arcs = [
        { pts: greatArc(tri.P, tri.Z, 56), color: "#e6d39a", width: 2.8 },
        { pts: greatArc(tri.P, tri.X, 56), color: "#5b7c99", width: 2.8 },
        { pts: greatArc(tri.Z, tri.X, 56), color: "#3d7a7a", width: 2.8 },
      ];
      return {
        caption: diagram.caption,
        metric: diagram.rising
          ? `H₀ ≈ ${toPersianDigits(H0.toFixed(1))}° · ۲H₀ ≈ ${toPersianDigits(((2 * H0) / 15).toFixed(2))}ʰ`
          : `PZ=${toPersianDigits(tri.PZ.toFixed(0))}° · PX=${toPersianDigits(tri.PX.toFixed(0))}° · a≈${toPersianDigits(alt.toFixed(1))}°`,
        equator: true,
        axis: true,
        meridians: [0],
        small: diagram.rising
          ? [
              { pole: tri.Z, radius: 90, color: "#8b4557" },
              {
                pole: N,
                radius: 90 - diagram.delta,
                color: "#3d7a7a",
                dashed: true,
              },
            ]
          : [{ pole: tri.Z, radius: 90, color: "#8b4557", dashed: true }],
        arcs,
        points: [
          { pos: tri.P, label: "P", color: "#e6d39a" },
          { pos: tri.Z, label: "Z", color: "#e6d39a" },
          { pos: tri.X, label: "X", color: "#7ec8c8" },
        ],
        fill: [tri.P, tri.Z, tri.X],
      };
    }
    case "ecliptic": {
      // Ecliptic pole at RA=18h, Dec=90−ε in equatorial frame ≈ lon=270°, lat=90−ε
      const eclPole = lonLatToCart(270, 90 - diagram.epsilon);
      const sun = lonLatToCart(
        // λ measured from equinox along ecliptic: at λ=90°, RA≈90°, Dec=ε
        90,
        diagram.epsilon,
      );
      return {
        caption: diagram.caption,
        metric: `δ = arcsin(sin ε sin λ) = ${toPersianDigits(diagram.epsilon.toFixed(2))}°`,
        equator: true,
        axis: true,
        meridians: [0, 90],
        small: [
          { pole: eclPole, radius: 90, color: "#6f9e7a" },
        ],
        points: [
          { pos: lonLatToCart(0, 90), label: "N", color: "#e6d39a" },
          { pos: sun, label: "☉ λ=90°", color: "#e6d39a" },
          {
            pos: lonLatToCart(0, 0),
            label: "ϒ",
            color: "#7ec8c8",
          },
        ],
        arcs: [
          {
            pts: greatArc(lonLatToCart(0, 0), sun, 48),
            color: "#6f9e7a",
            width: 2,
          },
        ],
      };
    }
    case "lst": {
      const gmstDeg = diagram.gmst * 15;
      const lstDeg = (diagram.gmst + diagram.lonEast / 15) * 15;
      const greenwich = lonLatToCart(gmstDeg, 0);
      const local = lonLatToCart(lstDeg, 0);
      const pole = lonLatToCart(0, 90);
      return {
        caption: diagram.caption,
        metric: `LST = ${toPersianDigits((diagram.gmst + diagram.lonEast / 15).toFixed(1))}ʰ`,
        equator: true,
        axis: true,
        meridians: [gmstDeg, lstDeg],
        arcs: [
          {
            pts: greatArc(greenwich, local, 40),
            color: "#e6d39a",
            width: 3,
          },
          {
            pts: greatArc(pole, greenwich, 40),
            color: "#5b7c99",
            width: 1.5,
          },
          {
            pts: greatArc(pole, local, 40),
            color: "#3d7a7a",
            width: 1.5,
          },
        ],
        points: [
          { pos: greenwich, label: "Gr", color: "#5b7c99" },
          { pos: local, label: "Loc", color: "#e6d39a" },
          { pos: pole, label: "P", color: "#e6d39a" },
        ],
      };
    }
  }
}

function triangleArcs(A: Vec3, B: Vec3, C: Vec3) {
  return [
    { pts: greatArc(A, B, 64), color: "#e6d39a", width: 2.8 },
    { pts: greatArc(B, C, 64), color: "#3d7a7a", width: 2.8 },
    { pts: greatArc(C, A, 64), color: "#5b7c99", width: 2.8 },
  ];
}

/** Pole of great circle through U,V, oriented into the hemisphere of toward. */
function poleOfSide(U: Vec3, V: Vec3, toward: Vec3): Vec3 {
  const n: Vec3 = [
    U[1] * V[2] - U[2] * V[1],
    U[2] * V[0] - U[0] * V[2],
    U[0] * V[1] - U[1] * V[0],
  ];
  const len = Math.hypot(n[0], n[1], n[2]) || 1;
  let p: Vec3 = [n[0] / len, n[1] / len, n[2] / len];
  if (p[0] * toward[0] + p[1] * toward[1] + p[2] * toward[2] < 0) {
    p = [-p[0], -p[1], -p[2]];
  }
  return p;
}

export function SolutionSphere({ diagram }: { diagram: SphereDiagram }) {
  const scene = useMemo(() => buildScene(diagram), [diagram]);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--ink-deep)]">
      <div className="h-[280px] w-full sm:h-[340px]">
        <GlobeCanvas className="h-full w-full">
          <SphereFigure scene={scene} />
        </GlobeCanvas>
      </div>
      <div className="space-y-1 border-t border-[var(--border)] px-3 py-2.5">
        <p className="text-center text-[12px] leading-6 text-[var(--muted)]">
          {scene.caption}
        </p>
        {scene.metric && (
          <p className="text-center font-[family-name:var(--font-display)] text-sm text-[var(--gold-soft)] dir-ltr">
            {scene.metric}
          </p>
        )}
        <p className="text-center text-[10px] text-[var(--muted)]">
          بکشید تا بچرخد · اسکرول برای بزرگ‌نمایی
        </p>
      </div>
    </div>
  );
}

function SphereFigure({ scene }: { scene: Built }) {
  const equator = useMemo(() => equatorCircle(160), []);
  const meridians = useMemo(
    () => (scene.meridians ?? []).map((λ) => meridianCircle(λ, 120)),
    [scene.meridians],
  );
  const parallels = useMemo(
    () => (scene.parallels ?? []).map((φ) => parallelCircle(φ, 96)),
    [scene.parallels],
  );
  const smalls = useMemo(
    () =>
      (scene.small ?? []).map((s) => ({
        ...s,
        pts: smallCircle(s.pole, s.radius, 128),
      })),
    [scene.small],
  );

  return (
    <group>
      <GlobeShell />
      {scene.axis ? <AxisLine /> : null}

      {scene.equator && <NativeLine pts={equator} color="#c9a227" />}
      {meridians.map((m, i) => (
        <NativeLine key={`m${i}`} pts={m} color="#8eb4d4" />
      ))}
      {parallels.map((p, i) => (
        <NativeLine key={`p${i}`} pts={p} color="#5aa3a3" dashed />
      ))}
      {smalls.map((s, i) => (
        <NativeLine
          key={`s${i}`}
          pts={s.pts}
          color={s.color ?? "#5aa3a3"}
          dashed={s.dashed}
        />
      ))}

      {scene.fill && <TriangleCap vertices={scene.fill} />}

      {(scene.arcs ?? []).map((a, i) => (
        <NativeLine key={`a${i}`} pts={a.pts} color={a.color} />
      ))}

      {(scene.points ?? []).map((p, i) => (
        <PointMarker key={`pt${i}`} pos={p.pos} label={p.label} color={p.color} />
      ))}
    </group>
  );
}

function TriangleCap({ vertices }: { vertices: [Vec3, Vec3, Vec3] }) {
  const geom = useMemo(() => {
    const [A, B, C] = vertices;
    const steps = 12;
    const g = new THREE.BufferGeometry();
    const verts: number[] = [];
    const tris: number[] = [];
    const grid: THREE.Vector3[][] = [];
    for (let i = 0; i <= steps; i++) {
      grid[i] = [];
      const ti = i / steps;
      const left = slerpV(A, B, ti);
      const right = slerpV(A, C, ti);
      for (let j = 0; j <= i; j++) {
        const u = i === 0 ? 0 : j / i;
        grid[i].push(slerpV(left, right, u).multiplyScalar(0.997));
      }
    }
    let n = 0;
    const indexAt: number[][] = [];
    for (let i = 0; i <= steps; i++) {
      indexAt[i] = [];
      for (let j = 0; j <= i; j++) {
        const p = grid[i][j];
        verts.push(p.x, p.y, p.z);
        indexAt[i][j] = n++;
      }
    }
    for (let i = 0; i < steps; i++) {
      for (let j = 0; j <= i; j++) {
        if (j < i) {
          tris.push(indexAt[i][j], indexAt[i + 1][j], indexAt[i + 1][j + 1]);
          tris.push(indexAt[i][j], indexAt[i + 1][j + 1], indexAt[i][j + 1]);
        } else {
          tris.push(indexAt[i][j], indexAt[i + 1][j], indexAt[i + 1][j + 1]);
        }
      }
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    g.setIndex(tris);
    g.computeVertexNormals();
    return g;
  }, [vertices]);

  return (
    <mesh geometry={geom}>
      <meshBasicMaterial
        color="#c9a227"
        transparent
        opacity={0.38}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function slerpV(a: Vec3 | THREE.Vector3, b: Vec3 | THREE.Vector3, t: number) {
  const A = Array.isArray(a)
    ? new THREE.Vector3(...a).normalize()
    : a.clone().normalize();
  const B = Array.isArray(b)
    ? new THREE.Vector3(...b).normalize()
    : b.clone().normalize();
  const d = clamp(A.dot(B));
  const θ = Math.acos(d);
  if (θ < 1e-6) return A.clone();
  const s0 = Math.sin((1 - t) * θ) / Math.sin(θ);
  const s1 = Math.sin(t * θ) / Math.sin(θ);
  return new THREE.Vector3(
    s0 * A.x + s1 * B.x,
    s0 * A.y + s1 * B.y,
    s0 * A.z + s1 * B.z,
  ).normalize();
}

