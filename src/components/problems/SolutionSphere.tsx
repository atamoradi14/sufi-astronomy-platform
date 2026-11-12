"use client";

import { useMemo } from "react";
import { deg } from "@/lib/astronomy/sphericalTrig";
import { toPersianDigits } from "@/lib/utils";

/** SVG sphere diagram for olympiad problem solutions */
export function SolutionSphere({
  mode,
  values,
}: {
  mode: "distance" | "triangle" | "pzx" | "excess" | "circles";
  values?: Record<string, number>;
}) {
  const computed = useMemo(() => {
    if (mode === "distance" && values?.d1 != null && values?.d2 != null && values?.da != null) {
      // cos d = sinδ1 sinδ2 + cosδ1 cosδ2 cosΔα ≡ cosine law with a=90°−δ1, b=90°−δ2, C=Δα
      return { c: deg.cosineLawSide(90 - values.d1, 90 - values.d2, values.da) };
    }
    if (mode === "excess" && values?.A && values?.B && values?.C) {
      return { E: deg.excess(values.A, values.B, values.C) };
    }
    if (mode === "triangle" && values?.a && values?.b && values?.C) {
      return { c: deg.cosineLawSide(values.a, values.b, values.C) };
    }
    return {};
  }, [mode, values]);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--ink-deep)] p-3">
      <svg viewBox="0 0 320 220" className="w-full">
        <circle cx="160" cy="110" r="88" fill="#0c1424" stroke="rgba(201,162,39,0.4)" />
        <ellipse cx="160" cy="110" rx="88" ry="28" fill="none" stroke="rgba(201,162,39,0.35)" />
        {mode === "circles" && (
          <>
            <ellipse cx="160" cy="70" rx="62" ry="14" fill="none" stroke="#3d7a7a" strokeDasharray="4 4" />
            <text x="160" y="205" textAnchor="middle" fill="#9aa6b8" fontSize="11">
              great (solid) · small (dashed)
            </text>
          </>
        )}
        {(mode === "triangle" || mode === "excess" || mode === "distance" || mode === "pzx") && (
          <>
            <path
              d="M160 30 L250 150 L70 145 Z"
              fill="rgba(201,162,39,0.12)"
              stroke="#e6d39a"
              strokeWidth="1.8"
            />
            <circle cx="160" cy="30" r="3.5" fill="#e6d39a" />
            <circle cx="250" cy="150" r="3.5" fill="#e6d39a" />
            <circle cx="70" cy="145" r="3.5" fill="#e6d39a" />
            <text x="168" y="28" fill="#e6d39a" fontSize="11">
              {mode === "pzx" ? "P" : "A"}
            </text>
            <text x="258" y="154" fill="#e6d39a" fontSize="11">
              {mode === "pzx" ? "Z" : "B"}
            </text>
            <text x="52" y="150" fill="#e6d39a" fontSize="11">
              {mode === "pzx" ? "X" : "C"}
            </text>
          </>
        )}
        {mode === "pzx" && (
          <text x="160" y="205" textAnchor="middle" fill="#9aa6b8" fontSize="10">
            Astronomical triangle PZX
          </text>
        )}
        {"c" in computed && computed.c != null && (
          <text x="160" y="205" textAnchor="middle" fill="#c9a227" fontSize="12">
            c ≈ {toPersianDigits(computed.c.toFixed(2))}°
          </text>
        )}
        {"E" in computed && computed.E != null && (
          <text x="160" y="205" textAnchor="middle" fill="#c9a227" fontSize="12">
            E ≈ {toPersianDigits(computed.E.toFixed(2))}°
          </text>
        )}
      </svg>
    </div>
  );
}
