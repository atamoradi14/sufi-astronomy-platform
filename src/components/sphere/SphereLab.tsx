"use client";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { SphereViewState } from "./CelestialSphere";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  angularDistanceDeg,
  lonLatToCart,
  sphericalAngleDeg,
} from "@/lib/astronomy/sphereGeom";
import { deg as trig } from "@/lib/astronomy/sphericalTrig";
import { MathBlock } from "@/components/ui/MathBlock";
import { RotateCcw, Maximize2, MousePointer2 } from "lucide-react";
import { formatDeg } from "@/lib/utils";
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
const PRESETS: Array<{
  id: string;
  label: string;
  patch: Partial<SphereViewState>;
}> = [
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
      pointB: { lon: 0, lat: 35.7 },
      pointC: { lon: -40, lat: 20 },
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
  showMeridians: false,
  showParallels: false,
  showHorizon: false,
  showEcliptic: false,
  showTriangle: true,
  showSmallDemo: false,
  smallRadius: 35,
  observerLat: 35.7,
  pointA: { lon: -20, lat: 55 },
  pointB: { lon: 35, lat: 15 },
  pointC: { lon: 80, lat: 45 },
  highlight: "triangle",
};
export function SphereLab() {
  return (
    <LocalizedDigits>
      {
        <Suspense
          fallback={
            <div className="text-[var(--muted)]">بارگذاری آزمایشگاه…</div>
          }
        >
          <SphereLabInner />
        </Suspense>
      }
    </LocalizedDigits>
  );
}
function SphereLabInner() {
  const search = useSearchParams();
  const [state, setState] = useState<SphereViewState>(INITIAL);
  const [active, setActive] = useState("triangle");
  const [editing, setEditing] = useState<"pointA" | "pointB" | "pointC" | null>(
    null,
  );
  const [cameraKey, setCameraKey] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preset = search.get("preset");
    const found = PRESETS.find((p) => p.id === preset);
    if (found) {
      setState({ ...INITIAL, ...found.patch });
      setActive(found.id);
    }
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
    const valid =
      [a, b, c, angA, angB, angC].every(Number.isFinite) &&
      Math.min(a, b, c) > 1e-6 &&
      Math.max(a, b, c) < 179.999999 &&
      E > 1e-7 &&
      a + b + c < 359.999999;
    return { a, b, c, angA, angB, angC, cFromCos, sineCheck, E, area, valid };
  }, [state.pointA, state.pointB, state.pointC]);
  const set = (patch: Partial<SphereViewState>) =>
    setState((s) => ({ ...s, ...patch }));
  const applyPreset = (id: string) => {
    const p = PRESETS.find((p) => p.id === id);
    if (p) {
      setState({ ...INITIAL, ...p.patch });
      setActive(id);
      setEditing(null);
    }
  };
  const metric = (v: number, n = 3) =>
    metrics.valid && Number.isFinite(v) ? `${v.toFixed(n)}°` : "—";
  const isPzx = active === "astro-tri";
  const layerKeys: Array<[keyof SphereViewState, string]> = [
    ["showEquator", "استوا · Equator"],
    ["showMeridians", "نصف‌النهارها · Meridians"],
    ["showParallels", "مدارهای میل · Parallels"],
    ["showHorizon", "افق · Horizon"],
    ["showEcliptic", "دایرة‌البروج · Ecliptic"],
    ["showTriangle", "مثلث · Triangle"],
    ["showSmallDemo", "صغیرهٔ حول A · Small circle"],
  ];
  return (
    <LocalizedDigits>
      {
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px] items-start">
            <div className="workspace lg:sticky lg:top-24" ref={stageRef}>
              <div className="workspace-toolbar">
                <span className="study-kicker">SPHERE / LAB</span>
                <select
                  aria-label="Sphere preset / نمای کره"
                  className="control-input !w-auto max-w-full"
                  value={active}
                  onChange={(e) => applyPreset(e.target.value)}
                >
                  {PRESETS.filter((p) => p.id !== "basics").map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCameraKey((k) => k + 1)}
                >
                  <RotateCcw size={15} />
                  بازنشانی نما
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Fullscreen sphere / تمام‌صفحه"
                  onClick={() => {
                    if (document.fullscreenElement)
                      void document.exitFullscreen();
                    else void stageRef.current?.requestFullscreen();
                  }}
                >
                  <Maximize2 size={16} />
                </Button>
              </div>
              <div className="workspace-stage">
                <CelestialSphere
                  resetKey={cameraKey}
                  state={{
                    ...state,
                    vertexLabels: isPzx ? ["P", "Z", "X"] : undefined,
                  }}
                  className="h-[min(70vh,670px)] max-lg:h-[min(90vw,480px)] min-h-[300px] w-full"
                  onPlace={
                    editing
                      ? (point) => {
                          set({ [editing]: point });
                          setEditing(null);
                          setActive("triangle");
                        }
                      : undefined
                  }
                />
              </div>
              <div className="workspace-legend">
                <span>
                  <i style={{ background: "#79d5ca" }} />a = BC
                </span>
                <span>
                  <i style={{ background: "#91b9ff" }} />b = CA
                </span>
                <span>
                  <i style={{ background: "#f1cf7b" }} />c = AB / استوا
                </span>
                <span>
                  <i style={{ background: "#ed94aa" }} />
                  افق
                </span>
                <span>
                  <i style={{ background: "#ad9bff" }} />
                  دایرة‌البروج / صغیره
                </span>
              </div>
              <p className="px-5 pb-4 text-xs leading-7 text-[var(--muted)]">
                کشیدن: چرخش · اسکرول یا دو انگشت: بزرگ‌نمایی · برای جابه‌جایی
                رأس، نام آن را انتخاب و روی سطح کلیک کنید. خطوط پشت کره
                پنهان‌اند.
              </p>
            </div>
            <aside className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">لایه‌های راهنما</CardTitle>
                  <CardDescription>
                    هر بار یک مفهوم را جدا بررسی کنید.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                  {layerKeys.map(([key, label]) => (
                    <Toggle
                      key={key}
                      label={label}
                      on={state[key] === true}
                      onChange={(v) => set({ [key]: v })}
                    />
                  ))}
                </CardContent>
              </Card>
              {state.showTriangle && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">رأس‌های مثلث</CardTitle>
                    <CardDescription>
                      {isPzx
                        ? "A=P، B=Z، C=X؛ عرض ناظر، رأس Z و افق را با هم تغییر می‌دهد."
                        : "طول و عرضِ جهت هر رأس روی کره؛ همهٔ ورودی‌ها درجه‌اند."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      {(["pointA", "pointB", "pointC"] as const).map(
                        (key, i) => (
                          <Button
                            key={key}
                            size="sm"
                            variant={editing === key ? "default" : "outline"}
                            aria-pressed={editing === key}
                            onClick={() =>
                              setEditing(editing === key ? null : key)
                            }
                          >
                            <MousePointer2 size={13} />
                            {["A", "B", "C"][i]}
                          </Button>
                        ),
                      )}
                    </div>
                    {editing && (
                      <p
                        role="status"
                        className="text-xs leading-7 text-[var(--teal)]"
                      >
                        رأس {editing.slice(-1)} را با کلیک روی سطح جای‌گذاری
                        کنید یا با همان دکمه لغو کنید.
                      </p>
                    )}
                    {(["pointA", "pointB", "pointC"] as const).map((key, i) => (
                      <details key={key} open={editing === key || i === 0}>
                        <summary className="py-2 text-sm text-[var(--gold-soft)]">
                          {["A", "B", "C"][i]} · {state[key].lon.toFixed(1)}°,{" "}
                          {state[key].lat.toFixed(1)}°
                        </summary>
                        <PointEditor
                          label={["A", "B", "C"][i]}
                          value={state[key]}
                          onChange={(v) => {
                            set({ [key]: v });
                            setActive("triangle");
                          }}
                        />
                      </details>
                    ))}
                  </CardContent>
                </Card>
              )}
              {(state.showHorizon || state.showSmallDemo) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">پارامترهای هندسی</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {state.showSmallDemo && (
                      <Slider
                        label="فاصلهٔ قطبی صغیره θ"
                        min={5}
                        max={175}
                        value={state.smallRadius}
                        onChange={(smallRadius) => set({ smallRadius })}
                        format={(v) => formatDeg(v, 0)}
                      />
                    )}{" "}
                    {state.showHorizon && (
                      <Slider
                        label="عرض ناظر φ"
                        min={-90}
                        max={90}
                        value={state.observerLat}
                        onChange={(observerLat) =>
                          set({
                            observerLat,
                            ...(isPzx
                              ? { pointB: { lon: 0, lat: observerLat } }
                              : {}),
                          })
                        }
                        format={(v) => formatDeg(v, 1)}
                      />
                    )}
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
          {state.showTriangle && (
            <Card>
              <CardHeader>
                <CardTitle>اندازه‌گیری و کنترل سازگاری</CardTitle>
                <CardDescription>
                  محاسبه از همان بردارهایی که روی کره رسم شده‌اند؛ اضلاع درجه‌ای
                  و مساحت روی کرهٔ واحد است.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!metrics.valid && (
                  <p
                    role="status"
                    className="rounded-lg border border-[var(--rose-ink)]/40 p-3 text-sm leading-7 text-[var(--rose-ink)]"
                  >
                    این آرایش، مثلث محدب معمول و غیرمنحط نمی‌سازد. رأس‌های
                    متمایز و غیرپادپا را در یک نیم‌کرهٔ باز انتخاب کنید؛ زاویه و
                    مساحت برای حالت منحط گزارش نمی‌شود.
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                  {[
                    ["a = BC", metrics.a],
                    ["b = CA", metrics.b],
                    ["c = AB", metrics.c],
                    ["A", metrics.angA],
                    ["B", metrics.angB],
                    ["C", metrics.angC],
                  ].map(([label, v]) => (
                    <Metric
                      key={label}
                      label={String(label)}
                      value={metric(Number(v))}
                    />
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Metric label="زیادی کروی · E" value={metric(metrics.E)} />
                  <Metric
                    label="مساحت واحد · S / R² (sr)"
                    value={metrics.valid ? metrics.area.toFixed(7) : "—"}
                  />
                  <Metric
                    label="اختلاف ضلع محاسبه‌شده و هندسی (deg)"
                    value={
                      metrics.valid
                        ? Math.abs(metrics.cFromCos - metrics.c) < 1e-10
                          ? "< 10⁻¹⁰"
                          : Math.abs(
                              metrics.cFromCos - metrics.c,
                            ).toExponential(2)
                        : "—"
                    }
                  />
                </div>
                <MathBlock>{String.raw`\cos c=\cos a\cos b+\sin a\sin b\cos C,\qquad S=R^2(A+B+C-\pi)`}</MathBlock>
              </CardContent>
            </Card>
          )}
        </div>
      }
    </LocalizedDigits>
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
    <LocalizedDigits>
      {
        <button
          type="button"
          aria-pressed={on}
          onClick={() => onChange(!on)}
          className={`rounded-lg border px-3 py-2 text-right transition-colors ${
            on
              ? "border-[var(--gold)]/50 bg-[var(--gold)]/10 text-[var(--gold-soft)]"
              : "border-[var(--border)] text-[var(--muted)]"
          }`}
        >
          {label}
        </button>
      }
    </LocalizedDigits>
  );
}
function PointEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: {
    lon: number;
    lat: number;
  };
  onChange: (v: { lon: number; lat: number }) => void;
}) {
  return (
    <LocalizedDigits>
      {
        <div className="rounded-lg border border-[var(--border)] bg-[var(--ink)]/40 p-3 space-y-2">
          <div className="text-sm text-[var(--gold-soft)]">نقطه {label}</div>
          <Slider
            label={`طول رأس ${label}`}
            min={-180}
            max={180}
            value={value.lon}
            onChange={(lon) => onChange({ ...value, lon })}
            format={(v) => formatDeg(v, 0)}
          />
          <Slider
            label={`عرض / میل رأس ${label}`}
            min={-90}
            max={90}
            value={value.lat}
            onChange={(lat) => onChange({ ...value, lat })}
            format={(v) => formatDeg(v, 0)}
          />
        </div>
      }
    </LocalizedDigits>
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
    <LocalizedDigits>
      {
        <label className="block space-y-1">
          <div className="flex justify-between text-[11px] text-[var(--muted)]">
            <span>{label}</span>
            <span className="text-[var(--parchment)]">{format(value)}</span>
          </div>
          <input
            aria-label={label}
            type="range"
            min={min}
            max={max}
            step={1}
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
          <div className="text-[10px] text-[var(--muted)]">{label}</div>
          <div className="font-mono text-[var(--gold-soft)] dir-ltr text-left">
            {value}
          </div>
        </div>
      }
    </LocalizedDigits>
  );
}
