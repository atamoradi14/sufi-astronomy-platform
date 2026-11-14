"use client";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import Link from "next/link";
export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <LocalizedDigits>
      {
        <footer className="mt-auto border-t border-[var(--border)] bg-[var(--ink-deep)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
            <p>
              {t(
                "ماندریا — آموزش ریاضیات کروی و رصد، با الهام از صور الکواکب.",
                "Manderia — spherical mathematics and observational astronomy, inspired by al-Sufi’s Book of Fixed Stars.",
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/course" className="hover:text-[var(--parchment)]">
                {t("دروس", "Course")}
              </Link>
              <Link
                href="/architecture"
                className="hover:text-[var(--parchment)]"
              >
                {t("معماری خدمات", "Architecture")}
              </Link>
            </div>
          </div>
        </footer>
      }
    </LocalizedDigits>
  );
}
