"use client";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import Link from "next/link";
export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <LocalizedDigits>
      {
        <footer className="site-footer mt-auto border-t border-[var(--border)] bg-[var(--ink-deep)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 space-y-3 md:max-w-md">
              <p>
                {t(
                  "فانوس خیال — پنجره‌ای برای شناختن زیبایی‌های آسمان، با نگاهی به میراث صوفی.",
                  "Fanous-e Khial — a window to the beauty of the sky, with a connection to al-Sufi’s legacy.",
                )}
              </p>
              <a
                href="mailto:atamoradi8@gmail.com"
                className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-[var(--teal)] hover:text-[var(--parchment)]"
              >
                <span>{t("تماس با ما", "Contact us")}</span>
                <span dir="ltr" data-digit-literal className="break-all">
                  atamoradi8@gmail.com
                </span>
              </a>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link prefetch={false} href="/about">
                {t("دربارهٔ فانوس خیال", "About")}
              </Link>
              <Link prefetch={false} href="/privacy">
                {t("حریم خصوصی", "Privacy")}
              </Link>
              <Link prefetch={false} href="/tools">
                {t("راهنمای ابزارها", "Tool guide")}
              </Link>
              <Link
                prefetch={false}
                href="/course"
                className="hover:text-[var(--parchment)]"
              >
                {t("دروس", "Course")}
              </Link>
              <Link
                prefetch={false}
                href="/directory"
                className="hover:text-[var(--parchment)]"
              >
                {t("نقشهٔ سایت", "Sitemap")}
              </Link>
            </div>
          </div>
        </footer>
      }
    </LocalizedDigits>
  );
}
