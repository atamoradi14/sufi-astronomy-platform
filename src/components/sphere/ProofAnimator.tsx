"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";

type ProofKind = "cosine" | "sine";

const COSINE_STEPS = [
  {
    title: "۱. قرارگیری مختصات",
    body: "کرهٔ واحد. رأس C را در (۰,۰,۱) بگذارید. ضلع b را روی نصف‌النهار xz قرار دهید تا B = (sin b, ۰, cos b).",
    formula: "C = (0,0,1) ، B = (sin b, 0, cos b)",
  },
  {
    title: "۲. قرار دادن A",
    body: "زاویهٔ C دوران حول محور z است. نقطهٔ A در فاصلهٔ a از C و با زاویهٔ C از صفحهٔ مرجع:",
    formula: "A = (sin a cos C, sin a sin C, cos a)",
  },
  {
    title: "۳. حاصل‌ضرب داخلی",
    body: "ضلع c فاصلهٔ زاویه‌ای A و B است؛ پس cos c = A·B.",
    formula: "A·B = sin a cos C · sin b + cos a · cos b",
  },
  {
    title: "۴. قانون کسینوس‌ها",
    body: "با مرتب‌سازی همان عبارت Smart:",
    formula: "cos c = cos a cos b + sin a sin b cos C",
  },
  {
    title: "۵. آزمایش عددی",
    body: "اسلایدرها را تغییر دهید و ببینید سمت راست و چپ فرمول یکی می‌مانند (تا خطای شناور).",
    formula: "باقیمانده → ۰",
  },
];

const SINE_STEPS = [
  {
    title: "۱. ارتفاع کروی",
    body: "از رأس A به ضلع a (یعنی کمان BC) ارتفاع کروی h رسم کنید؛ پای ارتفاع را D بنامید. دو مثلث قائم‌الزاویه ABD و ACD ساخته می‌شود.",
    formula: "ˆADB = ˆADC = 90°",
  },
  {
    title: "۲. از مثلث ABD",
    body: "در مثلث قائم با وتر c و زاویهٔ B:",
    formula: "sin h = sin c · sin B",
  },
  {
    title: "۳. از مثلث ACD",
    body: "به‌طور مشابه با وتر b و زاویهٔ C:",
    formula: "sin h = sin b · sin C",
  },
  {
    title: "۴. حذف ارتفاع",
    body: "دو عبارت را برابر قرار دهید:",
    formula: "sin b / sin B = sin c / sin C",
  },
  {
    title: "۵. تعمیم",
    body: "با تکرار برای رأس دیگر، قانون کامل سینوس‌ها به‌دست می‌آید (Smart I.4).",
    formula: "sin a / sin A = sin b / sin B = sin c / sin C",
  },
];

export function ProofAnimator({ kind }: { kind: ProofKind }) {
  const steps = kind === "cosine" ? COSINE_STEPS : SINE_STEPS;
  const [step, setStep] = useState(0);
  const [a, setA] = useState(50);
  const [b, setB] = useState(65);
  const [C, setC] = useState(40);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2200);
    return () => clearInterval(t);
  }, [playing, steps.length]);

  const check = useMemo(() => {
    const ar = (a * Math.PI) / 180;
    const br = (b * Math.PI) / 180;
    const Cr = (C * Math.PI) / 180;
    if (kind === "cosine") {
      const cosc = Math.cos(ar) * Math.cos(br) + Math.sin(ar) * Math.sin(br) * Math.cos(Cr);
      const c = (Math.acos(Math.min(1, Math.max(-1, cosc))) * 180) / Math.PI;
      // reconstruct from vectors as in proof
      const Ax = Math.sin(ar) * Math.cos(Cr);
      const Ay = Math.sin(ar) * Math.sin(Cr);
      const Az = Math.cos(ar);
      const Bx = Math.sin(br);
      const Bz = Math.cos(br);
      const dot = Ax * Bx + Ay * 0 + Az * Bz;
      return { c, residual: Math.abs(cosc - dot), side: "cosine" as const };
    }
    // sine demo: invent angle A from cosine polar-ish consistency using random third
    const cosc =
      Math.cos(ar) * Math.cos(br) + Math.sin(ar) * Math.sin(br) * Math.cos(Cr);
    const c = Math.acos(Math.min(1, Math.max(-1, cosc)));
    // angle A via cosine law for angles approx from sides
    const cosA =
      (Math.cos(ar) - Math.cos(br) * Math.cos(c)) /
      (Math.sin(br) * Math.sin(c) + 1e-12);
    const Aang = Math.acos(Math.min(1, Math.max(-1, cosA)));
    const ratio = Math.sin(ar) / Math.sin(Aang);
    const ratio2 = Math.sin(br) / Math.sin(Cr); // using C as stand-in only for demo balance
    return {
      c: (c * 180) / Math.PI,
      residual: Math.abs(ratio - Math.sin(c) / Math.sin(Cr === 0 ? 1 : Cr)),
      side: "sine" as const,
      ratio,
      ratio2,
      Aang: (Aang * 180) / Math.PI,
    };
  }, [a, b, C, kind]);

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>
            {kind === "cosine" ? "اثبات قانون کسینوس‌ها" : "اثبات قانون سینوس‌ها"}
          </CardTitle>
          <CardDescription>
            {kind === "cosine"
              ? "مسیر مختصات دکارتی — مطابق رویکرد تحلیلی Smart"
              : "مسیر ارتفاع کروی — رایج در جزوه‌های المپیاد نجوم ایران"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ink)]">
            <div
              className="h-full rounded-full bg-[var(--gold)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--ink-deep)] p-5">
            <ProofDiagram kind={kind} step={step} a={a} b={b} C={C} />
            <div className="relative z-10 mt-4 space-y-2 animate-in-fade" key={step}>
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
                {steps[step].title}
              </h3>
              <p className="text-sm leading-8 text-[var(--parchment)]/90">
                {steps[step].body}
              </p>
              <p className="rounded-md border border-[var(--teal)]/40 bg-[var(--teal)]/10 px-3 py-2 font-mono text-xs text-[var(--gold-soft)] dir-ltr text-left">
                {steps[step].formula}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              قبلی
            </Button>
            <Button
              size="sm"
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              disabled={step === steps.length - 1}
            >
              بعدی
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStep(0);
                setPlaying(true);
              }}
            >
              پخش انیمیشن گام‌ها
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">آزمایش عددی زنده</CardTitle>
          <CardDescription>مقادیر a, b, C را تغییر دهید</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumSlider label="a" value={a} onChange={setA} />
          <NumSlider label="b" value={b} onChange={setB} />
          <NumSlider label="C" value={C} onChange={setC} />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-[var(--border)] px-3 py-2">
              <div className="text-[10px] text-[var(--muted)]">c محاسبه‌شده</div>
              <div className="font-mono text-[var(--gold-soft)] dir-ltr text-left">
                {toPersianDigits(check.c.toFixed(3))}°
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] px-3 py-2">
              <div className="text-[10px] text-[var(--muted)]">
                {kind === "cosine" ? "|A·B − cos c|" : "نسبت sin a / sin A"}
              </div>
              <div className="font-mono text-[var(--gold-soft)] dir-ltr text-left">
                {kind === "cosine"
                  ? toPersianDigits(check.residual.toExponential(2))
                  : toPersianDigits((check as { ratio: number }).ratio.toFixed(4))}
              </div>
            </div>
          </div>
          {kind === "sine" && (
            <p className="text-xs leading-7 text-[var(--muted)]">
              زاویهٔ A از قانون کسینوس‌ها روی اضلاع بازیابی شده:{" "}
              <span className="text-[var(--parchment)]">
                {toPersianDigits((check as { Aang: number }).Aang.toFixed(2))}°
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NumSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block space-y-1">
      <div className="flex justify-between text-xs text-[var(--muted)]">
        <span>{label}</span>
        <span className="text-[var(--parchment)]">
          {toPersianDigits(value)}°
        </span>
      </div>
      <input
        type="range"
        min={10}
        max={120}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--gold)]"
      />
    </label>
  );
}

function ProofDiagram({
  kind,
  step,
  a,
  b,
  C,
}: {
  kind: ProofKind;
  step: number;
  a: number;
  b: number;
  C: number;
}) {
  // Simple SVG schematic that evolves with step
  const opacity = (i: number) => (step >= i ? 1 : 0.15);
  return (
    <svg viewBox="0 0 360 160" className="absolute inset-x-0 top-0 h-36 w-full opacity-90">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(201,162,39,0.15)" />
          <stop offset="100%" stopColor="rgba(201,162,39,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="180" cy="80" rx="120" ry="55" fill="url(#g)" stroke="rgba(91,124,153,0.45)" />
      {kind === "cosine" ? (
        <>
          <circle cx="180" cy="35" r="4" fill="#e6d39a" opacity={opacity(0)} />
          <text x="188" y="32" fill="#e6d39a" fontSize="11" opacity={opacity(0)}>
            C
          </text>
          <circle
            cx={180 + b * 0.9}
            cy={90}
            r="4"
            fill="#3d7a7a"
            opacity={opacity(1)}
          />
          <text x={188 + b * 0.9} y="94" fill="#3d7a7a" fontSize="11" opacity={opacity(1)}>
            B
          </text>
          <circle
            cx={180 - a * Math.cos((C * Math.PI) / 180)}
            cy={90 + a * 0.35}
            r="4"
            fill="#5b7c99"
            opacity={opacity(1)}
          />
          <text
            x={188 - a * Math.cos((C * Math.PI) / 180)}
            y={104 + a * 0.35}
            fill="#5b7c99"
            fontSize="11"
            opacity={opacity(1)}
          >
            A
          </text>
          <path
            d={`M ${180 - a * Math.cos((C * Math.PI) / 180)} ${90 + a * 0.35} Q 180 100 ${180 + b * 0.9} 90`}
            fill="none"
            stroke="#c9a227"
            strokeWidth="2"
            opacity={opacity(2)}
          />
        </>
      ) : (
        <>
          <circle cx="180" cy="40" r="4" fill="#e6d39a" opacity={opacity(0)} />
          <text x="188" y="38" fill="#e6d39a" fontSize="11">
            A
          </text>
          <circle cx="110" cy="110" r="4" fill="#3d7a7a" opacity={opacity(0)} />
          <circle cx="250" cy="110" r="4" fill="#5b7c99" opacity={opacity(0)} />
          <path
            d="M110 110 Q180 125 250 110"
            fill="none"
            stroke="rgba(201,162,39,0.7)"
            strokeWidth="1.5"
            opacity={opacity(0)}
          />
          <path
            d="M180 40 L180 118"
            stroke="#8b4557"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity={opacity(1)}
          />
          <circle cx="180" cy="118" r="3" fill="#8b4557" opacity={opacity(1)} />
          <text x="186" y="130" fill="#8b4557" fontSize="10" opacity={opacity(1)}>
            D
          </text>
        </>
      )}
    </svg>
  );
}
