import { LocalizedDigits } from "@/components/digits/DigitScript";
import { CompassQibla } from "@/components/compass/CompassQibla";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "قطب‌نما و محاسبهٔ سمت قبله",
  "محاسبهٔ سمت قبله با هندسهٔ دایرهٔ عظیمه و نمایش جهت با حسگر دستگاه در صورت پشتیبانی؛ ابزار نجومی فانوس خیال.",
  "/compass",
);
export default function CompassPage() {
  return (
    <LocalizedDigits>
      {
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
          <header>
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
              قطب‌نما و یابندهٔ قبله
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-8 text-[var(--muted)]">
              سمت قبله از هندسهٔ دایرهٔ عظیمه میان موقعیت GPS شما و کعبه محاسبه
              می‌شود و با حسگر جهت‌گیری دستگاه هم‌تراز می‌گردد.
            </p>
          </header>
          <CompassQibla />
        </div>
      }
    </LocalizedDigits>
  );
}
