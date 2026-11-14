"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lesson } from "@/lib/content/lessonTypes";
import { chapterOf, LESSONS } from "@/lib/content/lessons";
import { PROOFS } from "@/lib/content/proofs";
import { BookFigure } from "./BookFigures";
import { ExampleWidget } from "./ExampleWidgets";
import { Button } from "@/components/ui/button";
import { MathBlock } from "@/components/ui/MathBlock";
import { ArrowLeft, BookOpen, Box, Languages } from "lucide-react";

type Language = "fa" | "en" | "both";
export function LessonArticle({ lesson }: { lesson: Lesson }) {
  const [lang, setLang] = useState<Language>("both");
  const fa = lang !== "en",
    en = lang !== "fa";
  const ch = chapterOf(lesson);
  const proof = PROOFS.find((p) => p.kind === lesson.proofId);
  const siblings = LESSONS.filter((l) => l.chapterId === lesson.chapterId);
  const index = siblings.findIndex((l) => l.id === lesson.id);
  return (
    <article
      className="lesson-layout"
      dir={lang === "en" ? "ltr" : "rtl"}
      lang={lang === "en" ? "en" : "fa"}
    >
      <div className="lesson-body space-y-7">
        <header className="space-y-5 pb-3">
          <p className="study-kicker" dir="ltr">
            SMART / CHAPTER {lesson.smart.chapter} / {lesson.smart.sections}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl leading-relaxed text-[var(--gold-soft)] md:text-4xl">
            {fa ? lesson.titleFa : lesson.titleEn}
          </h1>
          {fa && en && (
            <p dir="ltr" className="text-lg text-[var(--muted)]">
              {lesson.titleEn}
            </p>
          )}
          {fa && <p className="text-sm leading-8">{lesson.summaryFa}</p>}
          {en && (
            <p dir="ltr" className="lesson-english text-sm">
              {lesson.summaryEn}
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            <Button size="sm" asChild>
              <Link href={`/lab?preset=${lesson.spherePreset}`}>
                <Box size={15} />
                {fa ? "آزمایش روی کره" : "Explore on the sphere"}
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/learn">
                <BookOpen size={15} />
                {fa ? "همهٔ درس‌ها" : "All lessons"}
              </Link>
            </Button>
            <label className="flex gap-2 items-center text-xs">
              <Languages size={16} />
              <span className="sr-only">Language / زبان</span>
              <select
                className="control-input"
                aria-label="Language / زبان"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                <option value="both">فارسی + English</option>
                <option value="fa">فارسی</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </header>
        <section
          id="notation"
          className="rounded-2xl border border-[var(--teal)]/25 bg-[var(--teal)]/5 p-5 text-sm leading-8"
        >
          <h2 className="font-bold text-[var(--teal)]">
            {fa
              ? "پیش از شروع: نماد و واحد"
              : "Before you begin: notation and units"}
          </h2>
          {fa && (
            <p>
              {lesson.chapterId === "ch1"
                ? "a، b، c اضلاع زاویه‌ای و A، B، C زاویه‌های رأس مقابل‌اند. طول کمان برابر شعاع ضرب در زاویهٔ رادیانی است. مثلث معمول را محدب و غیرمنحط با کمان‌های کوتاه می‌گیریم."
                : "φ عرض شمالی مثبت، δ میل شمالی مثبت، H زاویهٔ ساعتی به غرب مثبت، h ارتفاع و z فاصلهٔ سمت‌الرأسی است. سمت A از شمال به شرق است. در شکست جو، ζ فاصلهٔ سمت‌الرأسی مشاهده‌شده است."}
            </p>
          )}
          {en && (
            <p dir="ltr" className="lesson-english">
              {lesson.chapterId === "ch1"
                ? "a,b,c are angular sides; A,B,C are opposite vertex angles. Arc length is radius times angle in radians. We use ordinary convex, nondegenerate triangles of minor arcs."
                : "φ is north-positive latitude, δ north-positive declination, H west-positive hour angle, h altitude, z zenith distance. Azimuth A runs north through east. In refraction, ζ is observed zenith distance."}
            </p>
          )}
        </section>
        <section id="formulae" className="space-y-3">
          <h2 className="text-xl text-[var(--gold-soft)]">
            {fa ? "روابط اصلی" : "Key identities"}
          </h2>
          {lesson.formulas.map((f, i) => (
            <div key={i} className="space-y-2">
              <MathBlock label={f.nameEn}>{f.tex ?? f.display}</MathBlock>
              <p className="px-2 text-xs text-[var(--muted)]">
                {fa && f.nameFa}
                {fa && en && " · "}
                {en && f.nameEn}
              </p>
            </div>
          ))}
        </section>
        {lesson.sections.map((s, i) => (
          <section
            id={`section-${i}`}
            className="lesson-section space-y-3"
            key={s.headingEn}
          >
            <p className="study-kicker">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="text-xl font-[family-name:var(--font-display)] text-[var(--gold-soft)]">
              {fa ? s.headingFa : s.headingEn}
            </h2>
            {fa && <p className="text-sm">{s.bodyFa}</p>}
            {en && (
              <div className="lesson-english text-sm" dir="ltr">
                {fa && <h3 className="mb-2 font-semibold">{s.headingEn}</h3>}
                <p>{s.bodyEn}</p>
              </div>
            )}
            {s.formula && <MathBlock>{s.formula}</MathBlock>}
          </section>
        ))}
        {lesson.figures.length > 0 && (
          <section id="figures" className="space-y-4">
            <h2 className="text-xl text-[var(--gold-soft)]">
              {fa ? "شکل و ساخت هندسی" : "Geometric construction"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {lesson.figures.map((id) => (
                <BookFigure key={id} id={id} />
              ))}
            </div>
          </section>
        )}
        {proof && (
          <section id="derivation" className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl text-[var(--gold-soft)]">
                {fa ? "استنتاج پیوسته" : "Connected derivation"}
              </h2>
              <Link
                className="text-xs text-[var(--teal)]"
                href={`/proofs?kind=${proof.kind}`}
              >
                {fa ? "کارگاه اثبات ←" : "Proof workbench →"}
              </Link>
            </div>
            <p className="text-xs text-[var(--muted)]" dir="ltr">
              {proof.source}
            </p>
            {proof.steps.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--border)] p-5 space-y-3"
              >
                <h3 className="text-[var(--gold-soft)]">
                  {i + 1}. {fa ? s.titleFa : s.titleEn}
                </h3>
                {fa && <p className="text-sm leading-8">{s.bodyFa}</p>}
                {en && (
                  <p className="lesson-english text-sm" dir="ltr">
                    {s.bodyEn}
                  </p>
                )}
                <MathBlock>{s.formula}</MathBlock>
              </div>
            ))}
          </section>
        )}
        {lesson.example && (
          <section
            id="example"
            className="rounded-2xl border border-[var(--teal)]/30 bg-[var(--teal)]/5 p-5 space-y-4"
          >
            <h2 className="text-xl text-[var(--gold-soft)]">
              {fa ? lesson.example.titleFa : lesson.example.titleEn}
            </h2>
            <p className="text-xs text-[var(--muted)]" dir="ltr">
              {lesson.example.source}
            </p>
            {fa && (
              <>
                <p className="text-sm leading-8">
                  <strong>داده‌ها: </strong>
                  {lesson.example.givenFa}
                </p>
                <p className="text-sm leading-8">
                  <strong>خواسته: </strong>
                  {lesson.example.findFa}
                </p>
              </>
            )}
            {en && (
              <div dir="ltr" className="lesson-english text-sm">
                <p>
                  <strong>Given: </strong>
                  {lesson.example.givenEn}
                </p>
                <p>
                  <strong>Find: </strong>
                  {lesson.example.findEn}
                </p>
              </div>
            )}
            <ol className="space-y-4">
              {lesson.example.steps.map((st, i) => (
                <li key={i} className="space-y-2">
                  <span className="study-kicker">STEP {i + 1}</span>
                  {fa && <p className="text-sm leading-8">{st.fa}</p>}
                  {en && (
                    <p className="lesson-english text-sm" dir="ltr">
                      {st.en}
                    </p>
                  )}
                  {st.formula && <MathBlock>{st.formula}</MathBlock>}
                </li>
              ))}
            </ol>
            {fa && (
              <p className="text-sm leading-8 text-[var(--teal)]">
                {lesson.example.resultFa}
              </p>
            )}
            {en && (
              <p dir="ltr" className="text-sm leading-7 text-[var(--teal)]">
                {lesson.example.resultEn}
              </p>
            )}
            {lesson.example.widget && (
              <ExampleWidget example={lesson.example} />
            )}
          </section>
        )}
        <section id="practice" className="space-y-4">
          <h2 className="text-xl text-[var(--gold-soft)]">
            {fa ? "خودآزمایی" : "Check your understanding"}
          </h2>
          {lesson.exercises.map((ex, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] p-5 space-y-3"
            >
              {fa && <p className="text-sm leading-8">{ex.textFa}</p>}
              {en && (
                <p dir="ltr" className="lesson-english text-sm">
                  {ex.textEn}
                </p>
              )}
              <p dir="ltr" className="text-xs text-[var(--muted)]">
                {ex.source}
              </p>
              {ex.answer && (
                <details>
                  <summary className="text-sm text-[var(--teal)]">
                    {fa ? "نمایش پاسخ و مقایسه" : "Reveal answer and compare"}
                  </summary>
                  <div className="mt-3">
                    <MathBlock>{ex.answer}</MathBlock>
                  </div>
                </details>
              )}
            </div>
          ))}
        </section>
        <footer className="border-t border-[var(--border)] pt-5 space-y-4">
          <p className="text-xs leading-7 text-[var(--muted)]" dir="ltr">
            W. M. Smart, Textbook on Spherical Astronomy · Chapter{" "}
            {lesson.smart.chapter} · {lesson.smart.sections} · pp.{" "}
            {lesson.smart.pages}. Original teaching adaptation; diagrams are
            independently generated constructions.
          </p>
          <div className="flex flex-wrap justify-between gap-3">
            {index > 0 && (
              <Link
                className="text-sm text-[var(--teal)]"
                href={`/learn/${siblings[index - 1].id}`}
              >
                {fa ? "درس قبل: " : "Previous: "}
                {fa ? siblings[index - 1].titleFa : siblings[index - 1].titleEn}
              </Link>
            )}
            {index < siblings.length - 1 && (
              <Link
                className="flex gap-2 items-center text-sm text-[var(--gold-soft)]"
                href={`/learn/${siblings[index + 1].id}`}
              >
                {fa ? "درس بعد: " : "Next: "}
                {fa ? siblings[index + 1].titleFa : siblings[index + 1].titleEn}
                <ArrowLeft size={15} />
              </Link>
            )}
          </div>
        </footer>
      </div>
      <nav className="lesson-nav" aria-label="Lesson contents">
        <p className="study-kicker col-span-full">
          {fa ? "در این درس" : "IN THIS LESSON"} / {ch?.roman}
        </p>
        <a href="#notation">{fa ? "نماد و واحد" : "Notation & units"}</a>
        <a href="#formulae">{fa ? "روابط اصلی" : "Key identities"}</a>
        {lesson.sections.map((s, i) => (
          <a href={`#section-${i}`} key={i}>
            {i + 1}. {fa ? s.headingFa : s.headingEn}
          </a>
        ))}
        {lesson.figures.length > 0 && (
          <a href="#figures">{fa ? "ساخت هندسی" : "Construction"}</a>
        )}
        {proof && (
          <a href="#derivation">{fa ? "استنتاج پیوسته" : "Derivation"}</a>
        )}
        {lesson.example && (
          <a href="#example">{fa ? "مثال حل‌شده" : "Worked example"}</a>
        )}
        <a href="#practice">{fa ? "خودآزمایی" : "Practice"}</a>
      </nav>
    </article>
  );
}
