"use client";

import { useMemo } from "react";
import { useCompass } from "@/hooks/useCompass";
import { useGeolocation } from "@/hooks/useGeolocation";
import { qiblaBearing, qiblaDistanceKm } from "@/lib/geo/qibla";
import { formatDeg, toPersianDigits } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

export function CompassQibla() {
  const geo = useGeolocation(true);
  const compass = useCompass();

  const reading = geo.reading;
  const qibla = useMemo(() => {
    if (!reading) return null;
    return {
      bearing: qiblaBearing(reading.lat, reading.lon),
      distance: qiblaDistanceKm(reading.lat, reading.lon),
    };
  }, [reading]);

  const deviceHeading = compass.heading;
  const relativeQibla =
    qibla && deviceHeading != null
      ? ((qibla.bearing - deviceHeading + 540) % 360) - 180
      : qibla?.bearing ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>قطب‌نما و قبله</CardTitle>
          <CardDescription>
            با GPS و حسگر جهت‌گیری گوشی، سمت قبله نسبت به شما نمایش داده می‌شود. روی اندروید، صفحه را در حالت تمام‌صفحه و قفل‌صفحه خاموش نگه دارید.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {compass.needsPermission && (
            <Button onClick={() => void compass.requestPermission()}>
              فعال‌سازی حسگر قطب‌نما
            </Button>
          )}

          <div className="relative h-72 w-72 compass-ring rounded-full border-2 border-[var(--gold)]/50 bg-[var(--ink-deep)]">
            <div
              className="absolute inset-4 rounded-full border border-[var(--border)] transition-transform duration-200 ease-out"
              style={{
                transform: `rotate(${deviceHeading != null ? -deviceHeading : 0}deg)`,
              }}
            >
              {["ش", "ش‌ش", "ق", "ج‌ش", "ج", "ج‌غ", "غ", "ش‌غ"].map((label, i) => {
                const ang = (i * 45 * Math.PI) / 180;
                const x = 50 + 42 * Math.sin(ang);
                const y = 50 - 42 * Math.cos(ang);
                return (
                  <span
                    key={label}
                    className="absolute text-xs text-[var(--muted)]"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {label}
                  </span>
                );
              })}
              <div className="absolute left-1/2 top-3 h-10 w-1 -translate-x-1/2 rounded bg-[var(--danger)]" />
              <div className="absolute bottom-3 left-1/2 h-8 w-1 -translate-x-1/2 rounded bg-[var(--parchment)]/40" />
            </div>

            {/* Qibla needle relative to device */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
              style={{ transform: `rotate(${relativeQibla}deg)` }}
            >
              <div className="absolute top-8 flex flex-col items-center">
                <Navigation className="h-8 w-8 text-[var(--gold)] fill-[var(--gold)]" />
                <span className="mt-1 rounded bg-[var(--ink)]/80 px-2 text-[10px] text-[var(--gold-soft)]">
                  قبله
                </span>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-[var(--gold)]/30 bg-[var(--panel)] px-3 py-2 text-center">
                <div className="text-[10px] text-[var(--muted)]">جهت دستگاه</div>
                <div className="font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
                  {deviceHeading != null ? formatDeg(deviceHeading, 0) : "—"}
                </div>
              </div>
            </div>
          </div>

          {(compass.error || geo.error) && (
            <p className="text-center text-sm text-[var(--rose-ink)]">
              {compass.error || geo.error}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-4 w-4" /> موقعیت
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="عرض" value={reading ? formatDeg(reading.lat, 4) : "…"} />
            <Stat label="طول" value={reading ? formatDeg(reading.lon, 4) : "…"} />
            <Stat
              label="دقت"
              value={
                reading?.accuracy != null
                  ? `${toPersianDigits(Math.round(reading.accuracy))} متر`
                  : "—"
              }
            />
            <Stat
              label="ارتفاع"
              value={
                reading?.altitude != null
                  ? `${toPersianDigits(Math.round(reading.altitude))} متر`
                  : "—"
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">محاسبهٔ قبله</CardTitle>
            <CardDescription>دایرهٔ عظیمه تا کعبه</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Stat
              label="سمت قبله"
              value={qibla ? formatDeg(qibla.bearing, 1) : "…"}
            />
            <Stat
              label="فاصله"
              value={
                qibla
                  ? `${toPersianDigits(Math.round(qibla.distance).toLocaleString("en-US"))} کیلومتر`
                  : "…"
              }
            />
            <Stat
              label="انحراف از جلو"
              value={
                deviceHeading != null && qibla
                  ? formatDeg(relativeQibla, 1)
                  : "نیاز به قطب‌نما"
              }
            />
            <Stat
              label="مطلق بودن حسگر"
              value={compass.absolute ? "بله" : "نسبی / شبیه‌سازی"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--ink)]/40 px-3 py-2">
      <div className="text-[10px] text-[var(--muted)]">{label}</div>
      <div className="mt-0.5 text-[var(--parchment)]">{value}</div>
    </div>
  );
}
