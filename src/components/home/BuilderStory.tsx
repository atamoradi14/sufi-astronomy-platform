"use client";
import { Award, Heart, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
export function BuilderStory() {
  const { t } = useLanguage();
  return (
    <LocalizedDigits>
      <section
        id="builder"
        className="home-builder home-shell"
        aria-labelledby="builder-title"
      >
        <div className="builder-heading">
          <p className="home-eyebrow">
            {t("پشت این پنجره به آسمان", "Behind this window to the sky")}
          </p>
          <h2 id="builder-title">
            {t("من عطا مرادی‌ام؛", "I’m Ata Moradi.")}
            <span>
              {t(
                "یک منجم آماتور، با یک علاقهٔ قدیمی.",
                "An amateur astronomer, with a lasting fascination.",
              )}
            </span>
          </h2>
          <p>
            {t(
              "فانوس خیال را می‌سازم تا لذت شناختن آسمان را با شما شریک شوم. راهی که برای من با علاقه به نجوم آغاز شد، به المپیاد رسید و هنوز با همان کنجکاوی ادامه دارد.",
              "I’m building Fanous-e Khial to share the joy of getting to know the sky. A personal interest in astronomy led me to the olympiads, and the same curiosity is still with me today.",
            )}
          </p>
          <div className="builder-medals">
            <div>
              <Award size={22} />
              <span>
                <strong>
                  {t(
                    "مدال طلای المپیاد کشوری نجوم",
                    "National Astronomy Olympiad · Gold",
                  )}
                </strong>
                <small>
                  {t("۱۳۹۰ خورشیدی · ایران", "1390 Solar Hijri · Iran")}
                </small>
              </span>
            </div>
            <div>
              <Award size={22} />
              <span>
                <strong>
                  {t(
                    "مدال نقرهٔ المپیاد جهانی نجوم و اخترفیزیک",
                    "International Olympiad on Astronomy and Astrophysics · Silver",
                  )}
                </strong>
                <small>
                  {t(
                    "۲۰۱۲ · IOAA · ریودوژانیرو، برزیل",
                    "2012 · IOAA · Rio de Janeiro, Brazil",
                  )}
                </small>
              </span>
            </div>
          </div>
        </div>
        <div className="builder-words">
          <Sparkles className="builder-quote-star" size={32} />
          <blockquote>
            <p>
              {t(
                "نجوم برای من نشانهٔ زیبایی دنیاست و یادآور قدرت خدای مهربان.",
                "For me, astronomy is a sign of the beauty of our world, and a reminder of the power of a kind God.",
              )}
            </p>
          </blockquote>
          <p>
            {t(
              "امیدوارم بتوانم با کمک فانوس خیال، سهم کوچکی در کمک به جامعهٔ نجومی ایران و همهٔ علاقه‌مندان به نجوم داشته باشم. همچنین دوست دارم آثار دانشمندان بزرگ ایران عزیزمان را بیشتر معرفی کنم و پلی میان میراث آن‌ها و ابزارهای امروز بسازم.",
              "I hope Fanous-e Khial can make a small contribution to Iran’s astronomy community and to everyone who is curious about the sky. I also want to introduce more people to the work of great Iranian scientists, connecting their legacy with the tools we have today.",
            )}
          </p>
          <div className="builder-signature">
            <span>{t("عطا مرادی", "Ata Moradi")}</span>
            <small>
              <Heart size={13} />
              {t("سازندهٔ فانوس خیال", "Builder of Fanous-e Khial")}
            </small>
          </div>
          <a
            href="mailto:atamoradi8@gmail.com"
            className="mt-6 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--teal)] hover:text-[var(--parchment)]"
          >
            <span>{t("با من در تماس باشید", "Get in touch")}</span>
            <span dir="ltr" data-digit-literal className="break-all">
              atamoradi8@gmail.com
            </span>
          </a>
        </div>
      </section>
    </LocalizedDigits>
  );
}
