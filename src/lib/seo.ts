import type { Metadata } from "next";
export const SITE_URL = "https://manderia.daryajan.com";
export const SITE_NAME = "ماندریا | Manderia";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ماندریا`,
      description,
      url: SITE_URL + path,
      siteName: SITE_NAME,
      locale: "fa_IR",
      type: "website",
      images: [
        {
          url: "/social-card.png",
          width: 1200,
          height: 630,
          alt: "ماندریا؛ درس‌نامهٔ کروی و ابزارهای تعاملی نجوم",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/social-card.png"],
    },
  };
}
export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
