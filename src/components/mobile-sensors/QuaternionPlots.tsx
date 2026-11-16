"use client";
import { QuaternionSample } from "@/lib/mobile-sensors/capture";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
export function QuaternionPlots({ samples }: { samples: QuaternionSample[] }) {
  const { t } = useLanguage();
  const start = samples[0]?.at ?? 0,
    end = samples.at(-1)?.at ?? start;
  const x = (at: number) =>
    38 + ((at - start) / Math.max(1000, end - start)) * 580;
  const y = (value: number) => 85 - value * 60;
  const path = (axis: number, key: "measured" | "predicted" | "filtered") =>
    samples
      .map(
        (s, i) =>
          `${i === 0 || s.at - samples[i - 1].at > 700 ? "M" : "L"}${x(s.at).toFixed(1)},${y(s[key][axis]).toFixed(1)}`,
      )
      .join(" ");
  const last = samples.at(-1);
  return (
    <LocalizedDigits>
      <section className="sensor-panel lg:col-span-2">
        <h2>
          {t(
            "کواترنیون؛ مرجع، پیش‌بینی و خروجی کالمن",
            "Quaternion: reference, prediction & Kalman output",
          )}
        </h2>
        <p className="sensor-note">
          {t(
            "قرارداد [x,y,z,w]؛ علامت مرجع با خروجی هم‌راستا می‌شود تا q و −q پرش ساختگی نسازند. کواترنیون یکه است و واحد ندارد.",
            "Convention [x,y,z,w]. Reference signs align with the estimate so q and −q do not create artificial jumps. Unit quaternions are dimensionless.",
          )}
        </p>
        <div className="flex flex-wrap gap-4 text-xs my-3">
          <span className="text-[var(--muted)]">
            {t("خط‌چین: مرجع مرورگر/TRIAD", "Dashed: browser/TRIAD reference")}
          </span>
          <span className="text-[var(--gold)]">
            {t("نقطه‌چین: پیش‌بینی ژیروسکوپ", "Dotted: gyro prediction")}
          </span>
          <span className="text-[var(--teal)]">
            {t("پیوسته: خروجی کالمن", "Solid: Kalman output")}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {["x", "y", "z", "w"].map((name, axis) => (
            <div key={name} dir="ltr">
              <div className="text-sm">
                q{name}{" "}
                <span className="tabular-nums text-[var(--gold-soft)]">
                  {last?.filtered[axis].toFixed(5) ?? "—"}
                </span>
              </div>
              <svg
                viewBox="0 0 640 170"
                role="img"
                aria-label={`Quaternion q${name}`}
                className="w-full"
              >
                {[-1, 0, 1].map((v) => (
                  <g key={v}>
                    <line
                      x1="38"
                      x2="618"
                      y1={y(v)}
                      y2={y(v)}
                      stroke="var(--border)"
                    />
                    <text x="8" y={y(v) + 4} fill="var(--muted)" fontSize="12">
                      {v}
                    </text>
                  </g>
                ))}
                <path
                  d={path(axis, "measured")}
                  fill="none"
                  stroke="var(--muted)"
                  strokeDasharray="5 4"
                />
                <path
                  d={path(axis, "predicted")}
                  fill="none"
                  stroke="var(--gold)"
                  strokeDasharray="1 4"
                />
                <path
                  d={path(axis, "filtered")}
                  fill="none"
                  stroke="var(--teal)"
                  strokeWidth="2"
                />
                {!samples.length && (
                  <text
                    x="320"
                    y="90"
                    textAnchor="middle"
                    fontSize="13"
                    fill="var(--muted)"
                  >
                    {t("منتظر جهت‌گیری معتبر", "Waiting for valid attitude")}
                  </text>
                )}
                <text x="38" y="165" fill="var(--muted)" fontSize="11">
                  {Math.min(30, (end - start) / 1000).toFixed(1)} s ←
                </text>
              </svg>
            </div>
          ))}
        </div>
        <p className="sensor-note" dir="ltr">
          ‖q‖ = {last ? Math.hypot(...last.filtered).toFixed(8) : "—"}
        </p>
      </section>
    </LocalizedDigits>
  );
}
