import { ProblemList } from "@/components/problems/ProblemList";

export default function ProblemsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          مسائل و راه‌حل‌ها
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-[var(--muted)]">
          تمرین‌های طبقه‌بندی‌شده با راهنما و پاسخ تشریحی برای تثبیت مفاهیم ریاضیات کروی و نجوم رصدی.
        </p>
      </header>
      <ProblemList />
    </div>
  );
}
