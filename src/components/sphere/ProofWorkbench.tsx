"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProof, type ProofKind } from "@/lib/content/proofs";
import { BookFigure } from "@/components/learn/BookFigures";
import { deg } from "@/lib/astronomy/sphericalTrig";
import { dms, formatDms, nauticalMiles } from "@/lib/astronomy/angle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";

export function ProofWorkbench({ kind }: { kind: ProofKind }) {
  const proof = getProof(kind);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [kind]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= proof.steps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2600);
    return () => clearInterval(t);
  }, [playing, proof.steps.length]);

  const s = proof.steps[step];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{proof.titleFa}</CardTitle>
            <CardDescription className="dir-ltr text-left">
              {proof.titleEn} · {proof.source}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ink)]">
              <div
                className="h-full rounded-full bg-[var(--gold)] transition-all duration-500"
                style={{ width: `${((step + 1) / proof.steps.length) * 100}%` }}
              />
            </div>
            <div className="min-h-[220px] space-y-3 rounded-xl border border-[var(--border)] bg-[var(--ink-deep)] p-5">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
                {s.titleFa}
              </h3>
              <p className="text-xs text-[var(--muted)] dir-ltr text-left">{s.titleEn}</p>
              <p className="text-sm leading-8 text-[var(--parchment)]/90">{s.bodyFa}</p>
              <p className="text-sm leading-7 text-[var(--muted)] dir-ltr text-left">{s.bodyEn}</p>
              <p className="rounded-md border border-[var(--teal)]/40 bg-[var(--teal)]/10 px-3 py-2 font-mono text-xs text-[var(--gold-soft)] dir-ltr text-left">
                {s.formula}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" disabled={step === 0} onClick={() => setStep((x) => x - 1)}>
                قبل
              </Button>
              <Button
                size="sm"
                disabled={step === proof.steps.length - 1}
                onClick={() => setStep((x) => x + 1)}
              >
                بعد
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setStep(0);
                  setPlaying(true);
                }}
              >
                پخش
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href={`/learn/${proof.lessonId}`}>درس کامل</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <BookFigure id={proof.figure} />
      </div>
      <NumericPanel kind={kind} />
    </div>
  );
}

function NumericPanel({ kind }: { kind: ProofKind }) {
  const [a, setA] = useState(50);
  const [b, setB] = useState(65);
  const [C, setC] = useState(40);

  const c = useMemo(() => deg.cosineLawSide(a, b, C), [a, b, C]);
  const Aang = useMemo(() => deg.angleFromSides(a, b, c), [a, b, c]);
  const Bang = useMemo(() => deg.angleFromSides(b, a, c), [a, b, c]);
  const sineRatio = useMemo(() => {
    const sa = Math.sin((a * Math.PI) / 180) / Math.sin((Aang * Math.PI) / 180);
    const sc = Math.sin((c * Math.PI) / 180) / Math.sin((C * Math.PI) / 180);
    return sa / sc;
  }, [a, Aang, c, C]);
  const analogue = useMemo(() => deg.analogueCosB(a, b, c, Aang), [a, b, c, Aang]);
  const cosB = Math.cos((Bang * Math.PI) / 180);
  const havC = useMemo(() => deg.haversineSide(a, b, C), [a, b, C]);
  const E = useMemo(() => deg.excess(Aang, Bang, C), [Aang, Bang, C]);
  const El = useMemo(() => deg.excessLHuilier(a, b, c), [a, b, c]);

  const PA = dms(65, 42);
  const PB = dms(53, 13);
  const APB = dms(100, 57);
  const AB = deg.cosineLawSide(PA, PB, APB);
  const z = deg.zenithDistance(35.7, 16.5, 30);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">آزمایش عددی</CardTitle>
        <CardDescription className="dir-ltr text-left">Live identities from Smart’s formulae</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {kind !== "pzx" && kind !== "sidereal" && (
          <>
            <Num label="a" value={a} onChange={setA} />
            <Num label="b" value={b} onChange={setB} />
            <Num label="C" value={C} onChange={setC} />
          </>
        )}
        <div className="grid grid-cols-1 gap-2 text-sm">
          {(kind === "cosine" || kind === "analogue" || kind === "four-parts" || kind === "napier") && (
            <Metric label="c from (A)" value={formatDms(c, 2)} />
          )}
          {kind === "sine" && (
            <Metric label="(sin a)/sin A ÷ (sin c)/sin C" value={toPersianDigits(sineRatio.toFixed(6))} />
          )}
          {kind === "analogue" && (
            <Metric label="(C): cos B vs analogueCosB" value={toPersianDigits((analogue - cosB).toExponential(2))} />
          )}
          {kind === "haversine" && (
            <>
              <Metric label="c from (A)" value={formatDms(c, 2)} />
              <Metric label="c from hav (23)" value={formatDms(havC, 2)} />
              <Metric
                label="Smart §12 AB"
                value={`${formatDms(AB, 1)} = ${toPersianDigits(nauticalMiles(AB).toFixed(1))} nmi`}
              />
            </>
          )}
          {kind === "polar" && <Metric label="A from three sides (9)" value={formatDms(Aang, 2)} />}
          {kind === "girard" && (
            <>
              <Metric label="E = A+B+C−180°" value={formatDms(E, 3)} />
              <Metric label="E from L’Huilier" value={formatDms(El, 3)} />
            </>
          )}
          {kind === "pzx" && (
            <>
              <Metric label="φ=35°.7, δ=16°.5, H=30°" value="Smart II (3)" />
              <Metric label="z" value={formatDms(z, 2)} />
              <Metric label="a = 90°−z" value={formatDms(90 - z, 2)} />
            </>
          )}
          {kind === "sidereal" && (
            <>
              <Metric label="ST = H + α" value="Smart II (9)" />
              <Metric label="example: H=2ʰ, α=5ʰ" value="ST = 7ʰ" />
            </>
          )}
          {kind === "delambre" && (
            <Metric label="c from (A) — check analogies against this" value={formatDms(c, 2)} />
          )}
          {kind === "napier" && (
            <Metric
              label="right-angled check: set C=90° below in the lesson"
              value={formatDms(deg.rightHypotenuse(a, b), 2)}
            />
          )}
        </div>
      </CardContent>
    </Card>
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
