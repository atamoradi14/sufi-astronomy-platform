import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--ink-deep)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <p>
          صوفی‌آسمان — آموزش ریاضیات کروی و رصد به زبان فارسی، با الهام از{" "}
          <span className="text-[var(--gold-soft)]">صور الکواکب</span>.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/learn" className="hover:text-[var(--parchment)]">
            دروس
          </Link>
          <Link href="/architecture" className="hover:text-[var(--parchment)]">
            معماری خدمات
          </Link>
        </div>
      </div>
    </footer>
  );
}
