"use client";
import { useLanguage } from "@/components/language/Language";
import { setLanguage } from "@/lib/language";
import { AccountButton } from "@/components/auth/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, setDigitScript } from "@/lib/utils";
import {
  useDigitScript,
  LocalizedDigits,
} from "@/components/digits/DigitScript";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/layout/Theme";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { canUseMobileSensors } from "@/lib/mobile-sensors/access";
const NAV = [
  { href: "/", label: "خانه", en: "Home" },
  { href: "/course", label: "درس‌نامهٔ کروی", en: "Spherical course" },
  { href: "/lab", label: "کره", en: "Sphere" },
  { href: "/sky", label: "آسمان", en: "Sky" },
  { href: "/sensor", label: "حسگر ستاره", en: "Star sensor" },
  { href: "/atlas", label: "اطلس صوفی", en: "Sufi atlas" },
  { href: "/charts", label: "داده های لایو", en: "Live data" },
  { href: "/map", label: "نقشه", en: "Map" },
];
export function SiteHeader() {
  const { language, fa, t } = useLanguage();
  const pathname = usePathname();
  const { data: session } = useSession();
  const navigation = canUseMobileSensors(session?.user?.email)
    ? [
        ...NAV,
        {
          href: "/admin/sensors",
          label: "گوشی در نقش ماهواره",
          en: "Phone as satellite",
        },
      ]
    : NAV;
  const [open, setOpen] = useState(false);
  const digits = useDigitScript();
  const { theme, toggle } = useTheme();
  return (
    <LocalizedDigits>
      {
        <header className="site-header sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--ink)]">
          <div className="site-header-inner mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3">
            <Link
              prefetch={false}
              href="/"
              className="brand-lockup flex min-w-0 items-center gap-2 group"
            >
              <span className="shrink-0">
                <Image src="/logo.svg" alt="" width={44} height={44} priority />
              </span>
              <span className="leading-tight">
                <span className="block font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
                  {t("فانوس خیال", "Fanous-e Khial")}
                </span>
                <span
                  className="brand-header-verse block text-[var(--muted)]"
                  title={t(
                    "از رباعی منسوب به خیام",
                    "Inspired by a quatrain attributed to Khayyam",
                  )}
                >
                  {t(
                    "فانوس خیال از او مثالی دانیم",
                    "A lantern of imagination, a likeness of the heavens",
                  )}
                </span>
              </span>
            </Link>

            <nav
              className="header-desktop-nav hidden xl:flex items-center gap-1"
              aria-label={t("ناوبری اصلی", "Main navigation")}
            >
              {navigation.map((item) => (
                <Link
                  prefetch={false}
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

            <div className="header-controls flex w-full items-center justify-between gap-1 sm:w-auto sm:justify-end sm:gap-2">
              <AccountButton />
              <button
                type="button"
                className="theme-toggle rounded-md border border-[var(--border)] p-2 text-[var(--parchment)]"
                onClick={toggle}
                aria-label={
                  theme === "dark"
                    ? t("تغییر به حالت روشن", "Switch to light mode")
                    : t("تغییر به حالت تاریک", "Switch to dark mode")
                }
                title={
                  theme === "dark"
                    ? t("حالت روشن", "Light mode")
                    : t("حالت تاریک", "Dark mode")
                }
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div
                role="group"
                aria-label="Content language"
                className="header-language flex items-center rounded-md border border-[var(--border)] p-0.5"
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
                className="header-digits flex items-center gap-1 rounded-md border border-[var(--border)] p-0.5"
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
                    "rounded px-2 py-1 tabular-nums text-xs",
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
                aria-expanded={open}
                aria-controls="mobile-navigation"
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
            <nav
              id="mobile-navigation"
              aria-label={t("ناوبری موبایل", "Mobile navigation")}
              className="border-t border-[var(--border)] bg-[var(--ink)] px-4 py-3 xl:hidden animate-in-fade"
            >
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    prefetch={false}
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
