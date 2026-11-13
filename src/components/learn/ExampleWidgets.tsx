"use client";

import { useMemo } from "react";
import { dms, formatDms, nauticalMiles } from "@/lib/astronomy/angle";
import { deg } from "@/lib/astronomy/sphericalTrig";
import { toPersianDigits } from "@/lib/utils";
import type { WorkedExample } from "@/lib/content/lessonTypes";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm">
      <span className="text-[var(--muted)] dir-ltr text-left">{k}</span>
      <span className="font-mono text-[var(--gold-soft)]">{v}</span>
    </div>
  );
}

export function ExampleWidget({ example }: { example: WorkedExample }) {
  if (example.widget === "gc-distance") return <GcDistance />;
  if (example.widget === "pzx") return <PzxDemo />;
  if (example.widget === "rising") return <RisingDemo />;
  if (example.widget === "small-circle") return <SmallCircleDemo />;
  if (example.widget === "haversine") return <GcDistance />;
  return null;
}

/** Smart I §12 numbers. */
function GcDistance() {
  const PA = dms(65, 42);
  const PB = dms(53, 13);
  const APB = dms(100, 57);
  const AB = useMemo(() => deg.cosineLawSide(PA, PB, APB), [PA, PB, APB]);
  // Angle at A is opposite PB (Smart §12 (ii)).
  const A = useMemo(() => deg.angleFromSides(PB, PA, AB), [PA, PB, AB]);
  const havAB = useMemo(() => deg.haversineSide(PA, PB, APB), [PA, PB, APB]);
  const nmi = nauticalMiles(AB);
  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--teal)] dir-ltr text-left">Live check of Smart I §12, Fig. 9</p>
      <Row k="PA, PB, ∠APB" v={`${formatDms(PA, 0)}, ${formatDms(PB, 0)}, ${formatDms(APB, 0)}`} />
      <Row k="AB from (A)" v={`${formatDms(AB, 1)} = ${toPersianDigits(nmi.toFixed(1))} nmi`} />
      <Row k="AB from hav (23)" v={formatDms(havAB, 1)} />
      <Row k="angle at A from (9)" v={formatDms(A, 1)} />
      <p className="text-[11px] text-[var(--muted)]">
        اعداد کتاب با لگاریتم پنج‌رقمی AB = ۸۳°۴۹′٫۸ ≈ ۸۳°۴۹′ و ۵۰۲۸٫۸ مایل دریایی؛ زاویه در A ≈ ۵۲°۱۶′.
      </p>
    </div>
  );
}

function PzxDemo() {
  const phi = 35.7;
  const delta = 16.5;
  const H = 30;
  const z = deg.zenithDistance(phi, delta, H);
  const zHav = deg.zenithHaversine(phi, delta, H);
  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--teal)] dir-ltr text-left">Smart II (3) and (4) · Tehran-like φ</p>
      <Row k="φ, δ, H" v={`${phi}°, ${delta}°, ${H}°`} />
      <Row k="z from (3)" v={formatDms(z, 1)} />
      <Row k="z from hav (4)" v={formatDms(zHav, 1)} />
      <Row k="altitude a = 90°−z" v={formatDms(90 - z, 1)} />
    </div>
  );
}

function RisingDemo() {
  const phi = 40;
  const delta = 15;
  const H0 = deg.risingHourAngle(phi, delta);
  const hours = H0 == null ? null : (2 * H0) / 15;
  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--teal)] dir-ltr text-left">cos H₀ = −tan φ tan δ</p>
      <Row k="φ, δ" v={`${phi}° N, ${delta}°`} />
      <Row k="H₀" v={H0 == null ? "circumpolar / never rises" : formatDms(H0, 1)} />
      <Row k="time above horizon" v={hours == null ? "—" : `${toPersianDigits(hours.toFixed(2))}ʰ`} />
    </div>
  );
}

function SmallCircleDemo() {
  const ly = 20;
  const theta = 50;
  const hx = deg.parallelArc(ly, theta);
  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--teal)] dir-ltr text-left">Smart (2): HX = LY cos θ</p>
      <Row k="LY, θ" v={`${ly}°, ${theta}°`} />
      <Row k="HX" v={formatDms(hx, 1)} />
      <Row k="nautical miles" v={toPersianDigits(nauticalMiles(hx).toFixed(0))} />
    </div>
  );
}
