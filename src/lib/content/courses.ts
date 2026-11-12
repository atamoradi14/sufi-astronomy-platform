import data from "./coursesData.json";

export type CourseSection = {
  headingFa: string;
  headingEn: string;
  bodyFa: string;
  bodyEn: string;
  formula: string | null;
};

export type Course = {
  id: string;
  chapter: string;
  titleFa: string;
  titleEn: string;
  level: string;
  minutes: number;
  spherePreset: string;
  proofId?: string;
  olympiad: string;
  summaryFa: string;
  englishFormulas: string[];
  sections: CourseSection[];
};

export const COURSES = data.courses as Course[];

export function getCourse(id: string) {
  return COURSES.find((c) => c.id === id);
}
