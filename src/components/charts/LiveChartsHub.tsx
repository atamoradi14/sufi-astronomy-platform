"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  liveSnapshot,
  sunDaySeries,
  sunYearSeries,
  type LiveSnapshot,
} from "@/lib/astronomy/ephemeris";
import { useGeolocation } from "@/hooks/useGeolocation";
import { downloadCsv } from "@/lib/charts/csv";
import { formatDeg, formatHours, toPersianDigits } from "@/lib/utils";
import { CopyValue } from "@/components/charts/CopyValue";
import { EarthOrbitView } from "@/components/charts/EarthOrbitView";
import { MoonPhaseDisc } from "@/components/charts/MoonPhaseDisc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ObserverGlobe = dynamic(
  () => import("@/components/charts/ObserverGlobe").then((m) => m.ObserverGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] items-center justify-center text-sm text-[var(--muted)]">
        بارگذاری کره…
      </div>
    ),
  },
);

type IssState = {
  lat: number;
  lon: number;
  altKm: number | null;
  velocityKmh?: number | null;
  velocityKms: number | null;
  visibility: string | null;
  source: string;
  timestamp: number;
  note?: string;
};

type Tab = "overview" | "sun" | "moon" | "earth" | "observer" | "iss";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "نمای زنده" },
  { id: "sun", label: "خورشید" },
  { id: "moon", label: "ماه" },
  { id: "earth", label: "مدار زمین" },
  { id: "observer", label: "ناظر" },
  { id: "iss", label: "ISS" },
];

export function LiveChartsHub() {
  const geo = useGeolocation(true);
  const lat = geo.reading?.lat ?? 35.6892;
  const lon = geo.reading?.lon ?? 51.389;
  const altM = geo.reading?.altitude ?? null;

  const [now, setNow] = useState<Date | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [iss, setIss] = useState<IssState | null>(null);
  const [issError, setIssError] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const refreshIss = useCallback(async () => {
    try {
      const res = await fetch("/api/astro/iss", { cache: "no-store" });
      if (!res.ok) throw new Error("iss http");
      const j = (await res.json()) as IssState;
      setIss(j);
      setIssError(j.source === "sample-fallback" ? "نمونهٔ جایگزین (سرویس بالادستی در دسترس نبود)" : null);
    } catch {
      setIssError("خطا در دریافت ISS");
    }
  }, []);

  useEffect(() => {
    refreshIss();
    const t = setInterval(refreshIss, 10000);
    return () => clearInterval(t);
  }, [refreshIss]);

  const snap: LiveSnapshot | null = useMemo(() => {
    if (!now) return null;
    return liveSnapshot(now, lat, lon, altM);
  }, [now, lat, lon, altM]);

  const daySeries = useMemo(() => {
    if (!now) return [];
    return sunDaySeries(now, lat, lon, 0.25);
  }, [now, lat, lon]);

  const yearSeries = useMemo(() => {
    if (!now) return [];
    return sunYearSeries(now.getUTCFullYear(), lat, lon);
  }, [now, lat, lon]);

  const exportAll = () => {
    if (!snap || !now) return;
    const rows: Record<string, string | number | null>[] = [
      {
        kind: "snapshot",
        utc: snap.utcIso,
        et_tt: snap.et.ttIso,
        et_minutes: snap.et.minutesOfDay,
        deltaT_s: snap.et.deltaTSec,
        jd_tt: snap.et.jdTt,
        lat,
        lon,
        alt_m: altM,
        sun_dec: snap.sun.dec,
        sun_ra: snap.sun.ra,
        sun_alt: snap.sun.alt,
        sun_az: snap.sun.az,
        sun_lambda: snap.sun.lambda,
        sun_beta: snap.sun.beta,
        moon_illum: snap.moon.illumination,
        moon_phase: snap.moon.phaseNameFa,
        moon_ra: snap.moon.ra,
        moon_dec: snap.moon.dec,
        earth_lon: snap.earth.heliocentricLon,
        earth_r_au: snap.earth.rAu,
        iss_lat: iss?.lat ?? null,
        iss_lon: iss?.lon ?? null,
        iss_alt_km: iss?.altKm ?? null,
      },
      ...daySeries.map((p) => ({ kind: "sun_day", ...p })),
      ...yearSeries.map((p) => ({ kind: "sun_year", ...p })),
    ];
    downloadCsv(`sufi-live-${now.toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`, rows);
  };

  if (!now || !snap) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 px-4 py-10 text-center text-sm text-[var(--muted)]">
        همگام‌سازی داده‌های زنده…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          className="flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)]/60 p-2"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                tab === t.id
                  ? "border border-[var(--gold)]/45 bg-[var(--gold)]/20 text-[var(--gold-soft)]"
                  : "border border-transparent text-[var(--muted)] hover:text-[var(--parchment)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={exportAll}>
          خروجی CSV
        </Button>
      </div>

      {geo.error && (
        <p className="text-xs text-[var(--muted)]">{geo.error}</p>
      )}

      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CopyValue label="UTC" value={snap.utcIso} display={toPersianDigits(snap.utcIso.replace("T", " ").slice(0, 19))} />
            <CopyValue
              label="زمان نجومی / ET (TT)"
              value={snap.et.ttIso}
              display={toPersianDigits(snap.et.ttIso.replace("T", " ").slice(0, 23))}
            />
            <CopyValue
              label="ET — دقیقهٔ روز (اعشاری)"
              value={snap.et.minutesOfDay.toFixed(6)}
              display={toPersianDigits(snap.et.minutesOfDay.toFixed(6))}
            />
            <CopyValue
              label="ΔT (ثانیه)"
              value={snap.et.deltaTSec.toFixed(3)}
              display={toPersianDigits(snap.et.deltaTSec.toFixed(3))}
            />
            <CopyValue label="JD (TT)" value={snap.et.jdTt.toFixed(8)} display={toPersianDigits(snap.et.jdTt.toFixed(8))} />
            <CopyValue label="GMST" value={snap.observer.gmst.toFixed(8)} display={formatHours(snap.observer.gmst, 6)} />
            <CopyValue label="LST" value={snap.observer.lst.toFixed(8)} display={formatHours(snap.observer.lst, 6)} />
            <CopyValue
              label="معادلهٔ زمان (دقیقه)"
              value={snap.sun.equationOfTimeMin.toFixed(4)}
              display={toPersianDigits(snap.sun.equationOfTimeMin.toFixed(4))}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">خورشید — همین لحظه</CardTitle>
                <CardDescription>δ, α, a, A, λ, β — کلیک برای کپی</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                <CopyValue label="میل δ" value={snap.sun.dec.toFixed(6)} display={formatDeg(snap.sun.dec, 4)} />
                <CopyValue label="بعد α" value={snap.sun.ra.toFixed(8)} display={formatHours(snap.sun.ra, 5)} />
                <CopyValue label="ارتفاع a" value={snap.sun.alt.toFixed(6)} display={formatDeg(snap.sun.alt, 4)} />
                <CopyValue label="سمت A" value={snap.sun.az.toFixed(6)} display={formatDeg(snap.sun.az, 3)} />
                <CopyValue label="طول دایرة‌البروجی λ" value={snap.sun.lambda.toFixed(6)} display={formatDeg(snap.sun.lambda, 4)} />
                <CopyValue label="عرض دایرة‌البروجی β" value={snap.sun.beta.toFixed(6)} display={formatDeg(snap.sun.beta, 4)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ماه — همین لحظه</CardTitle>
                <CardDescription>{snap.moon.phaseNameFa}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <MoonPhaseDisc illumination={snap.moon.illumination} ageDays={snap.moon.ageDays} />
                </div>
                <CopyValue
                  label="درخشش (بخش روشن)"
                  value={(snap.moon.illumination * 100).toFixed(4)}
                  display={`${toPersianDigits((snap.moon.illumination * 100).toFixed(2))}٪`}
                />
                <CopyValue label="سن هلال (روز)" value={snap.moon.ageDays.toFixed(5)} display={toPersianDigits(snap.moon.ageDays.toFixed(3))} />
                <CopyValue label="میل" value={snap.moon.dec.toFixed(6)} display={formatDeg(snap.moon.dec, 3)} />
                <CopyValue label="بعد" value={snap.moon.ra.toFixed(8)} display={formatHours(snap.moon.ra, 4)} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === "sun" && (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <CopyValue label="δ" value={snap.sun.dec.toFixed(6)} display={formatDeg(snap.sun.dec, 4)} />
            <CopyValue label="α" value={snap.sun.ra.toFixed(8)} display={formatHours(snap.sun.ra, 5)} />
            <CopyValue label="ارتفاع" value={snap.sun.alt.toFixed(6)} display={formatDeg(snap.sun.alt, 4)} />
            <CopyValue label="سمت" value={snap.sun.az.toFixed(6)} display={formatDeg(snap.sun.az, 3)} />
            <CopyValue label="λ" value={snap.sun.lambda.toFixed(6)} display={formatDeg(snap.sun.lambda, 4)} />
            <CopyValue label="β" value={snap.sun.beta.toFixed(6)} display={formatDeg(snap.sun.beta, 4)} />
            <CopyValue label="R (AU)" value={snap.sun.distanceAu.toFixed(8)} display={toPersianDigits(snap.sun.distanceAu.toFixed(6))} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => downloadCsv("sun-day.csv", daySeries)}>
              CSV شبانه‌روز
            </Button>
            <Button size="sm" variant="secondary" onClick={() => downloadCsv("sun-year.csv", yearSeries)}>
              CSV سالانه
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="شبانه‌روز — میل، بعد، λ" desc="UTC hours">
              <SunMultiChart data={daySeries} xKey="label" />
            </ChartCard>
            <ChartCard title="شبانه‌روز — ارتفاع و سمت" desc="برای ناظر فعلی">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={daySeries}>
                  <CartesianGrid stroke="rgba(201,162,39,0.12)" />
                  <XAxis dataKey="label" stroke="#9aa6b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9aa6b8" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="alt" name="ارتفاع" stroke="#6f9e7a" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="az" name="سمت" stroke="#5b7c99" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="سالانه — میل و λ" desc="هر دو روز، ظهر UTC">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={yearSeries}>
                  <CartesianGrid stroke="rgba(201,162,39,0.12)" />
                  <XAxis dataKey="day" stroke="#9aa6b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9aa6b8" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="dec" name="میل δ" stroke="#c9a227" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="lambda" name="λ" stroke="#3d7a7a" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="ra" name="α (ʰ)" stroke="#8b4557" dot={false} strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="سالانه — ارتفاع ظهر" desc="وابسته به عرض ناظر">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={yearSeries}>
                  <CartesianGrid stroke="rgba(201,162,39,0.12)" />
                  <XAxis dataKey="day" stroke="#9aa6b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9aa6b8" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="alt" name="ارتفاع" stroke="#6f9e7a" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="az" name="سمت" stroke="#5b7c99" dot={false} strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {tab === "moon" && (
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>شکل زندهٔ ماه</CardTitle>
              <CardDescription>{snap.moon.phaseNameFa}</CardDescription>
            </CardHeader>
            <CardContent>
              <MoonPhaseDisc illumination={snap.moon.illumination} ageDays={snap.moon.ageDays} size={220} />
            </CardContent>
          </Card>
          <div className="grid gap-2 sm:grid-cols-2">
            <CopyValue label="درخشش" value={(snap.moon.illumination * 100).toFixed(6)} display={`${toPersianDigits((snap.moon.illumination * 100).toFixed(3))}٪`} />
            <CopyValue label="زاویهٔ فاز" value={snap.moon.phaseAngle.toFixed(4)} display={formatDeg(snap.moon.phaseAngle, 3)} />
            <CopyValue label="سن هلال" value={snap.moon.ageDays.toFixed(6)} display={toPersianDigits(snap.moon.ageDays.toFixed(4))} />
            <CopyValue label="فاصله (km)" value={snap.moon.distanceKm.toFixed(2)} display={toPersianDigits(snap.moon.distanceKm.toFixed(1))} />
            <CopyValue label="λ" value={snap.moon.lambda.toFixed(6)} display={formatDeg(snap.moon.lambda, 4)} />
            <CopyValue label="β" value={snap.moon.beta.toFixed(6)} display={formatDeg(snap.moon.beta, 4)} />
            <CopyValue label="α" value={snap.moon.ra.toFixed(8)} display={formatHours(snap.moon.ra, 5)} />
            <CopyValue label="δ" value={snap.moon.dec.toFixed(6)} display={formatDeg(snap.moon.dec, 4)} />
            <CopyValue label="ارتفاع" value={snap.moon.alt.toFixed(6)} display={formatDeg(snap.moon.alt, 3)} />
            <CopyValue label="سمت" value={snap.moon.az.toFixed(6)} display={formatDeg(snap.moon.az, 3)} />
            <CopyValue label="ازدیاد طول از خورشید" value={snap.moon.elongation.toFixed(4)} display={formatDeg(snap.moon.elongation, 3)} />
            <Button
              className="sm:col-span-2"
              variant="outline"
              onClick={() =>
                downloadCsv("moon-live.csv", [
                  {
                    utc: snap.utcIso,
                    illum: snap.moon.illumination,
                    age: snap.moon.ageDays,
                    ra: snap.moon.ra,
                    dec: snap.moon.dec,
                    lambda: snap.moon.lambda,
                    beta: snap.moon.beta,
                    alt: snap.moon.alt,
                    az: snap.moon.az,
                    dist_km: snap.moon.distanceKm,
                    phase: snap.moon.phaseNameFa,
                  },
                ])
              }
            >
              خروجی CSV ماه
            </Button>
          </div>
        </div>
      )}

      {tab === "earth" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>مدار بیضوی زمین حول خورشید</CardTitle>
              <CardDescription>خط‌چین: اعتدال بهاری ♈ · نقطهٔ درخشان: زمین</CardDescription>
            </CardHeader>
            <CardContent>
              <EarthOrbitView earth={snap.earth} />
            </CardContent>
          </Card>
          <div className="grid gap-2 content-start">
            <CopyValue label="طول خورشیدمرکزی زمین" value={snap.earth.heliocentricLon.toFixed(6)} display={formatDeg(snap.earth.heliocentricLon, 4)} />
            <CopyValue label="آنومالی حقیقی" value={snap.earth.trueAnomaly.toFixed(6)} display={formatDeg(snap.earth.trueAnomaly, 4)} />
            <CopyValue label="R (AU)" value={snap.earth.rAu.toFixed(8)} display={toPersianDigits(snap.earth.rAu.toFixed(6))} />
            <CopyValue label="خروج از مرکز e" value={snap.earth.eccentricity.toFixed(8)} display={toPersianDigits(snap.earth.eccentricity.toFixed(7))} />
            <CopyValue label="x (AU)" value={snap.earth.x.toFixed(8)} />
            <CopyValue label="y (AU)" value={snap.earth.y.toFixed(8)} />
            <CopyValue label="ET دقیقهٔ روز" value={snap.et.minutesOfDay.toFixed(6)} display={toPersianDigits(snap.et.minutesOfDay.toFixed(6))} />
            <Button
              variant="outline"
              onClick={() =>
                downloadCsv("earth-orbit.csv", [
                  {
                    utc: snap.utcIso,
                    helio_lon: snap.earth.heliocentricLon,
                    true_anomaly: snap.earth.trueAnomaly,
                    r_au: snap.earth.rAu,
                    e: snap.earth.eccentricity,
                    x: snap.earth.x,
                    y: snap.earth.y,
                    et_minutes: snap.et.minutesOfDay,
                  },
                ])
              }
            >
              خروجی CSV مدار
            </Button>
          </div>
        </div>
      )}

      {tab === "observer" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden p-0">
            <CardHeader>
              <CardTitle>موقعیت شما روی زمین</CardTitle>
              <CardDescription>کرهٔ درخشان کوچک = ناظر</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ObserverGlobe
                lat={lat}
                lon={lon}
                iss={iss ? { lat: iss.lat, lon: iss.lon } : null}
              />
            </CardContent>
          </Card>
          <div className="grid gap-2 content-start">
            <CopyValue label="عرض جغرافیایی" value={lat.toFixed(8)} display={formatDeg(lat, 6)} />
            <CopyValue label="طول جغرافیایی" value={lon.toFixed(8)} display={formatDeg(lon, 6)} />
            <CopyValue
              label="ارتفاع GPS (m)"
              value={altM == null ? "null" : altM.toFixed(3)}
              display={altM == null ? "—" : toPersianDigits(altM.toFixed(2))}
            />
            <CopyValue label="دقت GPS (m)" value={geo.reading?.accuracy?.toFixed(2) ?? "null"} />
            <CopyValue label="LST" value={snap.observer.lst.toFixed(8)} display={formatHours(snap.observer.lst, 6)} />
            <CopyValue label="GMST" value={snap.observer.gmst.toFixed(8)} display={formatHours(snap.observer.gmst, 6)} />
            <Button
              variant="outline"
              onClick={() =>
                downloadCsv("observer.csv", [
                  {
                    utc: snap.utcIso,
                    lat,
                    lon,
                    alt_m: altM,
                    accuracy_m: geo.reading?.accuracy ?? null,
                    lst: snap.observer.lst,
                    gmst: snap.observer.gmst,
                  },
                ])
              }
            >
              خروجی CSV ناظر
            </Button>
          </div>
        </div>
      )}

      {tab === "iss" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden p-0">
            <CardHeader>
              <CardTitle>ISS روی کره</CardTitle>
              <CardDescription>همراه با نقطهٔ ناظر</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ObserverGlobe
                lat={lat}
                lon={lon}
                iss={iss ? { lat: iss.lat, lon: iss.lon } : null}
              />
            </CardContent>
          </Card>
          <div className="grid gap-2 content-start">
            {issError && <p className="text-xs text-[var(--muted)]">{issError}</p>}
            {iss ? (
              <>
                <CopyValue label="عرض ISS" value={iss.lat.toFixed(6)} display={formatDeg(iss.lat, 4)} />
                <CopyValue label="طول ISS" value={iss.lon.toFixed(6)} display={formatDeg(iss.lon, 4)} />
                <CopyValue
                  label="ارتفاع (km)"
                  value={iss.altKm == null ? "null" : iss.altKm.toFixed(3)}
                  display={iss.altKm == null ? "—" : toPersianDigits(iss.altKm.toFixed(2))}
                />
                <CopyValue
                  label="سرعت (km/s)"
                  value={iss.velocityKms == null ? "null" : iss.velocityKms.toFixed(5)}
                  display={
                    iss.velocityKms == null ? "—" : toPersianDigits(iss.velocityKms.toFixed(3))
                  }
                />
                <CopyValue
                  label="سرعت (km/h)"
                  value={
                    iss.velocityKmh == null && iss.velocityKms == null
                      ? "null"
                      : (iss.velocityKmh ?? (iss.velocityKms! * 3600)).toFixed(2)
                  }
                  display={
                    iss.velocityKmh == null && iss.velocityKms == null
                      ? "—"
                      : toPersianDigits(
                          (iss.velocityKmh ?? iss.velocityKms! * 3600).toFixed(1),
                        )
                  }
                />
                <CopyValue label="منبع" value={iss.source} />
                <CopyValue
                  label="زمان داده"
                  value={new Date(iss.timestamp).toISOString()}
                  display={toPersianDigits(
                    new Date(iss.timestamp).toISOString().replace("T", " ").slice(0, 19),
                  )}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={refreshIss}>
                    تازه‌سازی
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      downloadCsv("iss-live.csv", [
                        {
                          timestamp: iss.timestamp,
                          lat: iss.lat,
                          lon: iss.lon,
                          alt_km: iss.altKm,
                          velocity_kms: iss.velocityKms,
                          visibility: iss.visibility,
                          source: iss.source,
                        },
                      ])
                    }
                  >
                    خروجی CSV
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">در حال دریافت موقعیت ISS…</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const tipStyle = {
  background: "#152238",
  border: "1px solid rgba(201,162,39,0.3)",
  borderRadius: 8,
  direction: "rtl" as const,
};

function SunMultiChart({
  data,
  xKey,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(201,162,39,0.12)" />
        <XAxis dataKey={xKey} stroke="#9aa6b8" tick={{ fontSize: 10 }} />
        <YAxis stroke="#9aa6b8" tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={tipStyle} />
        <Legend />
        <Line type="monotone" dataKey="dec" name="δ" stroke="#c9a227" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="ra" name="α" stroke="#8b4557" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="lambda" name="λ" stroke="#3d7a7a" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="beta" name="β" stroke="#5b7c99" dot={false} strokeWidth={1.5} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ChartCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}
