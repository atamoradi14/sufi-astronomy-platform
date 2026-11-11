"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useCompass } from "@/hooks/useCompass";
import {
  equalDistanceCircle,
  greatCirclePath,
  KAABA,
  qiblaBearing,
} from "@/lib/geo/qibla";
import { formatDeg, toPersianDigits } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--ink-deep)] text-[var(--muted)]">
      در حال بارگذاری نقشه…
    </div>
  ),
});

export function TrackerMap() {
  const geo = useGeolocation(true);
  const compass = useCompass();
  const [layer, setLayer] = useState<"street" | "satellite">("satellite");
  const [showQibla, setShowQibla] = useState(true);
  const [showCircles, setShowCircles] = useState(true);
  const [radiusKm, setRadiusKm] = useState(500);

  const reading = geo.reading;
  const heading = compass.heading ?? reading?.heading ?? null;

  const overlays = useMemo(() => {
    if (!reading) return null;
    const qiblaPath = greatCirclePath(reading.lat, reading.lon, KAABA.lat, KAABA.lon, 80);
    const circles = [250, radiusKm, 1500].map((r) => ({
      r,
      pts: equalDistanceCircle(reading.lat, reading.lon, r, 90),
    }));
    return {
      qiblaPath,
      circles,
      bearing: qiblaBearing(reading.lat, reading.lon),
    };
  }, [reading, radiusKm]);

  const speedKmh =
    reading?.speed != null && reading.speed >= 0 ? reading.speed * 3.6 : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>نقشه، حرکت و دایره‌های کروی</CardTitle>
          <CardDescription>
            موقعیت، سرعت و جهت شما روی تصویر ماهواره‌ای؛ مسیر قبله (دایرهٔ عظیمه) و دایره‌های هم‌فاصله حول ناظر.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={layer === "satellite" ? "default" : "secondary"}
              onClick={() => setLayer("satellite")}
            >
              ماهواره
            </Button>
            <Button
              size="sm"
              variant={layer === "street" ? "default" : "secondary"}
              onClick={() => setLayer("street")}
            >
              خیابان
            </Button>
            <Button
              size="sm"
              variant={showQibla ? "default" : "secondary"}
              onClick={() => setShowQibla((v) => !v)}
            >
              مسیر قبله
            </Button>
            <Button
              size="sm"
              variant={showCircles ? "default" : "secondary"}
              onClick={() => setShowCircles((v) => !v)}
            >
              دایره‌های هم‌فاصله
            </Button>
            {compass.needsPermission && (
              <Button size="sm" variant="outline" onClick={() => void compass.requestPermission()}>
                فعال‌سازی قطب‌نما
              </Button>
            )}
          </div>

          <label className="flex items-center gap-3 text-sm text-[var(--muted)]">
            شعاع دایرهٔ میانی
            <input
              type="range"
              min={100}
              max={3000}
              step={50}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="flex-1 accent-[var(--gold)]"
            />
            <span className="text-[var(--parchment)] w-24 text-left">
              {toPersianDigits(radiusKm)} کیلومتر
            </span>
          </label>

          {reading && overlays && (
            <MapInner
              lat={reading.lat}
              lon={reading.lon}
              heading={heading}
              layer={layer}
              showQibla={showQibla}
              showCircles={showCircles}
              qiblaPath={overlays.qiblaPath}
              circles={overlays.circles}
              kaaba={KAABA}
            />
          )}

          {geo.error && (
            <p className="text-sm text-[var(--rose-ink)]">{geo.error}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Telemetry
          label="عرض / طول"
          value={
            reading
              ? `${formatDeg(reading.lat, 4)} ، ${formatDeg(reading.lon, 4)}`
              : "…"
          }
        />
        <Telemetry
          label="سرعت"
          value={
            speedKmh != null
              ? `${toPersianDigits(speedKmh.toFixed(1))} کیلومتر بر ساعت`
              : "ایستا / نامشخص"
          }
        />
        <Telemetry
          label="جهت حرکت / قطب‌نما"
          value={heading != null ? formatDeg(heading, 0) : "—"}
        />
        <Telemetry
          label="سمت قبله"
          value={overlays ? formatDeg(overlays.bearing, 1) : "—"}
        />
      </div>
    </div>
  );
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 px-4 py-3">
      <div className="text-[11px] text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-sm text-[var(--parchment)]">{value}</div>
    </div>
  );
}
