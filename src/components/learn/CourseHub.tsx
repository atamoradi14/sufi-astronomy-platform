"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  COURSE_TABS,
  LEARNING_PATH,
  focusChapters,
  focusExamples,
  focusLessons,
  focusProblems,
  focusProofs,
  type CourseTab,
} from "@/lib/content/curriculum";
import { SMART_BOOK } from "@/lib/content/smart";
import { ProblemList } from "@/components/problems/ProblemList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";
import dynamic from "next/dynamic";

const SphereLab = dynamic(
  () => import("@/components/sphere/SphereLab").then((m) => m.SphereLab),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted)]">
        بارگذاری کرهٔ تعاملی…
      </div>
    ),
  },
);

export function CourseHub({ initialTab = "path" }: { initialTab?: CourseTab }) {
  const [tab, setTab] = useState<CourseTab>(initialTab);
  const chapters = focusChapters();
  const lessons = focusLessons();
  const examples = focusExamples();
  const problems = focusProblems();
  const proofs = focusProofs();

  const lessonCountByCh = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of lessons) m.set(l.chapterId, (m.get(l.chapterId) ?? 0) + 1);
    return m;
  }, [lessons]);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm text-[var(--teal)] dir-ltr text-left">
          {SMART_BOOK.author} · Chapters I–III · pp. 1–73
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          درس‌نامهٔ متمرکز · فصل‌های ۱ تا ۳
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          مسیر گام‌به‌گام المپیادی روی مثلثات کروی، کرهٔ سماوی و شکست جوّی — با دروس، مثال‌های عددی
          کتاب، مسائل شکل‌دار، اثبات‌ها و کرهٔ سه‌بعدی در یک فهرست واحد.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="بخش‌های درس‌نامه"
        className="flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)]/60 p-2"
      >
        {COURSE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              tab === t.id
                ? "bg-[var(--gold)]/20 text-[var(--gold-soft)] border border-[var(--gold)]/45"
                : "text-[var(--muted)] hover:text-[var(--parchment)] border border-transparent"
            }`}
          >
            {t.labelFa}
          </button>
        ))}
      </div>

      {tab === "path" && (
        <div className="space-y-4">
          {LEARNING_PATH.map((block, i) => {
            const ch = chapters.find((c) => c.id === block.chapterId);
            return (
              <Card key={block.chapterId}>
                <CardHeader>
                  <p className="text-[11px] text-[var(--teal)] dir-ltr text-left">
                    Stage {i + 1} · Chapter {ch?.roman} · pp. {ch?.pages}
                  </p>
                  <CardTitle className="text-xl">
                    {ch?.titleFa}{" "}
                    <span className="text-sm font-normal text-[var(--muted)]">
                      ({toPersianDigits(block.lessonIds.length)} درس)
                    </span>
                  </CardTitle>
                  <CardDescription>{block.goalFa}</CardDescription>
                  <p className="text-xs text-[var(--muted)] dir-ltr text-left">{block.goalEn}</p>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {block.lessonIds.map((id, j) => {
                      const les = lessons.find((l) => l.id === id);
                      if (!les) return null;
                      return (
                        <li
                          key={id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2"
                        >
                          <div>
                            <p className="text-sm text-[var(--parchment)]">
                              {toPersianDigits(j + 1)}. {les.titleFa}
                            </p>
                            <p className="text-[11px] text-[var(--muted)] dir-ltr text-left">
                              {les.titleEn} · {les.smart.sections}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm">
                              <Link href={`/learn/${les.id}`}>درس</Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/lab?preset=${les.spherePreset}`}>۳بعدی</Link>
                            </Button>
                            {les.proofId && (
                              <Button asChild size="sm" variant="secondary">
                                <Link href={`/proofs?kind=${les.proofId}`}>اثبات</Link>
                              </Button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "lessons" && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {chapters.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/40 px-4 py-3"
              >
                <p className="text-[11px] text-[var(--teal)] dir-ltr text-left">
                  Ch. {c.roman} · {c.pages}
                </p>
                <p className="mt-1 text-[var(--gold-soft)]">{c.titleFa}</p>
                <p className="text-xs text-[var(--muted)]">
                  {toPersianDigits(lessonCountByCh.get(c.id) ?? 0)} درس
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {lessons.map((l) => (
              <Link
                key={l.id}
                href={`/learn/${l.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/50 p-4 transition-colors hover:border-[var(--gold)]/45"
              >
                <p className="text-[11px] text-[var(--teal)] dir-ltr text-left">
                  Smart {l.smart.chapter} · {l.smart.sections} · pp. {l.smart.pages}
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
                  {l.titleFa}
                </p>
                <p className="text-xs text-[var(--muted)] dir-ltr text-left">{l.titleEn}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--parchment)]/85">
                  {l.summaryFa}
                </p>
                <p className="mt-2 text-[11px] text-[var(--gold-soft)]">
                  {l.level} · ≈ {toPersianDigits(l.minutes)} دقیقه
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {tab === "examples" && (
        <div className="space-y-3">
          {examples.map((ex) => (
            <Card key={ex.example.id}>
              <CardHeader>
                <CardTitle className="text-lg">{ex.example.titleFa}</CardTitle>
                <CardDescription className="dir-ltr text-left">
                  {ex.example.titleEn} · {ex.example.source}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm leading-8">
                <p>
                  <span className="text-[var(--gold-soft)]">درس: </span>
                  {ex.lessonTitleFa}
                </p>
                <p>
                  <span className="text-[var(--gold-soft)]">داده: </span>
                  {ex.example.givenFa}
                </p>
                <p>
                  <span className="text-[var(--gold-soft)]">خواسته: </span>
                  {ex.example.findFa}
                </p>
                <ol className="list-decimal space-y-1 pr-5">
                  {ex.example.steps.map((s) => (
                    <li key={s.en}>
                      {s.fa}
                      {s.formula && (
                        <span className="mt-1 block font-mono text-xs text-[var(--teal)] dir-ltr text-left">
                          {s.formula}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
                <p className="rounded-md border border-[var(--gold)]/30 px-3 py-2">
                  {ex.example.resultFa}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm">
                    <Link href={`/learn/${ex.lessonId}`}>متن کامل درس</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/lab?preset=${ex.spherePreset}`}>تجسم سه‌بعدی</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "problems" && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--muted)]">
            {toPersianDigits(problems.length)} مسئله از فصل‌های ۱–۳ با شکل سه‌بعدی و راه‌حل تشریحی.
          </p>
          <ProblemList problems={problems} />
        </div>
      )}

      {tab === "proofs" && (
        <div className="grid gap-3 md:grid-cols-2">
          {proofs.map((p) => (
            <Link
              key={p.kind}
              href={`/proofs?kind=${p.kind}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/50 p-4 hover:border-[var(--gold)]/45"
            >
              <p className="text-[11px] text-[var(--teal)] dir-ltr text-left">{p.source}</p>
              <p className="mt-1 text-lg text-[var(--gold-soft)]">{p.titleFa}</p>
              <p className="text-xs text-[var(--muted)] dir-ltr text-left">{p.titleEn}</p>
              <p className="mt-2 text-[11px] text-[var(--muted)]">
                {toPersianDigits(p.steps.length)} گام اثبات
              </p>
            </Link>
          ))}
        </div>
      )}

      {tab === "lab" && (
        <div className="space-y-3">
          <p className="text-sm leading-8 text-[var(--muted)]">
            لایه‌ها را روشن/خاموش کنید، نقاط A,B,C را بکشید، و اضلاع/زوایا را زنده اندازه بگیرید. پیش‌فرض‌ها
            با مسیر یادگیری فصل‌های ۱–۲ هم‌خوان‌اند.
          </p>
          <SphereLab />
        </div>
      )}
    </div>
  );
}
