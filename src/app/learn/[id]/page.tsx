import { pageMetadata, SITE_URL, safeJsonLd } from "@/lib/seo";
import { LocalizedDigits } from "@/components/digits/DigitScript";
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
  params: Promise<{
    id: string;
  }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) return { title: "درس" };
  return pageMetadata(lesson.titleFa, lesson.summaryFa, `/learn/${lesson.id}`);
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();
  return (
    <LocalizedDigits>
      {
        <div className="mx-auto max-w-3xl px-4 py-8">
          <LessonArticle lesson={lesson} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: safeJsonLd({
                "@context": "https://schema.org",
                "@type": "LearningResource",
                name: lesson.titleFa,
                alternateName: lesson.titleEn,
                description: lesson.summaryFa,
                url: `${SITE_URL}/learn/${lesson.id}`,
                inLanguage: ["fa", "en"],
                learningResourceType: "Lesson",
                isAccessibleForFree: true,
                timeRequired: `PT${lesson.minutes}M`,
                provider: {
                  "@type": "Organization",
                  name: "Manderia",
                  url: SITE_URL,
                },
              }),
            }}
          />
        </div>
      }
    </LocalizedDigits>
  );
}
