import { ProblemList } from "@/components/problems/ProblemList";

export default function ProblemsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <p className="text-sm text-[var(--teal)]">بانک مسائل · المپیاد و Smart</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          مسائل و راه‌حل‌ها
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-[var(--muted)]">
          هر مسئله یک کرهٔ سه‌بعدی با هندسهٔ دقیق راه‌حل دارد — مثلث PZX، عظیمه/صغیره، زیادى ژیرار. کره را بچرخانید؛ راهنما و پاسخ تشریحی جداگانه باز می‌شوند.
        </p>
      </header>
      <ProblemList />
    </div>
  );
}
