"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  earthOrbitTrack,
  liveSnapshot,
  moonMonthSeries,
  sunDaySeries,
  sunYearSeries,
  type LiveSnapshot,
} from "@/lib/astronomy/ephemeris";
import { AreaSeries, PlotCard } from "@/components/charts/AstroPlot";
import { useGeolocation } from "@/hooks/useGeolocation";
import { downloadCsv } from "@/lib/charts/csv";
import { formatDeg, formatHours, formatLat, formatLon, toPersianDigits } from "@/lib/utils";
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
  const [issAscending, setIssAscending] = useState(true);
  const prevIssLat = useRef<number | null>(null);

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
      const before = prevIssLat.current;
      if (before != null) {
        const dLat = j.lat - before;
        if (Math.abs(dLat) > 0.02 && Math.abs(dLat) < 15) setIssAscending(dLat > 0);
      }
      prevIssLat.current = j.lat;
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

  const localDayKey = now
    ? new Date(now.getTime() + (lon / 15) * 3_600_000).toISOString().slice(0, 10)
    : "";
  const yearKey = now ? now.getUTCFullYear() : 0;

  const daySeries = useMemo(() => {
    if (!now) return [];
    return sunDaySeries(now, lat, lon, altM);
    // Recompute when the local civil date or the observer changes, not every second.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDayKey, lat, lon, altM]);

  const azPlot = useMemo(() => {
    let prev = daySeries[0]?.az ?? 0;
    let offset = 0;
    return daySeries.map((p, i) => {
      if (i === 0) return p;
      const d = p.az - prev;
      if (d > 180) offset -= 360;
      if (d < -180) offset += 360;
      prev = p.az;
      return { ...p, az: +(p.az + offset).toFixed(3) };
    });
  }, [daySeries]);

  const yearSeries = useMemo(() => {
    if (!yearKey) return [];
    return sunYearSeries(yearKey, lat, lon, altM);
  }, [yearKey, lat, lon, altM]);

  const moonSeries = useMemo(() => {
    if (!now) return [];
    return moonMonthSeries(now, lat, lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDayKey, lat, lon]);

  const orbitTrack = useMemo(() => {
    if (!yearKey) return [];
    return earthOrbitTrack(yearKey);
  }, [yearKey]);

  const subsolar = useMemo(() => {
    if (!snap) return null;
    const lonSun = ((snap.sun.ra - snap.observer.gmst) * 15 + 540) % 360 - 180;
    return { lat: snap.sun.dec, lon: lonSun };
  }, [snap]);

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
              label="ET · دقیقهٔ روز"
              value={snap.et.minutesOfDay.toFixed(6)}
              display={toPersianDigits(snap.et.minutesOfDay.toFixed(6))}
            />
            <CopyValue
              label="ΔT · ثانیه"
              value={snap.et.deltaTSec.toFixed(3)}
              display={toPersianDigits(snap.et.deltaTSec.toFixed(3))}
            />
            <CopyValue label="JD (TT)" value={snap.et.jdTt.toFixed(8)} display={toPersianDigits(snap.et.jdTt.toFixed(8))} />
            <CopyValue label="GMST" value={snap.observer.gmst.toFixed(8)} display={formatHours(snap.observer.gmst, 6)} />
            <CopyValue label="LST" value={snap.observer.lst.toFixed(8)} display={formatHours(snap.observer.lst, 6)} />
            <CopyValue
              label="EoT · معادلهٔ زمان"
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
                <CopyValue label="Dec · میل" value={snap.sun.dec.toFixed(6)} display={formatDeg(snap.sun.dec, 4)} />
                <CopyValue label="RA · بعد" value={snap.sun.ra.toFixed(8)} display={formatHours(snap.sun.ra, 5)} />
                <CopyValue label="alt · ارتفاع" value={snap.sun.alt.toFixed(6)} display={formatDeg(snap.sun.alt, 4)} />
                <CopyValue label="az · سمت" value={snap.sun.az.toFixed(6)} display={formatDeg(snap.sun.az, 3)} />
                <CopyValue label="λ · طول دایرة‌البروجی" value={snap.sun.lambda.toFixed(6)} display={formatDeg(snap.sun.lambda, 4)} />
                <CopyValue label="β · عرض دایرة‌البروجی" value={snap.sun.beta.toFixed(6)} display={formatDeg(snap.sun.beta, 4)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ماه — همین لحظه</CardTitle>
                <CardDescription>{snap.moon.phaseNameFa}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <MoonPhaseDisc illumination={snap.moon.illumination} waxing={snap.moon.waxing} />
                </div>
                <CopyValue
                  label="illum · درخشش"
                  value={(snap.moon.illumination * 100).toFixed(4)}
                  display={`${toPersianDigits((snap.moon.illumination * 100).toFixed(2))}%`}
                />
                <CopyValue label="age · سن هلال" value={snap.moon.ageDays.toFixed(5)} display={toPersianDigits(snap.moon.ageDays.toFixed(3))} />
                <CopyValue label="Dec · میل" value={snap.moon.dec.toFixed(6)} display={formatDeg(snap.moon.dec, 3)} />
                <CopyValue label="RA · بعد" value={snap.moon.ra.toFixed(8)} display={formatHours(snap.moon.ra, 4)} />
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
            <CopyValue label="alt · ارتفاع" value={snap.sun.alt.toFixed(6)} display={formatDeg(snap.sun.alt, 4)} />
            <CopyValue label="az · سمت" value={snap.sun.az.toFixed(6)} display={formatDeg(snap.sun.az, 3)} />
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
            <PlotCard title="ارتفاع خورشید در شبانه‌روز محلی" desc="درجه از افق · خط صورتی = افق · محور افقی ساعت محلی">
              <AreaSeries data={daySeries} xKey="hour" yKey="alt" color="#e6d39a" name="alt" unit="°" zeroLine yLabel="°" />
            </PlotCard>
            <PlotCard title="سمت خورشید در شبانه‌روز" desc="آزیموت از شمال، ساعت‌گرد">
              <AreaSeries data={azPlot} xKey="hour" yKey="az" color="#7eb6e8" name="az" unit="°" yLabel="°" />
            </PlotCard>
            <PlotCard title="میل خورشید در سال" desc="ظهر محلی · محور = روز سال">
              <AreaSeries data={yearSeries} xKey="day" yKey="dec" color="#e6d39a" name="Dec" unit="°" domain={[-24, 24]} yLabel="°" />
            </PlotCard>
            <PlotCard title="طول دایرة‌البروجی در سال" desc="λ از اعتدال بهاری">
              <AreaSeries data={yearSeries} xKey="day" yKey="lambda" color="#7ec8c8" name="λ" unit="°" domain={[0, 360]} yLabel="°" />
            </PlotCard>
            <PlotCard title="بعد خورشید در سال" desc="ساعت اعتدالی">
              <AreaSeries data={yearSeries} xKey="day" yKey="ra" color="#e08aa0" name="RA" unit="h" domain={[0, 24]} yLabel="h" />
            </PlotCard>
            <PlotCard title="ارتفاع ظهر محلی در سال" desc="گذر نصف‌النهار برای عرض شما">
              <AreaSeries data={yearSeries} xKey="day" yKey="alt" color="#8fd4a4" name="alt" unit="°" yLabel="°" />
            </PlotCard>
            <PlotCard title="معادلهٔ زمان در سال" desc="دقیقه · ظاهری منهای میانگین">
              <AreaSeries data={yearSeries} xKey="day" yKey="eot" color="#d4a574" name="EoT" unit="min" zeroLine yLabel="min" />
            </PlotCard>
            <PlotCard title="عرض دایرة‌البروجی خورشید" desc="β تقریباً صفر؛ مقیاس باز شده تا مقدار واقعی دیده شود">
              <AreaSeries data={yearSeries} xKey="day" yKey="beta" color="#9ec4e6" name="β" unit="°" />
            </PlotCard>
          </div>
        </div>
      )}

      {tab === "moon" && (
        <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>شکل زندهٔ ماه</CardTitle>
              <CardDescription>{snap.moon.phaseNameFa}</CardDescription>
            </CardHeader>
            <CardContent>
              <MoonPhaseDisc illumination={snap.moon.illumination} waxing={snap.moon.waxing} size={220} />
            </CardContent>
          </Card>
          <div className="grid gap-2 sm:grid-cols-2">
            <CopyValue label="illum · درخشش" value={(snap.moon.illumination * 100).toFixed(6)} display={`${toPersianDigits((snap.moon.illumination * 100).toFixed(3))}%`} />
            <CopyValue label="phase · زاویهٔ فاز" value={snap.moon.phaseAngle.toFixed(4)} display={formatDeg(snap.moon.phaseAngle, 3)} />
            <CopyValue label="age · سن هلال" value={snap.moon.ageDays.toFixed(6)} display={toPersianDigits(snap.moon.ageDays.toFixed(4))} />
            <CopyValue label="Δ · km" value={snap.moon.distanceKm.toFixed(2)} display={toPersianDigits(snap.moon.distanceKm.toFixed(1))} />
            <CopyValue label="λ" value={snap.moon.lambda.toFixed(6)} display={formatDeg(snap.moon.lambda, 4)} />
            <CopyValue label="β" value={snap.moon.beta.toFixed(6)} display={formatDeg(snap.moon.beta, 4)} />
            <CopyValue label="α" value={snap.moon.ra.toFixed(8)} display={formatHours(snap.moon.ra, 5)} />
            <CopyValue label="δ" value={snap.moon.dec.toFixed(6)} display={formatDeg(snap.moon.dec, 4)} />
            <CopyValue label="alt · ارتفاع" value={snap.moon.alt.toFixed(6)} display={formatDeg(snap.moon.alt, 3)} />
            <CopyValue label="az · سمت" value={snap.moon.az.toFixed(6)} display={formatDeg(snap.moon.az, 3)} />
            <CopyValue label="elong · ازدیاد طول" value={snap.moon.elongation.toFixed(4)} display={formatDeg(snap.moon.elongation, 3)} />
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
        <PlotCard title="روشنایی ماه در ۳۰ روز آینده" desc="درصد سطح روشن · محور = روز از امروز">
          <AreaSeries
            data={moonSeries}
            xKey="day"
            yKey="illum"
            color="#f3ebd4"
            name="illum"
            unit="%"
            domain={[0, 100]}
            yLabel="%"
          />
        </PlotCard>
        </div>
      )}

      {tab === "earth" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>مدار بیضوی زمین حول خورشید</CardTitle>
              <CardDescription>
                خط طلایی: اعتدال‌ها. زمین در مارس روی L = 180° است و در سپتامبر روی L = 0°.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EarthOrbitView earth={snap.earth} track={orbitTrack} />
            </CardContent>
          </Card>
          <div className="grid gap-2 content-start">
            <CopyValue label="L · طول خورشیدمرکزی" value={snap.earth.heliocentricLon.toFixed(6)} display={formatDeg(snap.earth.heliocentricLon, 4)} />
            <CopyValue label="R · AU" value={snap.earth.rAu.toFixed(8)} display={toPersianDigits(snap.earth.rAu.toFixed(6))} />
            <CopyValue label="x · AU" value={snap.earth.x.toFixed(8)} display={toPersianDigits(snap.earth.x.toFixed(6))} />
            <CopyValue label="y · AU" value={snap.earth.y.toFixed(8)} display={toPersianDigits(snap.earth.y.toFixed(6))} />
            <CopyValue label="ET · دقیقهٔ روز" value={snap.et.minutesOfDay.toFixed(6)} display={toPersianDigits(snap.et.minutesOfDay.toFixed(6))} />
            <Button
              variant="outline"
              onClick={() =>
                downloadCsv("earth-orbit.csv", [
                  {
                    utc: snap.utcIso,
                    helio_lon: snap.earth.heliocentricLon,
                    r_au: snap.earth.rAu,
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
                altM={altM}
                iss={iss ? { lat: iss.lat, lon: iss.lon, altKm: iss.altKm, velocityKms: iss.velocityKms } : null}
                subsolar={subsolar}
                ascending={issAscending}
                focus="observer"
              />
            </CardContent>
          </Card>
          <div className="grid gap-2 content-start">
            <CopyValue label="lat · عرض جغرافیایی" value={lat.toFixed(8)} display={formatLat(lat, 6)} />
            <CopyValue label="lon · طول جغرافیایی" value={lon.toFixed(8)} display={formatLon(lon, 6)} />
            <CopyValue
              label="h · ارتفاع GPS"
              value={altM == null ? "null" : altM.toFixed(3)}
              display={altM == null ? "—" : toPersianDigits(altM.toFixed(2))}
            />
            <CopyValue
              label="σ · دقت GPS"
              value={geo.reading?.accuracy == null ? "null" : geo.reading.accuracy.toFixed(2)}
              display={geo.reading?.accuracy == null ? "—" : toPersianDigits(geo.reading.accuracy.toFixed(1))}
            />
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
                altM={altM}
                iss={iss ? { lat: iss.lat, lon: iss.lon, altKm: iss.altKm, velocityKms: iss.velocityKms } : null}
                subsolar={subsolar}
                ascending={issAscending}
                focus="iss"
              />
            </CardContent>
          </Card>
          <div className="grid gap-2 content-start">
            {issError && <p className="text-xs text-[var(--muted)]">{issError}</p>}
            {iss ? (
              <>
                <CopyValue label="lat · عرض ISS" value={iss.lat.toFixed(6)} display={formatLat(iss.lat, 4)} />
                <CopyValue label="lon · طول ISS" value={iss.lon.toFixed(6)} display={formatLon(iss.lon, 4)} />
                <CopyValue
                  label="h · km"
                  value={iss.altKm == null ? "null" : iss.altKm.toFixed(3)}
                  display={iss.altKm == null ? "—" : toPersianDigits(iss.altKm.toFixed(2))}
                />
                <CopyValue
                  label="v · km/s"
                  value={iss.velocityKms == null ? "null" : iss.velocityKms.toFixed(5)}
                  display={
                    iss.velocityKms == null ? "—" : toPersianDigits(iss.velocityKms.toFixed(3))
                  }
                />
                <CopyValue
                  label="v · km/h"
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
