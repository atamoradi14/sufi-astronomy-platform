"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Star } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/", label: "خانه" },
  { href: "/course", label: "درس‌نامه" },
  { href: "/lab", label: "کره" },
  { href: "/sky", label: "آسمان" },
  { href: "/atlas", label: "اطلس" },
  { href: "/charts", label: "زنده" },
  { href: "/map", label: "نقشه" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--ink)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--panel)] text-[var(--gold)] group-hover:border-[var(--gold)] transition-colors">
            <Star className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
              صوفی‌آسمان
            </span>
            <span className="block text-[10px] text-[var(--muted)] tracking-wide">
              به یاد عبدالرحمن صوفی
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
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
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="lg:hidden rounded-md border border-[var(--border)] p-2 text-[var(--parchment)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="منو"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[var(--border)] bg-[var(--ink)] px-4 py-3 lg:hidden animate-in-fade">
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
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
