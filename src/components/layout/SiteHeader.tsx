"use client";
import { useLanguage } from "@/components/language/Language";
import { setLanguage } from "@/lib/language";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, setDigitScript } from "@/lib/utils";
import {
  useDigitScript,
  LocalizedDigits,
} from "@/components/digits/DigitScript";
import { Menu, X, Star } from "lucide-react";
import { useState } from "react";
const NAV = [
  { href: "/", label: "خانه", en: "Home" },
  { href: "/course", label: "درس‌نامه", en: "Course" },
  { href: "/lab", label: "کره", en: "Sphere" },
  { href: "/sky", label: "آسمان", en: "Sky" },
  { href: "/atlas", label: "اطلس", en: "Atlas" },
  { href: "/charts", label: "زنده", en: "Live charts" },
  { href: "/map", label: "نقشه", en: "Map" },
];
export function SiteHeader() {
  const { language, fa, t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const digits = useDigitScript();
  return (
    <LocalizedDigits>
      {
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--ink)]/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--panel)] text-[var(--gold)] group-hover:border-[var(--gold)] transition-colors">
                <Star className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
                  {t("صوفی‌آسمان", "Sufi Sky")}
                </span>
                <span className="block text-[10px] text-[var(--muted)] tracking-wide">
                  {t("به یاد عبدالرحمن صوفی", "In memory of al-Sufi")}
                </span>
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href))
                      ? "bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                      : "text-[var(--muted)] hover:text-[var(--parchment)]",
                  )}
                >
                  {fa ? item.label : item.en}
                </Link>
              ))}
            </nav>

            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
              <div
                role="group"
                aria-label="Content language"
                className="flex items-center rounded-md border border-[var(--border)] p-0.5"
                dir="ltr"
                data-digit-literal
              >
                {(
                  [
                    ["fa", "فارسی", "Persian language"],
                    ["en", "English", "English language"],
                  ] as const
                ).map(([id, label, name]) => (
                  <button
                    key={id}
                    type="button"
                    aria-label={name}
                    aria-pressed={language === id}
                    onClick={() => setLanguage(id)}
                    className={cn(
                      "rounded px-2 py-1 text-xs",
                      language === id
                        ? "bg-[var(--gold)]/20 text-[var(--gold-soft)]"
                        : "text-[var(--muted)]",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div
                className="flex items-center gap-1 rounded-md border border-[var(--border)] p-0.5"
                dir="ltr"
                role="group"
                data-digit-literal
                aria-label="Number format / نمایش اعداد"
              >
                <button
                  type="button"
                  aria-label="English digits"
                  aria-pressed={digits === "en"}
                  onClick={() => setDigitScript("en")}
                  className={cn(
                    "rounded px-2 py-1 font-mono text-xs tabular-nums",
                    digits === "en"
                      ? "bg-[var(--gold)]/20 text-[var(--gold-soft)]"
                      : "text-[var(--muted)]",
                  )}
                >
                  123
                </button>
                <button
                  type="button"
                  aria-label="Persian digits"
                  aria-pressed={digits === "fa"}
                  onClick={() => setDigitScript("fa")}
                  className={cn(
                    "rounded px-2 py-1 text-xs",
                    digits === "fa"
                      ? "bg-[var(--gold)]/20 text-[var(--gold-soft)]"
                      : "text-[var(--muted)]",
                  )}
                >
                  ۱۲۳
                </button>
              </div>

              <button
                type="button"
                className="xl:hidden rounded-md border border-[var(--border)] p-2 text-[var(--parchment)]"
                onClick={() => setOpen((v) => !v)}
                aria-label={t("منو", "Menu")}
              >
                {open ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {open && (
            <nav className="border-t border-[var(--border)] bg-[var(--ink)] px-4 py-3 xl:hidden animate-in-fade">
              <div className="flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm",
                      pathname === item.href
                        ? "bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                        : "text-[var(--muted)]",
                    )}
                  >
                    {fa ? item.label : item.en}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </header>
      }
    </LocalizedDigits>
  );
}
