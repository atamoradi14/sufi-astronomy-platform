import type { MetadataRoute } from "next";
import { LESSONS } from "@/lib/content/lessons";
import { SITE_URL } from "@/lib/seo";
import { PUBLIC_PAGES } from "@/lib/site-pages";
export default function sitemap(): MetadataRoute.Sitemap {
  // No guessed modification dates or duplicate query/redirect URLs.
  return [
    ...new Set([
      ...PUBLIC_PAGES.map((page) => page.path),
      ...LESSONS.map((lesson) => `/learn/${lesson.id}`),
    ]),
  ].map((path) => ({ url: SITE_URL + path }));
}
