"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language/Language";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";

export function Heritage() {
  const { fa, t } = useLanguage();
  const Arrow = fa ? ArrowUpLeft : ArrowUpRight;
  return (
    <section className="heritage-section" aria-labelledby="heritage-title">
      <div className="home-shell heritage-layout">
        <figure className="heritage-plate">
          <Image
            src="/atlas/plates/orion-globe.webp"
            alt={t(
              "نگارهٔ تاریخی جبار در نسخهٔ صورالکواکب",
              "A historical Orion illustration from a manuscript of the Book of Fixed Stars",
            )}
            width={450}
            height={650}
            sizes="(max-width: 700px) 78vw, 360px"
          />
          <figcaption>
            {t(
              "جبار · نگارهٔ نسخهٔ تاریخی صورالکواکب",
              "Orion · a historical Book of Fixed Stars manuscript",
            )}
          </figcaption>
        </figure>
        <div className="heritage-copy">
          <p className="home-eyebrow">
            {t("از دفترهای نجوم ایران", "From the pages of Persian astronomy")}
          </p>
          <h2 id="heritage-title">
            {t(
              "همان آسمان، از نگاهی دیگر.",
              "The same sky, through another gaze.",
            )}
          </h2>
          <p>
            {t(
              "پیش از نقشه‌های دیجیتال، ستاره‌ها در دفترها و نگاره‌ها خانه داشتند. در اطلس صوفی، صورالکواکبِ عبدالرحمن صوفی را با نگاره‌های نسخه‌های تاریخی، شرح فارسی و دو منظرِ کره و آسمان مرور کنید.",
              "Long before digital maps, stars found their place in books and drawings. Explore Abd al-Rahman al-Sufi’s Book of Fixed Stars through historical manuscript illustrations, explanations, and its paired globe and sky views.",
            )}
          </p>
          <Link prefetch={false} href="/atlas" className="home-text-link">
            {t("ورق زدن اطلس صوفی", "Explore the Sufi atlas")}
            <Arrow size={18} />
          </Link>
          <small>
            {t(
              "نمایش نگاره‌های نسخه‌های تاریخی · ورود با حساب گوگل",
              "Historical manuscript illustrations · Google sign-in required",
            )}
          </small>
        </div>
      </div>
    </section>
  );
}
