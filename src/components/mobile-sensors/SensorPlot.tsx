"use client";
import { Sample } from "@/lib/mobile-sensors/capture";
import { useLanguage } from "@/components/language/Language";
const colors = ["var(--rose-ink)", "var(--teal)", "var(--gold)"];
export function SensorPlot({
  samples,
  unit,
  labels = ["X", "Y", "Z"],
  rawOnly = false,
}: {
  samples: Sample[];
  unit: string;
  labels?: string[];
  rawOnly?: boolean;
}) {
  const { t } = useLanguage();
  const values = samples.flatMap((s) => [...s.raw, ...s.filtered]);
  const lo = Math.min(0, ...values),
    hi = Math.max(1, ...values),
    range = hi - lo,
    pad = range * 0.08;
  const start = samples[0]?.at ?? 0,
    end = samples.at(-1)?.at ?? start;
  const x = (at: number) =>
    44 +
    ((at - Math.max(start, end - 30000)) /
      Math.max(1000, Math.min(30000, end - start))) *
      590;
  const y = (v: number) => 160 - ((v - lo + pad) / (range + 2 * pad)) * 140;
  const path = (axis: number, filtered: boolean) =>
    samples
      .map(
        (s, i) =>
          `${i === 0 || s.at - samples[i - 1].at > 700 || (unit === "°" && Math.abs((filtered ? s.filtered : s.raw)[axis] - (filtered ? samples[i - 1].filtered : samples[i - 1].raw)[axis]) > 180) ? "M" : "L"}${x(s.at).toFixed(1)},${y((filtered ? s.filtered : s.raw)[axis]).toFixed(1)}`,
      )
      .join(" ");
  return (
    <div className="min-w-0" dir="ltr">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-2">
        {labels.map((label, i) => (
          <span key={label} style={{ color: colors[i] }}>
            {label}
          </span>
        ))}
        <span className="text-[var(--muted)]">
          {rawOnly
            ? t("زاویه‌های خام", "Raw angles")
            : t(
                "خط پیوسته: فیلتر · خط‌چین: خام",
                "Solid: filtered · dashed: raw",
              )}{" "}
          · {unit}
        </span>
      </div>
      <svg
        viewBox="0 0 650 190"
        role="img"
        aria-label={`${labels.join(", ")} (${unit})`}
        className="w-full overflow-visible"
      >
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              x1="44"
              x2="634"
              y1={20 + 140 * f}
              y2={20 + 140 * f}
              stroke="var(--border)"
            />
            <text x="2" y={24 + 140 * f} fill="var(--muted)" fontSize="10">
              {(hi + pad - f * (range + 2 * pad)).toFixed(1)}
            </text>
          </g>
        ))}
        {labels.map((_, axis) => (
          <g key={axis}>
            <path
              d={path(axis, false)}
              fill="none"
              stroke={colors[axis]}
              strokeWidth={rawOnly ? 1.6 : 1}
              strokeDasharray={rawOnly ? undefined : "3 4"}
              opacity={rawOnly ? 1 : 0.35}
            />
            {!rawOnly && (
              <path
                d={path(axis, true)}
                fill="none"
                stroke={colors[axis]}
                strokeWidth="1.8"
              />
            )}
          </g>
        ))}
        <text x="44" y="183" fill="var(--muted)" fontSize="11">
          {Math.min(30, (end - start) / 1000).toFixed(0)} s ←
        </text>
        <text x="610" y="183" fill="var(--muted)" fontSize="11">
          0 s
        </text>
        {!samples.length && (
          <text
            x="330"
            y="95"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="13"
          >
            {t("منتظر دادهٔ واقعی حسگر", "Waiting for actual sensor data")}
          </text>
        )}
      </svg>
    </div>
  );
}
