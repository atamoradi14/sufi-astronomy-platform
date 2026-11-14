"use client";

import { useState } from "react";
import { AstroCharts } from "@/components/charts/AstroCharts";
import { LiveChartsHub } from "@/components/charts/LiveChartsHub";

export default function ChartsPage() {
  const [mode, setMode] = useState<"live" | "classic">("live");

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header className="space-y-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          نمودارها و دادهٔ زنده
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          خورشید (δ, α, a, A, λ, β)، ماه با قرص روشن، مدار بیضوی زمین و خط اعتدال، زمان نجومی ET،
          موقعیت درخشان ناظر، ISS زنده — با کپی تک‌کلیک و خروجی CSV.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("live")}
            className={`rounded-lg border px-3 py-2 text-sm ${
              mode === "live"
                ? "border-[var(--gold)]/50 bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            زنده
          </button>
          <button
            type="button"
            onClick={() => setMode("classic")}
            className={`rounded-lg border px-3 py-2 text-sm ${
              mode === "classic"
                ? "border-[var(--gold)]/50 bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            کلاسیک / ستارگان صوفی
          </button>
        </div>
      </header>
      {mode === "live" ? <LiveChartsHub /> : <AstroCharts />}
    </div>
  );
}
