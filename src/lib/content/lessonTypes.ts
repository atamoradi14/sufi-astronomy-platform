export type BookRef = {
  chapter: string;
  sections: string;
  pages: string;
  formulae?: string[];
  figures?: string[];
};

export type Formula = {
  display: string;
  number?: string;
  nameFa: string;
  nameEn: string;
};

export type LessonSection = {
  headingFa: string;
  headingEn: string;
  bodyFa: string;
  bodyEn: string;
  formula?: string;
};

export type WorkedExample = {
  id: string;
  titleFa: string;
  titleEn: string;
  source: string;
  givenFa: string;
  givenEn: string;
  findFa: string;
  findEn: string;
  steps: { fa: string; en: string; formula?: string }[];
  resultFa: string;
  resultEn: string;
  widget?: "gc-distance" | "pzx" | "haversine" | "rising" | "small-circle";
};

export type Exercise = {
  textFa: string;
  textEn: string;
  source: string;
  answer?: string;
};

export type Lesson = {
  id: string;
  chapterId: string;
  titleFa: string;
  titleEn: string;
  level: "مقدماتی" | "متوسط" | "المپیاد";
  minutes: number;
  spherePreset: string;
  proofId?: string;
  olympiad: string;
  summaryFa: string;
  summaryEn: string;
  smart: BookRef;
  figures: string[];
  formulas: Formula[];
  sections: LessonSection[];
  example?: WorkedExample;
  exercises: Exercise[];
  englishFormulas: string[];
};
