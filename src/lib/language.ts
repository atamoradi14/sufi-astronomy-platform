export type Language = "fa" | "en";
let language: Language = "fa";
const listeners = new Set<() => void>();
export const getLanguage = () => language;
export function subscribeLanguage(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function setLanguage(next: Language, persist = true) {
  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem("sufi-language", next);
    } catch {
      /* Session still works. */
    }
  }
  if (next === language) return;
  language = next;
  listeners.forEach((listener) => listener());
}

/** Legacy source notices store English / Persian in one field. */
export function selectSourceText(value: string, language: Language) {
  const parts = value.split(" / ");
  if (parts.length === 2 && /[آ-ی]/.test(parts[1]) && !/[آ-ی]/.test(parts[0]))
    return parts[language === "fa" ? 1 : 0];
  return value;
}
