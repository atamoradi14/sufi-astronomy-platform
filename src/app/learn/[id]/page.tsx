import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LESSONS, getLesson } from "@/lib/content/lessons";
import { LessonArticle } from "@/components/learn/LessonArticle";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) return { title: "درس" };
  return {
    title: `${lesson.titleFa} · صوفی‌آسمان`,
    description: lesson.summaryFa,
  };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <LessonArticle lesson={lesson} />
    </div>
  );
}
