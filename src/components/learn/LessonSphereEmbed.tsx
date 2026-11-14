"use client";

import dynamic from "next/dynamic";
import type { SphereDiagram } from "@/lib/content/problems";

const SolutionSphere = dynamic(
  () => import("@/components/problems/SolutionSphere").then((m) => m.SolutionSphere),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] items-center justify-center rounded-xl border border-[var(--border)] text-sm text-[var(--muted)]">
        بارگذاری شکل سه‌بعدی…
      </div>
    ),
  },
);

/** Map each focus lesson to a concrete Smart-style teaching diagram. */
const DIAGRAM_BY_LESSON: Record<string, SphereDiagram> = {
  "great-circles": {
    kind: "small-circle",
    delta: 40,
    caption: "عظیمهٔ استوا · صغیرهٔ δ=+۴۰° · قطب N · Smart Fig. 1",
  },
  "spherical-triangle": {
    kind: "triangle-sas",
    a: 70,
    b: 55,
    C: 60,
    caption: "مثلث کروی ABC · اضلاع عظیمه · زوایا در رأس",
  },
  "terrestrial-latlong": {
    kind: "small-circle",
    delta: 50,
    caption: "استوا · مدار عرض ۵۰° · نصف‌النهار · فرمول (۲)",
  },
  "cosine-sides": {
    kind: "star-distance",
    ra1h: 5.0,
    dec1: -8,
    ra2h: 5.6,
    dec2: 7,
    caption: "فاصلهٔ عظیمه دو ستاره · صورت (A)",
  },
  "sine-law": {
    kind: "triangle-ssa",
    a: 50,
    A: 120,
    b: 40,
    caption: "صورت (B) · sin a / sin A = sin b / sin B",
  },
  "analogue-c": {
    kind: "triangle-sas",
    a: 65,
    b: 50,
    C: 55,
    caption: "صورت (C) · sin a cos B = …",
  },
  "four-parts": {
    kind: "triangle-right",
    a: 30,
    B: 50,
    caption: "چهار جزء · قائم در C · صورت (D) / نپر",
  },
  "right-angled": {
    kind: "triangle-right",
    a: 30,
    B: 50,
    caption: "مثلث قائم · قواعد نپر",
  },
  "cosine-angles": {
    kind: "polar-dual",
    a: 70,
    b: 65,
    c: 55,
    caption: "مثلث اصلی و قطبی · کسینوس زوایا",
  },
  "haversine-example": {
    kind: "star-distance",
    ra1h: 133.65 / 15,
    dec1: 24.3,
    ra2h: (360 - 125.4) / 15,
    dec2: 36.783,
    caption: "بند ۱۲ · AB = ۸۳°۴۹′ · ∠A = ۵۲°۱۶′",
  },
  "delambre-napier": {
    kind: "triangle-sas",
    a: 60,
    b: 55,
    C: 70,
    caption: "قیاسی‌های دلامبر / نپر",
  },
  "spherical-area": {
    kind: "triangle-equilateral",
    side: 60,
    caption: "زیادی E · مساحت ژیرار",
  },
  horizontal: {
    kind: "pzx",
    phi: 35,
    delta: 20,
    H: 40,
    caption: "افق · سمت‌الرأس Z · ارتفاع و سمت",
  },
  equatorial: {
    kind: "pzx",
    phi: 35,
    delta: 20,
    H: 40,
    caption: "استوا · میل · زاویهٔ ساعتی H",
  },
  "rising-setting": {
    kind: "pzx",
    phi: 40,
    delta: 15,
    rising: true,
    caption: "طلوع/غروب · H₀ روی افق",
  },
  "coord-transform": {
    kind: "pzx",
    phi: 35,
    delta: 20,
    H: 30,
    caption: "مثلث PZX · فرمول‌های (۳)–(۷)",
  },
  "celestial-sphere": {
    kind: "lst",
    gmst: 9.2,
    lonEast: 51,
    caption: "بعد · نقطهٔ حمل · زمان نجومی",
  },
  ecliptic: {
    kind: "ecliptic",
    epsilon: 23.44,
    lambda: 90,
    caption: "دایرة‌البروج · میل خورشید در انقلاب",
  },
  time: {
    kind: "lst",
    gmst: 9.2,
    lonEast: 51,
    caption: "GMST و LST",
  },
  "refraction-laws": {
    kind: "pzx",
    phi: 35,
    delta: 10,
    H: 70,
    caption: "قائم محلی · z حقیقی و ζ ظاهری",
  },
  "refraction-cassini": {
    kind: "pzx",
    phi: 40,
    delta: 5,
    H: 55,
    caption: "شکست کسینی · تصحیح ارتفاع",
  },
  "refraction-parallax": {
    kind: "pzx",
    phi: 35,
    delta: -5,
    H: 0,
    caption: "کاربرد نصف‌النهاری شکست",
  },
};

export function LessonSphereEmbed({ lessonId }: { lessonId: string }) {
  const diagram = DIAGRAM_BY_LESSON[lessonId];
  if (!diagram) return null;
  return (
    <div className="space-y-2">
      <p className="text-sm text-[var(--gold-soft)]">شکل سه‌بعدی این بند</p>
      <SolutionSphere diagram={diagram} />
    </div>
  );
}
