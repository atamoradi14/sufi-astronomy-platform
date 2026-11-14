import type { Lesson } from "./lessonTypes";

/** Smart Chapter III — Refraction (pp. 58–73), split into teachable steps. */
export const LESSONS_CH3: Lesson[] = [
  {
    id: "refraction-laws",
    chapterId: "ch3",
    titleFa: "قوانین شکست و سمت‌القدم حقیقی / ظاهری",
    titleEn: "Laws of refraction; true and apparent zenith distance",
    level: "متوسط",
    minutes: 40,
    spherePreset: "horizon",
    olympiad: "R = z − ζ · خمش پرتو به‌سوی قائم",
    summaryFa:
      "بند ۳۴ اسمارت: نور ستاره پیش از رسیدن به ناظر از جو می‌گذرد و خم می‌شود. سمت‌القدم ظاهری از حقیقی کوچک‌تر است؛ ستاره بالاتر از جای حقیقی دیده می‌شود.",
    summaryEn:
      "Smart III §34: atmospheric refraction bends the ray toward the vertical. Apparent zenith distance ζ is smaller than the true z; the star appears higher.",
    smart: {
      chapter: "III",
      sections: "§34",
      pages: "58–60",
      figures: ["23"],
    },
    figures: ["fig10"],
    englishFormulas: [
      "ζ = z − R, where R is the astronomical refraction.",
      "The ray is bent toward denser layers → toward the vertical.",
      "Near the horizon R ≈ 34′ (mean conditions).",
    ],
    formulas: [
      {
        display: "ζ = z − R",
        nameFa: "سمت‌القدم ظاهری",
        nameEn: "Apparent zenith distance",
      },
      {
        display: "a_app = a_true + R",
        nameFa: "ارتفاع ظاهری",
        nameEn: "Apparent altitude",
      },
    ],
    sections: [
      {
        headingFa: "گام ۱ — چرا شکست برای نجوم مهم است؟",
        headingEn: "Step 1 — Why refraction matters",
        bodyFa:
          "هر رصد نوری از درون جو زمین انجام می‌شود. جو تا دست‌کم حدود ۱۰۰ مایل ارتفاع دارد (از شهاب‌ها)، اما اثر شکست نوری عمدتاً در حدود ۴۰ مایل پایینی مهم است. بدون تصحیح شکست، میل، عرض جغرافیایی از انتقال نصف‌النهاری، و زمان طلوع/غروب خطا دارند.",
        bodyEn:
          "Every optical observation is made through the atmosphere. Without correcting refraction, declinations, latitudes from meridian transit, and rising/setting times are systematically wrong.",
      },
      {
        headingFa: "گام ۲ — تعریف z، ζ و R",
        headingEn: "Step 2 — Define z, ζ and R",
        bodyFa:
          "z سمت‌القدم حقیقی است: زاویهٔ میان قائم محلی و راستای هندسی (بدون جو) تا جرم. ζ سمت‌القدم مشاهده‌شده است. R = z − ζ شکست نجومی است. چون پرتو به‌سوی قائم خم می‌شود، ζ < z و ارتفاع ظاهری بزرگ‌تر از حقیقی است.",
        bodyEn:
          "z = true zenith distance; ζ = apparent (observed) zenith distance; R = z − ζ. The ray bends toward the vertical, so ζ < z.",
        formula: "R = z − ζ > 0",
      },
      {
        headingFa: "گام ۳ — قوانین شکست (اسنل)",
        headingEn: "Step 3 — Snell’s laws",
        bodyFa:
          "در هر سطح شکست: (۱) پرتو تابش، قائم سطح و پرتو شکسته هم‌صفحه‌اند؛ (۲) μ₁ sin i₁ = μ₂ sin i₂. در جو، μ از ۱ در خلأ تا μ₀ ≈ ۱٫۰۰۰۲۹ در سطح زمین افزایش می‌یابد. لایه‌های کروی هم مرکز با زمین مدل استاندارد اسمارت‌اند.",
        bodyEn:
          "Snell: coplanar incidence and μ sin i continuous. μ rises from 1 in space to ≈1.00029 at the ground. Smart models concentric spherical shells.",
      },
      {
        headingFa: "گام ۴ — اثر افقی",
        headingEn: "Step 4 — Horizon effect",
        bodyFa:
          "نزدیک افق R به حدود ۳۴′ می‌رسد؛ بنابراین خورشید یا ستاره وقتی مرکز هندسی‌اش هنوز زیر افق است طلوع‌کرده دیده می‌شود. در مسائل المپیاد طلوع/غروب باید مشخص شود شکست لحاظ شده یا نه.",
        bodyEn:
          "Near the horizon R ≈ 34′, so rising/setting occurs while the true centre is still below the horizon. Olympiad problems must state whether refraction is included.",
      },
    ],
    example: {
      id: "ex-refraction-horizon",
      titleFa: "جابه‌جایی طلوع به‌خاطر شکست",
      titleEn: "Sunrise shift from refraction",
      source: "Smart III §34 (order-of-magnitude)",
      givenFa: "شکست افقی میانگین R ≈ ۳۴′. از انحنای زمین صرف‌نظر کنید.",
      givenEn: "Mean horizontal refraction R ≈ 34′. Ignore Earth's curvature.",
      findFa: "چقدر زودتر از هندسهٔ خالص، مرکز خورشید در افق ظاهری دیده می‌شود؟",
      findEn: "How much earlier does the Sun’s centre appear on the apparent horizon?",
      steps: [
        {
          fa: "بدون شکست، طلوع وقتی z = ۹۰°. با شکست، ζ = ۹۰° وقتی z = ۹۰° + R.",
          en: "Without refraction sunrise at z = 90°. With refraction, ζ = 90° when z = 90° + R.",
        },
        {
          fa: "پس جرم هنوز حدود ۳۴′ زیر افق هندسی است.",
          en: "The true centre is still ~34′ below the geometric horizon.",
          formula: "Δz ≈ 34′ ≈ 0°.57",
        },
      ],
      resultFa: "جابه‌جایی سمت‌القدم ≈ ۳۴′؛ زمان دقیق به φ و δ بستگی دارد (از dH/dt روی افق).",
      resultEn: "Zenith-distance shift ≈ 34′; time shift depends on φ, δ via dH/dt on the horizon.",
      widget: "rising",
    },
    exercises: [
      {
        textFa: "اگر ارتفاع ظاهری ستاره ۲۰° باشد و R ≈ ۲′.۵، ارتفاع حقیقی تقریباً چند است؟",
        textEn: "Apparent altitude 20°, R ≈ 2′.5. Approximate true altitude?",
        source: "Smart III §34",
        answer: "a_true ≈ 19°.96 (20° − 2′.5)",
      },
      {
        textFa: "چرا شکست سمت (azimuth) را در جو لایه‌ای متقارن تغییر نمی‌دهد؟",
        textEn: "Why does refraction not change azimuth in a spherically layered atmosphere?",
        source: "Smart III",
        answer: "The ray stays in the vertical plane of the star; bending is only in that plane.",
      },
    ],
  },
  {
    id: "refraction-cassini",
    chapterId: "ch3",
    titleFa: "مدل همگن، انتگرال شکست و فرمول کسینی",
    titleEn: "Homogeneous model, refraction integral, and Cassini’s formula",
    level: "المپیاد",
    minutes: 55,
    spherePreset: "horizon",
    olympiad: "R ≈ (μ−1) tan z · بسط A tan ζ + B tan³ ζ",
    summaryFa:
      "از تقریب جو همگن تا انتگرال عمومی (۲۰) اسمارت و صورت عملی کسینی/برادلی با ثابت‌های A و B.",
    summaryEn:
      "From the homogeneous-atmosphere approximation through Smart’s integral (20) to the working Cassini/Bradley series in A, B.",
    smart: {
      chapter: "III",
      sections: "§§35–40",
      pages: "60–68",
      formulae: ["(20)", "(31)", "(32)"],
    },
    figures: ["fig10"],
    englishFormulas: [
      "Homogeneous: R ≈ (μ₀ − 1) tan z.",
      "General integral Smart (20) in refractive index μ(r).",
      "Working form: R = A tan ζ + B tan³ ζ  (Cassini).",
    ],
    formulas: [
      {
        display: "R ≈ (μ₀ − 1) tan z",
        nameFa: "تقریب جو همگن",
        nameEn: "Homogeneous atmosphere",
      },
      {
        display: "R = A tan ζ + B tan³ ζ",
        number: "Cassini",
        nameFa: "صورت کسینی",
        nameEn: "Cassini’s formula",
      },
    ],
    sections: [
      {
        headingFa: "گام ۱ — جو همگن",
        headingEn: "Step 1 — Homogeneous atmosphere",
        bodyFa:
          "اگر جو لایه‌ای با ضریب ثابت μ₀ و ارتفاع معادل H فرض شود، هندسهٔ ساده و قانون اسنل می‌دهد R ≈ (μ₀ − 1) tan z. این تقریب برای zهای کوچک خوب است و نزدیک افق واگرا می‌شود — چون tan z → ∞.",
        bodyEn:
          "A slab of constant μ₀ yields R ≈ (μ₀ − 1) tan z. Useful at moderate z; diverges as z → 90°.",
        formula: "R ≈ (μ₀ − 1) tan z",
      },
      {
        headingFa: "گام ۲ — انتگرال عمومی (۲۰)",
        headingEn: "Step 2 — General integral (20)",
        bodyFa:
          "با لایه‌های کروی، μ = μ(r)، و شعاع زمین، اسمارت انتگرالی برای R می‌سازد که هم چگالی جو و هم انحنای زمین را دربردارد. این اساس نظری جدول‌های شکست است؛ در عمل از بسط‌های truncated استفاده می‌شود.",
        bodyEn:
          "Concentric shells μ(r) give Smart’s integral (20). Tables of mean refraction rest on this theory; practice uses truncated series.",
      },
      {
        headingFa: "گام ۳ — صورت کسینی",
        headingEn: "Step 3 — Cassini’s working formula",
        bodyFa:
          "برای رصد معمولی: R = A tan ζ + B tan³ ζ، که ζ سمت‌القدم ظاهری است. A و B به فشار، دما و طول‌موج بستگی دارند؛ در جداول میانگین برای شرایط استاندارد داده می‌شوند. جملهٔ اول غالب است؛ جملهٔ سوم نزدیک افق مهم می‌شود.",
        bodyEn:
          "R = A tan ζ + B tan³ ζ. A, B depend on pressure, temperature, wavelength. The cubic term matters near the horizon.",
        formula: "R = A tan ζ + B tan³ ζ",
      },
      {
        headingFa: "گام ۴ — تعیین A و B از ستارهٔ قطبی‌گرد",
        headingEn: "Step 4 — A, B from a circumpolar star",
        bodyFa:
          "گذار بالای نصف‌النهاری: z′ = |φ − δ| (با قرارداد مناسب). گذار پایین: z″ = 180° − φ − δ برای ستارهٔ شمالی. با اندازه‌گیری ζ′ و ζ″ و دانستن یکی از φ یا δ، دو معادله برای A و B به‌دست می‌آید. این تمرین کلاسیک فصل III است.",
        bodyEn:
          "Upper and lower culminations of a circumpolar star give two equations in A, B (and possibly φ or δ). Classical Smart III exercise.",
        formula: "z = ζ + A tan ζ + B tan³ ζ",
      },
    ],
    example: {
      id: "ex-cassini-mid",
      titleFa: "شکست در سمت‌القدم متوسط",
      titleEn: "Refraction at moderate zenith distance",
      source: "Smart III · Cassini form (illustrative constants)",
      givenFa: "ζ = ۴۵°، A ≈ ۵۷″٫۸، B ≈ −۰″٫۰۷ (مقادیر نمونهٔ آموزشی).",
      givenEn: "ζ = 45°, A ≈ 57″.8, B ≈ −0″.07 (teaching sample constants).",
      findFa: "R و z حقیقی.",
      findEn: "R and true z.",
      steps: [
        {
          fa: "tan ζ = tan 45° = ۱؛ tan³ ζ = ۱.",
          en: "tan 45° = 1; tan³ 45° = 1.",
        },
        {
          fa: "R = A(1) + B(1) ≈ ۵۷″٫۸ − ۰″٫۰۷ ≈ ۵۷″٫۷ ≈ ۰°.۰۱۶.",
          en: "R = A + B ≈ 57″.7 ≈ 0°.016.",
          formula: "R ≈ 57″.7",
        },
        {
          fa: "z = ζ + R ≈ ۴۵°.۰۱۶.",
          en: "z = ζ + R ≈ 45°.016.",
        },
      ],
      resultFa: "R ≈ ۵۸″؛ z ≈ ۴۵°.۰۱۶",
      resultEn: "R ≈ 58″; z ≈ 45°.016",
    },
    exercises: [
      {
        textFa: "نشان دهید در تقریب همگن، dR/dz ≈ (μ−1) sec² z و توضیح دهید چرا نزدیک افق مدل می‌شکند.",
        textEn: "Show dR/dz ≈ (μ−1) sec² z for the homogeneous model and why it fails near the horizon.",
        source: "Smart III",
      },
      {
        textFa: "دو ستارهٔ همسایه به فاصلهٔ حقیقی D. نشان دهید فاصلهٔ مشاهده‌شده تقریباً D − k D (1 + cos²ψ tan² z) است (تمرین ۷ فصل III).",
        textEn:
          "Neighbouring stars, true distance D: observed distance ≈ D − kD(1 + cos²ψ tan² z) (Smart III, Ex. 7).",
        source: "Smart III Exercises 7",
      },
    ],
  },
  {
    id: "refraction-parallax",
    chapterId: "ch3",
    titleFa: "کاربرد رصدی شکست در نصف‌النهار و افق",
    titleEn: "Observational use of refraction on the meridian and horizon",
    level: "المپیاد",
    minutes: 45,
    spherePreset: "astro-tri",
    olympiad: "تصحیح میل و عرض · طلوع/غروب",
    summaryFa:
      "چگونه R وارد کاهش رصد نصف‌النهاری، تعیین عرض، و زمان‌های طلوع/غروب می‌شود — پل میان فصل III و کاربردهای فصل‌های II/IV.",
    summaryEn:
      "How R enters meridian reductions, latitude, and rising/setting — bridging Chapters III and II/IV.",
    smart: {
      chapter: "III",
      sections: "§§41–end + applications",
      pages: "68–73",
      formulae: ["(31)", "(32)"],
    },
    figures: ["fig17"],
    englishFormulas: [
      "Meridian altitude → true z = ζ + R(ζ) → δ or φ.",
      "Rising/setting with refraction: use z = 90° + R_h instead of 90°.",
    ],
    formulas: [
      {
        display: "z_true = ζ_obs + R(ζ)",
        nameFa: "تصحیح سمت‌القدم نصف‌النهاری",
        nameEn: "Meridian zenith-distance correction",
      },
      {
        display: "cos H₀ = −tan φ tan δ   with z = 90° (+R_h if included)",
        nameFa: "طلوع با/بدون شکست",
        nameEn: "Rising hour angle with/without R",
      },
    ],
    sections: [
      {
        headingFa: "گام ۱ — انتقال نصف‌النهاری",
        headingEn: "Step 1 — Meridian transit",
        bodyFa:
          "ارتفاع اندازه‌گیری‌شده ظاهری است. ابتدا ζ = ۹۰° − a_app را بسازید، R(ζ) را از جدول یا کسینی بیابید، z = ζ + R را بگیرید. سپس با دانستن φ، میل δ = φ ± z (با علامت انتقال بالا/پایین) به‌دست می‌آید — یا برعکس φ از ستارهٔ معلوم‌المیل.",
        bodyEn:
          "Observed altitude is apparent. Form ζ = 90° − a_app, add R(ζ), then recover δ or φ from the meridian relation.",
        formula: "δ = φ − z   (upper culmination, south of zenith, northern hemisphere)",
      },
      {
        headingFa: "گام ۲ — طلوع و غروب",
        headingEn: "Step 2 — Rising and setting",
        bodyFa:
          "بدون شکست، روی افق z = ۹۰° و cos H₀ = −tan φ tan δ. با شکست افقی، شرط ζ = ۹۰° یعنی z = ۹۰° + R_h؛ در مثلث PZX به‌جای ZX = ۹۰° مقدار ۹۰° + R_h می‌نشیند و H₀ اندکی بزرگ‌تر می‌شود (روز طولانی‌تر).",
        bodyEn:
          "Without refraction, z = 90° on the horizon. With horizontal refraction, use z = 90° + R_h in PZX; H₀ increases slightly (longer day).",
      },
      {
        headingFa: "گام ۳ — آنچه شکست تغییر نمی‌دهد",
        headingEn: "Step 3 — What refraction does not change",
        bodyFa:
          "در جو متقارن لایه‌ای، صفحهٔ قائم ستاره حفظ می‌شود؛ بنابراین سمت (azimuth) و زاویهٔ ساعتی لحظه‌ای از خودِ خم‌شدگی تغییر نمی‌کنند — فقط مسیر ارتفاعی جابه‌جا می‌شود. اختلاف‌منظر (فصل IX) اثر هندسی دیگری است و با شکست قاطی نشود.",
        bodyEn:
          "In a spherically layered atmosphere azimuth is unchanged by refraction. Parallax (Ch. IX) is a different geometric effect.",
      },
    ],
    example: {
      id: "ex-meridian-refraction",
      titleFa: "میل از ارتفاع نصف‌النهاری تصحیح‌شده",
      titleEn: "Declination from corrected meridian altitude",
      source: "Smart III + II applications",
      givenFa: "φ = ۳۵°.۰۰۰ N، ارتفاع ظاهری انتقال بالای ستارهٔ جنوبی a_app = ۵۰°.۰۰۰، R ≈ ۱′٫۱۵ در آن ارتفاع.",
      givenEn: "φ = 35°.000 N, apparent upper-transit altitude of a southern star a_app = 50°.000, R ≈ 1′.15.",
      findFa: "میل ستاره.",
      findEn: "The star’s declination.",
      steps: [
        {
          fa: "ζ = ۹۰° − ۵۰° = ۴۰°. z = ۴۰° + ۱′٫۱۵ ≈ ۴۰°.۰۱۹.",
          en: "ζ = 40°. z = 40° + 1′.15 ≈ 40°.019.",
        },
        {
          fa: "ستاره جنوب سمت‌الرأس: δ = φ − z ≈ ۳۵° − ۴۰°.۰۱۹ = −۵°.۰۱۹.",
          en: "South of zenith: δ = φ − z ≈ −5°.019.",
          formula: "δ ≈ −5°.019",
        },
      ],
      resultFa: "δ ≈ −۵°.۰۲",
      resultEn: "δ ≈ −5°.02",
      widget: "pzx",
    },
    exercises: [
      {
        textFa: "برای φ = ۴۰°N و δ = +۱۵°، H₀ را بدون شکست و با R_h = ۳۴′ مقایسه کنید (ZX = ۹۰° در برابر ۹۰°.۵۷).",
        textEn: "Compare H₀ for φ = 40°N, δ = +15° with z = 90° vs z = 90°.57.",
        source: "Smart II + III",
      },
    ],
  },
];
