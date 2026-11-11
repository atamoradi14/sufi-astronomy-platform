"use client";

import { useMemo, useState } from "react";
import { CONSTELLATIONS } from "@/lib/astronomy/constellations";
import { equatorialToHorizontal } from "@/lib/astronomy/sphere";
import { computeAstroClock } from "@/lib/astronomy/time";
import { useGeolocation } from "@/hooks/useGeolocation";
import { formatDeg, formatHours, toPersianDigits } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ConstellationViewer() {
  const [id, setId] = useState(CONSTELLATIONS[0].id);
  const geo = useGeolocation(false);
  const cons = CONSTELLATIONS.find((c) => c.id === id)!;
  const lon = geo.reading?.lon ?? 51.389;
  const lat = geo.reading?.lat ?? 35.6892;
  const clock = useMemo(() => computeAstroClock(new Date(), lon), [lon]);

  const projected = useMemo(() => {
    return cons.stars.map((s) => {
      const h = equatorialToHorizontal(s.ra, s.dec, lat, clock.lst);
      return { ...s, ...h };
    });
  }, [cons, lat, clock.lst]);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>صورت‌های فلکی صوفی</CardTitle>
          <CardDescription>
            گزیده‌ای از نگاشت‌های صور الکواکب با مختصات مدرن و محاسبهٔ سمت/ارتفاع برای مکان شما.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {CONSTELLATIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setId(c.id)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  c.id === id
                    ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--parchment)]"
                }`}
              >
                {c.nameFa}
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--ink)]/40 p-4 prose-fa">
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
              {cons.nameFa}
              <span className="mr-2 text-sm text-[var(--muted)]">({cons.nameAr})</span>
            </h3>
            <p className="mt-2 text-sm text-[var(--parchment)]/90">{cons.description}</p>
            <p className="mt-3 text-xs text-[var(--muted)]">
              LST ناظر: {formatHours(clock.lst, 3)} · عرض: {formatDeg(lat, 2)}
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            {projected.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--border)] px-3 py-2"
              >
                <span className="text-[var(--gold-soft)]">{s.nameFa}</span>
                <span className="text-[var(--muted)] text-xs">
                  RA {formatHours(s.ra, 2)} · Dec {formatDeg(s.dec, 1)} · آز{" "}
                  {formatDeg(s.az, 0)} · ارتفاع {formatDeg(s.alt, 0)} · قدر{" "}
                  {toPersianDigits(s.mag.toFixed(1))}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نگارهٔ رصدی</CardTitle>
          <CardDescription>طرح ستارگان و خطوط صورت به سبک نسخهٔ مصور</CardDescription>
        </CardHeader>
        <CardContent>
          <ConstellationCanvas consId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

function ConstellationCanvas({ consId }: { consId: string }) {
  const cons = CONSTELLATIONS.find((c) => c.id === consId)!;
  const ras = cons.stars.map((s) => s.ra);
  const decs = cons.stars.map((s) => s.dec);
  const minRa = Math.min(...ras);
  const maxRa = Math.max(...ras);
  const minDec = Math.min(...decs);
  const maxDec = Math.max(...decs);
  const mapX = (ra: number) => {
    const t = (ra - minRa) / Math.max(0.01, maxRa - minRa);
    return 40 + (1 - t) * 320;
  };
  const mapY = (dec: number) => {
    const t = (dec - minDec) / Math.max(0.01, maxDec - minDec);
    return 40 + (1 - t) * 260;
  };
  const byId = Object.fromEntries(cons.stars.map((s) => [s.id, s]));

  return (
    <svg
      viewBox="0 0 400 340"
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--ink-deep)]"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(230,211,154,0.35)" />
          <stop offset="100%" stopColor="rgba(230,211,154,0)" />
        </radialGradient>
      </defs>
      {cons.lines.map(([a, b], i) => {
        const sa = byId[a];
        const sb = byId[b];
        if (!sa || !sb) return null;
        return (
          <line
            key={i}
            x1={mapX(sa.ra)}
            y1={mapY(sa.dec)}
            x2={mapX(sb.ra)}
            y2={mapY(sb.dec)}
            stroke="rgba(61,122,122,0.75)"
            strokeWidth="1.4"
          />
        );
      })}
      {cons.stars.map((s) => {
        const r = Math.max(2.2, 6 - s.mag);
        const x = mapX(s.ra);
        const y = mapY(s.dec);
        return (
          <g key={s.id}>
            <circle cx={x} cy={y} r={r * 3} fill="url(#glow)" className="twinkle" />
            <circle cx={x} cy={y} r={r} fill="#e6d39a" />
            <text
              x={x + 8}
              y={y + 3}
              fill="#9aa6b8"
              fontSize="10"
              fontFamily="var(--font-body), sans-serif"
            >
              {s.nameFa}
            </text>
          </g>
        );
      })}
      <text
        x="200"
        y="325"
        textAnchor="middle"
        fill="#9aa6b8"
        fontSize="11"
        fontFamily="var(--font-display), serif"
      >
        {cons.nameFa} — به سبک صور الکواکب
      </text>
    </svg>
  );
}
