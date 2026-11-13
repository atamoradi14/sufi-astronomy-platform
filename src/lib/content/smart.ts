/** Bibliographic anchor for W.M. Smart, Textbook on Spherical Astronomy, Part 1. */

export const SMART_BOOK = {
  author: "W. M. Smart",
  title: "Textbook on Spherical Astronomy",
  titleFa: "کتاب درسی نجوم کروی",
  publisher: "Cambridge University Press",
  part: "Part 1",
  pages: "1–222",
  noteFa:
    "درس‌نامهٔ این برنامه بر فصل‌بندی، شماره‌گذاری فرمول‌ها و شکل‌های بازسازی‌شدهٔ Smart استوار است: عظیمه، مثلث کروی، فرمول‌های (A)–(D)، هاورساین، مثلث نجومی PZX، و زمان نجومی در Part 1. شکل‌ها بازسازی آموزشی‌اند، نه رونوشت صفحه‌های چاپی.",
  noteEn:
    "Curriculum follows Smart Part 1 chapter and formula numbering. Explanations are pedagogical restatements; figures are original reconstructions of Smart’s labelled constructions.",
} as const;

export type SmartChapter = {
  id: string;
  roman: string;
  pages: string;
  titleEn: string;
  titleFa: string;
  sections: string;
};

export const SMART_CHAPTERS: SmartChapter[] = [
  {
    id: "ch1",
    roman: "I",
    pages: "1–24",
    titleEn: "Spherical Trigonometry",
    titleFa: "مثلثات کروی",
    sections: "§§1–16 · formulae (A)–(D), (1)–(52) · Figs. 1–9",
  },
  {
    id: "ch2",
    roman: "II",
    pages: "25–57",
    titleEn: "The Celestial Sphere",
    titleFa: "کرهٔ سماوی",
    sections: "§§17–29 · PZX (3)–(7) · RA, ST · Figs. 10–22",
  },
  {
    id: "ch3",
    roman: "III",
    pages: "58–73",
    titleEn: "Refraction",
    titleFa: "شکست نور",
    sections: "true/apparent z · Cassini · integral (20)",
  },
  {
    id: "ch4",
    roman: "IV",
    pages: "74–98",
    titleEn: "The Meridian Circle",
    titleFa: "دایرهٔ نصف‌النهاری",
    sections: "collimation, level, azimuth · Bessel · RA/Dec",
  },
  {
    id: "ch5",
    roman: "V",
    pages: "99–135",
    titleEn: "Planetary Motions",
    titleFa: "حرکت سیاره‌ای",
    sections: "Kepler · vis viva · eccentric anomaly · elements",
  },
  {
    id: "ch6",
    roman: "VI",
    pages: "136–157",
    titleEn: "Time",
    titleFa: "زمان",
    sections: "sidereal/solar · equation of time · calendar",
  },
  {
    id: "ch7",
    roman: "VII",
    pages: "158–177",
    titleEn: "Planetary Phenomena & Heliographic Coordinates",
    titleFa: "پدیده‌های سیاره‌ای و مختصات خورشیدمرکزی",
    sections: "elongation, phase, stationary points, brightness",
  },
  {
    id: "ch8",
    roman: "VIII",
    pages: "178–193",
    titleEn: "Aberration",
    titleFa: "انحراف نوری",
    sections: "Bradley · annual κ · diurnal",
  },
  {
    id: "ch9",
    roman: "IX",
    pages: "194–222",
    titleEn: "Parallax",
    titleFa: "اختلاف‌منظر",
    sections: "geocentric · lunar · stellar π · parallax factor",
  },
];
