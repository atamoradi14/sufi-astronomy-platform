"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { angularDistanceDeg, equatorialToHorizontal } from "@/lib/astronomy/sphere";
import { formatDeg, formatHours, toPersianDigits } from "@/lib/utils";

export function SphereDemo() {
  const [ra1, setRa1] = useState(11.06);
  const [dec1, setDec1] = useState(61.8);
  const [ra2, setRa2] = useState(11.03);
  const [dec2, setDec2] = useState(56.4);
  const [lat, setLat] = useState(35.7);
  const [lst, setLst] = useState(14);

  const dist = useMemo(
    () => angularDistanceDeg(ra1, dec1, ra2, dec2),
    [ra1, dec1, ra2, dec2],
  );
  const horiz = useMemo(
    () => equatorialToHorizontal(ra1, dec1, lat, lst),
    [ra1, dec1, lat, lst],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>فاصلهٔ زاویه‌ای تعاملی</CardTitle>
          <CardDescription>
            مختصات دو ستاره را تغییر دهید و فاصلهٔ کمانی را ببینید — نمونهٔ پیش‌فرض دُبّه و مراق.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <StarSliders label="ستارهٔ ۱" ra={ra1} dec={dec1} onRa={setRa1} onDec={setDec1} />
          <StarSliders label="ستارهٔ ۲" ra={ra2} dec={dec2} onRa={setRa2} onDec={setDec2} />
          <ResultBox
            label="Δσ"
            value={formatDeg(dist, 2)}
            note="قانون کسینوس‌های کروی"
          />
          <SphereSketch ra1={ra1} dec1={dec1} ra2={ra2} dec2={dec2} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تبدیل استوایی ← افقی</CardTitle>
          <CardDescription>
            با تغییر عرض جغرافیایی و LST، سمت و ارتفاع ستارهٔ ۱ را رصد کنید.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Range
            label="عرض جغرافیایی"
            min={-80}
            max={80}
            step={0.5}
            value={lat}
            onChange={setLat}
            format={(v) => formatDeg(v, 1)}
          />
          <Range
            label="زمان نجومی محلی"
            min={0}
            max={24}
            step={0.05}
            value={lst}
            onChange={setLst}
            format={(v) => formatHours(v, 2)}
          />
          <div className="grid grid-cols-3 gap-2">
            <ResultBox label="HA" value={formatDeg(horiz.ha, 1)} />
            <ResultBox label="ارتفاع" value={formatDeg(horiz.alt, 1)} />
            <ResultBox label="سمت" value={formatDeg(horiz.az, 1)} />
          </div>
          <HorizonSketch az={horiz.az} alt={horiz.alt} />
        </CardContent>
      </Card>
    </div>
  );
}

function StarSliders({
  label,
  ra,
  dec,
  onRa,
  onDec,
}: {
  label: string;
  ra: number;
  dec: number;
  onRa: (v: number) => void;
  onDec: (v: number) => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--ink)]/40 p-3 space-y-3">
      <p className="text-sm text-[var(--gold-soft)]">{label}</p>
      <Range label="بعد (RA)" min={0} max={24} step={0.01} value={ra} onChange={onRa} format={(v) => formatHours(v, 2)} />
      <Range label="میل (Dec)" min={-90} max={90} step={0.1} value={dec} onChange={onDec} format={(v) => formatDeg(v, 1)} />
    </div>
  );
}

function Range({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{label}</span>
        <span className="text-[var(--parchment)]">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--gold)]"
      />
    </label>
  );
}

function ResultBox({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--gold)]/25 bg-[var(--gold)]/5 px-3 py-2 text-center">
      <div className="text-[10px] text-[var(--muted)]">{label}</div>
      <div className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
        {value}
      </div>
      {note && <div className="text-[10px] text-[var(--muted)]">{note}</div>}
    </div>
  );
}

function SphereSketch({
  ra1,
  dec1,
  ra2,
  dec2,
}: {
  ra1: number;
  dec1: number;
  ra2: number;
  dec2: number;
}) {
  const p1 = project(ra1, dec1);
  const p2 = project(ra2, dec2);
  return (
    <svg viewBox="0 0 280 180" className="w-full rounded-lg border border-[var(--border)] bg-[var(--ink-deep)]">
      <ellipse cx="140" cy="90" rx="110" ry="70" fill="none" stroke="rgba(91,124,153,0.5)" />
      <line x1="30" y1="90" x2="250" y2="90" stroke="rgba(201,162,39,0.35)" strokeDasharray="3 4" />
      <path
        d={`M ${p1.x} ${p1.y} Q 140 40 ${p2.x} ${p2.y}`}
        fill="none"
        stroke="rgba(61,122,122,0.9)"
        strokeWidth="1.5"
      />
      <circle cx={p1.x} cy={p1.y} r="4" fill="#e6d39a" />
      <circle cx={p2.x} cy={p2.y} r="4" fill="#e8e2d4" />
      <text x="140" y="170" textAnchor="middle" fill="#9aa6b8" fontSize="10">
        تصویر گرهٔ سماوی — {toPersianDigits("۲")} ستاره
      </text>
    </svg>
  );
}

function project(ra: number, dec: number) {
  const x = 140 + (ra / 24) * 200 - 100;
  const y = 90 - (dec / 90) * 60;
  return { x, y };
}

function HorizonSketch({ az, alt }: { az: number; alt: number }) {
  const r = 60;
  const rad = ((90 - az) * Math.PI) / 180;
  const reach = ((90 - Math.max(-5, Math.min(90, alt))) / 90) * r;
  const x = 100 + reach * Math.cos(rad);
  const y = 100 - reach * Math.sin(rad);
  return (
    <svg viewBox="0 0 200 200" className="mx-auto w-48 rounded-full border border-[var(--border)] bg-[var(--ink-deep)]">
      <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(201,162,39,0.3)" />
      <circle cx="100" cy="100" r="35" fill="none" stroke="rgba(91,124,153,0.35)" />
      <text x="100" y="22" textAnchor="middle" fill="#e6d39a" fontSize="11">
        ش
      </text>
      <text x="100" y="192" textAnchor="middle" fill="#9aa6b8" fontSize="11">
        ج
      </text>
      <line x1="100" y1="100" x2={x} y2={y} stroke="#3d7a7a" strokeWidth="2" />
      <circle cx={x} cy={y} r="5" fill="#e6d39a" />
    </svg>
  );
}
