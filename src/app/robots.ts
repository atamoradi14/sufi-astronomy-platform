import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Let crawlers read the HTML noindex tags on account-only pages.
      // Authentication, not robots.txt, protects their actual contents.
      disallow: ["/api/"],
    },
    sitemap: SITE_URL + "/sitemap.xml",
    host: SITE_URL,
  };
}
