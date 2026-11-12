import { AstroCharts } from "@/components/charts/AstroCharts";

export default function ChartsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          نمودارها و زمان نجومی
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-[var(--muted)]">
          میل، بعد، سمت، ارتفاع، روز ژولیوسی، زمان نجومی و رویدادهای تقریبی طلوع و غروب.
        </p>
      </header>
      <AstroCharts />
    </div>
  );
}
