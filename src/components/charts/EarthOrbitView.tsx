"use client";

import type { EarthOrbitState } from "@/lib/astronomy/ephemeris";

type TrackPoint = { x: number; y: number };

/** True yearly heliocentric ecliptic track. +x is the vernal equinox. */
export function EarthOrbitView({
  earth,
  track,
}: {
  earth: EarthOrbitState;
  track: TrackPoint[];
}) {
  const size = 420;
  const pad = 36;
  const maxR = Math.max(1.05, ...track.map((p) => Math.hypot(p.x, p.y)), Math.hypot(earth.x, earth.y));
  const scale = (size / 2 - pad) / (maxR * 1.08);
  const toXy = (x: number, y: number) => ({
    X: size / 2 + x * scale,
    Y: size / 2 - y * scale,
  });

  const d = track
    .map((p, i) => {
      const { X, Y } = toXy(p.x, p.y);
      return `${i === 0 ? "M" : "L"}${X.toFixed(2)},${Y.toFixed(2)}`;
    })
    .join(" ");

  const sun = toXy(0, 0);
  const earthPt = toXy(earth.x, earth.y);
  const g1 = toXy(maxR * 1.12, 0);
  const g2 = toXy(-maxR * 1.12, 0);
  const n1 = toXy(0, maxR * 1.12);
  const n2 = toXy(0, -maxR * 1.12);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-auto w-full max-w-lg">
      <defs>
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d2" />
          <stop offset="45%" stopColor="#ffe08a" />
          <stop offset="100%" stopColor="#c9a227" />
        </radialGradient>
        <filter id="sunBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      <rect width={size} height={size} rx="16" fill="#070d18" />
      <circle cx={size / 2} cy={size / 2} r={(size / 2 - pad) * 0.98} fill="none" stroke="rgba(201,162,39,0.08)" />
      <line x1={g2.X} y1={g2.Y} x2={g1.X} y2={g1.Y} stroke="#7ec8c8" strokeWidth="1.4" strokeDasharray="6 5" />
      <line x1={n2.X} y1={n2.Y} x2={n1.X} y2={n1.Y} stroke="rgba(158,196,230,0.35)" strokeWidth="1" />
      <text x={g1.X - 28} y={g1.Y - 8} fill="#9fe0e0" fontSize="13">
        ♈ اعتدال
      </text>
      <path d={d} fill="none" stroke="#e6d39a" strokeWidth="2.25" strokeLinejoin="round" />
      <circle cx={sun.X} cy={sun.Y} r="22" fill="#ffe9a8" opacity="0.25" filter="url(#sunBlur)" />
      <circle cx={sun.X} cy={sun.Y} r="11" fill="url(#sunCore)" />
      <text x={sun.X + 14} y={sun.Y - 10} fill="#ffe9a8" fontSize="13">
        خورشید
      </text>
      <circle cx={earthPt.X} cy={earthPt.Y} r="7" fill="#7eb6e8" stroke="#fff6d2" strokeWidth="1.4" />
      <circle cx={earthPt.X} cy={earthPt.Y} r="14" fill="none" stroke="rgba(126,182,232,0.7)" strokeWidth="1.2">
        <animate attributeName="r" values="10;18;10" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.85;0.15;0.85" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <text x={earthPt.X + 12} y={earthPt.Y + 4} fill="#d6e8ff" fontSize="13">
        زمین
      </text>
      <text x="16" y={size - 16} fill="#9aa6b8" fontSize="11">
        صفحهٔ دایرة‌البروج · مسیر واقعی امسال · خط‌چین = اعتدال بهاری
      </text>
    </svg>
  );
}
