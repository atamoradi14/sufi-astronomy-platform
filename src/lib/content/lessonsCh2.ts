import type { Lesson } from "./lessonTypes";

export const LESSONS_CH2: Lesson[] = [
  {
    id: "horizontal",
    chapterId: "ch2",
    titleFa: "ارتفاع و سمت",
    titleEn: "Altitude and azimuth",
    level: "متوسط",
    minutes: 45,
    spherePreset: "horizon",
    olympiad: "دستگاه افقی · سمت‌القدم",
    summaryFa:
      "فصل دوم: کرهٔ سماوی به مرکز ناظر. بندهای ۱۷–۱۸ و شکل‌های ۱۰–۱۱ ارتفاع، سمت‌القدم، سمت و مثلث قائم‌الزاویهٔ ناظر را تعریف می‌کنند.",
    summaryEn:
      "Smart II §§17–18, Figs. 10–11: zenith, horizon, altitude, azimuth, co-latitude.",
    smart: {
      chapter: "II",
      sections: "§§17–18",
      pages: "25–27",
      formulae: ["(1)", "(2)"],
      figures: ["10", "11"],
    },
    figures: ["fig10", "fig11"],
    englishFormulas: [
      "z = 90° − a     (Smart II.1)",
      "PZ = 90° − φ     (Smart II.2)  — co-latitude",
    ],
    formulas: [
      {
        display: "z = 90° − a",
        number: "II.(1)",
        nameFa: "سمت‌القدم",
        nameEn: "Zenith distance",
      },
      {
        display: "PZ = 90° − φ",
        number: "II.(2)",
        nameFa: "متمم عرض ناظر",
        nameEn: "Observer’s co-latitude",
      },
    ],
    sections: [
      {
        headingFa: "سمت‌الرأس، افق، ارتفاع",
        headingEn: "Zenith, horizon, altitude",
        bodyFa:
          "O ناظر است. Z سمت‌الرأس است — راستای شاقول به بالا. صفحهٔ عمود بر OZ افق سماوی NAS را می‌برد. ارتفاع a کمان عظیمه از افق تا ستاره روی دایرهٔ قائم است. سمت‌القدم z = ZX = 90° − a. مدار ارتفاع، صغیرهٔ موازی افق است.",
        bodyEn:
          "O is the observer, Z the zenith (plumb-line produced). The plane through O perpendicular to OZ cuts the sphere in the celestial horizon. Altitude a is the great-circle arc from the horizon to the star on its vertical circle; zenith distance z = 90° − a.",
        formula: "z = 90° − a",
      },
      {
        headingFa: "قطب، نقطهٔ شمال، سمت",
        headingEn: "Pole, north point, azimuth",
        bodyFa:
          "OP موازی محور زمین است؛ P قطب شمال سماوی. دایرهٔ قائم گذرنده از P نصف‌النهار اصلی است و افق را در N (نقطهٔ شمال) قطع می‌کند. سمت W (west azimuth در قرارداد اسمارت وقتی ستاره در غرب است) زاویهٔ کروی PZX یا کمان افق از N است. نقاط اصلی: N, E, S, W. اگر سمت ۹۰°E یا ۹۰°W باشد ستاره روی دایرهٔ اول (prime vertical) است.",
        bodyEn:
          "OP is parallel to the Earth’s axis, P the north celestial pole. The vertical through P meets the horizon at the north point N. Azimuth is the spherical angle PZX (or the horizon arc from N). Cardinal points N, E, S, W. Azimuth 90° E or W is the prime vertical.",
      },
      {
        headingFa: "عرض از روی کرهٔ سماوی",
        headingEn: "Latitude on the celestial sphere",
        bodyFa:
          "زاویهٔ POZ برابر عرض φ است، بنابراین کمان PZ = 90° − φ متمم عرض است. ارتفاع قطب برابر عرض ناظر است: ارتفاع P برابر φ.",
        bodyEn:
          "Angle POZ is the observer’s latitude φ, so PZ = 90° − φ. The altitude of the pole equals the latitude.",
        formula: "alt(P) = φ,   PZ = 90° − φ",
      },
    ],
    exercises: [
      {
        textFa: "اگر ناظر رو به شمال بایستد، نقطهٔ شرق سمت راست اوست (پانوشت اسمارت ص. ۲۷). این قرارداد سمت را با شکل ۱۰ و ۱۱ سازگار کنید.",
        textEn: "Facing north, east is to the observer’s right (Smart p. 27 n.). Match this with Figs. 10–11.",
        source: "Smart II §18",
      },
    ],
  },
  {
    id: "equatorial",
    chapterId: "ch2",
    titleFa: "میل و زاویهٔ ساعتی",
    titleEn: "Declination and hour angle",
    level: "متوسط",
    minutes: 50,
    spherePreset: "celestial",
    olympiad: "δ، H · مدار میل",
    summaryFa:
      "بند ۱۹ و شکل‌های ۱۲–۱۳: استوای سماوی، میل، فاصلهٔ قطبی شمال، نصف‌النهار ناظر، طلوع/غروب/گذار، و زاویهٔ ساعتی. قاعدهٔ ارتباط سمت و H.",
    summaryEn:
      "Smart II §19, Figs. 12–13: equator, declination, N.P.D., meridian, hour angle.",
    smart: {
      chapter: "II",
      sections: "§19",
      pages: "28–30",
      figures: ["12", "13"],
    },
    figures: ["fig12", "fig13"],
    englishFormulas: [
      "N.P.D. = 90° − δ   (algebraic δ; north +)",
      "Hour angle H measured westwards from the observer’s meridian, 0ʰ to 24ʰ.",
      "Azimuth west ⇔ 0ʰ ≤ H ≤ 12ʰ; azimuth east ⇔ 12ʰ ≤ H ≤ 24ʰ.",
    ],
    formulas: [
      {
        display: "N.P.D. = 90° − δ",
        nameFa: "فاصلهٔ قطبی شمال",
        nameEn: "North polar distance",
      },
      {
        display: "H west 0ʰ…24ʰ from the meridian",
        nameFa: "زاویهٔ ساعتی",
        nameEn: "Hour angle",
      },
    ],
    sections: [
      {
        headingFa: "استوا و میل",
        headingEn: "Equator and declination",
        bodyFa:
          "صفحهٔ عمود بر OP استوای سماوی است و افق را در شرق و غرب قطع می‌کند. میل δ کمان از استوا تا ستاره روی دایرهٔ ساعتی است، شمال مثبت و جنوب منفی. فاصلهٔ قطبی شمال PX = 90° − δ برای هر دو علامت میل یکسان نوشته می‌شود.",
        bodyEn:
          "The great circle whose plane is perpendicular to OP is the celestial equator; it meets the horizon at E and W. Declination δ is the arc from the equator to the star on the hour circle, north positive. North polar distance = 90° − δ holds for both signs.",
        formula: "PX = 90° − δ",
      },
      {
        headingFa: "نصف‌النهار، گذار، طلوع و غروب",
        headingEn: "Meridian, transit, rising and setting",
        bodyFa:
          "نیم‌عظیمهٔ PZRSQ نصف‌النهار ناظر است. روی نصف‌النهار ستاره در گذار (culmination) است: ارتفاع بیشینه و z کمینه. سپس روی مدار میل به‌سوی غرب می‌رود، در F غروب می‌کند (ارتفاع ۰)، در M پایین‌ترین نقطه، در G طلوع می‌کند، و دوباره به L می‌رسد.",
        bodyEn:
          "Semi-great circle PZRSQ is the observer’s meridian. On it the star transits: maximum altitude, minimum zenith distance. It then rides the parallel of declination westwards, sets at F, reaches lower culmination at M, rises at G, and returns to L.",
      },
      {
        headingFa: "زاویهٔ ساعتی و قاعدهٔ سمت",
        headingEn: "Hour angle and the azimuth rule",
        bodyFa:
          "H زاویه در قطب میان نصف‌النهار ناظر و دایرهٔ ساعتی ستاره است، از ۰° در گذار تا ۳۶۰° (یا ۰ʰ تا ۲۴ʰ) به‌سوی غرب. از شکل ۱۳: اگر سمت غرب باشد، H بین ۰ʰ و ۱۲ʰ است؛ اگر سمت شرق باشد، H بین ۱۲ʰ و ۲۴ʰ است.",
        bodyEn:
          "H is the angle at P from the observer’s meridian westwards to the star’s hour circle, 0ʰ to 24ʰ. If azimuth is west, 0ʰ ≤ H ≤ 12ʰ; if azimuth is east, 12ʰ ≤ H ≤ 24ʰ.",
      },
    ],
    exercises: [
      {
        textFa: "برای ناظر جنوبی شکل ۱۴ را کامل کنید و نشان دهید همان قاعدهٔ سمت–H برقرار است (تمرین بند ۲۰).",
        textEn: "Complete Fig. 14 for a southern observer and recover the same azimuth–H rule (§20).",
        source: "Smart II §20",
      },
    ],
  },
  {
    id: "rising-setting",
    chapterId: "ch2",
    titleFa: "ستارگان قطبی‌گرد، گذار بالا و پایین",
    titleEn: "Circumpolar stars; upper and lower culmination",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "horizon",
    olympiad: "شرط غروب‌نکردن · z در گذار",
    summaryFa:
      "بند ۲۱ و شکل ۱۵: شرط غروب‌نکردن δ > co-lat. بند ادامه: z در گذار بالا = |φ − δ| و در گذار پایین = ۱۸۰° − (φ+δ) (با جزئیات اسمارت).",
    summaryEn:
      "Smart II §21, Fig. 15: circumpolar condition; culmination zenith distances.",
    smart: {
      chapter: "II",
      sections: "§21",
      pages: "32–33",
      figures: ["15"],
    },
    figures: ["fig15"],
    englishFormulas: [
      "Never sets (north) if N.P.D. < φ, i.e. δ > 90° − φ.",
      "Upper culmination: z = |φ − δ|; lower: z = 180° − (φ + δ) when the star is circumpolar.",
    ],
    formulas: [
      {
        display: "δ > 90° − φ   (northern circumpolar)",
        nameFa: "شرط قطبی‌گرد شمالی",
        nameEn: "Northern circumpolar condition",
      },
      {
        display: "z_upper = |φ − δ|,   z_lower = 180° − (φ + δ)",
        nameFa: "سمت‌القدم در دو گذار",
        nameEn: "Zenith distances at culmination",
      },
    ],
    sections: [
      {
        headingFa: "قطبی‌گرد",
        headingEn: "Circumpolar stars",
        bodyFa:
          "اگر مدار میل کاملاً بالای افق باشد ستاره غروب نمی‌کند. از شکل ۱۵: PM باید از PN کوچک‌تر باشد، یعنی فاصلهٔ قطبی از عرض کمتر باشد، یا δ > 90° − φ در نیم‌کرهٔ شمالی. ستارگان جنوبیِ قطبی‌گرد به‌طور متقارن با قطب جنوب تعریف می‌شوند.",
        bodyEn:
          "If the parallel of declination never meets the horizon the star is circumpolar. Fig. 15: PM < PN, i.e. north polar distance less than the latitude, or δ > 90° − φ in the north.",
        formula: "δ > co-lat(φ)",
      },
      {
        headingFa: "گذار بالا و پایین",
        headingEn: "Upper and lower culmination",
        bodyFa:
          "در L گذار بالاست (transit). در M گذار پایین. سمت‌القدم در گذار بالا ZL = |φ − δ|. در گذار پایین ZM = 180° − (φ + δ). اگر δ = φ گذار بالا در سمت‌الرأس است. اگر δ > φ گذار بالا میان P و Z رخ می‌دهد و سمت از ۹۰° تجاوز نمی‌کند.",
        bodyEn:
          "At L, upper culmination; at M, lower. z_upper = |φ − δ|, z_lower = 180° − (φ + δ). If δ = φ the star transits in the zenith. If δ > φ upper culmination lies between P and Z and azimuth does not exceed 90°.",
      },
      {
        headingFa: "طلوع و غروب وقتی رخ می‌دهند",
        headingEn: "When rising and setting occur",
        bodyFa:
          "ارتفاع صفر در فرمول PZX (درس بعد) می‌دهد cos H₀ = − tan φ tan δ. اگر |tan φ tan δ| > 1 ستاره یا همیشه بالای افق است یا هرگز طلوع نمی‌کند.",
        bodyEn:
          "Setting a = 0 in the PZX cosine formula yields cos H₀ = −tan φ tan δ. If the right-hand side lies outside [−1, 1] the star never rises or never sets.",
        formula: "cos H₀ = − tan φ tan δ",
      },
    ],
    example: {
      id: "ex-rising",
      titleFa: "مدت بالای افق",
      titleEn: "Time above the horizon",
      source: "Smart II §21 + PZX with a = 0",
      givenFa: "φ = ۴۰°N، δ = +۱۵°.",
      givenEn: "φ = 40°N, δ = +15°.",
      findFa: "زاویهٔ ساعتی غروب و مدت روز ستاره.",
      findEn: "Setting hour angle and time above the horizon.",
      steps: [
        {
          fa: "cos H₀ = −tan 40° tan 15°.",
          en: "cos H₀ = −tan 40° tan 15°.",
        },
      ],
      resultFa: "H₀ ≈ ۱۰۳° ≈ ۶ʰ۵۲ᵐ؛ مدت ≈ ۱۳ʰ۴۴ᵐ",
      resultEn: "H₀ ≈ 103° ≈ 6ʰ52ᵐ; duration ≈ 13ʰ44ᵐ",
      widget: "rising",
    },
    exercises: [
      {
        textFa: "شرط ستارهٔ ابدی‌الغروب در عرض φ را بنویسید.",
        textEn: "Write the condition that a star never rises at latitude φ.",
        source: "Smart II §21",
        answer: "δ < φ − 90° (north latitude)",
      },
    ],
  },
  {
    id: "coord-transform",
    chapterId: "ch2",
    titleFa: "کرهٔ زمین‌مرکز و حل مثلث PZX",
    titleEn: "The geocentric celestial sphere and triangle PZX",
    level: "المپیاد",
    minutes: 55,
    spherePreset: "astro-tri",
    proofId: "pzx",
    olympiad: "تبدیل استوایی ↔ افقی",
    summaryFa:
      "بندهای ۲۲–۲۳ و شکل‌های ۱۶–۱۷: تعریف زمین‌مرکز میل برای اجسام نزدیک، سپس دو مسئلهٔ استاندارد PZX با فرمول‌های (۳)–(۷) و صورت هاورساین.",
    summaryEn:
      "Smart II §§22–23, Figs. 16–17: standard sphere at Earth’s centre; PZX formulae (3)–(7).",
    smart: {
      chapter: "II",
      sections: "§§22–23",
      pages: "33–36",
      formulae: ["(3)", "(4)", "(5)", "(6)", "(7)"],
      figures: ["16", "17"],
    },
    figures: ["fig17"],
    englishFormulas: [
      "cos z = sin φ sin δ + cos φ cos δ cos H     (3)",
      "hav z = hav(φ − δ) + cos φ cos δ hav H     (4)",
      "sin δ = sin φ cos z + cos φ sin z cos A     (5)",
      "cos H = cos z sec φ sec δ − tan φ tan δ     (7)",
    ],
    formulas: [
      {
        display: "cos z = sin φ sin δ + cos φ cos δ cos H",
        number: "II.(3)",
        nameFa: "کسینوس سمت‌القدم",
        nameEn: "Cosine of zenith distance",
      },
      {
        display: "hav z = hav(φ − δ) + cos φ cos δ hav H",
        number: "II.(4)",
        nameFa: "هاورساین سمت‌القدم",
        nameEn: "Haversine form of (3)",
      },
      {
        display: "sin δ = sin φ cos z + cos φ sin z cos A",
        number: "II.(5)",
        nameFa: "میل از ارتفاع و سمت",
        nameEn: "Declination from z and A",
      },
      {
        display: "cos H = cos z sec φ sec δ − tan φ tan δ",
        number: "II.(7)",
        nameFa: "زاویهٔ ساعتی از z و δ",
        nameEn: "Hour angle from z and δ",
      },
    ],
    sections: [
      {
        headingFa: "کرهٔ استاندارد (شکل ۱۶–۱۷)",
        headingEn: "The standard sphere (Figs. 16–17)",
        bodyFa:
          "برای ستارگان، فاصله آن‌قدر زیاد است که میل تعریف‌شده از ناظر O با میل از مرکز زمین C یکی است. برای ماه یا خورشید چنین نیست: PÔM به جایگاه O بستگی دارد. از این پس مرکز کرهٔ سماوی C، مرکز زمین است؛ CZ سمت‌الرأس ناظر، CP محور جهان، افق عمود بر CZ.",
        bodyEn:
          "For stars, north polar distance from the observer equals that from the Earth’s centre. For the Moon it does not. Hereafter the celestial sphere is centred at C, the Earth’s centre: CZ is the zenith, CP the axis, the horizon perpendicular to CZ.",
      },
      {
        headingFa: "مسئلهٔ (i): از (φ, δ, H) به (z, A)",
        headingEn: "Problem (i): (φ, δ, H) → (z, A)",
        bodyFa:
          "در PZX دو ضلع PZ = 90°−φ و PX = 90°−δ و زاویهٔ مشمول در P برابر H است. فرمول (A) همان (۳) را می‌دهد. صورت هاورساین (۴) برای کار لگاریتمی است. سپس (A) روی ضلع PX، میل را برحسب z و A می‌دهد — یا معکوس، سمت را از (۵). اسمارت صورت هاورساین سمت را نیز می‌آورد: cos φ cos a hav A = hav(90°−δ) − hav(φ−a).",
        bodyEn:
          "Sides PZ = 90°−φ, PX = 90°−δ, included angle H. Formula (A) is (3); haversine form is (4). (5) recovers δ from z and A, or azimuth from δ, z, φ. Haversine azimuth: cos φ cos a hav A = hav(90°−δ) − hav(φ − a).",
        formula: "cos z = sin φ sin δ + cos φ cos δ cos H",
      },
      {
        headingFa: "مسئلهٔ (ii): از (φ, z, A) به (δ, H)",
        headingEn: "Problem (ii): (φ, z, A) → (δ, H)",
        bodyFa:
          "با معلوم بودن عرض، سمت‌القدم و سمت، (۵) میل را می‌دهد و (۳) یا (۷) زاویهٔ ساعتی را. اگر ستاره شرق نصف‌النهار باشد (شکل ۱۳) زاویه در P برابر 24ʰ − H است و حل به‌همان ترتیب پیش می‌رود.",
        bodyEn:
          "Given φ, z, A, (5) yields δ and (3) or (7) yields H. East of the meridian the angle at P is 24ʰ − H; the same formulae apply.",
      },
    ],
    example: {
      id: "ex-pzx",
      titleFa: "ارتفاع از (φ, δ, H)",
      titleEn: "Altitude from (φ, δ, H)",
      source: "Smart II §23 (3)",
      givenFa: "φ = ۳۵°.۷ N (تهران)، δ = +۱۶°.۵، H = +۲ʰ (= ۳۰°).",
      givenEn: "φ = 35°.7 N, δ = +16°.5, H = +2ʰ = 30°.",
      findFa: "سمت‌القدم و ارتفاع.",
      findEn: "Zenith distance and altitude.",
      steps: [
        {
          fa: "فرمول (۳) را با H = ۳۰° به کار ببرید.",
          en: "Apply (3) with H = 30°.",
        },
      ],
      resultFa: "z ≈ ۴۱°؛ a ≈ ۴۹°",
      resultEn: "z ≈ 41°; a ≈ 49°",
      widget: "pzx",
    },
    exercises: [
      {
        textFa: "اگر z₁ سمت‌القدم در نصف‌النهار و z₂ روی دایرهٔ اول باشد، ثابت کنید cot δ = csc z₁ sec z₂ − cot 2φ (تمرین ۱ فصل II، با نماد اسمارت).",
        textEn:
          "If z₁, z₂ are meridian and prime-vertical zenith distances, prove cot δ = csc z₁ sec z₂ − cot 2φ (Smart II, Ex. 1).",
        source: "Smart II Exercises 1",
      },
    ],
  },
  {
    id: "celestial-sphere",
    chapterId: "ch2",
    titleFa: "بعد، نقطهٔ حمل و زمان نجومی",
    titleEn: "Right ascension, the equinox, and sidereal time",
    level: "متوسط",
    minutes: 50,
    spherePreset: "celestial",
    proofId: "sidereal",
    olympiad: "α · LST · ST = H + α",
    summaryFa:
      "بندهای ۲۴ و ۲۷: نقطهٔ حمل به‌عنوان مبدأ بعد، اندازهٔ شرقی ۰ʰ تا ۲۴ʰ، و تعریف زمان نجومی به‌عنوان زاویهٔ ساعتی نقطهٔ حمل. ST = H + α.",
    summaryEn:
      "Smart II §§24, 27, Figs. 18 and 22: RA, vernal equinox, sidereal time.",
    smart: {
      chapter: "II",
      sections: "§§24, 27",
      pages: "36–37, 41–42",
      formulae: ["(8)", "(9)", "(13)", "(14)"],
      figures: ["18", "22"],
    },
    figures: ["fig18", "fig22"],
    englishFormulas: [
      "Sidereal time = H.A. of ♈ + R.A. of X,   i.e.  S.T. = H + α     (8)(9)",
      "H.A. at Greenwich = H.A. at longitude l ± long. of l     (13)",
      "S.T. at Greenwich = S.T. at l ± long. of l     (14)",
    ],
    formulas: [
      {
        display: "S.T. = H + α",
        number: "II.(9)",
        nameFa: "زمان نجومی محلی",
        nameEn: "Local sidereal time",
      },
      {
        display: "GST = LST ∓ longitude (time measure; + if west)",
        number: "II.(14)",
        nameFa: "زمان نجومی گرینویچ",
        nameEn: "Greenwich sidereal time",
      },
    ],
    sections: [
      {
        headingFa: "بعد از نقطهٔ حمل (شکل ۱۸)",
        headingEn: "Right ascension from ♈ (Fig. 18)",
        bodyFa:
          "میل در حرکت شبانه‌روزی ثابت می‌ماند؛ H به‌طور یکنواخت زیاد می‌شود. پیکربندی ستارگان نسبت به استوا ثابت است، پس زاویه میان یک ستارهٔ مرجع استوایی ♈ و دایرهٔ ساعتی ستاره ثابت است. این زاویه، اندازه‌گیری‌شده به‌سوی شرق از ۰ʰ تا ۲۴ʰ، بعد α است. جهت بعد خلاف جهت H است.",
        bodyEn:
          "Declination is constant under diurnal motion; H increases uniformly. The angle from a chosen equatorial reference ♈ eastwards to the star’s hour circle is right ascension α, 0ʰ to 24ʰ — opposite in sense to hour angle.",
      },
      {
        headingFa: "زمان نجومی",
        headingEn: "Sidereal time",
        bodyFa:
          "H.A. نقطهٔ حمل همان زمان نجومی است. از شکل: کمان استوایی RD = H و TD = α، پس RT = H + α. وقتی ♈ روی نصف‌النهار است ST = 0ʰ. یک دور کامل ۲۴ʰ زمان نجومی یک روز نجومی است — دورهٔ چرخش زمین نسبت به اعتدال.",
        bodyEn:
          "The hour angle of ♈ is the sidereal time. Fig. 18: RD = H, TD = α, so RT = H + α. When ♈ is on the meridian, S.T. = 0ʰ. 24ʰ of sidereal time is a sidereal day.",
        formula: "S.T. = H + α",
      },
      {
        headingFa: "گرینویچ و طول جغرافیایی (شکل ۲۲)",
        headingEn: "Greenwich and longitude (Fig. 22)",
        bodyFa:
          "زاویهٔ ساعتی در گرینویچ برابر زاویهٔ ساعتی در مکان l به‌علاوهٔ طول غربی l است (طول به اندازهٔ زمانی: ۱۵° = 1ʰ). زمان نجومی در گرینویچ = زمان نجومی در l ± طول l، با علامت + اگر l غرب گرینویچ باشد.",
        bodyEn:
          "H.A. at Greenwich = H.A. at l + west longitude of l (in time measure). Sidereal time at Greenwich = sidereal time at l ± longitude of l, + if l is west of Greenwich.",
        formula: "H_Greenwich = H_l + long_W",
      },
    ],
    exercises: [
      {
        textFa: "ستاره‌ای با α = ۵ʰ روی نصف‌النهار ناظر است. LST چیست؟",
        textEn: "A star of RA 5ʰ is on the observer’s meridian. What is LST?",
        source: "Smart II §24",
        answer: "LST = 5ʰ",
      },
    ],
  },
  {
    id: "ecliptic",
    chapterId: "ch2",
    titleFa: "مدار زمین، دایرة‌البروج و مختصات بروجی",
    titleEn: "The Earth’s orbit, the ecliptic, and celestial latitude/longitude",
    level: "المپیاد",
    minutes: 50,
    spherePreset: "ecliptic",
    olympiad: "ε · λ, β · اعتدال‌ها",
    summaryFa:
      "بندهای ۲۵–۲۶ و شکل‌های ۱۹–۲۱: قانون کپلر، مدار ظاهری خورشید، میل دایرة‌البروج حدود ۲۳½°، اعتدال‌ها و انقلاب‌ها، طول و عرض سماوی.",
    summaryEn:
      "Smart II §§25–26, Figs. 19–21: Earth’s orbit, ecliptic, obliquity, λ and β.",
    smart: {
      chapter: "II",
      sections: "§§25–26",
      pages: "37–40",
      figures: ["19", "20", "21"],
    },
    figures: ["fig19", "fig21"],
    englishFormulas: [
      "Obliquity ε = ∠ between ecliptic and equator ≈ 23½°.",
      "Sun: β = 0;  sin δ = sin ε sin λ;  the four cardinal longitudes 0ʰ, 6ʰ, 12ʰ, 18ʰ.",
    ],
    formulas: [
      {
        display: "ε ≈ 23½°   (obliquity of the ecliptic)",
        nameFa: "میل دایرة‌البروج",
        nameEn: "Obliquity",
      },
      {
        display: "sin δ_☉ = sin ε sin λ   (β = 0)",
        nameFa: "میل خورشید",
        nameEn: "Solar declination",
      },
    ],
    sections: [
      {
        headingFa: "مدار زمین و مدار ظاهری خورشید",
        headingEn: "Earth’s orbit and the Sun’s apparent orbit",
        bodyFa:
          "زمین روی بیضی با کانون خورشید می‌گردد (قانون اول کپلر). از زمین، خورشید روی بیضی ظاهری مخالف می‌رود (شکل‌های ۱۹–۲۰). صفحهٔ این مدار دایرة‌البروج است؛ تقاطع آن با کرهٔ سماوی عظیمهٔ دایرة‌البروج است.",
        bodyEn:
          "The Earth revolves on an ellipse with the Sun at a focus (Kepler I). Relative to the Earth the Sun appears to describe the opposite ellipse. That plane is the ecliptic; its intersection with the celestial sphere is the ecliptic great circle.",
      },
      {
        headingFa: "میل دایرة‌البروج و نقطهٔ حمل (شکل ۲۱)",
        headingEn: "Obliquity and the equinox (Fig. 21)",
        bodyFa:
          "زاویهٔ میان دایرة‌البروج و استوا ε ≈ ۲۳½° است. خورشید سالی دو بار از استوا می‌گذرد: ♈ حدود ۲۱ مارس (اعتدال بهاری، مبدأ بعد و طول) و ♎ حدود ۲۱ سپتامبر. در انقلاب تابستانی (حدود ۲۱ ژوئن) α = ۶ʰ و δ ≈ +۲۳½°؛ در انقلاب زمستانی α = ۱۸ʰ و δ ≈ −۲۳½°.",
        bodyEn:
          "The inclination of the ecliptic to the equator is the obliquity ε ≈ 23½°. The Sun crosses the equator at ♈ (about March 21, vernal equinox — origin of RA and longitude) and at ♎ (about September 21). At the June solstice α = 6ʰ, δ ≈ +23½°; at the December solstice α = 18ʰ, δ ≈ −23½°.",
      },
      {
        headingFa: "طول و عرض سماوی",
        headingEn: "Celestial longitude and latitude",
        bodyFa:
          "طول λ از ♈ روی دایرة‌البروج به شرق؛ عرض β از دایرة‌البروج به‌سوی قطب دایرة‌البروج. خورشید β = 0 دارد. تبدیل (α, δ) ↔ (λ, β) مثلث قطبی استوا–دایرة‌البروج با زاویهٔ ε است.",
        bodyEn:
          "Longitude λ is measured from ♈ along the ecliptic eastwards; latitude β from the ecliptic towards the ecliptic pole. The Sun has β = 0. Transformation (α, δ) ↔ (λ, β) is the equatorial–ecliptic polar triangle of angle ε.",
      },
    ],
    exercises: [
      {
        textFa: "ثابت کنید برای خورشید cos δ cos α = cos λ و cos δ sin α = cos ε sin λ.",
        textEn: "For the Sun prove cos δ cos α = cos λ and cos δ sin α = cos ε sin λ.",
        source: "Smart II §26",
      },
    ],
  },
  {
    id: "time",
    chapterId: "ch2",
    titleFa: "زمان خورشیدی میانگین و نمونهٔ منطقهٔ زمانی",
    titleEn: "Mean solar time and a zone-time example",
    level: "متوسط",
    minutes: 45,
    spherePreset: "celestial",
    olympiad: "معادلهٔ زمان · زمان منطقه",
    summaryFa:
      "بندهای ۲۸–۲۹: روز شمسی ظاهری برای زندگی روزمره نامناسب است؛ خورشید میانگین و معادلهٔ زمان. مثال: از زمان منطقه به زاویهٔ ساعتی خورشید.",
    summaryEn:
      "Smart II §§28–29: mean solar time; worked zone-time example (p. 45).",
    smart: {
      chapter: "II",
      sections: "§§28–29",
      pages: "42–46",
    },
    figures: ["fig22"],
    englishFormulas: [
      "Equation of time E = apparent solar time − mean solar time.",
      "Zone time is mean time of a standard meridian (e.g. 165° E = 11ʰ E).",
    ],
    formulas: [
      {
        display: "E = AST − MST",
        nameFa: "معادلهٔ زمان",
        nameEn: "Equation of time",
      },
    ],
    sections: [
      {
        headingFa: "ظهر ظاهری و خورشید میانگین",
        headingEn: "Apparent noon and the mean Sun",
        bodyFa:
          "وقتی خورشید روی نصف‌النهار است ظهر ظاهری است. فاصلهٔ دو ظهر ظاهری روز شمسی ظاهری است و به‌خاطر خروج از مرکز مدار و میل دایرة‌البروج یکنواخت نیست. خورشید میانگین روی استوا با حرکت یکنواخت تعریف می‌شود تا روز شمسی میانگین ثابت بماند.",
        bodyEn:
          "The Sun on the meridian is apparent noon. The interval between apparent noons — the apparent solar day — is uneven because of orbital eccentricity and the obliquity. A fictitious mean Sun is defined on the equator with uniform motion.",
      },
      {
        headingFa: "مثال بند ۲۹",
        headingEn: "The §29 example",
        bodyFa:
          "در طول ۱۶۳°۱۴′ E، زمان منطقه ۸ʰ۴۶ᵐ۲۲ˢ در ۱۰ مارس ۱۹۷۵ خواسته می‌شود به H.A. خورشید تبدیل شود. زمان منطقه، زمان میانگین نصف‌النهار استاندارد ۱۶۵° E (۱۱ʰ شرق) است. مسیر: منطقه → زمان میانگین محلی → زمان ظاهری (با معادلهٔ زمان) → زاویهٔ ساعتی خورشید، با توجه به اختلاف طول ۱۴۶′ قوس ≈ ۹ᵐ۴۴ˢ زمان.",
        bodyEn:
          "At longitude 163°14′ E, convert zone time 8ʰ46ᵐ22ˢ on 1975 March 10 to the Sun’s hour angle. Zone time is mean time of the 165° E (11ʰ E) standard meridian. Path: zone → local mean time → apparent time (equation of time) → solar hour angle.",
      },
    ],
    exercises: [
      {
        textFa: "اختلاف طول ۱۶۵°E − ۱۶۳°۱۴′E را به زمان تبدیل کنید.",
        textEn: "Convert the longitude difference 165°E − 163°14′E into time.",
        source: "Smart II §29",
        answer: "1°46′ = 7ᵐ4ˢ",
      },
    ],
  },
];
