"use client";

import { useMemo } from "react";
import type { EarthOrbitState } from "@/lib/astronomy/ephemeris";

/** 2D ecliptic-plane view: Sun at focus, Earth on ellipse, equinox line γ. */
export function EarthOrbitView({ earth }: { earth: EarthOrbitState }) {
  const size = 320;
  const pad = 28;
  const e = earth.eccentricity;
  const a = 1; // AU scale
  const b = a * Math.sqrt(1 - e * e);
  const c = a * e; // focus offset

  const pts = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    for (let i = 0; i <= 180; i++) {
      const th = (i / 180) * Math.PI * 2;
      // parametric ellipse centred; Sun at +c along x toward perihelion ≈ γ for teaching
      out.push({ x: a * Math.cos(th) - c, y: b * Math.sin(th) });
    }
    return out;
  }, [a, b, c]);

  const scale = (size / 2 - pad) / (a * (1 + e) + 0.05);
  const toXy = (x: number, y: number) => ({
    X: size / 2 + x * scale,
    Y: size / 2 - y * scale,
  });

  const earthPt = toXy(earth.x, earth.y);
  const sunPt = toXy(0, 0);
  const gammaA = toXy(1.15, 0);
  const gammaB = toXy(-1.15, 0);

  const path = pts
    .map((p, i) => {
      const { X, Y } = toXy(p.x, p.y);
      return `${i === 0 ? "M" : "L"}${X.toFixed(1)},${Y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-auto w-full max-w-sm">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="1" />
          <stop offset="55%" stopColor="#c9a227" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={size} height={size} fill="#070d18" rx="12" />
      {/* equinox line */}
      <line
        x1={gammaB.X}
        y1={gammaB.Y}
        x2={gammaA.X}
        y2={gammaA.Y}
        stroke="rgba(126,200,200,0.7)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text x={gammaA.X - 8} y={gammaA.Y - 8} fill="#7ec8c8" fontSize="11">
        ♈ γ
      </text>
      <path d={path} fill="none" stroke="rgba(201,162,39,0.45)" strokeWidth="1.5" />
      {/* Sun */}
      <circle cx={sunPt.X} cy={sunPt.Y} r="16" fill="url(#sunGlow)" />
      <circle cx={sunPt.X} cy={sunPt.Y} r="7" fill="#ffe9a8" />
      <text x={sunPt.X + 12} y={sunPt.Y + 4} fill="#e6d39a" fontSize="11">
        ☉
      </text>
      {/* Earth */}
      <circle cx={earthPt.X} cy={earthPt.Y} r="6" fill="#6fa3d4" stroke="#e6d39a" strokeWidth="1.2" />
      <circle cx={earthPt.X} cy={earthPt.Y} r="10" fill="none" stroke="rgba(111,163,212,0.45)" strokeWidth="1">
        <animate attributeName="r" values="8;14;8" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.15;0.7" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <text x={earthPt.X + 10} y={earthPt.Y + 4} fill="#9ec4e6" fontSize="11">
        ⊕
      </text>
      <text x="12" y={size - 12} fill="#9aa6b8" fontSize="10">
        صفحهٔ دایرة‌البروج · کانون = خورشید · خط‌چین = اعتدال
      </text>
    </svg>
  );
}
