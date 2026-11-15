import type { MetadataRoute } from "next";
import { LESSONS } from "@/lib/content/lessons";
import { SITE_URL } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/course",
    "/proofs",
    "/sky",
    "/charts",
    "/map",
    "/compass",
    "/about",
    "/tools",
    "/privacy",
    ...LESSONS.map((l) => `/learn/${l.id}`),
  ].map((path) => ({
    url: SITE_URL + path,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/course" ? 0.9 : 0.7,
  }));
}
