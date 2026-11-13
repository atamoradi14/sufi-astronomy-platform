import { SMART_CHAPTERS } from "./smart";
import type { Lesson } from "./lessonTypes";
import { LESSONS_CH1 } from "./lessonsCh1";
import { LESSONS_CH2 } from "./lessonsCh2";
import { LESSONS_LATER } from "./lessonsLater";

export type { Lesson, BookRef, Formula, LessonSection, WorkedExample, Exercise } from "./lessonTypes";
export { SMART_BOOK, SMART_CHAPTERS } from "./smart";

export const LESSONS: Lesson[] = [...LESSONS_CH1, ...LESSONS_CH2, ...LESSONS_LATER];

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id);
}

export function lessonsForChapter(chapterId: string) {
  return LESSONS.filter((l) => l.chapterId === chapterId);
}

export function chapterOf(lesson: Lesson) {
  return SMART_CHAPTERS.find((c) => c.id === lesson.chapterId);
}
