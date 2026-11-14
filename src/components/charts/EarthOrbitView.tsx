"use client";

import type { EarthOrbitState } from "@/lib/astronomy/ephemeris";
import { useDigitScript } from "@/components/digits/DigitScript";
import { localizeDigits } from "@/lib/utils";

type TrackPoint = { x: number; y: number; lon: number; r: number };

function angDiff(a: number, b: number) {
  return Math.abs((((a - b + 540) % 360) + 360) % 360 - 180);
}

function nearest(track: TrackPoint[], lon: number) {
  return track.reduce((best, p) => (angDiff(p.lon, lon) < angDiff(best.lon, lon) ? p : best));
}

/** Magnify departure from 1 AU so the focus and perihelion are visible. Angles stay true. */
function magnify(p: { x: number; y: number }, gain: number) {
  const r = Math.hypot(p.x, p.y) || 1;
  const r2 = 1 + gain * (r - 1);
  return { x: (p.x / r) * r2, y: (p.y / r) * r2 };
}

/**
 * Heliocentric view from the north ecliptic pole.
 * +x is the vernal-equinox direction. Earth sits on that axis at the
 * September equinox (L = 0°) and on the opposite side at the March equinox (L = 180°).
 */
export function EarthOrbitView({
  earth,
  track,
}: {
  earth: EarthOrbitState;
  track: TrackPoint[];
}) {
  useDigitScript();
  if (track.length < 12) return null;

  const W = 460;
  const H = 640;
  const cx = 230;
  const cy = 208;
  const maxR = Math.max(
    1.02,
    ...track.map((p) => Math.hypot(p.x, p.y)),
    Math.hypot(earth.x, earth.y),
  );
  const scale = 118 / maxR;

  const to = (x: number, y: number, sc = scale, ox = cx, oy = cy) => ({
    X: ox + x * sc,
    Y: oy - y * sc,
  });

  const dOf = (pts: { x: number; y: number }[], sc = scale, ox = cx, oy = cy) =>
    pts
      .map((p, i) => {
        const q = to(p.x, p.y, sc, ox, oy);
        return `${i === 0 ? "M" : "L"}${q.X.toFixed(2)},${q.Y.toFixed(2)}`;
      })
      .join(" ") + " Z";

  const march = nearest(track, 180);
  const sept = nearest(track, 0);
  const june = nearest(track, 270);
  const december = nearest(track, 90);
  const peri = track.reduce((a, b) => (b.r < a.r ? b : a));
  const aphe = track.reduce((a, b) => (b.r > a.r ? b : a));

  const ray = (p: { x: number; y: number }, factor: number) => {
    const r = Math.hypot(p.x, p.y) || 1;
    return to((p.x / r) * maxR * factor, (p.y / r) * maxR * factor);
  };

  const n = (value: number, digits = 2) => localizeDigits(value.toFixed(digits));

  const aheadLon = ((earth.heliocentricLon + 16) * Math.PI) / 180;
  const ahead = {
    x: earth.rAu * Math.cos(aheadLon),
    y: earth.rAu * Math.sin(aheadLon),
  };
  const ePt = to(earth.x, earth.y);
  const aPt = to(ahead.x, ahead.y);
  const vx = aPt.X - ePt.X;
  const vy = aPt.Y - ePt.Y;
  const vlen = Math.hypot(vx, vy) || 1;
  const ux = vx / vlen;
  const uy = vy / vlen;
  const px = -uy;
  const py = ux;
  const tip = { X: ePt.X + ux * 26, Y: ePt.Y + uy * 26 };
  const b1 = { X: ePt.X + ux * 12 + px * 7, Y: ePt.Y + uy * 12 + py * 7 };
  const b2 = { X: ePt.X + ux * 12 - px * 7, Y: ePt.Y + uy * 12 - py * 7 };

  const gain = 28;
  const exTrack = track.filter((_, i) => i % 2 === 0).map((p) => magnify(p, gain));
  const exEarth = magnify(earth, gain);
  const exPeri = magnify(peri, gain);
  const exAphe = magnify(aphe, gain);
  const exMax = Math.max(...exTrack.map((p) => Math.hypot(p.x, p.y)), 0.1);
  const iScale = 56 / exMax;
  const iox = 116;
  const ioy = 552;

  const labelAt = (p: { x: number; y: number }, lines: string[], fill: string) => {
    const r = Math.hypot(p.x, p.y) || 1;
    const q = to((p.x / r) * (maxR + 0.16), (p.y / r) * (maxR + 0.16));
    const anchor = p.x > 0.15 ? "start" : p.x < -0.15 ? "end" : "middle";
    return (
      <text x={q.X} y={q.Y} textAnchor={anchor} fill={fill} fontSize="12">
        {lines.map((line, i) => (
          <tspan key={line} x={q.X} dy={i === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-xl" style={{ direction: "ltr" }}>
      <rect width={W} height={H} rx="18" fill="#070d18" />
      <text x="20" y="28" fill="#e6d39a" fontSize="14">
        دید از قطب شمال دایرة‌البروج · پادساعتگرد
      </text>
      <text x="20" y="46" fill="#9aa6b8" fontSize="11">
        L خورشیدمرکزی از اعتدال بهاری · مقیاس اصلی حقیقی است
      </text>

      <line
        x1={ray(march, 1.28).X}
        y1={ray(march, 1.28).Y}
        x2={ray(sept, 1.28).X}
        y2={ray(sept, 1.28).Y}
        stroke="#f0d78a"
        strokeWidth="1.4"
        strokeDasharray="5 4"
      />
      <line
        x1={ray(june, 1.22).X}
        y1={ray(june, 1.22).Y}
        x2={ray(december, 1.22).X}
        y2={ray(december, 1.22).Y}
        stroke="#7eb6e8"
        strokeWidth="1.1"
        strokeDasharray="2 5"
      />

      <path d={dOf(track)} fill="none" stroke="#e6d39a" strokeWidth="2.6" />

      {labelAt(march, ["♈ اعتدال بهاری", "L = 180°"], "#f0d78a")}
      {labelAt(sept, ["♎ اعتدال پاییزی", "L = 0°"], "#f0d78a")}
      {labelAt(june, ["انقلاب تابستانی", "L = 270°"], "#9ec4e6")}
      {labelAt(december, ["انقلاب زمستانی", "L = 90°"], "#9ec4e6")}
      {labelAt(peri, ["حضیض", `${n(peri.r, 4)} AU`], "#e7b8c4")}
      {labelAt(aphe, ["اوج", `${n(aphe.r, 4)} AU`], "#b7d4c0")}

      <circle cx={cx} cy={cy} r="16" fill="#ffe9a8" opacity="0.22" />
      <circle cx={cx} cy={cy} r="9" fill="#ffe08a" stroke="#fff6d2" strokeWidth="1" />
      <text x={cx + 14} y={cy - 12} fill="#ffe9a8" fontSize="12">
        خورشید
      </text>

      <circle cx={ePt.X} cy={ePt.Y} r="7.5" fill="#7eb6e8" stroke="#fff6d2" strokeWidth="1.5" />
      <polygon
        points={`${tip.X},${tip.Y} ${b1.X},${b1.Y} ${b2.X},${b2.Y}`}
        fill="#d6e8ff"
      />
      <text x={ePt.X + 12} y={ePt.Y - 16} fill="#d6e8ff" fontSize="13">
        زمین
      </text>
      <text x={ePt.X + 12} y={ePt.Y} fill="#d6e8ff" fontSize="12">
        {`L = ${n(earth.heliocentricLon, 2)}°`}
      </text>
      <text x={ePt.X + 12} y={ePt.Y + 14} fill="#9ec4e6" fontSize="11">
        {`R = ${n(earth.rAu, 4)} AU`}
      </text>

      <g>
        <rect x="16" y="444" width="210" height="176" rx="12" fill="#0c1628" stroke="rgba(230,211,154,0.35)" />
        <text x="28" y="464" fill="#e6d39a" fontSize="12">
          {`×${localizeDigits(String(gain))} شعاع`}
        </text>
        <text x="28" y="480" fill="#9aa6b8" fontSize="10">
          زاویه حقیقی است، فقط (r − 1 AU) درشت شده
        </text>
        <path
          d={dOf(exTrack, iScale, iox, ioy)}
          fill="none"
          stroke="#e6d39a"
          strokeWidth="1.8"
        />
        <circle cx={iox} cy={ioy} r="4.5" fill="#ffe08a" />
        <circle
          cx={to(exEarth.x, exEarth.y, iScale, iox, ioy).X}
          cy={to(exEarth.x, exEarth.y, iScale, iox, ioy).Y}
          r="4"
          fill="#7eb6e8"
        />
        <circle
          cx={to(exPeri.x, exPeri.y, iScale, iox, ioy).X}
          cy={to(exPeri.x, exPeri.y, iScale, iox, ioy).Y}
          r="2.4"
          fill="#e7b8c4"
        />
        <circle
          cx={to(exAphe.x, exAphe.y, iScale, iox, ioy).X}
          cy={to(exAphe.x, exAphe.y, iScale, iox, ioy).Y}
          r="2.4"
          fill="#b7d4c0"
        />
      </g>

      <g transform="translate(248, 448)">
        <text x="0" y="16" fill="#c5d0de" fontSize="11">
          ♈ زمین در اعتدال بهاری، L = 180°
        </text>
        <text x="0" y="34" fill="#c5d0de" fontSize="11">
          ♎ زمین در اعتدال پاییزی، L = 0°
        </text>
        <text x="0" y="52" fill="#c5d0de" fontSize="11">
          خط‌چین طلایی = خط اعتدال‌ها
        </text>
        <text x="0" y="70" fill="#c5d0de" fontSize="11">
          خط‌چین آبی = خط انقلاب‌ها
        </text>
        <text x="0" y="88" fill="#c5d0de" fontSize="11">
          پیکان = جهت حرکت
        </text>
        <text x="0" y="112" fill="#9aa6b8" fontSize="11">
          {`e ≈ ${n(0.0167, 4)} · حضیض ${n(peri.r, 4)} AU`}
        </text>
        <text x="0" y="130" fill="#9aa6b8" fontSize="11">
          {`اوج ${n(aphe.r, 4)} AU`}
        </text>
      </g>
    </svg>
  );
}
