import { SuwarAtlas } from "@/components/atlas/SuwarAtlas";

export default function AtlasPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <p className="text-sm text-[var(--teal)]">صور الکواکب · عبدالرحمن صوفی</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          اطلس نسخهٔ خطی
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--muted)]">
          چهل‌وهشت صورت بطلمیوسی با نگاره‌های واقعی شش دفتر نسخه، شرح فارسی، و نماهای کره / آسمان /
          جدول ستارگان — همان روش دوگانهٔ صوفی.
        </p>
      </header>
      <SuwarAtlas />
    </div>
  );
}
