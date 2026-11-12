import { CourseBrowser } from "@/components/learn/CourseBrowser";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="space-y-4">
        <p className="text-sm text-[var(--teal)]">
          Comprehensive curriculum · Smart + Iranian olympiad
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          درس‌نامهٔ نجوم کروی
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          هر درس شامل صورت انگلیسی فرمول‌ها (مطابق مرجع)، توضیح فارسی، و پیوند مستقیم به کرهٔ تعاملی یا اثبات است.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/lab">آزمایشگاه کره</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/proofs?kind=girard">مساحت / Girard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/sky">آسمان زنده</Link>
          </Button>
        </div>
      </header>
      <CourseBrowser />
    </div>
  );
}
