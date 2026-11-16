"use client";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProof, type ProofKind } from "@/lib/content/proofs";
import { deg } from "@/lib/astronomy/sphericalTrig";
import { dms, formatDms, nauticalMiles } from "@/lib/astronomy/angle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MathBlock } from "@/components/ui/MathBlock";
import { GeometryFigure } from "@/components/learn/GeometryFigure";
import { toPersianDigits } from "@/lib/utils";
export function ProofWorkbench({ kind }: { kind: ProofKind }) {
  const { fa, t } = useLanguage();
  const proof = getProof(kind);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [kind]);
  useEffect(() => {
    if (!playing) return;
    if (step >= proof.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 9000);
    return () => clearTimeout(timer);
  }, [playing, step, proof.steps.length]);
  const s = proof.steps[step];
  return (
    <LocalizedDigits>
      {
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="min-w-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{fa ? proof.titleFa : proof.titleEn}</CardTitle>
                <CardDescription className="dir-ltr text-left">
                  {proof.source}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ink)]">
                  <div
                    className="h-full rounded-full bg-[var(--gold)] transition-all duration-500"
                    style={{
                      width: `${((step + 1) / proof.steps.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="min-h-[300px] space-y-3 rounded-xl border border-[var(--border)] bg-[var(--ink-deep)] p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
                    {fa ? s.titleFa : s.titleEn}
                  </h3>

                  <p className="text-sm leading-8 text-[var(--parchment)]/90">
                    {fa ? s.bodyFa : s.bodyEn}
                  </p>

                  <MathBlock>{s.formula}</MathBlock>
                </div>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Proof steps"
                >
                  {proof.steps.map((st, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-current={i === step ? "step" : undefined}
                      title={fa ? st.titleFa : st.titleEn}
                      onClick={() => {
                        setStep(i);
                        setPlaying(false);
                      }}
                      className={`h-9 w-9 rounded-lg border ${i === step ? "bg-[var(--gold)] text-[var(--ink)]" : "border-[var(--border)]"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={step === 0}
                    onClick={() => setStep((x) => x - 1)}
                  >
                    {t("قبل", "Previous")}
                  </Button>
                  <Button
                    size="sm"
                    disabled={step === proof.steps.length - 1}
                    onClick={() => setStep((x) => x + 1)}
                  >
                    {t("بعد", "Next")}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPlaying(false)}
                    disabled={!playing}
                  >
                    {t("توقف", "Pause")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setStep(0);
                      setPlaying(true);
                    }}
                  >
                    {t("پخش", "Play")}
                  </Button>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/learn/${proof.lessonId}`}>
                      {t("درس کامل", "Full lesson")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <NumericPanel kind={kind} />
        </div>
      }
    </LocalizedDigits>
  );
}
function NumericPanel({ kind }: { kind: ProofKind }) {
  const { t } = useLanguage();
  const [a, setA] = useState(50);
  const [b, setB] = useState(65);
  const [C, setC] = useState(40);
  const included = kind === "napier" ? 90 : C;
  const c = useMemo(() => deg.cosineLawSide(a, b, included), [a, b, included]);
  const Aang = useMemo(() => deg.angleFromSides(a, b, c), [a, b, c]);
  const Bang = useMemo(() => deg.angleFromSides(b, a, c), [a, b, c]);
  const sineRatio = useMemo(() => {
    const sa = Math.sin((a * Math.PI) / 180) / Math.sin((Aang * Math.PI) / 180);
    const sc =
      Math.sin((c * Math.PI) / 180) / Math.sin((included * Math.PI) / 180);
    return sa / sc;
  }, [a, Aang, c, included]);
  const analogue = useMemo(
    () => deg.analogueCosB(a, b, c, Aang),
    [a, b, c, Aang],
  );
  const cosB = Math.cos((Bang * Math.PI) / 180);
  const havC = useMemo(
    () => deg.haversineSide(a, b, included),
    [a, b, included],
  );
  const E = useMemo(
    () => deg.excess(Aang, Bang, included),
    [Aang, Bang, included],
  );
  const El = useMemo(() => deg.excessLHuilier(a, b, c), [a, b, c]);
  const PA = dms(65, 42);
  const PB = dms(53, 13);
  const APB = dms(100, 57);
  const AB = deg.cosineLawSide(PA, PB, APB);
  const z = deg.zenithDistance(35.7, 16.5, 30);
  return (
    <LocalizedDigits>
      {
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("آزمایش عددی", "Numerical exploration")}
            </CardTitle>
            <CardDescription className="dir-ltr text-left">
              {t(
                "بررسی زندهٔ همانی‌های اسمارت",
                "Live identities from Smart’s formulae",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {kind !== "sidereal" && (
              <GeometryFigure
                kind={
                  kind === "pzx"
                    ? "horizon"
                    : kind === "polar"
                      ? "polar"
                      : kind === "girard"
                        ? "area"
                        : "triangle"
                }
                sides={{ a, b, C: included }}
              />
            )}
            {kind !== "pzx" && kind !== "sidereal" && (
              <>
                <Num label="a" value={a} onChange={setA} />
                <Num label="b" value={b} onChange={setB} />
                {kind !== "napier" ? (
                  <Num label="C" value={C} onChange={setC} />
                ) : (
                  <p className="text-sm" dir="ltr">
                    C = 90°
                  </p>
                )}
              </>
            )}
            <div className="grid grid-cols-1 gap-2 text-sm">
              {(kind === "cosine" ||
                kind === "analogue" ||
                kind === "four-parts" ||
                kind === "napier") && (
                <Metric
                  label={t("c از (A)", "c from (A)")}
                  value={formatDms(c, 2)}
                />
              )}
              {kind === "sine" && (
                <Metric
                  label="(sin a)/sin A ÷ (sin c)/sin C"
                  value={toPersianDigits(sineRatio.toFixed(6))}
                />
              )}
              {kind === "analogue" && (
                <Metric
                  label={t(
                    "(C): مقایسهٔ دو محاسبهٔ cos B",
                    "(C): cos B vs analogueCosB",
                  )}
                  value={
                    Math.abs(analogue - cosB) < 1e-10
                      ? "< 10⁻¹⁰"
                      : (analogue - cosB).toExponential(2)
                  }
                />
              )}
              {kind === "haversine" && (
                <>
                  <Metric
                    label={t("c از (A)", "c from (A)")}
                    value={formatDms(c, 2)}
                  />
                  <Metric
                    label={t("c از هاورساین (۲۳)", "c from hav (23)")}
                    value={formatDms(havC, 2)}
                  />
                  <Metric
                    label={t("اسمارت بند ۱۲، AB", "Smart §12 AB")}
                    value={`${formatDms(AB, 1)} = ${toPersianDigits(nauticalMiles(AB).toFixed(1))} nmi`}
                  />
                </>
              )}
              {kind === "polar" && (
                <Metric
                  label={t("A از سه ضلع (۹)", "A from three sides (9)")}
                  value={formatDms(Aang, 2)}
                />
              )}
              {kind === "girard" && (
                <>
                  <Metric label="E = A+B+C−180°" value={formatDms(E, 3)} />
                  <Metric
                    label={t("E از لویلیر", "E from L’Huilier")}
                    value={formatDms(El, 3)}
                  />
                </>
              )}
              {kind === "pzx" && (
                <>
                  <Metric
                    label="φ=35°.7, δ=16°.5, H=30°"
                    value="Smart II (3)"
                  />
                  <Metric label="z" value={formatDms(z, 2)} />
                  <Metric label="a = 90°−z" value={formatDms(90 - z, 2)} />
                </>
              )}
              {kind === "sidereal" && (
                <>
                  <Metric label="ST = H + α" value="Smart II (9)" />
                  <Metric
                    label={t("مثال: H=2ʰ, α=5ʰ", "example: H=2ʰ, α=5ʰ")}
                    value="ST = 7ʰ"
                  />
                </>
              )}
              {kind === "delambre" && (
                <Metric
                  label={t(
                    "c از (A)؛ همانی‌ها را با آن مقایسه کنید",
                    "c from (A) — check analogies against this",
                  )}
                  value={formatDms(c, 2)}
                />
              )}
              {kind === "napier" && (
                <Metric
                  label="C = 90° · c from cos c = cos a cos b"
                  value={formatDms(deg.rightHypotenuse(a, b), 2)}
                />
              )}
            </div>
          </CardContent>
        </Card>
      }
    </LocalizedDigits>
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
    <LocalizedDigits>
      {
        <label className="block space-y-1">
          <div className="flex justify-between text-xs text-[var(--muted)]">
            <span>{label}</span>
            <span>{toPersianDigits(value)}°</span>
          </div>
          <input
            aria-label={label}
            type="range"
            min={10}
            max={120}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-[var(--gold)]"
          />
        </label>
      }
    </LocalizedDigits>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <LocalizedDigits>
      {
        <div className="rounded-lg border border-[var(--border)] px-3 py-2">
          <div className="text-[10px] text-[var(--muted)] dir-ltr text-left">
            {label}
          </div>
          <div className="tabular-nums text-[var(--gold-soft)]">{value}</div>
        </div>
      }
    </LocalizedDigits>
  );
}
