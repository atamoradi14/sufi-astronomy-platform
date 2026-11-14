"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDigitScript } from "@/components/digits/DigitScript";
import { localizeDigits } from "@/lib/utils";

function tickText(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const abs = Math.abs(value);
    const text = abs >= 100 || Number.isInteger(value) ? String(Math.round(value * 1000) / 1000) : value.toFixed(1);
    return localizeDigits(text);
  }
  return localizeDigits(String(value ?? ""));
}

const tipStyle = {
  background: "#101a2c",
  border: "1px solid rgba(230,211,154,0.35)",
  borderRadius: 10,
  color: "#e8e2d4",
  fontSize: 12,
};

export function PlotCard({
  title,
  desc,
  children,
  height = 320,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="pt-3" style={{ height }}>
        {children}
      </CardContent>
    </Card>
  );
}

export function AreaSeries({
  data,
  xKey,
  yKey,
  color,
  name,
  unit,
  domain,
  zeroLine,
  yLabel,
}: {
  data: object[];
  xKey: string;
  yKey: string;
  color: string;
  name: string;
  unit: string;
  domain?: [number | string, number | string];
  zeroLine?: boolean;
  yLabel?: string;
}) {
  useDigitScript();
  const id = `fill-${yKey}-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(154,166,184,0.16)" vertical={false} />
        <XAxis
          dataKey={xKey}
          stroke="#9aa6b8"
          tick={{ fontSize: 11, fill: "#c5d0de" }}
          interval="preserveStartEnd"
          minTickGap={28}
          tickFormatter={tickText}
        />
        <YAxis
          stroke="#9aa6b8"
          tick={{ fontSize: 11, fill: "#c5d0de" }}
          domain={domain ?? ["auto", "auto"]}
          width={52}
          tickFormatter={tickText}
          label={
            yLabel
              ? { value: yLabel, angle: -90, position: "insideLeft", fill: "#9aa6b8", fontSize: 11 }
              : undefined
          }
        />
        <Tooltip
          contentStyle={tipStyle}
          formatter={(value) => {
            const n = typeof value === "number" ? value : Number(value);
            return [`${localizeDigits(Number.isFinite(n) ? n.toFixed(3) : String(value))} ${unit}`, name];
          }}
        />
        {zeroLine ? (
          <ReferenceLine y={0} stroke="#e08aa0" strokeDasharray="5 4" strokeWidth={1.25} />
        ) : null}
        <Area
          type="monotone"
          dataKey={yKey}
          name={name}
          stroke={color}
          strokeWidth={2.6}
          fill={`url(#${id})`}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function DualLine({
  data,
  xKey,
  aKey,
  bKey,
  aName,
  bName,
  aColor,
  bColor,
}: {
  data: object[];
  xKey: string;
  aKey: string;
  bKey: string;
  aName: string;
  bName: string;
  aColor: string;
  bColor: string;
}) {
  useDigitScript();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid stroke="rgba(154,166,184,0.16)" vertical={false} />
        <XAxis dataKey={xKey} stroke="#9aa6b8" tick={{ fontSize: 11, fill: "#c5d0de" }} minTickGap={28} tickFormatter={tickText} />
        <YAxis yAxisId="l" stroke={aColor} tick={{ fontSize: 11, fill: aColor }} width={52} tickFormatter={tickText} />
        <YAxis yAxisId="r" orientation="right" stroke={bColor} tick={{ fontSize: 11, fill: bColor }} width={52} tickFormatter={tickText} />
        <Tooltip contentStyle={tipStyle} />
        <Line yAxisId="l" type="monotone" dataKey={aKey} name={aName} stroke={aColor} strokeWidth={2.6} dot={false} />
        <Line yAxisId="r" type="monotone" dataKey={bKey} name={bName} stroke={bColor} strokeWidth={2.4} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
