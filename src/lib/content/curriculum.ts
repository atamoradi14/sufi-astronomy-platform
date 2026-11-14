/**
 * Aggregated curriculum index for Smart Chapters I–III.
 * Single source for the Course hub tabs: path, lessons, examples, problems, proofs.
 */

import { LESSONS } from "./lessons";
import { PROBLEMS } from "./problems";
import { PROOFS } from "./proofs";
import { SMART_CHAPTERS } from "./smart";

export const FOCUS_CHAPTERS = ["ch1", "ch2", "ch3"] as const;

export type CourseTab = "path" | "lessons" | "examples" | "problems" | "proofs" | "lab";

export const COURSE_TABS: { id: CourseTab; labelFa: string; labelEn: string }[] = [
  { id: "path", labelFa: "مسیر یادگیری", labelEn: "Path" },
  { id: "lessons", labelFa: "دروس", labelEn: "Lessons" },
  { id: "examples", labelFa: "مثال‌ها", labelEn: "Examples" },
  { id: "problems", labelFa: "مسائل", labelEn: "Problems" },
  { id: "proofs", labelFa: "اثبات‌ها", labelEn: "Proofs" },
  { id: "lab", labelFa: "کرهٔ سه‌بعدی", labelEn: "3D Lab" },
];

/** Ordered learning path for IOAA-style mastery of Smart I–III. */
export const LEARNING_PATH: {
  chapterId: string;
  lessonIds: string[];
  goalFa: string;
  goalEn: string;
}[] = [
  {
    chapterId: "ch1",
    lessonIds: [
      "great-circles",
      "spherical-triangle",
      "terrestrial-latlong",
      "cosine-sides",
      "sine-law",
      "analogue-c",
      "four-parts",
      "right-angled",
      "cosine-angles",
      "haversine-example",
      "delambre-napier",
      "spherical-area",
    ],
    goalFa:
      "از تعریف عظیمه تا صورت‌های (A)(B)(C)(D)، مثلث قائم/نپر، قطبی، هاورساین و مثال عددی بند ۱۲.",
    goalEn:
      "From great circles through (A)–(D), Napier, polar triangle, haversine, and Smart §12.",
  },
  {
    chapterId: "ch2",
    lessonIds: [
      "horizontal",
      "equatorial",
      "rising-setting",
      "coord-transform",
      "celestial-sphere",
      "ecliptic",
      "time",
    ],
    goalFa:
      "سامانه‌های افقی و استوایی، ستارگان قطبی‌گرد، مثلث PZX، بعد و زمان نجومی، دایرة‌البروج.",
    goalEn:
      "Horizontal & equatorial frames, circumpolar stars, PZX, RA/ST, ecliptic.",
  },
  {
    chapterId: "ch3",
    lessonIds: [
      "refraction-laws",
      "refraction-cassini",
      "refraction-parallax",
    ],
    goalFa: "قوانین شکست، z حقیقی/ظاهری، مدل کسینی، کاربرد رصدی در افق و انتقال نصف‌النهاری.",
    goalEn: "Laws of refraction, true/apparent z, Cassini model, observational use.",
  },
];

export function focusLessons() {
  return LESSONS.filter((l) => FOCUS_CHAPTERS.includes(l.chapterId as (typeof FOCUS_CHAPTERS)[number]));
}

export function focusExamples() {
  return focusLessons()
    .filter((l) => l.example)
    .map((l) => ({
      lessonId: l.id,
      chapterId: l.chapterId,
      lessonTitleFa: l.titleFa,
      lessonTitleEn: l.titleEn,
      spherePreset: l.spherePreset,
      example: l.example!,
    }));
}

export function focusProblems() {
  const lessonIds = new Set(focusLessons().map((l) => l.id));
  return PROBLEMS.filter((p) => lessonIds.has(p.lessonId));
}

export function focusProofs() {
  const proofIds = new Set(
    focusLessons()
      .map((l) => l.proofId)
      .filter(Boolean) as string[],
  );
  // Always include core Ch I–II proofs
  const core = [
    "cosine",
    "sine",
    "analogue",
    "four-parts",
    "polar",
    "napier",
    "haversine",
    "pzx",
    "girard",
    "delambre",
    "sidereal",
  ];
  return PROOFS.filter((p) => proofIds.has(p.kind) || core.includes(p.kind));
}

export function focusChapters() {
  return SMART_CHAPTERS.filter((c) =>
    FOCUS_CHAPTERS.includes(c.id as (typeof FOCUS_CHAPTERS)[number]),
  );
}

export function lessonById(id: string) {
  return LESSONS.find((l) => l.id === id);
}
