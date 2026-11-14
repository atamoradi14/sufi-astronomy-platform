"use client";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { LiveChartsHub } from "@/components/charts/LiveChartsHub";
export default function ChartsPage() {
  return (
    <LocalizedDigits>
      {
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
          <header className="space-y-3">
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
              داده های لایو
            </h1>
            <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
              مختصات خورشید و ماه از مدل VSOP/ELP (astronomy-engine)، زمان زمینی
              TT، مدار واقعی زمین، قرص ماه، و ISS. هر کمیت روی محور خودش است.
              کلید نمایش اعداد در بالای صفحه، قالب فارسی یا انگلیسی را انتخاب
              می‌کند. کلیک = کپی، و CSV جدا برای هر سری.
            </p>
          </header>
          <LiveChartsHub />
        </div>
      }
    </LocalizedDigits>
  );
}
