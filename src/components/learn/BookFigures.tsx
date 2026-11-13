"use client";

import type { ReactNode } from "react";
import { SMART_BOOK } from "@/lib/content/smart";

const stroke = "var(--gold-soft)";
const faint = "var(--muted)";
const ink = "var(--parchment)";
const accent = "var(--teal)";

function Sphere({ cx = 160, cy = 155, r = 118 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="1.4" />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.34} fill="none" stroke={faint} strokeDasharray="4 3" />
    </>
  );
}

function Lbl({
  x,
  y,
  children,
  fill = ink,
}: {
  x: number | string;
  y: number | string;
  children: string;
  fill?: string;
}) {
  return (
    <text x={x} y={y} fill={fill} fontSize="13" fontFamily="serif">
      {children}
    </text>
  );
}

function FigFrame({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--ink-deep)]">
      <svg viewBox="0 0 320 320" className="mx-auto h-auto w-full max-w-md" role="img" aria-label={title}>
        {children}
      </svg>
      <figcaption className="space-y-1 border-t border-[var(--border)] px-3 py-2">
        <p className="text-xs font-medium text-[var(--gold-soft)] dir-ltr text-left">{title}</p>
        <p className="text-[11px] leading-6 text-[var(--muted)]">{caption}</p>
        <p className="text-[10px] text-[var(--muted)] dir-ltr text-left">
          Reconstruction of {SMART_BOOK.author}, {SMART_BOOK.title}
        </p>
      </figcaption>
    </figure>
  );
}

export function BookFigure({ id }: { id: string }) {
  switch (id) {
    case "fig1":
      return (
        <FigFrame
          title="Fig. 1 — Great circle EAB, small circle FCD, poles P, Q"
          caption="صفحهٔ EAB از مرکز O می‌گذرد (عظیمه). FCD موازی آن است (صغیره). P و Q قطب‌های EABاند. زاویهٔ کروی در P برابر زاویهٔ مماس‌هاست."
        >
          <Sphere />
          <ellipse cx="160" cy="155" rx="118" ry="40" fill="none" stroke={accent} />
          <path d="M42 155 Q160 28 278 155" fill="none" stroke={stroke} strokeWidth="1.6" />
          <ellipse cx="160" cy="108" rx="72" ry="22" fill="none" stroke={accent} />
          <line x1="160" y1="37" x2="160" y2="273" stroke={faint} strokeDasharray="3 3" />
          <Lbl x="154" y="30">P</Lbl>
          <Lbl x="154" y="292">Q</Lbl>
          <Lbl x="154" y="150">O</Lbl>
          <Lbl x="48" y="168">A</Lbl>
          <Lbl x="262" y="168">B</Lbl>
          <Lbl x="92" y="108">C</Lbl>
          <Lbl x="218" y="108">D</Lbl>
          <Lbl x="70" y="88">F</Lbl>
        </FigFrame>
      );
    case "fig2":
      return (
        <FigFrame
          title="Fig. 2 — Terrestrial equator, Greenwich meridian, latitude"
          caption="P, Q قطب‌ها؛ استوا عظیمهٔ عمود بر PQ؛ K گرینویچ روی استوا؛ J مکان با عرض LJ و طول KOL."
        >
          <Sphere />
          <ellipse cx="160" cy="155" rx="118" ry="40" fill="none" stroke={accent} />
          <path d="M160 37 Q70 155 160 273" fill="none" stroke={stroke} />
          <path d="M160 37 Q250 155 160 273" fill="none" stroke={stroke} />
          <line x1="160" y1="37" x2="160" y2="273" stroke={faint} strokeDasharray="3 2" />
          <Lbl x="154" y="28">P</Lbl>
          <Lbl x="154" y="292">Q</Lbl>
          <Lbl x="40" y="160">W</Lbl>
          <Lbl x="268" y="160">E</Lbl>
          <Lbl x="168" y="118">J</Lbl>
          <Lbl x="188" y="198">K</Lbl>
          <text x="200" y="210" fill={faint} fontSize="10">
            Equator
          </text>
        </FigFrame>
      );
    case "fig3":
      return (
        <FigFrame
          title="Fig. 3 — Cosine-formula construction (tangents at A)"
          caption="مماس AD بر AB و AE بر AC. ∠DAE = A. از مثلث‌های قائم OAD, OAE و DOE صورت (A) به‌دست می‌آید."
        >
          <circle cx="168" cy="128" r="88" fill="none" stroke={stroke} />
          <path d="M120 190 Q168 70 230 150" fill="none" stroke={accent} strokeWidth="2" />
          <line x1="168" y1="128" x2="96" y2="250" stroke={faint} />
          <line x1="168" y1="128" x2="268" y2="236" stroke={faint} />
          <line x1="96" y1="250" x2="268" y2="236" stroke={stroke} />
          <line x1="120" y1="190" x2="96" y2="250" stroke={stroke} />
          <line x1="230" y1="150" x2="268" y2="236" stroke={stroke} />
          <Lbl x="160" y="118">O</Lbl>
          <Lbl x="108" y="186">B</Lbl>
          <Lbl x="236" y="144">C</Lbl>
          <Lbl x="148" y="210">A</Lbl>
          <Lbl x="78" y="266">D</Lbl>
          <Lbl x="270" y="250">E</Lbl>
        </FigFrame>
      );
    case "fig4":
      return (
        <FigFrame
          title="Fig. 4 — Analogue formula: produce BA to D with BD = 90°"
          caption="AD = 90°−c و CÂD = 180°−A. کمان CD = x از (A) در CAD و BCD حذف می‌شود و (C) می‌ماند."
        >
          <path d="M70 220 Q160 40 250 210" fill="none" stroke={stroke} />
          <path d="M70 220 Q160 250 250 210" fill="none" stroke={accent} strokeWidth="2" />
          <path d="M250 210 Q210 100 160 40" fill="none" stroke={faint} strokeDasharray="4 3" />
          <Lbl x="58" y="236">B</Lbl>
          <Lbl x="252" y="228">C</Lbl>
          <Lbl x="168" y="168">A</Lbl>
          <Lbl x="148" y="32">D</Lbl>
          <Lbl x="150" y="250">a</Lbl>
          <Lbl x="88" y="150">c</Lbl>
          <Lbl x="210" y="140">b</Lbl>
        </FigFrame>
      );
    case "fig5":
      return (
        <FigFrame
          title="Fig. 5 — Four consecutive parts B, a, C, b"
          caption="C زاویهٔ داخلی (میان a و b) و a ضلع داخلی (میان B و C) است. قاعدهٔ حافظهٔ اسمارت برای (D)."
        >
          <path d="M64 210 Q160 48 256 210" fill="none" stroke={stroke} strokeWidth="1.8" />
          <path d="M64 210 Q160 248 256 210" fill="none" stroke={accent} />
          <Lbl x="48" y="224">B</Lbl>
          <Lbl x="258" y="224">C</Lbl>
          <Lbl x="154" y="42">A</Lbl>
          <Lbl x="150" y="236">a</Lbl>
          <Lbl x="214" y="140">b</Lbl>
          <Lbl x="88" y="140">c</Lbl>
        </FigFrame>
      );
    case "fig6":
      return (
        <FigFrame
          title="Fig. 6 — Geometric proof of (A), (B), (C)"
          caption="از P روی OC عمودها بر وجوه؛ PS بر صفحهٔ AOB عمود است. مثلث‌های قائم OPQ و OPR فرمول‌ها را می‌دهند."
        >
          <path d="M48 250 L160 40 L272 250 Z" fill="none" stroke={stroke} />
          <path d="M48 250 L160 250 L272 250" fill="none" stroke={faint} />
          <line x1="160" y1="40" x2="160" y2="250" stroke={accent} strokeDasharray="3 3" />
          <line x1="160" y1="120" x2="100" y2="250" stroke={faint} />
          <line x1="160" y1="120" x2="220" y2="250" stroke={faint} />
          <Lbl x="154" y="32">C</Lbl>
          <Lbl x="32" y="266">O</Lbl>
          <Lbl x="274" y="266">A</Lbl>
          <Lbl x="168" y="266">B</Lbl>
          <Lbl x="168" y="118">P</Lbl>
          <Lbl x="108" y="178">Q</Lbl>
          <Lbl x="200" y="178">R</Lbl>
        </FigFrame>
      );
    case "fig7":
      return (
        <FigFrame
          title="Fig. 7 — Napier’s circular parts (C = 90°)"
          caption="پنج جزء داخل دایره: a, b, 90°−A, 90°−c, 90°−B. sin(میانه) = حاصل tan مجاورها = حاصل cos مقابل‌ها."
        >
          <circle cx="160" cy="160" r="92" fill="none" stroke={stroke} strokeWidth="1.6" />
          {["a", "b", "90°−A", "90°−c", "90°−B"].map((t, i) => {
            const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
            const x = 160 + 118 * Math.cos(ang);
            const y = 164 + 118 * Math.sin(ang);
            return (
              <text key={t} x={x} y={y} fill={ink} fontSize="11" textAnchor="middle" fontFamily="serif">
                {t}
              </text>
            );
          })}
          <Lbl x="148" y="164">C=90°</Lbl>
        </FigFrame>
      );
    case "fig8":
      return (
        <FigFrame
          title="Fig. 8 — Polar triangle A′B′C′"
          caption="A′ قطب BC در نیم‌کرهٔ A است. a′ = 180°−A و A′ = 180°−a. اعمال (A) روی قطبی، کسینوس زوایای اصلی را می‌دهد."
        >
          <circle cx="160" cy="160" r="110" fill="none" stroke={faint} />
          <path d="M90 210 L160 70 L230 210 Z" fill="none" stroke={stroke} strokeWidth="1.8" />
          <path d="M70 80 L250 80 L160 250 Z" fill="none" stroke={accent} strokeDasharray="5 3" />
          <Lbl x="154" y="62">A</Lbl>
          <Lbl x="74" y="226">B</Lbl>
          <Lbl x="232" y="226">C</Lbl>
          <Lbl x="154" y="48">A′</Lbl>
          <Lbl x="52" y="78">B′</Lbl>
          <Lbl x="252" y="78">C′</Lbl>
        </FigFrame>
      );
    case "fig9":
      return (
        <FigFrame
          title="Fig. 9 — Two places A, B and north pole P"
          caption="مثال بند ۱۲: PA و PB متمم عرض‌ها؛ زاویهٔ APB اختلاف طول کوتاه‌تر. AB فاصلهٔ عظیمه است."
        >
          <Sphere />
          <path d="M160 37 Q64 155 160 273" fill="none" stroke={stroke} />
          <path d="M160 37 Q256 155 160 273" fill="none" stroke={stroke} />
          <path d="M86 120 Q160 90 234 130" fill="none" stroke={accent} strokeWidth="2" />
          <ellipse cx="160" cy="155" rx="118" ry="40" fill="none" stroke={faint} />
          <Lbl x="154" y="28">P</Lbl>
          <Lbl x="154" y="292">Q</Lbl>
          <Lbl x="70" y="118">A</Lbl>
          <Lbl x="240" y="128">B</Lbl>
          <text x="196" y="200" fill={faint} fontSize="10">
            Equator
          </text>
        </FigFrame>
      );
    case "fig10":
    case "fig11":
      return (
        <FigFrame
          title="Figs. 10–11 — Horizon, zenith Z, pole P, azimuth"
          caption="افق عظیمهٔ عمود بر OZ است. ارتفاع کمان از افق روی دایرهٔ قائم؛ سمت زاویهٔ PZX از نقطهٔ شمال N."
        >
          <Sphere />
          <ellipse cx="160" cy="200" rx="110" ry="28" fill="none" stroke={accent} />
          <line x1="160" y1="37" x2="160" y2="273" stroke={faint} strokeDasharray="3 2" />
          <path d="M160 37 Q210 120 210 200" fill="none" stroke={stroke} />
          <circle cx="210" cy="132" r="3" fill={stroke} />
          <Lbl x="154" y="28">P</Lbl>
          <Lbl x="168" y="48">Z</Lbl>
          <Lbl x="216" y="126">X</Lbl>
          <Lbl x="154" y="150">O</Lbl>
          <Lbl x="46" y="210">N</Lbl>
          <Lbl x="262" y="210">S</Lbl>
          <text x="200" y="248" fill={faint} fontSize="10">
            Horizon
          </text>
        </FigFrame>
      );
    case "fig12":
    case "fig13":
    case "fig17":
      return (
        <FigFrame
          title="Figs. 12, 13, 17 — Triangle PZX on the celestial sphere"
          caption="PZ = 90°−φ، PX = 90°−δ، ZX = z. زاویه در P برابر H (غرب) است. این مثلث دستگاه افقی را به استوایی وصل می‌کند."
        >
          <Sphere />
          <ellipse cx="160" cy="200" rx="110" ry="26" fill="none" stroke={faint} />
          <ellipse cx="160" cy="155" rx="118" ry="40" fill="none" stroke={accent} />
          <path d="M160 37 L210 128 L160 200" fill="none" stroke={stroke} strokeWidth="1.8" />
          <path d="M160 37 L160 200" fill="none" stroke={stroke} />
          <circle cx="210" cy="128" r="3" fill={stroke} />
          <Lbl x="154" y="28">P</Lbl>
          <Lbl x="166" y="52">Z</Lbl>
          <Lbl x="216" y="122">X</Lbl>
          <Lbl x="150" y="96">90°−φ</Lbl>
          <Lbl x="188" y="96">90°−δ</Lbl>
          <Lbl x="176" y="168">z</Lbl>
          <text x="188" y="248" fill={faint} fontSize="10">
            Horizon
          </text>
          <text x="200" y="148" fill={accent} fontSize="10">
            Equator
          </text>
        </FigFrame>
      );
    case "fig14":
      return (
        <FigFrame
          title="Fig. 14 — Southern observer"
          caption="قطب جنوب Q بالای افق است. QZ = 90°−φ. قواعد سمت و H برای عرض جنوبی همان‌اند که اسمارت در پایان بند ۱۹ نوشته است."
        >
          <Sphere />
          <ellipse cx="160" cy="200" rx="110" ry="26" fill="none" stroke={accent} />
          <Lbl x="154" y="48">Z</Lbl>
          <Lbl x="154" y="292">P</Lbl>
          <Lbl x="168" y="86">Q</Lbl>
          <Lbl x="46" y="210">N</Lbl>
          <Lbl x="262" y="210">S</Lbl>
        </FigFrame>
      );
    case "fig15":
      return (
        <FigFrame
          title="Fig. 15 — Circumpolar parallels"
          caption="مدارهای میل X و Y هرگز افق را قطع نمی‌کنند. شرط: فاصلهٔ قطبی < عرض، یا δ > 90°−φ در شمال."
        >
          <Sphere />
          <ellipse cx="160" cy="200" rx="110" ry="26" fill="none" stroke={faint} />
          <ellipse cx="160" cy="78" rx="52" ry="16" fill="none" stroke={stroke} />
          <ellipse cx="160" cy="100" rx="70" ry="18" fill="none" stroke={accent} />
          <Lbl x="154" y="28">P</Lbl>
          <Lbl x="166" y="52">Z</Lbl>
          <Lbl x="220" y="78">Y</Lbl>
          <Lbl x="236" y="104">X</Lbl>
          <Lbl x="46" y="210">N</Lbl>
        </FigFrame>
      );
    case "fig16":
      return (
        <FigFrame
          title="Fig. 16 — Observer O versus Earth’s centre C"
          caption="برای ستارگان دور، فاصلهٔ قطبی از O و از C یکی است. برای ماه، PÔM به جایگاه ناظر بستگی دارد. کرهٔ استاندارد از C کشیده می‌شود."
        >
          <circle cx="130" cy="170" r="52" fill="none" stroke={stroke} />
          <line x1="130" y1="118" x2="130" y2="80" stroke={stroke} />
          <line x1="130" y1="118" x2="210" y2="70" stroke={accent} />
          <line x1="130" y1="170" x2="240" y2="90" stroke={faint} />
          <Lbl x="122" y="112">O</Lbl>
          <Lbl x="118" y="188">C</Lbl>
          <Lbl x="214" y="64">X</Lbl>
          <Lbl x="122" y="72">Z</Lbl>
        </FigFrame>
      );
    case "fig18":
    case "fig22":
      return (
        <FigFrame
          title="Figs. 18, 22 — Right ascension and sidereal time"
          caption="♈ مبدأ بعد روی استواست. α از ♈ به شرق؛ H از نصف‌النهار به غرب. ST = H + α. اختلاف طول، ST محلی را به گرینویچ وصل می‌کند."
        >
          <Sphere />
          <ellipse cx="160" cy="155" rx="118" ry="40" fill="none" stroke={accent} />
          <path d="M160 37 L210 128" fill="none" stroke={stroke} />
          <Lbl x="154" y="28">P</Lbl>
          <Lbl x="216" y="122">X</Lbl>
          <Lbl x="196" y="178">♈</Lbl>
          <Lbl x="168" y="52">Z</Lbl>
          <text x="200" y="148" fill={accent} fontSize="10">
            Equator
          </text>
        </FigFrame>
      );
    case "fig19":
      return (
        <FigFrame
          title="Figs. 19–20 — Earth’s orbit and the Sun’s apparent orbit"
          caption="زمین روی بیضی با کانون خورشید S. از زمین، خورشید روی بیضی مخالف می‌گردد. صفحهٔ مدار دایرة‌البروج است."
        >
          <ellipse cx="160" cy="160" rx="120" ry="70" fill="none" stroke={stroke} />
          <circle cx="190" cy="160" r="5" fill={stroke} />
          <circle cx="70" cy="160" r="4" fill={accent} />
          <Lbl x="196" y="154">S</Lbl>
          <Lbl x="52" y="154">E</Lbl>
          <Lbl x="270" y="164">A</Lbl>
          <Lbl x="148" y="86">perihelion →</Lbl>
        </FigFrame>
      );
    case "fig21":
      return (
        <FigFrame
          title="Fig. 21 — Ecliptic, equator, obliquity ε, equinox ♈"
          caption="دایرة‌البروج عظیمهٔ مدار زمین است و با استوا زاویهٔ ε ≈ ۲۳½° می‌سازد. ♈ تقاطع با عبور خورشید از جنوب به شمال است."
        >
          <Sphere />
          <ellipse cx="160" cy="155" rx="118" ry="40" fill="none" stroke={accent} />
          <ellipse cx="160" cy="155" rx="118" ry="58" fill="none" stroke={stroke} transform="rotate(-23 160 155)" />
          <Lbl x="154" y="28">P</Lbl>
          <Lbl x="196" y="178">♈</Lbl>
          <text x="210" y="132" fill={stroke} fontSize="11">
            ε
          </text>
          <text x="200" y="150" fill={accent} fontSize="10">
            Equator
          </text>
          <text x="44" y="210" fill={stroke} fontSize="10">
            Ecliptic
          </text>
        </FigFrame>
      );
    case "fig-lune":
      return (
        <FigFrame
          title="Girard — lune of angle A (olympiad supplement)"
          caption="هلال میان دو عظیمه با زاویهٔ A روی کرهٔ واحد مساحت ۲A دارد. سه هلال به Area = A+B+C−π می‌انجامند."
        >
          <Sphere />
          <path d="M160 37 Q70 155 160 273" fill="none" stroke={stroke} />
          <path d="M160 37 Q250 155 160 273" fill="none" stroke={stroke} />
          <path d="M160 37 Q160 155 160 273" fill="none" stroke={faint} />
          <Lbl x="154" y="28">N</Lbl>
          <Lbl x="88" y="150">A</Lbl>
        </FigFrame>
      );
    default:
      return null;
  }
}
