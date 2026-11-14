import { GeometryFigure, RefractionFigure } from "./GeometryFigure";

/** Independently generated diagrams; these are not facsimiles of Smart's figures. */
export function BookFigure({ id }: { id: string }) {
  if (id === "refraction") return <RefractionFigure />;
  if (id.startsWith("geometry-")) return <GeometryFigure kind={id.slice(9)} />;
  if (["fig1", "fig2"].includes(id)) return <GeometryFigure kind="circles" />;
  if (id === "fig7") return <NapierFigure />;
  if (id === "fig8") return <GeometryFigure kind="polar" />;
  if (
    ["fig10", "fig11", "fig12", "fig13", "fig14", "fig15", "fig17"].includes(id)
  )
    return <GeometryFigure kind="horizon" />;
  if (["fig18", "fig22"].includes(id))
    return <GeometryFigure kind="celestial" />;
  if (id === "fig19") return <OrbitFigure />;
  if (id === "fig21") return <GeometryFigure kind="ecliptic" />;
  if (id === "fig16") return <ParallaxFigure />;
  return <GeometryFigure kind={id === "fig-lune" ? "area" : "triangle"} />;
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
  return (
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
        {caption}
      </figcaption>
    </figure>
  );
}
function NapierFigure() {
  const labels = ["a", "b", "π/2 − A", "π/2 − c", "π/2 − B"];
  return (
    <Frame
      label="Napier five circular parts for angle C = 90 degrees"
      caption="پنج جزء با ترتیب دایره‌ای ثابت برای C قائم. میانه، دو همسایه و دو مقابل دارد. / Fixed cyclic order for right angle C; each middle has two adjacent and two opposite parts."
    >
      <circle cx="220" cy="175" r="132" stroke="#718da7" fill="none" />
      {labels.map((label, i) => {
        const theta = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return (
          <g key={i}>
            <line
              x1="220"
              y1="175"
              x2={220 + 132 * Math.cos(theta + Math.PI / 5)}
              y2={175 + 132 * Math.sin(theta + Math.PI / 5)}
              stroke="#718da766"
            />
            <text
              x={220 + 88 * Math.cos(theta)}
              y={181 + 88 * Math.sin(theta)}
              fill="#f1cf7b"
              fontSize="17"
              textAnchor="middle"
            >
              {label}
            </text>
          </g>
        );
      })}
      <text x="220" y="337" fill="#79d5ca" fontSize="15" textAnchor="middle">
        C = π/2
      </text>
    </Frame>
  );
}
function OrbitFigure() {
  const a = 160,
    b = 100,
    c = Math.sqrt(a * a - b * b),
    theta = 2.4,
    ex = 220 + a * Math.cos(theta),
    ey = 170 - b * Math.sin(theta);
  return (
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
        x1={220 - c}
        x2={220 + c}
        y1="170"
        y2="170"
        stroke="#617b96"
        strokeDasharray="4 5"
      />
      <line x1={220 + c} y1="170" x2={ex} y2={ey} stroke="#79d5ca" />
      <circle cx={220 + c} cy="170" r="7" fill="#f1cf7b" />
      <circle cx={ex} cy={ey} r="5" fill="#79d5ca" />
      <text x={220 + c - 23} y="201" fill="#f1cf7b" fontSize="15">
        Sun
      </text>
      <text x={ex - 8} y={ey - 14} fill="#79d5ca" fontSize="15">
        Earth
      </text>
      <text x="220" y="320" textAnchor="middle" fill="#a8bdd0" fontSize="14">
        c² = a² − b² · r = a(1 − e cos E)
      </text>
    </Frame>
  );
}
function ParallaxFigure() {
  return (
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
  );
}
