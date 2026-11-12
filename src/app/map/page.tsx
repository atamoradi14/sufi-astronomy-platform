import { TrackerMap } from "@/components/map/TrackerMap";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          نقشه، سرعت و دایره‌های زمینی
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-[var(--muted)]">
          پایش موقعیت، سرعت و جهت روی لایهٔ ماهواره‌ای؛ رسم مسیر قبله و دایره‌های هم‌فاصله به‌عنوان نمونه‌های زندهٔ هندسهٔ کروی.
        </p>
      </header>
      <TrackerMap />
    </div>
  );
}
