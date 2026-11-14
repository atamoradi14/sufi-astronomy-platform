import type { Lesson } from "./lessonTypes";
export const LESSONS_LATER: Lesson[] = [
  {
    id: "refraction-parallax",
    chapterId: "ch3",
    titleFa: "شکست نور",
    titleEn: "Astronomical refraction",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "horizon",
    olympiad: "z حقیقی و ظاهری · فرمول کسینوس",
    summaryFa:
      "از قانون اسنل تا تقریب شکست: جهت حقیقی و ظاهری، مدل لایه‌های تخت و محدودیت‌های آن.",
    summaryEn:
      "From Snell’s law to refraction: true and apparent directions, plane-parallel layers, and their limitations.",
    smart: {
      chapter: "III",
      sections: "§§34–35",
      pages: "58–62",
      formulae: ["(4)", "(5)", "(6)", "(7)"],
    },
    figures: ["refraction"],
    englishFormulas: ["R=z-\\zeta", "R\\simeq(\\mu_0-1)\\tan\\zeta"],
    formulas: [
      {
        display: "R=z-\\zeta",
        nameFa: "تعریف شکست",
        nameEn: "Refraction definition",
      },
      {
        display: "R\\simeq(\\mu_0-1)\\tan\\zeta",
        nameFa: "تقریب رادیانی لایه‌های تخت",
        nameEn: "Plane-parallel approximation in radians",
      },
    ],
    sections: [
      {
        headingFa: "تعریف کمیت‌های حقیقی و ظاهری",
        headingEn: "Define true and apparent quantities",
        bodyFa:
          "z فاصلهٔ سمت‌الرأسی جهت هندسی ستاره در محل ناظر بدون جو و ζ فاصلهٔ سمت‌الرأسی مماس پرتو رسیده به چشم است. در جو کروی زاویهٔ پرتو با شاقول در بالای جو را نباید عیناً z گرفت. در جو معمول، ستاره بالاتر دیده می‌شود و ζ از z کوچک‌تر است.",
        bodyEn:
          "z is the zenith distance of the unrefracted direction at the observer; ζ is the zenith distance of the arriving ray’s tangent. In spherical layers the ray angle to the vertical at the top is not simply z. Ordinary refraction raises the apparent star, so ζ < z.",
        formula: "R=z-\\zeta=h_{\\rm apparent}-h_{\\rm true}",
      },
      {
        headingFa: "اسنل در لایه‌های موازی",
        headingEn: "Snell through parallel layers",
        bodyFa:
          "در هر مرز μ sin i از قانون اسنل ثابت است. در مدل تخت همهٔ عمودها موازی‌اند؛ با ضریب شکست یک در بالا و μ₀ کنار ناظر، sin z = μ₀ sin ζ نتیجه می‌شود. این رابطه برای جو کرویِ تمام آسمان دقیق نیست.",
        bodyEn:
          "Snell’s law conserves μ sin i across each interface. In the plane-parallel model all normals are parallel; index 1 above and μ₀ at the observer give sin z = μ₀ sin ζ. This is not an exact spherical-atmosphere all-sky law.",
        formula: "\\sin z=\\mu_0\\sin\\zeta",
      },
      {
        headingFa: "بسط بدون پرش",
        headingEn: "Expand without skipped steps",
        bodyFa:
          "z را ζ + R بگذارید و سینوس مجموع را باز کنید. برای R کوچک، sin R تقریباً R و cos R تقریباً یک است. پس R cos ζ = (μ₀ − ۱) sin ζ. تقسیم بر cos ζ نتیجهٔ زیر را می‌دهد؛ R رادیانی است.",
        bodyEn:
          "Set z = ζ + R and expand the sine of a sum. For small R, sin R ≈ R and cos R ≈ 1. Then R cos ζ = (μ₀−1) sin ζ. Divide by cos ζ; R is in radians.",
        formula: "R\\simeq(\\mu_0-1)\\tan\\zeta",
      },
      {
        headingFa: "محدودهٔ اعتبار و واحد ضریب",
        headingEn: "Validity and coefficient units",
        bodyFa:
          "اسمارت تقریب را برای فاصلهٔ سمت‌الرأسی کوچک می‌دهد. ضریب نمونهٔ ۵۸٫۲ ثانیهٔ قوسی به شرایط مرجع متن مربوط است. واگرایی تانژانت در افق شکست مدل است، نه شکست واقعی نامتناهی؛ فشار و دما نیز اثر دارند.",
        bodyEn:
          "Smart introduces this for small zenith distances. The representative 58.2 arcsecond coefficient belongs to the text’s reference conditions. Tangent divergence at the horizon is a model failure, not infinite physical refraction; pressure and temperature also matter.",
      },
    ],
    exercises: [
      {
        textFa:
          "برای μ₀ − ۱ = ۰٫۰۰۰۲۹ و ζ = ۳۰ درجه، R را به رادیان و ثانیهٔ قوسی بیابید؛ چرا این رابطه برای ζ = ۹۰ درجه معتبر نیست؟",
        textEn:
          "For μ₀−1 = 0.00029 and ζ = 30°, find R in radians and arcseconds. Why is the formula invalid at ζ = 90°?",
        source: "Original check based on Smart III §35",
        answer: "R ≈ 0.00016743 rad ≈ 34.54 arcsec",
      },
    ],
  },
  {
    id: "refraction-integral",
    chapterId: "ch3",
    titleFa: "جو کروی: ناوردا و انتگرال شکست",
    titleEn: "Spherical atmosphere: invariant and integral",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "horizon",
    olympiad: "z حقیقی و ظاهری · فرمول کسینوس",
    summaryFa:
      "برای فاصله‌های سمت‌الرأسی بزرگ، عمودهای لایه‌ها دیگر موازی نیستند. جو را پوسته‌های کروی هم‌مرکز با زمین و μ را تابع شعاع r فرض می‌کنیم. i زاویهٔ پرتو با شعاع محلی است؛ آن را با ζ ناظر یکی نگیرید.",
    summaryEn:
      "At large zenith distance layer normals are not parallel. Assume spherical shells concentric with Earth and index μ depending on radius r. Let i be the ray’s angle to the local radius, distinct from the observer’s ζ.",
    smart: {
      chapter: "III",
      sections: "§36",
      pages: "62–65",
    },
    figures: ["refraction"],
    englishFormulas: [
      "\\mu r\\sin i=K",
      "R=\\int_1^{\\mu_0}\\frac{K\\,d\\mu}{\\mu\\sqrt{\\mu^2r(\\mu)^2-K^2}}",
    ],
    formulas: [
      {
        display: "\\mu r\\sin i=K",
        nameFa: "ناوردای پرتو",
        nameEn: "Ray invariant",
      },
      {
        display:
          "R=\\int_1^{\\mu_0}\\frac{K\\,d\\mu}{\\mu\\sqrt{\\mu^2r(\\mu)^2-K^2}}",
        nameFa: "بازنویسی انتگرال ۲۰",
        nameEn: "Restatement of integral (20)",
      },
    ],
    sections: [
      {
        headingFa: "چرا جو کروی؟",
        headingEn: "Why spherical layers?",
        bodyFa:
          "برای فاصله‌های سمت‌الرأسی بزرگ، عمودهای لایه‌ها دیگر موازی نیستند. جو را پوسته‌های کروی هم‌مرکز با زمین و μ را تابع شعاع r فرض می‌کنیم. i زاویهٔ پرتو با شعاع محلی است؛ آن را با ζ ناظر یکی نگیرید.",
        bodyEn:
          "At large zenith distance layer normals are not parallel. Assume spherical shells concentric with Earth and index μ depending on radius r. Let i be the ray’s angle to the local radius, distinct from the observer’s ζ.",
      },
      {
        headingFa: "استخراج ناوردا",
        headingEn: "Derive the invariant",
        bodyFa:
          "در هر مرز، μ sin i از اسنل پیوسته است؛ در هر قطعهٔ مستقیم، r sin i فاصلهٔ ثابت خط از مرکز است. ترکیب این دو در تمام لایه‌ها یک ناوردا می‌دهد. در سطح زمین r برابر a است.",
        bodyEn:
          "Across an interface μ sin i is continuous by Snell. On a straight segment r sin i is the fixed line-to-centre distance. Combining them gives one invariant through all shells, with r = a at the observer.",
        formula: "K=\\mu r\\sin i=\\mu_0a\\sin\\zeta",
      },
      {
        headingFa: "جمع انحراف لایه‌ها",
        headingEn: "Sum the shell bending",
        bodyFa:
          "با رفتن به داخل، افزایش dμ انحراف dR = tan i ضرب در dμ/μ می‌دهد. از ناوردا tan i = K تقسیم بر ریشهٔ μ²r² − K² است. با جمع از ضریب شکست یک تا μ₀ انتگرال زیر به دست می‌آید؛ برای عددگذاری باید r(μ) مشخص باشد.",
        bodyEn:
          "Moving inward gives dR = tan i dμ/μ. The invariant gives tan i = K/√(μ²r²−K²). Integrate from index 1 to μ₀. A numerical evaluation requires a specified profile r(μ).",
        formula:
          "R=\\int_1^{\\mu_0}\\frac{K\\,d\\mu}{\\mu\\sqrt{\\mu^2r(\\mu)^2-K^2}}",
      },
      {
        headingFa: "فرض مدل بخشی از نتیجه است",
        headingEn: "Model assumptions belong to the result",
        bodyFa:
          "تقارن کروی و لایه‌بندی شعاعی فرض‌اند. وارونگی دما و ناهمگنی افقی می‌توانند این مدل را نقض کنند. انتگرال بدون مدل فشار، چگالی و دما یک عدد یکتا نمی‌دهد.",
        bodyEn:
          "Spherical symmetry and radial stratification are assumptions. Temperature inversions and horizontal structure can violate them. The integral alone does not give a unique number without a pressure, density, and temperature model.",
      },
    ],
    exercises: [
      {
        textFa:
          "با r = a ثابت نشان دهید انتگرال به arcsin(μ₀ sin ζ) − ζ تبدیل می‌شود و تا مرتبهٔ اول بسط دهید.",
        textEn:
          "With constant r = a show the integral becomes arcsin(μ₀ sin ζ) − ζ and expand to first order.",
        source: "Original derivation check",
        answer: "R ≈ (μ₀−1) tan ζ",
      },
    ],
  },
  {
    id: "refraction-series",
    chapterId: "ch3",
    titleFa: "بسط شکست و تعیین ضرایب",
    titleEn: "Refraction series and coefficient fitting",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "horizon",
    olympiad: "z حقیقی و ظاهری · فرمول کسینوس",
    summaryFa:
      "اسمارت r/a = ۱ + s می‌گذارد و انتگرال را برای s کوچک بسط می‌دهد. کوچک بودن ارتفاع جو کافی نیست؛ نزدیک افق مخرج کوچک می‌شود و بسط اعتبار ندارد.",
    summaryEn:
      "Smart writes r/a = 1+s and expands for small s. A small atmospheric height alone is insufficient; a small denominator near the horizon invalidates the expansion.",
    smart: {
      chapter: "III",
      sections: "§§37–38",
      pages: "65–69",
    },
    figures: ["refraction"],
    englishFormulas: ["R=A\\tan\\zeta+B\\tan^3\\zeta"],
    formulas: [
      {
        display: "R=A\\tan\\zeta+B\\tan^3\\zeta",
        nameFa: "بسط با B علامت‌دار",
        nameEn: "Series with signed B",
      },
    ],
    sections: [
      {
        headingFa: "پارامتر کوچک و مخرج حساس",
        headingEn: "Small parameter and a sensitive denominator",
        bodyFa:
          "اسمارت r/a = ۱ + s می‌گذارد و انتگرال را برای s کوچک بسط می‌دهد. کوچک بودن ارتفاع جو کافی نیست؛ نزدیک افق مخرج کوچک می‌شود و بسط اعتبار ندارد.",
        bodyEn:
          "Smart writes r/a = 1+s and expands for small s. A small atmospheric height alone is insufficient; a small denominator near the horizon invalidates the expansion.",
      },
      {
        headingFa: "علامت B و واحدها",
        headingEn: "The sign of B and its units",
        bodyFa:
          "قرارداد متن R = A tan ζ + B tan³ ζ است و B میانگین منفی است. اعداد زیر ثانیهٔ قوسی‌اند؛ استفاده از منفی B همراه همین مقدار عددی علامت را برعکس می‌کند.",
        bodyEn:
          "The text uses R = A tan ζ + B tan³ ζ with negative mean B. The coefficients below are arcseconds; writing −B while retaining the same signed value reverses the correction.",
        formula: "R_{\\rm arcsec}\\simeq58.16\\tan\\zeta-0.067\\tan^3\\zeta",
      },
      {
        headingFa: "دو مشاهده، دو مجهول",
        headingEn: "Two observations, two unknowns",
        bodyFa:
          "با معلوم بودن عرض و میل، فاصلهٔ سمت‌الرأسی حقیقی دو عبور را از هندسه می‌یابیم. حقیقی منهای ظاهری دو معادلهٔ خطی برای A و B می‌دهد. برای دو فاصلهٔ یکسان، دستگاه مستقل نیست؛ چندین رصد با دامنهٔ مناسب را با کمترین مربعات ترکیب کنید.",
        bodyEn:
          "With latitude and declination known, compute true zenith distances at the two transits. True minus apparent gives two linear equations for A,B. Identical distances do not give independent equations; combine multiple observations spanning a useful range with least squares.",
        formula:
          "\\begin{bmatrix}\\tan\\zeta_1&\\tan^3\\zeta_1\\\\\\tan\\zeta_2&\\tan^3\\zeta_2\\end{bmatrix}\\begin{bmatrix}A\\\\B\\end{bmatrix}=\\begin{bmatrix}z_1-\\zeta_1\\\\z_2-\\zeta_2\\end{bmatrix}",
      },
      {
        headingFa: "حد تقریب",
        headingEn: "Limit of the expansion",
        bodyFa:
          "اسمارت این بسط را برای فاصله‌های سمت‌الرأسی بیشتر از حدود ۷۵ درجه کافی نمی‌داند. نزدیک افق باید از مدل مناسب جو یا جدول/روش معتبر برای آن ناحیه استفاده کرد.",
        bodyEn:
          "Smart states that the expansion becomes insufficient beyond about 75° zenith distance. Near the horizon use an atmospheric model or a method validated for that regime.",
      },
    ],
    exercises: [
      {
        textFa:
          "با ضرایب میانگین متن، R را برای ζ = ۴۵ درجه بیابید و سهم جملهٔ مکعبی را گزارش کنید.",
        textEn:
          "Using the text’s mean coefficients find R at ζ = 45° and report the cubic correction.",
        source: "Original numerical check",
        answer: "R = 58.093 arcsec; cubic correction = −0.067 arcsec",
      },
    ],
  },
  {
    id: "refraction-horizon",
    chapterId: "ch3",
    titleFa: "شکست، افق و زمان غروب",
    titleEn: "Refraction, the horizon, and sunset timing",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "horizon",
    olympiad: "z حقیقی و ظاهری · فرمول کسینوس",
    summaryFa:
      "ستارهٔ نقطه‌ای در افق ظاهری ارتفاع ظاهری صفر و ارتفاع هندسی تقریباً منفی R افقی دارد. مقدار حدود ۳۴ دقیقهٔ قوسی نمونهٔ مرجع و وابسته به جو است؛ از تانژانت ۹۰ درجه محاسبه نمی‌شود.",
    summaryEn:
      "A point star on the apparent horizon has apparent altitude zero and geometric altitude approximately −R at the horizon. About 34 arcminutes is a representative atmosphere-dependent value, not a value obtained from tan 90°.",
    smart: {
      chapter: "III",
      sections: "§39 and exercises",
      pages: "69–73",
    },
    figures: ["refraction"],
    englishFormulas: ["h_{\\rm apparent}=h_{\\rm true}+R"],
    formulas: [
      {
        display: "h_{\\rm apparent}=h_{\\rm true}+R",
        nameFa: "ارتفاع ظاهری",
        nameEn: "Apparent altitude",
      },
    ],
    sections: [
      {
        headingFa: "افق هندسی و ظاهری",
        headingEn: "Geometric and apparent horizon",
        bodyFa:
          "ستارهٔ نقطه‌ای در افق ظاهری ارتفاع ظاهری صفر و ارتفاع هندسی تقریباً منفی R افقی دارد. مقدار حدود ۳۴ دقیقهٔ قوسی نمونهٔ مرجع و وابسته به جو است؛ از تانژانت ۹۰ درجه محاسبه نمی‌شود.",
        bodyEn:
          "A point star on the apparent horizon has apparent altitude zero and geometric altitude approximately −R at the horizon. About 34 arcminutes is a representative atmosphere-dependent value, not a value obtained from tan 90°.",
      },
      {
        headingFa: "ارتفاع آستانهٔ مشخص",
        headingEn: "A specified altitude threshold",
        bodyFa:
          "برای ارتفاع هندسی آستانه h₀، همان قانون ارتفاع را برای H₀ حل کنید. طرف راست خارج از بازهٔ منفی یک تا یک یعنی رویداد وجود ندارد. آستانهٔ ستارهٔ نقطه‌ای با مرکز یا لبهٔ خورشید فرق دارد.",
        bodyEn:
          "For a chosen geometric threshold h₀ solve the altitude equation for H₀. A cosine outside [−1,1] means there is no event. A point-star threshold differs from a solar-centre or limb threshold.",
        formula:
          "\\cos H_0=\\frac{\\sin h_0-\\sin\\varphi\\sin\\delta}{\\cos\\varphi\\cos\\delta}",
      },
      {
        headingFa: "تأخیر غروب از مشتق",
        headingEn: "Setting delay from a derivative",
        bodyFa:
          "با مشتق نسبت به H، نرخ ارتفاع به دست می‌آید. برای افت کوچک هندسی به اندازهٔ R، تغییر مثبت H در غروب از رابطهٔ زیر حاصل می‌شود. نزدیک مسیر مماس با افق، sin H کوچک است و تقریب خطی حساس می‌شود.",
        bodyEn:
          "Differentiate with respect to H. A small geometric drop R gives a positive hour-angle shift at setting as below. Near a grazing path small sin H makes the linear estimate sensitive.",
        formula:
          "\\frac{dh}{dH}=-\\frac{\\cos\\varphi\\cos\\delta\\sin H}{\\cos h},\\quad\\Delta H\\simeq\\frac{R\\cos h}{\\cos\\varphi\\cos\\delta\\sin H}",
      },
      {
        headingFa: "خورشید نقطه نیست",
        headingEn: "The Sun is not a point",
        bodyFa:
          "برای آخرین تماس خورشید، نیم‌قطر ظاهری قرص هم وارد می‌شود. تقریب مرکز خورشید در حدود منفی ۵۰ دقیقهٔ قوسی، جمع نمونهٔ شکست و نیم‌قطر است؛ یک ثابت جهانی یا پیش‌بینی دقیق وضعیت جو نیست.",
        bodyEn:
          "Last solar contact also includes the disc’s angular semidiameter. A centre threshold near −50 arcminutes combines representative refraction and semidiameter; it is not a universal constant or a precise atmospheric forecast.",
      },
    ],
    exercises: [
      {
        textFa:
          "در استوا و اعتدال، شکست نمونهٔ ۳۴ دقیقهٔ قوسی غروب ستارهٔ نقطه‌ای را تقریباً چند دقیقهٔ زمان عقب می‌اندازد؟",
        textEn:
          "At the equator and equinox, approximately how many time minutes does representative 34 arcminute refraction delay a point star’s setting?",
        source: "Original limiting-case check",
        answer: "Approximately 2.27 minutes of time",
      },
    ],
  },
  {
    id: "meridian-circle",
    chapterId: "ch4",
    titleFa: "دایرهٔ نصف‌النهاری",
    titleEn: "The meridian circle",
    level: "المپیاد",
    minutes: 45,
    spherePreset: "celestial",
    olympiad: "خطای همخطی، تراز، سمت · بسل",
    summaryFa:
      "فصل IV: ابزار بنیادی تعیین α و δ. سه خطای هندسی — collimation c، level b، azimuth a — و تصحیح زمان عبور بسل.",
    summaryEn:
      "Smart IV: collimation, level and azimuth errors; Bessel’s transit reduction; RA and Dec from the instrument.",
    smart: {
      chapter: "IV",
      sections: "full chapter",
      pages: "74–98",
    },
    figures: ["fig17"],
    englishFormulas: [
      "Bessel: Δt ≈ c sec δ + b cos(φ−δ) sec δ + a sin(φ−δ) sec δ  (seconds of time, small-angle form).",
      "Declination from measured zenith distance on the meridian after refraction.",
    ],
    formulas: [
      {
        display: "Δt = c sec δ + (b cos z + a sin z) sec δ",
        nameFa: "تصحیح بسل زمان عبور (صورت آموزشی)",
        nameEn: "Bessel transit correction (teaching form)",
      },
    ],
    sections: [
      {
        headingFa: "سه خطای هندسی",
        headingEn: "Three geometric errors",
        bodyFa:
          "محور دوران باید شرق–غرب و افقی باشد و صفحهٔ همخطی باید نصف‌النهار باشد. خطاهای کوچک: سمت a (غروب‌تر از شاقول افق)، تراز b (یک سر محور بالاتر)، همخطی c (صفحهٔ سیم‌ها از صفحهٔ عمود بر محور جداست). ستاره روی سیم مرکزی نه دقیقاً روی نصف‌النهار حقیقی دیده می‌شود.",
        bodyEn:
          "The rotation axis should be east–west and horizontal, and the collimation plane should be the meridian. Small errors: azimuth a, level b, collimation c. The star is observed on the central wire not exactly on the true meridian.",
      },
      {
        headingFa: "از عبور تا بعد",
        headingEn: "From transit to right ascension",
        bodyFa:
          "زمان عبور تصحیح‌شده، زمان نجومی محلی عبور نصف‌النهار است و برابر بعد ستاره است (ST = α در نصف‌النهار). بعد از عبور خورشید در انحراف بهاری و از ساعت نجومی کالیبره می‌شود. میل از سمت‌الرأسی نصف‌النهاری پس از شکست به‌دست می‌آید: δ = φ − z (جنوب سمت‌الرأس با قرارداد علامت معمول).",
        bodyEn:
          "The corrected transit time is the local sidereal time of meridian passage, equal to the star’s RA. Declination follows from the meridian zenith distance after refraction: δ = φ − z with the usual sign convention south of the zenith.",
      },
    ],
    exercises: [
      {
        textFa:
          "با دو ستارهٔ نزدیک‌قطب، خطای سمت دایرهٔ نصف‌النهاری را برآورد کنید (تمرین لندن ۱۹۲۶ در فصل IV).",
        textEn:
          "From two near-polar stars, estimate the azimuth error of the meridian circle (London 1926 exercise in Smart IV).",
        source: "Smart IV Exercises",
      },
    ],
  },
  {
    id: "kepler",
    chapterId: "ch5",
    titleFa: "حرکت سیاره‌ای و معادلهٔ کپلر",
    titleEn: "Planetary motion and Kepler’s equation",
    level: "المپیاد",
    minutes: 55,
    spherePreset: "ecliptic",
    olympiad: "آنومالی‌های سه‌گانه از مرکز · مدار در صفحه",
    summaryFa:
      "فصل V: قانون مربع معکوس، قوانین کپلر، vis viva، آنومالی خارج از مرکز/متوسط/حقیقی، معادلهٔ کپلر M = E − e sin E، و هفت عنصر مدار.",
    summaryEn:
      "Smart V: inverse-square motion, vis viva, eccentric anomaly, Kepler’s equation, orbital elements.",
    smart: {
      chapter: "V",
      sections: "§§ Kepler’s equation, elements",
      pages: "99–135",
      formulae: ["Kepler M = E − e sin E"],
    },
    figures: ["fig19"],
    englishFormulas: [
      "Kepler I: ellipse, Sun at a focus.  II: equal areas.  III: n² a³ = μ.",
      "M = n(t − T) = E − e sin E.",
      "r = a(1 − e cos E),   tan(v/2) = √[(1+e)/(1−e)] tan(E/2).",
    ],
    formulas: [
      {
        display: "M = E − e sin E",
        nameFa: "معادلهٔ کپلر",
        nameEn: "Kepler’s equation",
      },
      {
        display: "r = a (1 − e cos E)",
        nameFa: "طول شعاع حامل",
        nameEn: "Radius vector",
      },
      {
        display: "v² = μ (2/r − 1/a)",
        nameFa: "vis viva",
        nameEn: "Vis-viva integral",
      },
    ],
    sections: [
      {
        headingFa: "از نیوتن تا کپلر",
        headingEn: "From Newton to Kepler",
        bodyFa:
          "شتاب نسبی به سوی خورشید −G(M+m)/r² روی جرم است. مدارهای بسته بیضی‌اند با خورشید در کانون. سرعت مساحتی h = r²θ̇ ثابت است. حرکت متوسط n² a³ = μ را با n حرکت متوسط سیاره برآورده می‌کند.",
        bodyEn:
          "Relative acceleration toward the Sun is −G(M+m)/r². Bound orbits are ellipses with the Sun at a focus. Areal velocity h = r²θ̇ is constant. Mean motion satisfies n² a³ = μ.",
      },
      {
        headingFa: "سه آنومالی",
        headingEn: "Three anomalies",
        bodyFa:
          "آنومالی حقیقی v زاویه از حضیض در کانون است. آنومالی خارج از مرکز E زاویه روی دایرهٔ کمکی است. آنومالی متوسط M = n(t−T) زاویهٔ یکنواخت است. معادلهٔ کپلر M = E − e sin E را برای E حل می‌کنند، سپس r و v از E.",
        bodyEn:
          "True anomaly v is the focus angle from perihelion; eccentric anomaly E is the auxiliary-circle angle; mean anomaly M = n(t−T) is uniform. Kepler’s equation M = E − e sin E is solved for E, then r and v follow.",
        formula: "M = E − e sin E",
      },
      {
        headingFa: "عناصر و تبدیل به استوا",
        headingEn: "Elements and the equatorial frame",
        bodyFa:
          "عناصر کلاسیک: a, e, i, Ω, ω, T (یا M₀). اسمارت بردار شعاع مدار را با سه دوران به محورهای دایرة‌البروج و سپس استوا می‌برد و α، δ را از X,Y,Z زمین‌مرکز می‌خواند.",
        bodyEn:
          "Classical elements a, e, i, Ω, ω, T. Smart rotates the orbital radius into ecliptic then equatorial axes and reads α, δ from the geocentric vector.",
      },
    ],
    exercises: [
      {
        textFa:
          "با دورهٔ سیاره T به سال، نیم‌قطر بزرگ را به AU از کپلر III بنویسید.",
        textEn:
          "Given a planet’s period T in years, express its semi-major axis in AU from Kepler III.",
        source: "Smart V",
        answer: "a = T^{2/3} AU (Sun’s mass dominating)",
      },
    ],
  },
  {
    id: "calendar-time",
    chapterId: "ch6",
    titleFa: "زمان، معادلهٔ زمان و تقویم",
    titleEn: "Time, the equation of time, and the calendar",
    level: "متوسط",
    minutes: 45,
    spherePreset: "celestial",
    olympiad: "سال اعتدالی · گرگوری · فرمول مرکز",
    summaryFa:
      "فصل VI: روز نجومی در برابر روز خورشیدی، سال اعتدالی، تقویم‌های ژولیانی/گرگوری، معادلهٔ مرکز و فصل‌ها از طول خورشید.",
    summaryEn:
      "Smart VI: sidereal vs solar day; tropical year; Julian/Gregorian calendars; equation of centre and the seasons.",
    smart: {
      chapter: "VI",
      sections: "calendar, equation of time, seasons",
      pages: "136–157",
    },
    figures: ["fig21"],
    englishFormulas: [
      "Tropical year ≈ 365.2422 mean solar days.",
      "Gregorian: century years are leap only if divisible by 400.",
      "Equation of centre: λ ≈ L + 2e sin M  (first order).",
    ],
    formulas: [
      {
        display: "tropical year ≈ 365.2422 d",
        nameFa: "سال اعتدالی",
        nameEn: "Tropical year",
      },
      {
        display: "λ ≈ L₀ + 2e sin M",
        nameFa: "معادلهٔ مرکز (مرتبهٔ e)",
        nameEn: "Equation of the centre",
      },
    ],
    sections: [
      {
        headingFa: "چرا قطب حرکت می‌کند",
        headingEn: "Why the pole moves",
        bodyFa:
          "اسمارت فصل زمان را با تقدیم می‌گذارد: دو هزار سال پیش قطب ۱۲° از Polarist فاصله داشت؛ در ۱۲۰۰۰ سال نزدیک Vega خواهد نشست. سال اعتدالی فاصلهٔ بازگشت خورشید به ♈ است، نه به همان ستاره (سال نجومی).",
        bodyEn:
          "Precession: two thousand years ago the pole was 12° from Polaris; in 12 000 years it will lie near Vega. The tropical year is the return of the Sun to ♈, not to the same star (sidereal year).",
      },
      {
        headingFa: "ژولیانی و گرگوری",
        headingEn: "Julian and Gregorian",
        bodyFa:
          "ژولیانی هر چهار سال یک سال کبیسه می‌گذارد (سال متوسط ۳۶۵.۲۵ روز) و نسبت به سال اعتدالی کمی زیاد است. گرگوری (۱۵۸۲؛ بریتانیا ۱۷۵۲) سال‌های قرن را مگر بخش‌پذیر بر ۴۰۰ کبیسه نمی‌گذارد: ۱۷۰۰، ۱۸۰۰، ۱۹۰۰ عادی، ۲۰۰۰ کبیسه.",
        bodyEn:
          "Julian leap years every four years average 365.25 d. Gregorian (1582; Britain 1752) drops century leap years unless divisible by 400: 1700, 1800, 1900 common, 2000 leap.",
      },
      {
        headingFa: "فصل‌ها از معادلهٔ مرکز",
        headingEn: "Seasons from the equation of the centre",
        bodyFa:
          "طول فصل از حرکت ناهموار خورشید روی دایرة‌البروج به‌دست می‌آید. تا مرتبهٔ اول در e، λ = L + 2e sin M. حضیض در ژانویه زمستان شمالی را از تابستان کوتاه‌تر می‌کند.",
        bodyEn:
          "Season lengths follow from the Sun’s unequal motion. To first order in e, λ = L + 2e sin M. Perihelion in January makes northern winter shorter than summer.",
      },
    ],
    exercises: [
      {
        textFa: "چرا سال ۲۰۰۰ کبیسه بود و ۱۹۰۰ نبود؟",
        textEn: "Why was 2000 a leap year and 1900 not?",
        source: "Smart VI",
        answer: "Gregorian: century leap only if ÷ 400.",
      },
    ],
  },
  {
    id: "planetary-phenomena",
    chapterId: "ch7",
    titleFa: "پدیده‌های سیاره‌ای و درخشندگی",
    titleEn: "Planetary phenomena and brightness",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "ecliptic",
    olympiad: "کشیدگی · ایست · فاز",
    summaryFa:
      "فصل VII: کشیدگی، مقارنه و مقابله، نقطهٔ ایست، فاز، و درخشندگی ظاهری ∝ فاز / Δ². مختصات خورشیدمرکزی روی قرص خورشید.",
    summaryEn:
      "Smart VII: elongation, conjunction, opposition, stationary points, phase, brightness; heliographic coordinates.",
    smart: {
      chapter: "VII",
      sections: "phenomena, brightness, heliographic",
      pages: "158–177",
      formulae: ["(24) brightness"],
    },
    figures: ["fig19"],
    englishFormulas: [
      "Synodic period 1/S = |1/T − 1/T′|.",
      "Brightness B ∝ ψ / Δ², with ψ the illuminated fraction (phase).",
    ],
    formulas: [
      {
        display: "1/S = |1/T − 1/T′|",
        nameFa: "دورهٔ هلالی",
        nameEn: "Synodic period",
      },
      {
        display: "B ∝ ψ / Δ²",
        number: "VII.(24)",
        nameFa: "درخشندگی ظاهری",
        nameEn: "Apparent brightness",
      },
    ],
    sections: [
      {
        headingFa: "کشیدگی و نقطهٔ ایست",
        headingEn: "Elongation and stationary points",
        bodyFa:
          "کشیدگی زاویهٔ خورشید–زمین–سیاره است. سیاره‌های داخلی به مقارنهٔ داخلی/خارجی می‌رسند؛ سیاره‌های خارجی به مقابله و مقارنه. وقتی dl/dt ظاهری صفر شود نقطهٔ ایست است؛ شرط کلاسیک از توازی طول روی دایرة‌البروج مدار زمین به‌دست می‌آید.",
        bodyEn:
          "Elongation is the Sun–Earth–planet angle. Inferior planets reach inferior/superior conjunction; superior planets reach opposition and conjunction. A stationary point is where the apparent dl/dt vanishes.",
      },
      {
        headingFa: "فاز و درخشندگی",
        headingEn: "Phase and brightness",
        bodyFa:
          "فاز کسر روشن قرص است، تابعی از زاویهٔ فاز. شار با ۱/Δ² می‌افتد، پس B ∝ ψ/Δ²، پایهٔ قدر ظاهری سیاره. قدر ظاهری از همین نسبت و قدر پایه ساخته می‌شود.",
        bodyEn:
          "Phase is the illuminated fraction, a function of the phase angle. Flux falls as 1/Δ², so B ∝ ψ/Δ², the basis of a planet’s apparent magnitude.",
      },
    ],
    exercises: [
      {
        textFa:
          "ثابت کنید وقتی سیاره با میل غیرصفر مطلقاً ایست است، دو جهت سرعت روی خط گره‌ها به هم می‌رسند (تمرین ۹ فصل).",
        textEn:
          "If a planet with non-zero inclination is absolutely stationary, the two velocity directions meet on the line of nodes (Smart VII, Ex. 9).",
        source: "Smart VII Exercises 9",
      },
    ],
  },
  {
    id: "aberration",
    chapterId: "ch8",
    titleFa: "انحراف نوری",
    titleEn: "Aberration",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "celestial",
    olympiad: "κ ≈ ۲۰″.۵ · انحراف روزانه",
    summaryFa:
      "فصل VIII: بردلی؛ انحراف سالانه با ثابت κ؛ جملهٔ بیضوی از vis viva؛ و انحراف روزانه در عبور که از دوران زمین می‌آید.",
    summaryEn:
      "Smart VIII: Bradley; annual aberration constant κ; elliptic term; diurnal aberration at transit.",
    smart: {
      chapter: "VIII",
      sections: "annual and diurnal",
      pages: "178–193",
      formulae: ["(52) diurnal"],
    },
    figures: ["fig18"],
    englishFormulas: [
      "Annual aberration constant κ = v⊕/c ≈ 20″.5.",
      "Diurnal aberration delays meridian transit by 0ˢ.021 cos φ sec δ.",
    ],
    formulas: [
      {
        display: "κ = v⊕ / c ≈ 20″.5",
        nameFa: "ثابت انحراف سالانه",
        nameEn: "Annual aberration constant",
      },
      {
        display: "Δt = 0ˢ.021 cos φ sec δ",
        nameFa: "تأخیر عبور از انحراف روزانه",
        nameEn: "Diurnal aberration at transit",
      },
    ],
    sections: [
      {
        headingFa: "سالانه",
        headingEn: "Annual aberration",
        bodyFa:
          "حرکت مداری زمین جای ظاهری ستاره را به‌اندازهٔ κ sin θ جابه‌جا می‌کند، با κ = v⊕/c ≈ 20″.5. خروج از مرکز مدار جملهٔ بیضوی کوچکی از vis viva فصل V می‌افزاید که اسمارت در vis viva مرتبهٔ e تصحیح می‌کند.",
        bodyEn:
          "The Earth’s orbital motion displaces a star by κ sin θ, with κ = v⊕/c ≈ 20″.5. Eccentricity adds a small elliptic term built from the vis-viva velocity of Chapter V.",
      },
      {
        headingFa: "روزانه روی دایرهٔ نصف‌النهاری",
        headingEn: "Diurnal aberration on the meridian",
        bodyFa:
          "گردش زمین ستاره را به شرق جابه‌جا می‌کند، پس عبور دیرتر رخ می‌دهد. در H = 0 فرمول اسمارت تأخیر ۰ˢ.۰۲۱ cos φ sec δ را می‌دهد. روی استوا و میل صفر این تأخیر ۰ˢ.۰۲۱ است.",
        bodyEn:
          "Earth’s rotation displaces the star eastwards, so transit is late. At H = 0 Smart’s formula gives a delay 0ˢ.021 cos φ sec δ.",
        formula: "Δt = 0ˢ.021 cos φ sec δ",
      },
    ],
    exercises: [
      {
        textFa:
          "تأخیر عبور قطبی (δ = ۶۰°) را در عرض ۴۰° از انحراف روزانه حساب کنید.",
        textEn: "Diurnal-aberration delay at φ = 40°, δ = 60°.",
        source: "Smart VIII",
        answer: "≈ 0ˢ.032",
      },
    ],
  },
  {
    id: "parallax",
    chapterId: "ch9",
    titleFa: "اختلاف‌منظر زمین‌مرکز و ستاره‌ای",
    titleEn: "Geocentric and stellar parallax",
    level: "المپیاد",
    minutes: 50,
    spherePreset: "horizon",
    olympiad: "π افق · عامل اختلاف‌منظر",
    summaryFa:
      "فصل IX: اختلاف‌منظر روزانهٔ ماه و سیارات؛ سمت‌الرأسی افقی استوایی؛ و اختلاف‌منظر ستاره‌ای سالانه با عامل F در بعد.",
    summaryEn:
      "Smart IX: diurnal parallax of Moon and planets; equatorial horizontal parallax; stellar parallax factor.",
    smart: {
      chapter: "IX",
      sections: "diurnal and stellar",
      pages: "194–222",
      formulae: ["(35)", "(67)", "(68)"],
    },
    figures: ["fig16"],
    englishFormulas: [
      "sin p = (Δ / r) sin z′   (geocentric diurnal parallax).",
      "Moon’s equatorial horizontal parallax ≈ 57′.",
      "Δα cos δ = F ϖ,   F = Y cos α − X sin α     (67)(68).",
    ],
    formulas: [
      {
        display: "sin p = (Δ / r) sin z′",
        nameFa: "اختلاف‌منظر روزانه",
        nameEn: "Diurnal parallax",
      },
      {
        display: "Δα cos δ = F ϖ",
        number: "IX.(67)",
        nameFa: "اثر اختلاف‌منظر ستاره‌ای در بعد",
        nameEn: "Stellar parallax in RA",
      },
    ],
    sections: [
      {
        headingFa: "روزانه و ماه",
        headingEn: "Diurnal parallax and the Moon",
        bodyFa:
          "ناظر روی سطح است نه در مرکز. جهت ماه از O با آن از C به‌اندازهٔ p فرق دارد: sin p = (Δ/r) sin z′. در افق z′ = 90° و p = π افقی. برای ماه π ≈ ۵۷′؛ برای سیارات کوچک‌تر است و برای اروس π ممکن است ~۳۰″ باشد، پس مربعات Δ/r را می‌اندازند.",
        bodyEn:
          "The observer is on the surface, not at the centre. The Moon’s direction from O differs from that from C by p, with sin p = (Δ/r) sin z′. On the horizon p is the horizontal parallax, ≈ 57′ for the Moon. For Eros π may be ~30″, so squares of Δ/r are dropped.",
      },
      {
        headingFa: "اختلاف‌منظر ستاره‌ای و عامل F",
        headingEn: "Stellar parallax and factor F",
        bodyFa:
          "جابه‌جایی سالانه روی بیضی با نیم‌قطر ϖ (اختلاف‌منظر) است. در بعد، Δα cos δ = F ϖ که F = Y cos α − X sin α از طول حقیقی خورشید ساخته می‌شود و با طول خورشید وقتی شرق است تمام می‌شود. سری‌های عکاسی ϖ را از این عامل تعیین می‌کنند.",
        bodyEn:
          "Annual displacement is an ellipse of semi-axis ϖ. In RA, Δα cos δ = F ϖ with F = Y cos α − X sin α, a function of the Sun’s true longitude. Photographic series determine ϖ from this factor.",
        formula: "F = Y cos α − X sin α",
      },
      {
        headingFa: "سرعت شعاعی روزانه",
        headingEn: "Diurnal radial velocity",
        bodyFa:
          "گردش زمین مؤلفهٔ شعاعی R′ = 0.47 cos φ cos δ sin H km s⁻¹ به سرعت شعاعی می‌افزاید (مثبت اگر receding). در H = 0ʰ یا ۱۲ʰ صفر است.",
        bodyEn:
          "Earth rotation adds a radial component R′ = 0.47 cos φ cos δ sin H km s⁻¹ (positive if recession). It vanishes at H = 0ʰ or 12ʰ.",
      },
    ],
    exercises: [
      {
        textFa:
          "π افقی ماه را ۵۷′ بگیرید. اختلاف‌منظر را در z′ = ۴۵° حساب کنید (sin p = sin π sin z′).",
        textEn: "With lunar horizontal parallax 57′, find p at z′ = 45°.",
        source: "Smart IX",
        answer: "p ≈ 40′",
      },
    ],
  },
  {
    id: "sufi-atlas",
    chapterId: "ch2",
    titleFa: "اطلس صوفی در کنار اسمارت",
    titleEn: "al-Ṣūfī’s atlas beside Smart",
    level: "مقدماتی",
    minutes: 25,
    spherePreset: "circles",
    olympiad: "قدر بصری · دو منظر",
    summaryFa:
      "عبدالرحمن صوفی در صور الکواکب هر ۴۸ صورت بطلمیوسی را در دو منظر کره و آسمان ثبت کرد — همدم تاریخی کرهٔ اسمارت. این درس قدر، دو منظر و اطلس سایت را به فصل II گره می‌زند.",
    summaryEn:
      "al-Ṣūfī’s Book of the Fixed Stars records Ptolemy’s 48 constellations in globe and sky aspect — the historical companion to Smart’s sphere.",
    smart: {
      chapter: "II",
      sections: "historical companion",
      pages: "—",
    },
    figures: ["fig1"],
    englishFormulas: [
      "Magnitude difference Δm = 1 corresponds to a flux ratio 10^{0.4} ≈ 2.512.",
      "al-Ṣūfī revised Ptolemy’s magnitudes and drew dual aspects of each constellation.",
    ],
    formulas: [
      {
        display: "F₁ / F₂ = 10^{0.4 (m₂ − m₁)}",
        nameFa: "نسبت شار قدرها",
        nameEn: "Magnitude–flux ratio",
      },
    ],
    sections: [
      {
        headingFa: "دو منظر",
        headingEn: "Two aspects",
        bodyFa:
          "صوفی هر صورت را روی کرهٔ سماوی می‌کشد و از آسمان شب می‌بیند — همان تمایز داخل/خارج که شکل‌های اسمارت هندسی می‌کنند. این درس قدر بصری مکمل المپیاد است نه بند اسمارت.",
        bodyEn:
          "Each constellation is figured as on the globe and as in the sky — the same inside/outside distinction Smart’s diagrams make geometrically.",
      },
    ],
    exercises: [
      {
        textFa:
          "در اطلس سایت، دب اصغر را در دو منظر «کره» و «آسمان» مقایسه کنید.",
        textEn: "In the site atlas, compare Ursa Minor in globe vs sky aspect.",
        source: "al-Ṣūfī / site atlas",
      },
    ],
  },
];
