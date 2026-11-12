"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { SphereViewState } from "./CelestialSphere";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  angularDistanceDeg,
  lonLatToCart,
  sphericalAngleDeg,
} from "@/lib/astronomy/sphereGeom";
import { deg as trig } from "@/lib/astronomy/sphericalTrig";
import { formatDeg, toPersianDigits } from "@/lib/utils";

const CelestialSphere = dynamic(
  () => import("./CelestialSphere").then((m) => m.CelestialSphere),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--ink-deep)] text-[var(--muted)]">
        بارگذاری کرهٔ تعاملی…
      </div>
    ),
  },
);

const PRESETS: Array<{ id: string; label: string; patch: Partial<SphereViewState> }> = [
  {
    id: "circles",
    label: "عظیمه / صغیره",
    patch: {
      showEquator: true,
      showMeridians: true,
      showParallels: true,
      showTriangle: false,
      showSmallDemo: true,
      showHorizon: false,
      showEcliptic: false,
      highlight: "small",
    },
  },
  {
    id: "basics",
    label: "پایه",
    patch: {
      showEquator: true,
      showMeridians: true,
      showParallels: true,
      showTriangle: false,
      showSmallDemo: true,
      highlight: "small",
    },
  },
  {
    id: "triangle",
    label: "مثلث ABC",
    patch: {
      showEquator: true,
      showMeridians: false,
      showParallels: false,
      showHorizon: false,
      showEcliptic: false,
      showTriangle: true,
      showSmallDemo: false,
      pointA: { lon: -20, lat: 55 },
      pointB: { lon: 35, lat: 15 },
      pointC: { lon: 80, lat: 45 },
      highlight: "triangle",
    },
  },
  {
    id: "area",
    label: "مساحت / زیادی",
    patch: {
      showEquator: false,
      showMeridians: false,
      showParallels: false,
      showTriangle: true,
      showSmallDemo: false,
      pointA: { lon: 0, lat: 70 },
      pointB: { lon: 80, lat: 10 },
      pointC: { lon: -70, lat: 15 },
      highlight: "triangle",
    },
  },
  {
    id: "astro-tri",
    label: "مثلث نجومی PZX",
    patch: {
      showEquator: true,
      showMeridians: true,
      showParallels: false,
      showHorizon: true,
      showTriangle: true,
      showSmallDemo: false,
      pointA: { lon: 0, lat: 90 },
      pointB: { lon: 0, lat: 35 },
      pointC: { lon: 40, lat: 20 },
      highlight: "triangle",
    },
  },
  {
    id: "horizon",
    label: "افق ناظر",
    patch: {
      showEquator: true,
      showHorizon: true,
      showMeridians: true,
      showParallels: false,
      showEcliptic: false,
      showTriangle: false,
      showSmallDemo: false,
      highlight: "great",
    },
  },
  {
    id: "celestial",
    label: "کرهٔ سماوی",
    patch: {
      showEquator: true,
      showMeridians: true,
      showParallels: true,
      showEcliptic: true,
      showHorizon: false,
      showTriangle: false,
      showSmallDemo: false,
      highlight: "great",
    },
  },
  {
    id: "ecliptic",
    label: "دایرة‌البروج",
    patch: {
      showEquator: true,
      showEcliptic: true,
      showMeridians: false,
      showParallels: false,
      showHorizon: false,
      showTriangle: false,
      showSmallDemo: false,
      highlight: "great",
    },
  },
];

const INITIAL: SphereViewState = {
  showEquator: true,
  showMeridians: true,
  showParallels: true,
  showHorizon: false,
  showEcliptic: false,
  showTriangle: true,
  showSmallDemo: true,
  smallRadius: 35,
  observerLat: 35.7,
  pointA: { lon: -20, lat: 55 },
  pointB: { lon: 35, lat: 15 },
  pointC: { lon: 80, lat: 45 },
  highlight: "triangle",
};

export function SphereLab() {
  return (
    <Suspense fallback={<div className="text-[var(--muted)]">بارگذاری آزمایشگاه…</div>}>
      <SphereLabInner />
    </Suspense>
  );
}

function SphereLabInner() {
  const search = useSearchParams();
  const [state, setState] = useState<SphereViewState>(INITIAL);

  useEffect(() => {
    const preset = search.get("preset");
    const found = PRESETS.find((p) => p.id === preset);
    if (found) setState((s) => ({ ...s, ...found.patch }));
  }, [search]);

  const metrics = useMemo(() => {
    const A = lonLatToCart(state.pointA.lon, state.pointA.lat);
    const B = lonLatToCart(state.pointB.lon, state.pointB.lat);
    const C = lonLatToCart(state.pointC.lon, state.pointC.lat);
    const a = angularDistanceDeg(B, C);
    const b = angularDistanceDeg(A, C);
    const c = angularDistanceDeg(A, B);
    const angA = sphericalAngleDeg(B, A, C);
    const angB = sphericalAngleDeg(A, B, C);
    const angC = sphericalAngleDeg(A, C, B);
    const cFromCos = trig.cosineLawSide(a, b, angC);
    const sineCheck =
      Math.sin((a * Math.PI) / 180) /
      Math.sin((angA * Math.PI) / 180) /
      (Math.sin((b * Math.PI) / 180) / Math.sin((angB * Math.PI) / 180));
    const E = trig.excess(angA, angB, angC);
    const area = trig.areaUnit(angA, angB, angC);
    return { a, b, c, angA, angB, angC, cFromCos, sineCheck, E, area };
  }, [state.pointA, state.pointB, state.pointC]);

  const set = (patch: Partial<SphereViewState>) =>
    setState((s) => ({ ...s, ...patch }));

  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          <span className="text-xs text-[var(--muted)]">پیش‌فرض‌ها:</span>
          {PRESETS.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant="secondary"
              onClick={() => set(p.patch)}
            >
              {p.label}
            </Button>
          ))}
          <span className="mr-auto text-[11px] text-[var(--muted)]">
            بکشید برای چرخش · اسکرول برای بزرگ‌نمایی (Pan/Tilt)
          </span>
        </div>
        <CelestialSphere state={state} className="h-[min(62vh,560px)] w-full" />
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">لایه‌های کره</CardTitle>
            <CardDescription>
              طبق Smart §1–2: دایرهٔ عظیمه = صفحه از مرکز؛ دایرهٔ صغیره = صفحهٔ موازی افست‌دار.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <Toggle
              label="استوا (عظیمه)"
              on={state.showEquator}
              onChange={(v) => set({ showEquator: v, highlight: "great" })}
            />
            <Toggle
              label=" نصف‌النهارات"
              on={state.showMeridians}
              onChange={(v) => set({ showMeridians: v })}
            />
            <Toggle
              label="مدارات میل (صغیره)"
              on={state.showParallels}
              onChange={(v) => set({ showParallels: v, highlight: "small" })}
            />
            <Toggle
              label="افق ناظر"
              on={state.showHorizon}
              onChange={(v) => set({ showHorizon: v })}
            />
            <Toggle
              label="دایرة‌البروج"
              on={state.showEcliptic}
              onChange={(v) => set({ showEcliptic: v, highlight: "great" })}
            />
            <Toggle
              label="مثلث کروی ABC"
              on={state.showTriangle}
              onChange={(v) => set({ showTriangle: v, highlight: "triangle" })}
            />
            <Toggle
              label="دایرهٔ صغیره حول A"
              on={state.showSmallDemo}
              onChange={(v) => set({ showSmallDemo: v, highlight: "small" })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">کنترل نقاط و شعاع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <PointEditor
              label="A"
              value={state.pointA}
              onChange={(pointA) => set({ pointA })}
            />
            <PointEditor
              label="B"
              value={state.pointB}
              onChange={(pointB) => set({ pointB })}
            />
            <PointEditor
              label="C"
              value={state.pointC}
              onChange={(pointC) => set({ pointC })}
            />
            <Slider
              label="شعاع زاویه‌ای دایرهٔ صغیره حول A"
              min={5}
              max={85}
              value={state.smallRadius}
              onChange={(smallRadius) => set({ smallRadius, highlight: "small" })}
              format={(v) => formatDeg(v, 0)}
            />
            <Slider
              label="عرض ناظر (افق)"
              min={-80}
              max={80}
              value={state.observerLat}
              onChange={(observerLat) => set({ observerLat })}
              format={(v) => formatDeg(v, 1)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">اندازه‌گیری زنده</CardTitle>
            <CardDescription>
              اضلاع a,b,c روبه‌روی زوایای A,B,C — آزمایش قانون کسینوس‌ها و سینوس‌ها
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="ضلع a = BC" value={formatDeg(metrics.a, 2)} />
            <Metric label="ضلع b = AC" value={formatDeg(metrics.b, 2)} />
            <Metric label="ضلع c = AB" value={formatDeg(metrics.c, 2)} />
            <Metric label="زاویه A" value={formatDeg(metrics.angA, 2)} />
            <Metric label="زاویه B" value={formatDeg(metrics.angB, 2)} />
            <Metric label="زاویه C" value={formatDeg(metrics.angC, 2)} />
            <Metric
              label="c from cos-law"
              value={formatDeg(metrics.cFromCos, 2)}
            />
            <Metric
              label="(sin a/sin A)/(sin b/sin B)"
              value={toPersianDigits(metrics.sineCheck.toFixed(4))}
            />
            <Metric label="E = A+B+C−180°" value={formatDeg(metrics.E, 2)} />
            <Metric
              label="Area (sr, R=1)"
              value={toPersianDigits(metrics.area.toFixed(5))}
            />
            <div className="col-span-2 rounded-lg border border-[var(--teal)]/30 bg-[var(--teal)]/5 px-3 py-2 font-mono text-[10px] leading-5 text-[var(--muted)] dir-ltr text-left">
              cos c = cos a cos b + sin a sin b cos C
              <br />
              Area = E = A+B+C−π (Girard, unit sphere)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`rounded-lg border px-3 py-2 text-right transition-colors ${
        on
          ? "border-[var(--gold)]/50 bg-[var(--gold)]/10 text-[var(--gold-soft)]"
          : "border-[var(--border)] text-[var(--muted)]"
      }`}
    >
      {label}
    </button>
  );
}

function PointEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { lon: number; lat: number };
  onChange: (v: { lon: number; lat: number }) => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--ink)]/40 p-3 space-y-2">
      <div className="text-sm text-[var(--gold-soft)]">نقطه {label}</div>
      <Slider
        label="طول"
        min={-180}
        max={180}
        value={value.lon}
        onChange={(lon) => onChange({ ...value, lon })}
        format={(v) => formatDeg(v, 0)}
      />
      <Slider
        label="عرض / میل"
        min={-89}
        max={89}
        value={value.lat}
        onChange={(lat) => onChange({ ...value, lat })}
        format={(v) => formatDeg(v, 0)}
      />
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="block space-y-1">
      <div className="flex justify-between text-[11px] text-[var(--muted)]">
        <span>{label}</span>
        <span className="text-[var(--parchment)]">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
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
      <div className="text-[10px] text-[var(--muted)]">{label}</div>
      <div className="font-mono text-[var(--gold-soft)] dir-ltr text-left">{value}</div>
    </div>
  );
}
