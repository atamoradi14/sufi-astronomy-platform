"use client";
import { useCallback } from "react";
import { formatDigits } from "@/lib/digits";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useDigitScript,
  LocalizedDigits,
} from "@/components/digits/DigitScript";
import { localizeDigits } from "@/lib/utils";
function tickText(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const abs = Math.abs(value);
    const text =
      abs >= 100 || Number.isInteger(value)
        ? String(Math.round(value * 1000) / 1000)
        : value.toFixed(1);
    return localizeDigits(text);
  }
  return localizeDigits(String(value ?? ""));
}
const tipStyle = {
  background: "var(--panel)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  color: "var(--parchment)",
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
    <LocalizedDigits>
      {
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </CardHeader>
          <CardContent className="pt-3" style={{ height }}>
            {children}
          </CardContent>
        </Card>
      }
    </LocalizedDigits>
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
  const digits = useDigitScript();
  const formatTick = useCallback(
    (value: unknown) => formatDigits(tickText(value), digits),
    [digits],
  );
  const id = `fill-${yKey}-${color.replace("#", "")}`;
  return (
    <LocalizedDigits>
      {
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="var(--muted)"
              tick={{ fontSize: 11, fill: "var(--parchment)" }}
              interval="preserveStartEnd"
              minTickGap={28}
              tickFormatter={formatTick}
            />
            <YAxis
              stroke="var(--muted)"
              tick={{ fontSize: 11, fill: "var(--parchment)" }}
              domain={domain ?? ["auto", "auto"]}
              width={52}
              tickFormatter={formatTick}
              label={
                yLabel
                  ? {
                      value: yLabel,
                      angle: -90,
                      position: "insideLeft",
                      fill: "var(--muted)",
                      fontSize: 11,
                    }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={tipStyle}
              formatter={(value) => {
                const n = typeof value === "number" ? value : Number(value);
                return [
                  `${localizeDigits(Number.isFinite(n) ? n.toFixed(3) : String(value))} ${unit}`,
                  name,
                ];
              }}
            />
            {zeroLine ? (
              <ReferenceLine
                y={0}
                stroke="#e08aa0"
                strokeDasharray="5 4"
                strokeWidth={1.25}
              />
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
      }
    </LocalizedDigits>
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
  const digits = useDigitScript();
  const formatTick = useCallback(
    (value: unknown) => formatDigits(tickText(value), digits),
    [digits],
  );
  return (
    <LocalizedDigits>
      {
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
          >
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="var(--muted)"
              tick={{ fontSize: 11, fill: "var(--parchment)" }}
              minTickGap={28}
              tickFormatter={formatTick}
            />
            <YAxis
              yAxisId="l"
              stroke={aColor}
              tick={{ fontSize: 11, fill: aColor }}
              width={52}
              tickFormatter={formatTick}
            />
            <YAxis
              yAxisId="r"
              orientation="right"
              stroke={bColor}
              tick={{ fontSize: 11, fill: bColor }}
              width={52}
              tickFormatter={formatTick}
            />
            <Tooltip contentStyle={tipStyle} />
            <Line
              yAxisId="l"
              type="monotone"
              dataKey={aKey}
              name={aName}
              stroke={aColor}
              strokeWidth={2.6}
              dot={false}
            />
            <Line
              yAxisId="r"
              type="monotone"
              dataKey={bKey}
              name={bName}
              stroke={bColor}
              strokeWidth={2.4}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      }
    </LocalizedDigits>
  );
}
