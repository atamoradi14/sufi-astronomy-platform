import { LESSONS, SMART_CHAPTERS } from "@/lib/content/lessons";
import { SiteDirectory } from "@/components/seo/SiteDirectory";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "نقشهٔ سایت و فهرست درس‌های نجوم",
  "فهرست صفحات عمومی و درس‌های فانوس خیال؛ نجوم کروی، کرهٔ سماوی، نقشهٔ آسمان و راهنمای ابزارهای نجومی.",
  "/directory",
);

export default function Page() {
  const groups = SMART_CHAPTERS.map((chapter) => ({
    id: chapter.id,
    titleFa: chapter.titleFa,
    titleEn: chapter.titleEn,
    lessons: LESSONS.filter((lesson) => lesson.chapterId === chapter.id).map(
      ({ id, titleFa, titleEn }) => ({ id, titleFa, titleEn }),
    ),
  })).filter((group) => group.lessons.length);
  return <SiteDirectory groups={groups} />;
}
