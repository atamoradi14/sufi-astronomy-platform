import { SphereLab } from "@/components/sphere/SphereLab";

export default function LabPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="space-y-3">
        <p className="text-sm text-[var(--teal)]">آزمایشگاه کره · Smart I–II</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          کرهٔ تعاملی: عظیمه، صغیره، مثلث
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          بچرخانید و کج کنید (pan/tilt)، لایه‌های دایرهٔ عظیمه و صغیره را روشن کنید، رأس‌های مثلث کروی را جابه‌جا کنید و قانون سینوس/کسینوس را روی اندازه‌گیری زنده بیازمایید — ابزار اصلی دانش‌آموز المپیاد و رصدگر آماتور.
        </p>
      </header>
      <SphereLab />
    </div>
  );
}
