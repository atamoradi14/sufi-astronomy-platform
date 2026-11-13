import { CourseBrowser } from "@/components/learn/CourseBrowser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SMART_BOOK } from "@/lib/content/smart";

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="space-y-4">
        <p className="text-sm text-[var(--teal)] dir-ltr text-left">
          {SMART_BOOK.author} · {SMART_BOOK.title} · {SMART_BOOK.part}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          درس‌نامهٔ نجوم کروی
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          نه فصل Part 1 — از مثلثات کروی تا اختلاف‌منظر — با شماره‌گذاری فرمول‌ها، شکل‌های بازسازی‌شده، مثال عددی
          و تمرین پایان‌فصل. هر درس به اثبات و کرهٔ تعاملی وصل است.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/lab">آزمایشگاه کره</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/proofs?kind=cosine">اثبات (A)</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/learn/haversine-example">مثال بند ۱۲</Link>
          </Button>
        </div>
      </header>
      <CourseBrowser />
    </div>
  );
}
