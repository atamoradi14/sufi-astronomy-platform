"use client";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import {
  getLanguage,
  setLanguage,
  subscribeLanguage,
  type Language,
} from "@/lib/language";
export function useLanguage() {
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguage,
    () => "fa" as Language,
  );
  return {
    language,
    fa: language === "fa",
    t: (fa: string, en: string) => (language === "fa" ? fa : en),
  };
}
export function LanguageRoot({ children }: { children: ReactNode }) {
  const { language, fa } = useLanguage();
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("sufi-language");
      if (saved === "fa" || saved === "en") setLanguage(saved, false);
    } catch {
      /* Session still works. */
    }
    const sync = (event: StorageEvent) => {
      if (event.key === "sufi-language")
        setLanguage(event.newValue === "en" ? "en" : "fa", false);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = fa ? "rtl" : "ltr";
  }, [language, fa]);
  return (
    <div lang={language} dir={fa ? "rtl" : "ltr"} className="contents">
      {children}
    </div>
  );
}
