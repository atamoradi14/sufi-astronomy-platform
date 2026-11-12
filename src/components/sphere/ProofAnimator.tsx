"use client";

import { useEffect, useMemo, useState } from "react";
import { deg } from "@/lib/astronomy/sphericalTrig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";

type ProofKind = "cosine" | "sine";

const COSINE_STEPS = [
  {
    titleFa: "۱. قرارگیری رأس C",
    titleEn: "1. Place vertex C",
    bodyFa: "کرهٔ واحد. C را در (۰,۰,۱) بگذارید.",
    bodyEn:
      "On the unit sphere place C at (0,0,1). Side lengths are central angles; cosines of sides equal scalar products of unit vectors.",
    formula: "C = (0, 0, 1)",
  },
  {
    titleFa: "۲. قرار دادن B",
    titleEn: "2. Place B in the reference meridian",
    bodyFa: "ضلع b روی نصف‌النهار مرجع xz.",
    bodyEn: "Put B in the xz-plane at angular distance b from C:",
    formula: "B = (sin b,  0,  cos b)",
  },
  {
    titleFa: "۳. قرار دادن A با زاویهٔ C",
    titleEn: "3. Place A using included angle C",
    bodyFa: "A در فاصلهٔ a از C و با زاویهٔ دایه‌درال C از صفحهٔ مرجع.",
    bodyEn:
      "Rotate about the z-axis by the dihedral angle C (Smart's included angle at C):",
    formula: "A = (sin a cos C,  sin a sin C,  cos a)",
  },
  {
    titleFa: "۴. حاصل‌ضرب داخلی",
    titleEn: "4. Dot product",
    bodyFa: "ضلع c فاصلهٔ زاویه‌ای A و B است؛ cos c = A·B.",
    bodyEn: "By definition cos c = A·B. Expanding gives Smart's cosine formula for sides.",
    formula: "A·B = cos a cos b + sin a sin b cos C",
  },
  {
    titleFa: "۵. صورت نهایی Smart",
    titleEn: "5. Smart's formula",
    bodyFa: "قانون کسینوس‌ها برای اضلاع:",
    bodyEn:
      "In any spherical triangle: the cosine of any side equals the product of the cosines of the other two sides plus the product of the sines of those sides and the cosine of the included angle.",
    formula: "cos c = cos a cos b + sin a sin b cos C",
  },
];

const SINE_STEPS = [
  {
    titleFa: "۱. ارتفاع کروی",
    titleEn: "1. Spherical altitude",
    bodyFa: "از A به ضلع a ارتفاع h فرود آورید؛ پای آن D.",
    bodyEn:
      "From A drop a perpendicular great-circle arc to side a (or its extension) meeting at D. Let h = AD.",
    formula: "∠ADB = ∠ADC = 90°",
  },
  {
    titleFa: "۲. مثلث قائم ABD",
    titleEn: "2. Right triangle ABD",
    bodyFa: "در مثلث قائم با وتر c و زاویهٔ B:",
    bodyEn: "In right spherical triangle ABD with hypotenuse c:",
    formula: "sin h = sin c · sin B",
  },
  {
    titleFa: "۳. مثلث قائم ACD",
    titleEn: "3. Right triangle ACD",
    bodyFa: "به‌طور مشابه:",
    bodyEn: "Likewise in ACD with hypotenuse b:",
    formula: "sin h = sin b · sin C",
  },
  {
    titleFa: "۴. حذف h",
    titleEn: "4. Eliminate h",
    bodyFa: "دو عبارت را برابر قرار دهید.",
    bodyEn: "Equate the two expressions for sin h and rearrange:",
    formula: "sin b / sin B = sin c / sin C",
  },
  {
    titleFa: "۵. صورت کامل Smart I.4",
    titleEn: "5. Full sine formula",
    bodyFa: "با تکرار برای رأس دیگر:",
    bodyEn:
      "The sines of the sides are proportional to the sines of the opposite angles (Smart §4).",
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
    setStep(0);
  }, [kind]);

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
    }, 2400);
    return () => clearInterval(t);
  }, [playing, steps.length]);

  const check = useMemo(() => {
    const c = deg.cosineLawSide(a, b, C);
    return { c };
  }, [a, b, C]);

  const Aang = useMemo(() => {
    const c = deg.cosineLawSide(a, b, C);
    return deg.angleFromSides(a, b, c);
  }, [a, b, C]);

  const residual = useMemo(() => {
    const c = deg.cosineLawSide(a, b, C);
    const ar = (a * Math.PI) / 180;
    const br = (b * Math.PI) / 180;
    const Cr = (C * Math.PI) / 180;
    const Ax = Math.sin(ar) * Math.cos(Cr);
    const Az = Math.cos(ar);
    const Bx = Math.sin(br);
    const Bz = Math.cos(br);
    const dot = Ax * Bx + Az * Bz;
    return Math.abs(dot - Math.cos((c * Math.PI) / 180));
  }, [a, b, C]);

  const sineRatio = useMemo(() => {
    const c = deg.cosineLawSide(a, b, C);
    const A = deg.angleFromSides(a, b, c);
    return (
      Math.sin((a * Math.PI) / 180) / Math.sin((A * Math.PI) / 180) /
      (Math.sin((c * Math.PI) / 180) / Math.sin((C * Math.PI) / 180))
    );
  }, [a, b, C]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>
            {kind === "cosine" ? "قانون کسینوس‌ها (اضلاع)" : "قانون سینوس‌ها"}
          </CardTitle>
          <CardDescription className="dir-ltr text-left">
            {kind === "cosine"
              ? "Smart I §3 — cos c = cos a cos b + sin a sin b cos C"
              : "Smart I §4 — sin a / sin A = sin b / sin B = sin c / sin C"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ink)]">
            <div
              className="h-full rounded-full bg-[var(--gold)] transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="min-h-[240px] space-y-3 rounded-xl border border-[var(--border)] bg-[var(--ink-deep)] p-5">
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
              {steps[step].titleFa}
            </h3>
            <p className="text-xs text-[var(--muted)] dir-ltr text-left">{steps[step].titleEn}</p>
            <p className="text-sm leading-8 text-[var(--parchment)]/90">{steps[step].bodyFa}</p>
            <p className="text-sm leading-7 text-[var(--muted)] dir-ltr text-left">
              {steps[step].bodyEn}
            </p>
            <p className="rounded-md border border-[var(--teal)]/40 bg-[var(--teal)]/10 px-3 py-2 font-mono text-xs text-[var(--gold-soft)] dir-ltr text-left">
              {steps[step].formula}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              قبلی
            </Button>
            <Button
              size="sm"
              disabled={step === steps.length - 1}
              onClick={() => setStep((s) => s + 1)}
            >
              بعدی
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setStep(0);
                setPlaying(true);
              }}
            >
              پخش انیمیشن
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Numerical check</CardTitle>
          <CardDescription>Live verification of the identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Num label="a" value={a} onChange={setA} />
          <Num label="b" value={b} onChange={setB} />
          <Num label="C" value={C} onChange={setC} />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="c (cosine law)" value={`${toPersianDigits(check.c.toFixed(4))}°`} />
            <Metric label="A (from sides)" value={`${toPersianDigits(Aang.toFixed(4))}°`} />
            {kind === "cosine" ? (
              <Metric label="|A·B − cos c|" value={toPersianDigits(residual.toExponential(2))} />
            ) : (
              <Metric
                label="sine-ratio check ≈1"
                value={toPersianDigits(sineRatio.toFixed(5))}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Num({
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
        <span>{toPersianDigits(value)}°</span>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] px-3 py-2">
      <div className="text-[10px] text-[var(--muted)] dir-ltr text-left">{label}</div>
      <div className="font-mono text-[var(--gold-soft)]">{value}</div>
    </div>
  );
}
