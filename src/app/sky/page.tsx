import { ConstellationViewer } from "@/components/sky/ConstellationViewer";

export default function SkyPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          آسمان‌نما — صور الکواکب
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-[var(--muted)]">
          صورت‌های فلکی به روایت عبدالرحمن صوفی، با مختصات مدرن و محاسبهٔ سمت و ارتفاع برای مکان شما.
        </p>
      </header>
      <ConstellationViewer />
    </div>
  );
}
