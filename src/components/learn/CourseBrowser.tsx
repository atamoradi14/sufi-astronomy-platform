"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LESSONS, SMART_CHAPTERS, SMART_BOOK } from "@/lib/content/lessons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/utils";

export function CourseBrowser() {
  const [chapter, setChapter] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");

  const list = useMemo(() => {
    return LESSONS.filter((l) => {
      if (chapter !== "all" && l.chapterId !== chapter) return false;
      if (level !== "all" && l.level !== level) return false;
      return true;
    });
  }, [chapter, level]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--panel)]/80 p-4 text-sm leading-8">
        <p className="text-[var(--parchment)]">
          مرجع:{" "}
          <span className="text-[var(--gold-soft)] dir-ltr">
            {SMART_BOOK.author}, {SMART_BOOK.title} ({SMART_BOOK.part}, pp. {SMART_BOOK.pages})
          </span>
          . هر درس بندها، فرمول‌ها و شکل‌های اسمارت را با توضیح فارسی، مثال عددی زنده، تمرین پایان‌فصل و پیوند به کرهٔ سه‌بعدی یا اثبات می‌آورد.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={chapter === "all" ? "default" : "secondary"} onClick={() => setChapter("all")}>
          همهٔ فصل‌ها
        </Button>
        {SMART_CHAPTERS.map((c) => (
          <Button
            key={c.id}
            size="sm"
            variant={chapter === c.id ? "default" : "secondary"}
            onClick={() => setChapter(c.id)}
          >
            {c.roman}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {["all", "مقدماتی", "متوسط", "المپیاد"].map((lv) => (
          <Button
            key={lv}
            size="sm"
            variant={level === lv ? "default" : "outline"}
            onClick={() => setLevel(lv)}
          >
            {lv === "all" ? "همه سطوح" : lv}
          </Button>
        ))}
      </div>

      {chapter === "all" && (
        <div className="grid gap-3 md:grid-cols-2">
          {SMART_CHAPTERS.map((c) => {
            const n = LESSONS.filter((l) => l.chapterId === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setChapter(c.id)}
                className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/50 px-4 py-3 text-right hover:border-[var(--gold)]/45"
              >
                <p className="text-[11px] text-[var(--teal)] dir-ltr text-left">
                  Chapter {c.roman} · pp. {c.pages}
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
                  {c.titleFa}
                </p>
                <p className="text-xs text-[var(--muted)] dir-ltr text-left">{c.titleEn}</p>
                <p className="mt-1 text-[11px] text-[var(--muted)]">
                  {toPersianDigits(n)} درس · {c.sections}
                </p>
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        {list.map((l, i) => (
          <Card key={l.id} id={l.id}>
            <CardHeader className="border-b border-[var(--border)] bg-[var(--ink)]/35">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] text-[var(--teal)] dir-ltr text-left">
                    Smart {l.smart.chapter} {l.smart.sections} · pp. {l.smart.pages}
                  </p>
                  <CardTitle className="mt-1">
                    {toPersianDigits(i + 1)}. {l.titleFa}
                  </CardTitle>
                  <p className="mt-1 text-sm text-[var(--muted)] dir-ltr text-left">{l.titleEn}</p>
                  <CardDescription className="mt-2">{l.summaryFa}</CardDescription>
                </div>
                <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--gold-soft)]">
                  {l.level}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-4">
              <Button asChild size="sm">
                <Link href={`/learn/${l.id}`}>متن کامل درس</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/lab?preset=${l.spherePreset}`}>کره</Link>
              </Button>
              {l.proofId && (
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/proofs?kind=${l.proofId}`}>اثبات</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
