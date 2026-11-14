import { CourseHub } from "@/components/learn/CourseHub";
import type { CourseTab } from "@/lib/content/curriculum";

export default async function CoursePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const allowed: CourseTab[] = ["path", "lessons", "examples", "problems", "proofs", "lab"];
  const initialTab = allowed.includes(sp.tab as CourseTab)
    ? (sp.tab as CourseTab)
    : "path";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CourseHub initialTab={initialTab} />
    </div>
  );
}
