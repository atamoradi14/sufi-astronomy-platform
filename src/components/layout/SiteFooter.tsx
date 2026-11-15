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
                "ماندریا — پنجره‌ای برای شناختن زیبایی‌های آسمان، با نگاهی به میراث صوفی.",
                "Manderia — a window to the beauty of the sky, with a connection to al-Sufi’s legacy.",
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about">{t("دربارهٔ ماندریا", "About")}</Link>
              <Link href="/privacy">{t("حریم خصوصی", "Privacy")}</Link>
              <Link href="/tools">{t("راهنمای ابزارها", "Tool guide")}</Link>
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
