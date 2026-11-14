import { LESSONS_LATER } from "./lessonsLater";
/** Compatibility export for the reviewed Smart III sequence. */
export const LESSONS_CH3 = LESSONS_LATER.filter(
  (lesson) => lesson.chapterId === "ch3",
);
