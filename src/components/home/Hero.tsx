"use client";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { useLanguage } from "@/components/language/Language";
import { KhayyamVerse } from "@/components/brand/KhayyamVerse";
import { LanternScene } from "@/components/brand/LanternScene";
export function Hero() {
  const { fa, t } = useLanguage();
  const Arrow = fa ? ArrowUpLeft : ArrowUpRight;
  return (
    <LocalizedDigits>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-aura" />
        <div className="home-shell hero-composition">
          <div className="hero-story">
            <p className="home-eyebrow">
              <span />
              {t("از زمین، برای تماشای آسمان", "From Earth, with wonder")}
            </p>
            <h1 id="home-title">{t("فانوس خیال", "Fanous-e Khial")}</h1>
            <KhayyamVerse />
            <p className="hero-tagline">
              {t(
                "نجوم، آسمان و میراث ایران",
                "Explore the sky. Discover Persian astronomy.",
              )}
            </p>
            <p className="hero-introduction">
              {t(
                "فانوس خیال، وب‌سایتی نجومی برای شناختن زیبایی‌های آسمان.",
                "Fanous-e Khial is a place to discover the beauty of the sky.",
              )}
            </p>
            <p className="hero-description">
              {t(
                "ستاره‌های یک عکس را پیدا کنید، در آسمان شب گردش کنید و هندسهٔ جهان بالای سرتان را روی یک کره ببینید. اینجا قرار است کنجکاوی، آغاز یک کشف باشد.",
                "Find the stars in a photograph, wander through the night sky, and explore the geometry above you on an interactive sphere. Let curiosity be the beginning of a discovery.",
              )}
            </p>
            <div className="hero-actions">
              <Link className="home-button home-button-primary" href="/sky">
                {t("تماشای آسمان", "Explore the night sky")}
                <Arrow size={18} />
              </Link>
              <a className="home-button home-button-secondary" href="#explore">
                {t("کشف ابزارهای فانوس خیال", "Discover the tools")}
                <ChevronDown size={17} />
              </a>
            </div>
            <p className="hero-development">
              <span className="status-light" />
              {t(
                "فانوس خیال هنوز در حال ساخت است؛ چند پنجره به آسمان، همین حالا باز است.",
                "Fanous-e Khial is still taking shape. A few windows to the sky are already open.",
              )}
            </p>
          </div>
          <figure className="hero-sky-figure">
            <div className="hero-figure-top">
              <span className="home-eyebrow">
                {t("برای لحظه‌ای، رو به آسمان", "Take a moment. Look up.")}
              </span>
              <span className="sky-mini-star">✦</span>
            </div>
            <LanternScene />
            <figcaption>
              <span>
                {t(
                  "یک آسمان، هزار مسیرِ کشف",
                  "One sky. A thousand ways to discover it.",
                )}
              </span>
              <a href="#builder">
                {t("داستان فانوس خیال", "The story behind Fanous-e Khial")}
                <Arrow size={15} />
              </a>
            </figcaption>
          </figure>
        </div>
      </section>
    </LocalizedDigits>
  );
}
