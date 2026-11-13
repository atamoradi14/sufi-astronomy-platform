"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lesson } from "@/lib/content/lessonTypes";
import { chapterOf } from "@/lib/content/lessons";
import { SMART_BOOK } from "@/lib/content/smart";
import { BookFigure } from "./BookFigures";
import { ExampleWidget } from "./ExampleWidgets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";

export function LessonArticle({ lesson }: { lesson: Lesson }) {
  const [lang, setLang] = useState<"fa" | "both">("both");
  const ch = chapterOf(lesson);

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm text-[var(--teal)] dir-ltr text-left">
          Smart Ch. {lesson.smart.chapter} · {lesson.smart.sections} · pp. {lesson.smart.pages}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          {lesson.titleFa}
        </h1>
        <p className="text-sm text-[var(--muted)] dir-ltr text-left">{lesson.titleEn}</p>
        <p className="max-w-3xl text-sm leading-8 text-[var(--parchment)]/90">{lesson.summaryFa}</p>
        {lang === "both" && (
          <p className="max-w-3xl text-sm leading-7 text-[var(--muted)] dir-ltr text-left">
            {lesson.summaryEn}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--gold-soft)]">
            {lesson.level}
          </span>
          <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)]">
            ≈ {toPersianDigits(lesson.minutes)} دقیقه
          </span>
          <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)]">
            {lesson.olympiad}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={`/lab?preset=${lesson.spherePreset}`}>تجسم سه‌بعدی</Link>
          </Button>
          {lesson.proofId && (
            <Button asChild size="sm" variant="outline">
              <Link href={`/proofs?kind=${lesson.proofId}`}>اثبات گام‌به‌گام</Link>
            </Button>
          )}
          <Button asChild size="sm" variant="secondary">
            <Link href="/learn">فهرست فصل‌ها</Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => setLang((l) => (l === "both" ? "fa" : "both"))}>
            {lang === "both" ? "فقط فارسی" : "فارسی + English"}
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">مرجع</CardTitle>
          <CardDescription className="dir-ltr text-left">
            {SMART_BOOK.author}, {SMART_BOOK.title} ({SMART_BOOK.part})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-8">
          <p>
            فصل {ch?.roman} — {ch?.titleFa} (ص. {ch?.pages}). بندهای {lesson.smart.sections}، صفحات{" "}
            {lesson.smart.pages}.
          </p>
          {lesson.smart.formulae && lesson.smart.formulae.length > 0 && (
            <p className="dir-ltr text-left text-[var(--teal)]">
              Formulae {lesson.smart.formulae.join(", ")}
              {lesson.smart.figures?.length ? ` · Figs. ${lesson.smart.figures.join(", ")}` : ""}
            </p>
          )}
          <p className="text-[var(--muted)]">{SMART_BOOK.noteFa}</p>
        </CardContent>
      </Card>

      {lesson.figures.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {lesson.figures.map((id) => (
            <BookFigure key={id} id={id} />
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg dir-ltr text-left">Formulae</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {lesson.formulas.map((f) => (
            <div
              key={f.display}
              className="rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/5 px-3 py-2"
            >
              <p className="font-mono text-xs leading-6 text-[var(--gold-soft)] dir-ltr text-left">
                {f.number ? `${f.number}  ` : ""}
                {f.display}
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                {f.nameFa}
                {lang === "both" ? ` · ${f.nameEn}` : ""}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {lesson.sections.map((s) => (
        <section key={s.headingEn} className="space-y-2 border-t border-[var(--border)] pt-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
            {s.headingFa}
          </h2>
          {lang === "both" && (
            <p className="text-xs text-[var(--muted)] dir-ltr text-left">{s.headingEn}</p>
          )}
          <p className="text-sm leading-8 text-[var(--parchment)]/90">{s.bodyFa}</p>
          {lang === "both" && (
            <p className="text-sm leading-7 text-[var(--muted)] dir-ltr text-left">{s.bodyEn}</p>
          )}
          {s.formula && (
            <p className="rounded-md border border-[var(--teal)]/35 bg-[var(--teal)]/10 px-3 py-2 font-mono text-xs text-[var(--gold-soft)] dir-ltr text-left">
              {s.formula}
            </p>
          )}
        </section>
      ))}

      {lesson.example && (
        <Card>
          <CardHeader>
            <CardTitle>{lesson.example.titleFa}</CardTitle>
            <CardDescription className="dir-ltr text-left">
              {lesson.example.titleEn} · {lesson.example.source}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-8">
            <p>
              <span className="text-[var(--gold-soft)]">داده: </span>
              {lesson.example.givenFa}
            </p>
            {lang === "both" && (
              <p className="text-[var(--muted)] dir-ltr text-left">Given: {lesson.example.givenEn}</p>
            )}
            <p>
              <span className="text-[var(--gold-soft)]">خواسته: </span>
              {lesson.example.findFa}
            </p>
            <ol className="list-decimal space-y-2 pr-5">
              {lesson.example.steps.map((st) => (
                <li key={st.en}>
                  {st.fa}
                  {st.formula && (
                    <span className="mt-1 block font-mono text-xs text-[var(--teal)] dir-ltr text-left">
                      {st.formula}
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="rounded-md border border-[var(--gold)]/30 px-3 py-2">
              {lesson.example.resultFa}
            </p>
            {lesson.example.widget && <ExampleWidget example={lesson.example} />}
          </CardContent>
        </Card>
      )}

      {lesson.exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>تمرین‌ها</CardTitle>
            <CardDescription>از پایان فصل اسمارت یا تعمیم المپیادی همان بندها</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lesson.exercises.map((ex, i) => (
              <div key={ex.textEn} className="space-y-1 border-t border-[var(--border)] pt-3 first:border-0 first:pt-0">
                <p className="text-sm leading-8">
                  {toPersianDigits(i + 1)}. {ex.textFa}
                </p>
                {lang === "both" && (
                  <p className="text-xs leading-6 text-[var(--muted)] dir-ltr text-left">{ex.textEn}</p>
                )}
                <p className="text-[11px] text-[var(--teal)] dir-ltr text-left">{ex.source}</p>
                {ex.answer && (
                  <p className="font-mono text-xs text-[var(--gold-soft)] dir-ltr text-left">
                    Ans. {ex.answer}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </article>
  );
}
