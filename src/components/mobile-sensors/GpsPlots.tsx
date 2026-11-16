"use client";
import { Fix } from "@/lib/mobile-sensors/capture";
import { useLanguage } from "@/components/language/Language";
/** Each GPS coordinate has its own scale; never mix degrees and metres on one axis. */
export function GpsPlots({ fixes }: { fixes: Fix[] }) {
  const { t } = useLanguage();
  return (
    <div className="grid gap-4 md:grid-cols-3" dir="ltr">
      {(
        [
          ["lat", t("عرض · درجه", "Latitude · degrees"), 6],
          ["lon", t("طول · درجه", "Longitude · degrees"), 6],
          ["altitude", t("ارتفاع · متر", "Altitude · metres"), 1],
        ] as const
      ).map(([key, label, precision]) => {
        const values = fixes.filter((p) => p[key] !== null),
          ys = values.map((p) => p[key]!);
        const min = Math.min(...ys),
          max = Math.max(...ys),
          range = Math.max(max - min, key === "altitude" ? 1 : 0.00001);
        const begin = values[0]?.at ?? 0,
          end = values.at(-1)?.at ?? begin;
        const d = values
          .map(
            (p, i) =>
              `${i === 0 || p.at - values[i - 1].at > 30000 ? "M" : "L"}${45 + ((p.at - begin) / Math.max(end - begin, 1000)) * 270},${120 - ((p[key]! - min) / range) * 95}`,
          )
          .join(" ");
        return (
          <div key={key}>
            <p className="text-xs text-[var(--muted)] mb-2">{label}</p>
            <svg
              className="w-full"
              role="img"
              aria-label={label}
              viewBox="0 0 330 150"
            >
              <path d="M45,20 V125 H320" fill="none" stroke="var(--border)" />
              <path d={d} fill="none" stroke="var(--teal)" strokeWidth="2" />
              {ys.length ? (
                <>
                  <text x="2" y="20" fontSize="9" fill="var(--muted)">
                    {(min + range).toFixed(precision)}
                  </text>
                  <text x="2" y="125" fontSize="9" fill="var(--muted)">
                    {min.toFixed(precision)}
                  </text>
                  <text x="45" y="145" fontSize="10" fill="var(--muted)">
                    {new Date(begin).toISOString().slice(11, 19)}
                  </text>
                  <text x="265" y="145" fontSize="10" fill="var(--muted)">
                    {new Date(end).toISOString().slice(11, 19)}
                  </text>
                </>
              ) : (
                <text
                  x="170"
                  y="80"
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--muted)"
                >
                  {t("بدون داده", "No data")}
                </text>
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
