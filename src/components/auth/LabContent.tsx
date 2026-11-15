"use client";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { SphereLab } from "@/components/sphere/SphereLab";
export function LabContent() {
  const { t } = useLanguage();
  return (
    <LocalizedDigits>
      {
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
          <header className="space-y-3">
            <p className="text-sm text-[var(--teal)]">
              {t(
                "آزمایشگاه کره · اسمارت فصل‌های اول و دوم",
                "Sphere lab · Smart I–II",
              )}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
              {t(
                "کرهٔ تعاملی: عظیمه، صغیره، مثلث",
                "Interactive sphere: great circles, small circles, triangles",
              )}
            </h1>
            <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
              {t(
                "یک مفهوم را انتخاب کنید، لایه‌های اضافی را خاموش کنید و رأس‌ها را روی سطح قرار دهید. شکل و اندازه‌گیری از بردارهای یکسان ساخته می‌شوند؛ طول ضلع، زاویهٔ رأس و مساحت را کنار هم بررسی کنید.",
                "Choose a concept, hide unnecessary layers, and place vertices on the surface. The diagram and measurements use the same vectors; compare side lengths, vertex angles, and area together.",
              )}
            </p>
          </header>
          <SphereLab />
        </div>
      }
    </LocalizedDigits>
  );
}
