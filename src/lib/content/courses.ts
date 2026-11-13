import { LESSONS } from "./lessons";
import type { Lesson } from "./lessonTypes";

/** Compatibility view used by the home page and problem filters. */
export type CourseSection = Lesson["sections"][number];

export type Course = Lesson & {
  chapter: string;
};

export const COURSES: Course[] = LESSONS.map((l) => ({
  ...l,
  chapter: `Smart ${l.smart.chapter} ${l.smart.sections} · pp. ${l.smart.pages}`,
}));

export function getCourse(id: string) {
  return COURSES.find((c) => c.id === id);
}
