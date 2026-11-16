import type { Metadata } from "next";
import type { Lesson } from "@/lib/content/lessonTypes";
export const SITE_URL = "https://fanous.online";
export const SITE_NAME = "فانوس خیال | Fanous-e Khial";
export const SITE_DESCRIPTION =
  "فانوس خیال، ساختهٔ عطا مرادی؛ نقشهٔ آسمان شب، حسگر ستاره، کرهٔ تعاملی، اطلس صوفی و درس‌نامهٔ نجوم کروی در حال توسعه، برای شناختن زیبایی‌های آسمان.";
export const AUTHOR_ID = `${SITE_URL}/about#ata-moradi`;
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
      title: `${title} | فانوس خیال`,
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
          alt: "فانوس خیال؛ پنجره‌ای برای شناختن زیبایی‌های آسمان",
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

export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "فانوس خیال",
    alternateName: ["Fanous-e Khial", "fanous.online"],
    url: SITE_URL + "/",
    description: SITE_DESCRIPTION,
    inLanguage: ["fa", "en"],
    creator: {
      "@type": "Person",
      "@id": AUTHOR_ID,
      name: "عطا مرادی",
      alternateName: "Ata Moradi",
      url: SITE_URL + "/about",
    },
  };
}

export function aboutStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": SITE_URL + "/about#page",
    name: "دربارهٔ فانوس خیال و عطا مرادی",
    url: SITE_URL + "/about",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "Person",
      "@id": AUTHOR_ID,
      name: "عطا مرادی",
      alternateName: "Ata Moradi",
      url: SITE_URL + "/about",
      description: "منجم آماتور و سازندهٔ فانوس خیال",
    },
  };
}

export function lessonStructuredData(lesson: Lesson) {
  const url = `${SITE_URL}/learn/${lesson.id}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        "@id": url + "#lesson",
        name: lesson.titleFa,
        alternateName: lesson.titleEn,
        description: lesson.summaryFa,
        url,
        inLanguage: ["fa", "en"],
        learningResourceType: "Lesson",
        isAccessibleForFree: true,
        timeRequired: `PT${lesson.minutes}M`,
        author: { "@type": "Person", "@id": AUTHOR_ID, name: "عطا مرادی" },
        isPartOf: {
          "@type": "CreativeWork",
          name: "درس‌نامهٔ کروی اسمارت",
          url: SITE_URL + "/course",
        },
        citation: {
          "@type": "Book",
          name: "Textbook on Spherical Astronomy",
          author: { "@type": "Person", name: "W. M. Smart" },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": url + "#breadcrumbs",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "خانه",
            item: SITE_URL + "/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "درس‌نامهٔ کروی",
            item: SITE_URL + "/course",
          },
          { "@type": "ListItem", position: 3, name: lesson.titleFa, item: url },
        ],
      },
    ],
  };
}
