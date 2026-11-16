"use client";
import Link from "next/link";
import { useLanguage } from "@/components/language/Language";
import { PUBLIC_PAGES } from "@/lib/site-pages";

type Group = {
  id: string;
  titleFa: string;
  titleEn: string;
  lessons: { id: string; titleFa: string; titleEn: string }[];
};
export function SiteDirectory({ groups }: { groups: Group[] }) {
  const { fa, t } = useLanguage();
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <header className="space-y-4">
        <h1 className="text-3xl text-[var(--parchment)]">
          {t("نقشهٔ سایت و فهرست درس‌ها", "Site and lesson directory")}
        </h1>
        <p className="text-[var(--muted)]">
          {t(
            "از اینجا به صفحات عمومی و همهٔ درس‌های فانوس خیال دسترسی دارید. درس‌نامه همچنان در حال تکمیل و بازبینی است؛ فعلاً برای مرور خلاصه‌ها از آن استفاده کنید.",
            "Find the public pages and lessons of Fanous-e Khial. The course is still being developed and reviewed; use it for an overview for now.",
          )}
        </p>
        <a href="/sitemap.xml" className="text-[var(--teal)] underline">
          {t(
            "نقشهٔ XML برای موتورهای جست‌وجو",
            "XML sitemap for search engines",
          )}
        </a>
      </header>
      <section aria-labelledby="directory-pages" className="space-y-4">
        <h2 id="directory-pages" className="text-2xl">
          {t("صفحات عمومی", "Public pages")}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PUBLIC_PAGES.filter((p) => p.path !== "/directory").map((page) => (
            <li key={page.path}>
              <Link
                prefetch={false}
                href={page.path}
                className="text-[var(--teal)] underline underline-offset-4"
              >
                {fa ? page.fa : page.en}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={`directory-${group.id}`}
          className="space-y-4 border-t border-[var(--border)] pt-6"
        >
          <h2 id={`directory-${group.id}`} className="text-2xl">
            {fa ? group.titleFa : group.titleEn}
          </h2>
          <ul className="space-y-3">
            {group.lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  prefetch={false}
                  href={`/learn/${lesson.id}`}
                  className="text-[var(--teal)] underline underline-offset-4"
                >
                  {fa ? lesson.titleFa : lesson.titleEn}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
