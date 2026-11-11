"use client";

import { useEffect, useMemo, useState } from "react";
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
import { equatorialToHorizontal } from "@/lib/astronomy/sphere";
import { computeAstroClock, sunEquatorial } from "@/lib/astronomy/time";
import { CONSTELLATIONS } from "@/lib/astronomy/constellations";
import { useGeolocation } from "@/hooks/useGeolocation";
import { formatDeg, formatHours, toPersianDigits } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AstroCharts() {
  const geo = useGeolocation(false);
  const lat = geo.reading?.lat ?? 35.6892;
  const lon = geo.reading?.lon ?? 51.389;
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const clock = useMemo(() => computeAstroClock(now, lon), [now, lon]);

  const daySeries = useMemo(() => {
    const points = [];
    for (let h = 0; h < 24; h += 0.5) {
      const d = new Date(now);
      d.setUTCHours(h, 0, 0, 0);
      const sun = sunEquatorial(d);
      const lst = computeAstroClock(d, lon).lst;
      const horiz = equatorialToHorizontal(sun.ra, sun.dec, lat, lst);
      points.push({
        hour: h,
        label: toPersianDigits(h.toFixed(1)),
        dec: Number(sun.dec.toFixed(2)),
        ra: Number(sun.ra.toFixed(3)),
        alt: Number(horiz.alt.toFixed(2)),
        az: Number(horiz.az.toFixed(1)),
      });
    }
    return points;
  }, [now, lat, lon]);

  const starSeries = useMemo(() => {
    const stars = CONSTELLATIONS.flatMap((c) =>
      c.stars.slice(0, 2).map((s) => ({
        name: s.nameFa,
        ra: Number(s.ra.toFixed(2)),
        dec: Number(s.dec.toFixed(1)),
      })),
    );
    return stars;
  }, []);

  const events = useMemo(() => {
    const rises: string[] = [];
    const sets: string[] = [];
    for (let i = 1; i < daySeries.length; i++) {
      const a = daySeries[i - 1];
      const b = daySeries[i];
      if (a.alt < 0 && b.alt >= 0) {
        rises.push(`طلوع تقریبی خورشید حوالی ${toPersianDigits(b.hour.toFixed(1))} UTC`);
      }
      if (a.alt >= 0 && b.alt < 0) {
        sets.push(`غروب تقریبی خورشید حوالی ${toPersianDigits(b.hour.toFixed(1))} UTC`);
      }
    }
    return [...rises, ...sets];
  }, [daySeries]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ClockStat label="روز ژولیوسی" value={toPersianDigits(clock.jd.toFixed(4))} />
        <ClockStat label="GMST" value={formatHours(clock.gmst, 3)} />
        <ClockStat label="LST" value={formatHours(clock.lst, 3)} />
        <ClockStat
          label="معادلهٔ زمان"
          value={`${toPersianDigits(clock.eotMin.toFixed(1))} دقیقه`}
        />
        <ClockStat label="بعد خورشید" value={formatHours(clock.solarRa, 3)} />
        <ClockStat label="میل خورشید" value={formatDeg(clock.solarDec, 2)} />
        <ClockStat
          label="UTC"
          value={toPersianDigits(
            now.toISOString().replace("T", " ").slice(0, 19),
          )}
        />
        <ClockStat
          label="مکان ناظر"
          value={`${formatDeg(lat, 2)} ، ${formatDeg(lon, 2)}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="میل و بعد خورشید در شبانه‌روز" desc="Declination & Right Ascension">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={daySeries}>
              <CartesianGrid stroke="rgba(201,162,39,0.12)" />
              <XAxis dataKey="label" stroke="#9aa6b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9aa6b8" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#152238",
                  border: "1px solid rgba(201,162,39,0.3)",
                  borderRadius: 8,
                  direction: "rtl",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="dec" name="میل (°)" stroke="#c9a227" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="ra" name="بعد (ʰ)" stroke="#3d7a7a" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ارتفاع و سمت خورشید" desc="Altitude & Azimuth برای ناظر">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={daySeries}>
              <CartesianGrid stroke="rgba(201,162,39,0.12)" />
              <XAxis dataKey="label" stroke="#9aa6b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9aa6b8" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#152238",
                  border: "1px solid rgba(201,162,39,0.3)",
                  borderRadius: 8,
                  direction: "rtl",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="alt" name="ارتفاع (°)" stroke="#6f9e7a" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="az" name="سمت (°)" stroke="#5b7c99" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="نمونه‌ای از ستارگان صوفی — بعد در برابر میل" desc="Right Ascension vs Declination">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={starSeries}>
            <CartesianGrid stroke="rgba(201,162,39,0.12)" />
            <XAxis
              dataKey="ra"
              name="RA"
              type="number"
              domain={[0, 24]}
              stroke="#9aa6b8"
              tick={{ fontSize: 10 }}
              label={{ value: "RA (ʰ)", position: "insideBottom", offset: -2, fill: "#9aa6b8" }}
            />
            <YAxis
              dataKey="dec"
              type="number"
              domain={[-40, 70]}
              stroke="#9aa6b8"
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              formatter={(value, name) => [value, name === "dec" ? "میل" : "بعد"]}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.name ?? ""
              }
              contentStyle={{
                background: "#152238",
                border: "1px solid rgba(201,162,39,0.3)",
                borderRadius: 8,
                direction: "rtl",
              }}
            />
            <Line
              type="monotone"
              dataKey="dec"
              name="میل"
              stroke="#e6d39a"
              strokeWidth={0}
              dot={{ r: 5, fill: "#c9a227", stroke: "#e6d39a" }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card>
        <CardHeader>
          <CardTitle>رویدادهای تقریبی</CardTitle>
          <CardDescription>بر اساس عبور ارتفاع خورشید از افق برای مکان فعلی</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">رویدادی در این نمونه‌گیری یافت نشد.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {events.map((e) => (
                <li
                  key={e}
                  className="rounded-md border border-[var(--border)] bg-[var(--ink)]/40 px-3 py-2"
                >
                  {e}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ClockStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/85 px-4 py-3">
      <div className="text-[11px] text-[var(--muted)]">{label}</div>
      <div className="mt-1 font-[family-name:var(--font-display)] text-[var(--gold-soft)]">
        {value}
      </div>
    </div>
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
