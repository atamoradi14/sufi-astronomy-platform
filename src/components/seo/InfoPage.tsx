"use client";
import Link from "next/link";
import { useLanguage } from "@/components/language/Language";
import { KhayyamVerse } from "@/components/brand/KhayyamVerse";
export function InfoPage({ kind }: { kind: "about" | "privacy" | "tools" }) {
  const { t } = useLanguage();
  const pages = {
    about: {
      title: t("دربارهٔ فانوس خیال", "About Fanous-e Khial"),
      intro: t(
        "فانوس خیال وب‌سایتی نجومی برای شناختن زیبایی‌های آسمان است؛ از پیدا کردن ستاره‌های یک عکس تا گردش در آسمان شب و آشنایی با میراث دانشمندان ایران.",
        "Fanous-e Khial is a place to discover the beauty of the sky, from finding the stars in a photo to exploring the night sky and the legacy of Iranian astronomers.",
      ),
      sections: [
        [
          t("نامی از روشنایی و حیرت", "A name of light and wonder"),
          t(
            "نام فانوس خیال از رباعی منسوب به خیام الهام گرفته است؛ تصویری شاعرانه از خورشید، جهان و گردش نقش‌ها در روشنایی یک فانوس. اینجا، همان حیرت در برابر آسمان را با رصد، هندسه و میراث نجوم ایران دنبال می‌کنیم.",
            "Fanous-e Khial takes its name from a quatrain attributed to Khayyam: a poetic image of the sun, the world, and figures turning in a lantern’s light. Here, that wonder leads to observation, geometry, and the heritage of Persian astronomy.",
          ),
        ],
        [
          t(
            "درس‌نامهٔ کروی بر پایهٔ اسمارت",
            "A spherical course based on Smart",
          ),
          t(
            "درس‌نامهٔ کروی از فصل‌های اول تا سوم نجوم کروی اسمارت شروع شده است. هنوز به توسعه و بازبینی بیشتری نیاز دارد؛ فعلاً برای مرور خلاصه‌ها از آن استفاده کنید، نه به‌عنوان مرجع آموزش.",
            "The spherical course begins with Chapters I–III of Smart’s Textbook on Spherical Astronomy. It needs more development and review: for now, use it for an overview, rather than as a teaching reference.",
          ),
        ],
        [
          t("الهام از عبدالرحمن صوفی", "Inspired by Abd al-Rahman al-Sufi"),
          t(
            "اطلس صوفی، دو منظر تاریخی کره و آسمان در صور الکواکب را به هندسه و رصد امروز پیوند می‌دهد. نگارهٔ تاریخی با نمودار محاسباتی یکسان نیست و نقش هر کدام مشخص می‌شود.",
            "The Sufi atlas connects the historical globe and sky views in the Book of Fixed Stars with geometry and observation. Historical illustrations and computed diagrams serve different, clearly identified purposes.",
          ),
        ],
        [
          t("دقت و حدود مدل‌ها", "Accuracy and model limits"),
          t(
            "آسمان آموزشی از فهرست ستاره‌های مرجع و هندسهٔ تقریبی استفاده می‌کند و ابزار نجوم‌سنجی رصدخانه‌ای نیست. در هر بخش، قرارداد زاویه، واحدها و تقریب‌های مؤثر توضیح داده می‌شوند.",
            "The educational sky uses reference star positions and approximate geometry; it is not observatory astrometry. Angle conventions, units, and relevant approximations are explained alongside each tool.",
          ),
        ],
      ],
    },
    privacy: {
      title: t("حریم خصوصی در فانوس خیال", "Privacy at Fanous-e Khial"),
      intro: t(
        "برای ورود، از گوگل فقط هویت پایهٔ حساب، نام، تصویر نمایه و ایمیل تأییدشده درخواست می‌شود. دسترسی به ایمیل‌ها یا صندوق Gmail درخواست نمی‌کنیم.",
        "Google sign-in requests only your basic identity, name, profile picture, and verified email. It does not request access to Gmail messages or your inbox.",
      ),
      sections: [
        [
          t("اطلاعات حساب", "Account information"),
          t(
            "شناسهٔ گوگل، نام، ایمیل، نشانی تصویر نمایه، زمان ثبت‌نام، آخرین ورود و تعداد ورود در پایگاه دادهٔ حساب‌ها ذخیره می‌شوند. فقط مدیر مجاز فهرست کاربران را می‌بیند.",
            "Your Google identifier, name, email, profile-picture URL, registration time, last sign-in, and sign-in count are stored in the account database. Only the authorised administrator can view the user list.",
          ),
        ],
        [
          t("کوکی و تنظیمات", "Cookies and preferences"),
          t(
            "کوکی‌های ضروری برای نشست ورود و امنیت ورود استفاده می‌شوند. انتخاب زبان و قالب اعداد به‌صورت محلی در مرورگر شما ذخیره می‌شود.",
            "Essential cookies support the login session and sign-in security. Your language and numeral preferences are stored locally in your browser.",
          ),
        ],
        [
          t("کنترل شما", "Your control"),
          t(
            "می‌توانید از حساب خارج شوید یا مجوز فانوس خیال را در تنظیمات حساب گوگل لغو کنید. برای درخواست حذف اطلاعات حساب، با مدیر سایت پیگیری کنید.",
            "You can sign out or revoke the app’s permission in your Google account settings. To request deletion of your account data, contact the site administrator.",
          ),
        ],
      ],
    },
    tools: {
      title: t("ابزارهای نجومی فانوس خیال", "Fanous-e Khial astronomy tools"),
      intro: t(
        "متن درس‌ها بدون حساب در دسترس است. برای کار با کرهٔ سه‌بعدی، حسگر ستاره و اطلس صوفی با حساب گوگل وارد شوید.",
        "The lessons are public. Sign in with Google to use the 3D sphere, star sensor, and Sufi atlas.",
      ),
      sections: [
        [
          t("کرهٔ سه‌بعدی و مثلث نجومی", "3D sphere and astronomical triangle"),
          t(
            "عظیمه، صغیره و مثلث کروی را بسازید. رأس‌ها را جابه‌جا کنید و ضلع‌ها، زاویه‌ها و زیادی کروی را از همان بردارهای رسم‌شده بسنجید.",
            "Construct great circles, small circles, and spherical triangles. Move vertices and measure sides, angles, and spherical excess from the same vectors used to draw them.",
          ),
        ],
        [
          t("حسگر ستاره برای عکس آسمان", "Star sensor for sky photographs"),
          t(
            "الگوی ستاره‌ها در یک عکس آسمان را با فهرست مرجع مقایسه کنید. نتیجه به کیفیت تصویر، ستاره‌های قابل تشخیص و میدان دید بستگی دارد؛ تطبیق نامطمئن را با موقعیت واقعی آسمان بررسی کنید.",
            "Compare the star pattern in a sky photograph with the reference catalogue. Results depend on image quality, detected stars, and field of view; check uncertain matches against the observed sky.",
          ),
        ],
        [
          t("اطلس صوفی", "Sufi atlas"),
          t(
            "چهل‌وهشت صورت تاریخی را در منظر کره و آسمان مرور و با جدول ستاره‌ها مقایسه کنید. این ابزار، تاریخ نجوم را در کنار آموزش هندسه قرار می‌دهد.",
            "Browse 48 historical constellations in globe and sky views and compare their star tables. The atlas brings the history of astronomy into the geometry course.",
          ),
        ],
      ],
    },
  };
  const page = pages[kind];
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-5 py-12">
      <header className="space-y-4">
        <p className="study-kicker">FANOUS-E KHIAL</p>
        <h1 className="text-3xl text-[var(--gold-soft)]">{page.title}</h1>
        <p className="text-base leading-9 text-[var(--muted)]">{page.intro}</p>
      </header>
      {kind === "about" && <KhayyamVerse full />}
      {page.sections.map(([title, body]) => (
        <section
          key={title}
          className="space-y-3 border-t border-[var(--border)] pt-6"
        >
          <h2 className="text-xl text-[var(--gold-soft)]">{title}</h2>
          <p className="text-sm leading-8">{body}</p>
        </section>
      ))}
      <nav className="flex flex-wrap gap-4 text-sm text-[var(--teal)]">
        <Link prefetch={false} href="/course">
          {t("درس‌نامهٔ کروی", "Spherical course")}
        </Link>
        <Link prefetch={false} href="/lab">
          {t("کرهٔ سه‌بعدی", "3D sphere")}
        </Link>
        <Link prefetch={false} href="/sensor">
          {t("حسگر ستاره", "Star sensor")}
        </Link>
        <Link prefetch={false} href="/atlas">
          {t("اطلس صوفی", "Sufi atlas")}
        </Link>
      </nav>
    </article>
  );
}
