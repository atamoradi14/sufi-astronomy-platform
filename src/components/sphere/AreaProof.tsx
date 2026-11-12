"use client";

import { useMemo, useState } from "react";
import { deg } from "@/lib/astronomy/sphericalTrig";
import { toPersianDigits } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS = [
  {
    titleEn: "1. Lune of angle A",
    titleFa: "۱. هلال با زاویهٔ A",
    bodyEn:
      "A lune is the region between two great circles meeting at angle A. On the unit sphere its area is 2A (steradians), because a lune of angle π covers a hemisphere pair totaling 2π, so area scales as 2A.",
    bodyFa:
      "هلال ناحیهٔ میان دو عظیمه با زاویهٔ A است. روی کرهٔ واحد مساحت آن ۲A استرادیان است.",
    formula: "Area(lune A) = 2A",
  },
  {
    titleEn: "2. Three lunes A, B, C",
    titleFa: "۲. سه هلال A، B، C",
    bodyEn:
      "Form the three lunes belonging to the angles of triangle ABC. Together they cover the whole sphere, but the triangle and its antipodal triangle are each covered three times in the raw sum of lune areas.",
    bodyFa:
      "سه هلال زوایای مثلث را در نظر بگیرید. مجموع آن‌ها کره را می‌پوشاند اما مثلث و پادمثلث بیش از یک‌بار شمرده می‌شوند.",
    formula: "2A + 2B + 2C  covers sphere with overcount",
  },
  {
    titleEn: "3. Overcount bookkeeping",
    titleFa: "۳. حساب پوشش اضافی",
    bodyEn:
      "Careful counting (Girard): summing the three lunes counts the entire sphere once and counts both the triangle and its antipode an extra time each. Hence 2(A+B+C) = 2π + 2·Area(+antipode contribution handled) leading to Area = A+B+C−π.",
    bodyFa:
      "با شمارش دقیق ژیرار: ۲(A+B+C) = ۲π + ۲·مساحت ⇒ مساحت = A+B+C−π.",
    formula: "2(A+B+C) = 2π + 2E  ⇒  E = A+B+C−π",
  },
  {
    titleEn: "4. Girard's theorem",
    titleFa: "۴. قضیهٔ ژیرار",
    bodyEn:
      "The area of a spherical triangle on the unit sphere equals its spherical excess E = A+B+C−π. On a sphere of radius R, Area = R² E.",
    bodyFa: "مساحت مثلث روی کرهٔ واحد برابر زیادی کروی است. روی کرهٔ شعاع R: R²E.",
    formula: "Area = E = A + B + C − π",
  },
  {
    titleEn: "5. L'Huilier from three sides",
    titleFa: "۵. لاهوئیلیه از سه ضلع",
    bodyEn:
      "When only sides are known: let s = (a+b+c)/2. Then tan(E/4) = √[tan(s/2) tan((s−a)/2) tan((s−b)/2) tan((s−c)/2)].",
    bodyFa: "اگر فقط اضلاع معلوم باشند از فرمول لاهوئیلیه استفاده کنید.",
    formula: "tan(E/4) = √[tan(s/2) tan((s−a)/2) tan((s−b)/2) tan((s−c)/2)]",
  },
];

export function AreaProof() {
  const [step, setStep] = useState(0);
  const [A, setA] = useState(80);
  const [B, setB] = useState(70);
  const [C, setC] = useState(95);
  const [a, seta] = useState(60);
  const [b, setb] = useState(55);
  const [c, setc] = useState(70);

  const E = useMemo(() => deg.excess(A, B, C), [A, B, C]);
  const area = useMemo(() => deg.areaUnit(A, B, C), [A, B, C]);
  const El = useMemo(() => deg.excessLHuilier(a, b, c), [a, b, c]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle>مساحت مثلث کروی — Girard</CardTitle>
          <CardDescription>
            English formulation as in classical spherical trigonometry (Smart / Girard lune argument)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AreaDiagram A={A} B={B} C={C} step={step} />
          <div className="space-y-2 animate-in-fade" key={step}>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
              {STEPS[step].titleFa}
            </h3>
            <p className="text-sm leading-7 text-[var(--muted)] dir-ltr text-left">
              {STEPS[step].titleEn}
            </p>
            <p className="text-sm leading-8 text-[var(--parchment)]/90">{STEPS[step].bodyFa}</p>
            <p className="rounded-md border border-[var(--border)] bg-[var(--ink)]/40 px-3 py-2 text-sm leading-7 text-[var(--muted)] dir-ltr text-left">
              {STEPS[step].bodyEn}
            </p>
            <p className="rounded-md border border-[var(--teal)]/40 bg-[var(--teal)]/10 px-3 py-2 font-mono text-xs text-[var(--gold-soft)] dir-ltr text-left">
              {STEPS[step].formula}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              قبلی
            </Button>
            <Button
              size="sm"
              disabled={step === STEPS.length - 1}
              onClick={() => setStep((s) => s + 1)}
            >
              بعدی
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">آزمایش E از زوایا</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Ang label="A" v={A} set={setA} />
            <Ang label="B" v={B} set={setB} />
            <Ang label="C" v={C} set={setC} />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Metric label="E = A+B+C−180°" value={`${toPersianDigits(E.toFixed(3))}°`} />
              <Metric label="Area (sr, R=1)" value={toPersianDigits(area.toFixed(5))} />
            </div>
            <p className="text-[11px] text-[var(--muted)] leading-6">
              برای مثلث معتبر باید E&gt;۰ و هر زاویه بین ۰ و ۱۸۰° باشد.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">L&apos;Huilier از اضلاع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Ang label="a" v={a} set={seta} />
            <Ang label="b" v={b} set={setb} />
            <Ang label="c" v={c} set={setc} />
            <Metric label="E (L'Huilier)" value={`${toPersianDigits(El.toFixed(3))}°`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Ang({
  label,
  v,
  set,
}: {
  label: string;
  v: number;
  set: (n: number) => void;
}) {
  return (
    <label className="block space-y-1">
      <div className="flex justify-between text-xs text-[var(--muted)]">
        <span>{label}</span>
        <span>{toPersianDigits(v)}°</span>
      </div>
      <input
        type="range"
        min={20}
        max={160}
        value={v}
        onChange={(e) => set(Number(e.target.value))}
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

function AreaDiagram({
  A,
  B,
  C,
  step,
}: {
  A: number;
  B: number;
  C: number;
  step: number;
}) {
  const opacity = (i: number) => (step >= i ? 1 : 0.2);
  return (
    <svg viewBox="0 0 400 220" className="w-full rounded-xl border border-[var(--border)] bg-[var(--ink-deep)]">
      <circle cx="200" cy="110" r="90" fill="#0c1424" stroke="rgba(201,162,39,0.35)" />
      {/* triangle */}
      <path
        d="M200 35 L290 150 L110 150 Z"
        fill="rgba(201,162,39,0.18)"
        stroke="#e6d39a"
        strokeWidth="2"
        opacity={opacity(0)}
      />
      {/* lunes hinted as arcs */}
      <path
        d="M200 35 Q 320 90 290 150"
        fill="none"
        stroke="#8b4557"
        strokeWidth="2"
        opacity={opacity(1)}
      />
      <path
        d="M200 35 Q 80 90 110 150"
        fill="none"
        stroke="#3d7a7a"
        strokeWidth="2"
        opacity={opacity(1)}
      />
      <path
        d="M110 150 Q 200 190 290 150"
        fill="none"
        stroke="#5b7c99"
        strokeWidth="2"
        opacity={opacity(1)}
      />
      <text x="200" y="28" textAnchor="middle" fill="#e6d39a" fontSize="12" opacity={opacity(0)}>
        A={A}°
      </text>
      <text x="300" y="160" fill="#e6d39a" fontSize="12" opacity={opacity(0)}>
        B={B}°
      </text>
      <text x="85" y="160" fill="#e6d39a" fontSize="12" opacity={opacity(0)}>
        C={C}°
      </text>
      <text
        x="200"
        y="205"
        textAnchor="middle"
        fill="#9aa6b8"
        fontSize="11"
        opacity={opacity(3)}
      >
        Area = E = A+B+C−π
      </text>
    </svg>
  );
}
