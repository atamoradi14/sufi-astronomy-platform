"use client";
import Link from "next/link";
import {
  ArrowUpLeft,
  ArrowUpRight,
  BookOpen,
  Compass,
  Construction,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { BuilderStory } from "@/components/home/BuilderStory";
import { Heritage } from "@/components/home/Heritage";
import {
  FeaturePreview,
  type PreviewKind,
} from "@/components/home/FeaturePreview";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { useLanguage } from "@/components/language/Language";
type Feature = {
  id: PreviewKind;
  href: string;
  title: string;
  titleEn: string;
  eyebrow: string;
  eyebrowEn: string;
  description: string;
  descriptionEn: string;
  cta: string;
  ctaEn: string;
  requiresLogin?: boolean;
  developing?: boolean;
  wide?: boolean;
};
const FEATURES: Feature[] = [
  {
    id: "satellite",
    href: "/satellite",
    title: "ماهوارهٔ خودت را بساز",
    titleEn: "Build your own satellite",
    eyebrow: "گوشی، حسگرها و مدار",
    eyebrowEn: "Your phone, sensors & orbit",
    description:
      "برنامهٔ اندروید را نصب کن، گوشی را با حساب گوگل تأیید کن و حسگرها، وضعیت سه‌بعدی و آسمان دوربین را روی گوشی یا لپ‌تاپ ببین. با شش عنصر مداری، ماهوارهٔ آزمایشی خودت را شبیه‌سازی کن.",
    descriptionEn:
      "Install the Android app, approve your phone with Google, and watch live sensors, 3D attitude and the camera-aligned sky on your phone or laptop. Simulate a spacecraft with six orbital elements.",
    cta: "دانلود و اتصال گوشی",
    ctaEn: "Download & connect your phone",
    developing: true,
  },
  {
    id: "sky",
    href: "/sky",
    title: "امشب، آسمان را جور دیگری ببینید.",
    titleEn: "See the night sky in a new light.",
    eyebrow: "آسمان زنده",
    eyebrowEn: "The live sky",
    description:
      "در نقشهٔ به‌روز آسمان شب گردش کنید، صورت‌های فلکی را ببینید و ستاره‌ها را پیدا کنید. جای ناظر و زمان را تغییر دهید و از تماشای آسمان لذت ببرید.",
    descriptionEn:
      "Wander through an up-to-date night-sky map, explore constellations, and find stars. Change the observer’s location and time, and enjoy a different view of the sky.",
    cta: "باز کردن آسمان",
    ctaEn: "Open the sky",
    wide: true,
  },
  {
    id: "sensor",
    href: "/sensor",
    title: "یک عکس، کلی ستارهٔ آشنا.",
    titleEn: "One photo. A sky full of names.",
    eyebrow: "حسگر ستاره",
    eyebrowEn: "Star sensor",
    description:
      "عکسی از آسمان به ستاره‌یاب هوشمند بدهید؛ الگوی ستاره‌ها را تطبیق می‌دهد، نام ستاره‌های شناسایی‌شده را نشان می‌دهد و مختصات مرکز تصویر را تخمین می‌زند.",
    descriptionEn:
      "Give the intelligent star finder a sky photograph. It matches star patterns, names the stars it identifies, and estimates the coordinates at the centre of your image.",
    cta: "امتحان کردن یک عکس",
    ctaEn: "Try a sky photo",
    requiresLogin: true,
  },
  {
    id: "sphere",
    href: "/lab",
    title: "با آسمان، هندسه بازی کنید.",
    titleEn: "Get your hands on the geometry.",
    eyebrow: "کرهٔ تعاملی",
    eyebrowEn: "Interactive sphere",
    description:
      "کره را بچرخانید، رأس‌ها را جابه‌جا کنید و عظیمه‌ها، زاویه‌ها و مثلث‌های کروی را از نزدیک بشناسید. این بخش جالبِ داستان را حتماً امتحان کنید.",
    descriptionEn:
      "Rotate the sphere, move its vertices, and get to know great circles, angles, and spherical triangles. This is one part of the story you really should try.",
    cta: "کار با کره",
    ctaEn: "Explore the sphere",
    requiresLogin: true,
  },
  {
    id: "atlas",
    href: "/atlas",
    title: "آسمان، از نگاه استاد صوفی.",
    titleEn: "The sky, through al-Sufi’s eyes.",
    eyebrow: "اطلس صوفی",
    eyebrowEn: "Sufi atlas",
    description:
      "به یاد استاد عبدالرحمن صوفی، نگاره‌های نسخه‌های صورالکواکب را انتخاب و مطالعه کنید؛ میراثی از دانشمندان ایران عزیز، در کنار تجربه‌ای امروزی از آسمان.",
    descriptionEn:
      "Explore selected illustrations from manuscripts of the Book of Fixed Stars, in honour of Abd al-Rahman al-Sufi. Discover a chapter of Iran’s scientific heritage alongside a modern view of the sky.",
    cta: "ورق زدن اطلس",
    ctaEn: "Browse the atlas",
    requiresLogin: true,
  },
  {
    id: "charts",
    href: "/charts",
    title: "ریتم خورشید، زمین و ماه.",
    titleEn: "Follow the rhythm of our solar system.",
    eyebrow: "داده های لایو",
    eyebrowEn: "Live data",
    description:
      "حرکت خورشید، زمین و ماه و تغییر مختصات نجومی را در نمودارهای به‌روز دنبال کنید. هر نمودار، راه دیگری برای دیدن نظم و حرکت آسمان است.",
    descriptionEn:
      "Follow the Sun, Earth, Moon, and changing astronomical coordinates through updated charts. Each plot offers another way to see the order and motion of the sky.",
    cta: "دیدن نمودارها",
    ctaEn: "See the charts",
  },
  {
    id: "course",
    href: "/course",
    title: "اسمارت، در قالب درس‌نامهٔ کروی.",
    titleEn: "Smart, one chapter at a time.",
    eyebrow: "درس‌نامهٔ کروی",
    eyebrowEn: "Spherical course",
    description:
      "خلاصه‌ها، شکل‌ها و درس‌های فعلی نجوم کروی اسمارت را مرور کنید. این بخش هنوز خیلی کار دارد؛ فعلاً برای مرور و دیدن خلاصه‌ها مناسب‌تر است و هنوز آن را به‌عنوان مرجع آموزش توصیه نمی‌کنم.",
    descriptionEn:
      "Browse the current summaries, diagrams, and lessons based on Smart’s Spherical Astronomy. There is still a lot to do: it is useful for an overview, but I do not yet recommend it as a teaching reference.",
    cta: "مرور درس‌های فعلی",
    ctaEn: "Browse the current lessons",
    developing: true,
    wide: true,
  },
  {
    id: "map",
    href: "/map",
    title: "جای شما در این جهان کجاست؟",
    titleEn: "Where are you in this world?",
    eyebrow: "نقشه و موقعیت",
    eyebrowEn: "Map and location",
    description:
      "موقعیت خود را روی نقشه پیدا کنید، فاصله‌ها و جهت‌ها را بشناسید و ارتباط جای ناظر روی زمین با هندسهٔ کره را ببینید.",
    descriptionEn:
      "Find your place on the map, explore distances and directions, and connect your position on Earth with the geometry of a sphere.",
    cta: "رفتن به نقشه",
    ctaEn: "Open the map",
  },
];
export default function HomePage() {
  const { fa, t } = useLanguage();
  const Arrow = fa ? ArrowUpLeft : ArrowUpRight;
  return (
    <LocalizedDigits>
      <div className="fanous-home">
        <Hero />
        <section
          id="explore"
          className="home-shell home-explore"
          aria-labelledby="explore-title"
        >
          <header className="home-section-heading">
            <div>
              <p className="home-eyebrow">
                {t("پنجره‌ای را انتخاب کنید", "Choose your window")}
              </p>
              <h2 id="explore-title">
                {t(
                  "هر کنجکاوی، یک راه به آسمان.",
                  "Let your curiosity choose the way.",
                )}
              </h2>
            </div>
            <p>
              {t(
                "از تماشای یک صورت فلکی تا شناختن ستاره‌های عکس خودتان؛ روی هر کارت بزنید و وارد همان بخش شوید.",
                "From finding a constellation to recognising the stars in your own photo—choose a card and step inside.",
              )}
            </p>
          </header>
          <div className="home-feature-grid">
            {FEATURES.map((f) => (
              <Link
                prefetch={false}
                key={f.id}
                href={f.href}
                className={`home-feature-card feature-card-${f.id}${f.wide ? " feature-wide" : ""}${f.developing ? " feature-developing" : ""}`}
                aria-labelledby={`feature-${f.id}-title`}
              >
                <div className="feature-art">
                  <FeaturePreview kind={f.id} />
                  <span className="feature-preview-label">
                    {t("پیش‌نمایش", "Preview")}
                  </span>
                  {f.requiresLogin && (
                    <span className="feature-access">
                      <LockKeyhole size={12} />
                      {t("با حساب گوگل", "Google sign-in")}
                    </span>
                  )}
                  {f.developing && (
                    <span className="feature-access feature-status">
                      <Construction size={13} />
                      {t("در حال تکمیل", "Work in progress")}
                    </span>
                  )}
                </div>
                <div className="feature-copy">
                  <p className="home-eyebrow">{fa ? f.eyebrow : f.eyebrowEn}</p>
                  <h3 id={`feature-${f.id}-title`}>
                    {fa ? f.title : f.titleEn}
                  </h3>
                  <p className="feature-description">
                    {fa ? f.description : f.descriptionEn}
                  </p>
                  <span className="feature-cta">
                    {fa ? f.cta : f.ctaEn}
                    <Arrow size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <Heritage />
        <section
          className="home-shell phone-section dark-surface"
          aria-labelledby="phone-title"
        >
          <div className="phone-art">
            <FeaturePreview kind="compass" />
            <span className="phone-icon">
              <Smartphone size={24} />
            </span>
          </div>
          <div className="phone-copy">
            <p className="home-eyebrow">
              {t(
                "یک همراه کوچک برای شب‌های رصد",
                "A little companion for a night under the stars",
              )}
            </p>
            <h2 id="phone-title">
              {t(
                "گوشی‌تان هم می‌تواند هم‌سفر آسمان باشد.",
                "Your phone can join the adventure.",
              )}
            </h2>
            <p>
              {t(
                "در گوشی‌های اندرویدی و مرورگرهای سازگار، فانوس خیال می‌تواند با اجازهٔ شما از موقعیت و حسگرهای جهت‌یابیِ موجود استفاده کند. ابزارهای موقعیت، قطب‌نما و نقشهٔ آسمان کمک می‌کنند آسمان اطرافتان را بهتر بشناسید.",
                "On supported Android phones and browsers, Fanous-e Khial can use your location and available orientation sensors—with your permission. Location tools, the compass, and the sky map help you get to know the sky around you.",
              )}
            </p>
            <ul>
              <li>
                <ShieldCheck size={16} />
                {t(
                  "دسترسی فقط با اجازهٔ شما",
                  "Access only with your permission",
                )}
              </li>
              <li>
                <MapPin size={16} />
                {t(
                  "امکان ورود دستی موقعیت در ابزارهای پشتیبان",
                  "Manual location entry in supported tools",
                )}
              </li>
            </ul>
            <Link prefetch={false} className="home-text-link" href="/compass">
              {t("رفتن به قطب‌نما و حسگرها", "Open the compass and sensors")}
              <Arrow size={17} />
            </Link>
            <small>
              {t(
                "در دسترس بودن حسگرها به گوشی، مرورگر و مجوزهای شما بستگی دارد؛ این ابزارها جایگزین ابزار دقیق رصدی نیستند.",
                "Sensor availability depends on your phone, browser, and permissions. These tools do not replace precision observing instruments.",
              )}
            </small>
          </div>
        </section>
        <BuilderStory />
        <section
          className="home-shell home-in-progress"
          aria-labelledby="progress-title"
        >
          <div className="progress-mark">
            <Sparkles size={23} />
          </div>
          <div>
            <p className="home-eyebrow">
              {t("هنوز در آغاز راه", "Still growing")}
            </p>
            <h2 id="progress-title">
              {t(
                "این آسمان، کم‌کم کامل‌تر می‌شود.",
                "This little universe is still taking shape.",
              )}
            </h2>
            <p>
              {t(
                "فانوس خیال هنوز در حال ساخت است، اما بعضی سرویس‌ها همین حالا در دسترس‌اند. درس‌نامهٔ کروی به بازبینی و توسعهٔ بیشتری نیاز دارد؛ امیدوارم به‌زودی آن را به بخشی بسیار بهتر و دوست‌داشتنی‌تر تبدیل کنیم. تا آن روز، کشف و تجربه را از ابزارهای فعلی شروع کنید.",
                "Fanous-e Khial is a work in progress, with several services already available. The spherical course needs more review and development; I hope to make it much better in the days ahead. For now, start exploring with the tools that are here.",
              )}
            </p>
            <div className="home-closing-links">
              <Link prefetch={false} href="/course?tab=proofs">
                <BookOpen size={15} />
                {t("اثبات‌ها و خلاصه‌ها", "Proofs and overviews")}
                <Arrow size={15} />
              </Link>
              <Link prefetch={false} href="/sky">
                <Compass size={15} />
                {t("یک نگاه به آسمان", "Take a look at the sky")}
                <Arrow size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LocalizedDigits>
  );
}
