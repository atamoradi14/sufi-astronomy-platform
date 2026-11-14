"use client";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { GeometryFigure, RefractionFigure } from "./GeometryFigure";
/** Independently generated diagrams; these are not facsimiles of Smart's figures. */
export function BookFigure({ id }: { id: string }) {
  if (id === "refraction")
    return <LocalizedDigits>{<RefractionFigure />}</LocalizedDigits>;
  if (id.startsWith("geometry-"))
    return (
      <LocalizedDigits>{<GeometryFigure kind={id.slice(9)} />}</LocalizedDigits>
    );
  if (["fig1", "fig2"].includes(id))
    return (
      <LocalizedDigits>{<GeometryFigure kind="circles" />}</LocalizedDigits>
    );
  if (id === "fig7")
    return <LocalizedDigits>{<NapierFigure />}</LocalizedDigits>;
  if (id === "fig8")
    return <LocalizedDigits>{<GeometryFigure kind="polar" />}</LocalizedDigits>;
  if (
    ["fig10", "fig11", "fig12", "fig13", "fig14", "fig15", "fig17"].includes(id)
  )
    return (
      <LocalizedDigits>{<GeometryFigure kind="horizon" />}</LocalizedDigits>
    );
  if (["fig18", "fig22"].includes(id))
    return (
      <LocalizedDigits>{<GeometryFigure kind="celestial" />}</LocalizedDigits>
    );
  if (id === "fig19")
    return <LocalizedDigits>{<OrbitFigure />}</LocalizedDigits>;
  if (id === "fig21")
    return (
      <LocalizedDigits>{<GeometryFigure kind="ecliptic" />}</LocalizedDigits>
    );
  if (id === "fig16")
    return <LocalizedDigits>{<ParallaxFigure />}</LocalizedDigits>;
  return (
    <LocalizedDigits>
      {<GeometryFigure kind={id === "fig-lune" ? "area" : "triangle"} />}
    </LocalizedDigits>
  );
}
function Frame({
  label,
  caption,
  children,
}: {
  label: string;
  caption: string;
  children: React.ReactNode;
}) {
  const { fa } = useLanguage();
  return (
    <LocalizedDigits>
      {
        <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#091424]">
          <svg
            viewBox="0 0 440 360"
            role="img"
            aria-label={label}
            className="w-full"
            style={{ direction: "ltr" }}
          >
            {children}
          </svg>
          <figcaption className="border-t border-[var(--border)] p-4 text-xs leading-7 text-[var(--muted)]">
            {caption.split(" / ")[fa ? 0 : 1]}
          </figcaption>
        </figure>
      }
    </LocalizedDigits>
  );
}
function NapierFigure() {
  const labels = ["a", "b", "π/2 − A", "π/2 − c", "π/2 − B"];
  return (
    <LocalizedDigits>
      {
        <Frame
          label="Napier five circular parts for angle C = 90 degrees"
          caption="پنج جزء با ترتیب دایره‌ای ثابت برای C قائم. میانه، دو همسایه و دو مقابل دارد. / Fixed cyclic order for right angle C; each middle has two adjacent and two opposite parts."
        >
          <circle cx="220" cy="175" r="132" stroke="#718da7" fill="none" />
          {labels.map((label, i) => {
            const theta = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
            return (
              <LocalizedDigits key={i}>
                {
                  <g key={i}>
                    <line
                      x1="220"
                      y1="175"
                      x2={Number(
                        (220 + 132 * Math.cos(theta + Math.PI / 5)).toFixed(3),
                      )}
                      y2={Number(
                        (175 + 132 * Math.sin(theta + Math.PI / 5)).toFixed(3),
                      )}
                      stroke="#718da766"
                    />
                    <text
                      x={Number((220 + 88 * Math.cos(theta)).toFixed(3))}
                      y={Number((181 + 88 * Math.sin(theta)).toFixed(3))}
                      fill="#f1cf7b"
                      fontSize="17"
                      textAnchor="middle"
                    >
                      {label}
                    </text>
                  </g>
                }
              </LocalizedDigits>
            );
          })}
          <text
            x="220"
            y="337"
            fill="#79d5ca"
            fontSize="15"
            textAnchor="middle"
          >
            C = π/2
          </text>
        </Frame>
      }
    </LocalizedDigits>
  );
}
function OrbitFigure() {
  const { t } = useLanguage();
  const a = 160,
    b = 100,
    c = Math.sqrt(a * a - b * b),
    theta = 2.4,
    ex = 220 + a * Math.cos(theta),
    ey = 170 - b * Math.sin(theta);
  return (
    <LocalizedDigits>
      {
        <Frame
          label="Elliptical orbit with the Sun at the mathematically computed focus"
          caption="خورشید در کانون محاسبه‌شدهٔ بیضی است؛ خروج از مرکز برای وضوح بزرگ‌نمایی شده و مقیاس واقعی زمین نیست. / Sun at the ellipse’s computed focus; eccentricity exaggerated, not Earth's orbital scale."
        >
          <ellipse
            cx="220"
            cy="170"
            rx={a}
            ry={b}
            fill="none"
            stroke="#9cb4cb"
            strokeWidth="2"
          />
          <line
            x1={Number((220 - c).toFixed(3))}
            x2={Number((220 + c).toFixed(3))}
            y1="170"
            y2="170"
            stroke="#617b96"
            strokeDasharray="4 5"
          />
          <line
            x1={Number((220 + c).toFixed(3))}
            y1="170"
            x2={Number(ex.toFixed(3))}
            y2={Number(ey.toFixed(3))}
            stroke="#79d5ca"
          />
          <circle
            cx={Number((220 + c).toFixed(3))}
            cy="170"
            r="7"
            fill="#f1cf7b"
          />
          <circle
            cx={Number(ex.toFixed(3))}
            cy={Number(ey.toFixed(3))}
            r="5"
            fill="#79d5ca"
          />
          <text
            x={Number((220 + c - 23).toFixed(3))}
            y="201"
            fill="#f1cf7b"
            fontSize="15"
          >
            {t("خورشید", "Sun")}
          </text>
          <text
            x={Number((ex - 8).toFixed(3))}
            y={Number((ey - 14).toFixed(3))}
            fill="#79d5ca"
            fontSize="15"
          >
            {t("زمین", "Earth")}
          </text>
          <text
            x="220"
            y="320"
            textAnchor="middle"
            fill="#a8bdd0"
            fontSize="14"
          >
            c² = a² − b² · r = a(1 − e cos E)
          </text>
        </Frame>
      }
    </LocalizedDigits>
  );
}
function ParallaxFigure() {
  return (
    <LocalizedDigits>
      {
        <Frame
          label="Observer-centred and geocentric lines of sight to a nearby body"
          caption="برای جرم نزدیک، خط دید از مرکز C و ناظر O متفاوت است. شکل شماتیک است و فاصله‌ها مقیاس واقعی ندارند. / Observer O and geocentre C see different directions to a nearby body; schematic, distances not to scale."
        >
          <circle cx="130" cy="220" r="70" fill="#14243a" stroke="#8da5bc" />
          <circle cx="130" cy="220" r="3" fill="#9fb4c8" />
          <circle cx="130" cy="150" r="4" fill="#79d5ca" />
          <line x1="130" y1="220" x2="370" y2="85" stroke="#9fb4c8" />
          <line x1="130" y1="150" x2="370" y2="85" stroke="#79d5ca" />
          <line
            x1="130"
            y1="220"
            x2="130"
            y2="55"
            stroke="#6e879e"
            strokeDasharray="4 4"
          />
          <circle cx="370" cy="85" r="5" fill="#f1cf7b" />
          <text x="112" y="235" fill="#9fb4c8">
            C
          </text>
          <text x="108" y="145" fill="#79d5ca">
            O
          </text>
          <text x="378" y="80" fill="#f1cf7b">
            X
          </text>
        </Frame>
      }
    </LocalizedDigits>
  );
}
