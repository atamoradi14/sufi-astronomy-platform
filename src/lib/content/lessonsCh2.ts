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
    olympiad: "دستگاه افقی · سمت‌الرأس",
    summaryFa:
      "سمت‌الرأس امتداد شاقول به بالاست و افق هندسی بر آن عمود است. ارتفاع h بالای افق مثبت و فاصلهٔ سمت‌الرأسی z از بالای سر سنجیده می‌شود. افق طبیعی با عوارض زمین ممکن است با افق هندسی فرق کند.",
    summaryEn:
      "Zenith is the upward vertical and the geometric horizon is perpendicular to it. Altitude h is positive above the horizon; zenith distance z is measured from overhead. Terrain can make the visible horizon differ from the geometric horizon.",
    smart: {
      chapter: "II",
      sections: "§§17–18",
      pages: "25–27",
      formulae: ["(1)", "(2)"],
      figures: ["10", "11"],
    },
    figures: ["geometry-horizon"],
    englishFormulas: ["z=\\frac\\pi2-h,\\quad PZ=\\frac\\pi2-\\varphi"],
    formulas: [
      {
        display: "z=\\frac\\pi2-h,\\quad PZ=\\frac\\pi2-\\varphi",
        tex: "z=\\frac\\pi2-h,\\quad PZ=\\frac\\pi2-\\varphi",
        nameFa: "ارتفاع و فاصلهٔ قطبی",
        nameEn: "Altitude and polar distance",
      },
    ],
    sections: [
      {
        headingFa: "دستگاه محلی ناظر",
        headingEn: "The observer’s local frame",
        bodyFa:
          "سمت‌الرأس امتداد شاقول به بالاست و افق هندسی بر آن عمود است. ارتفاع h بالای افق مثبت و فاصلهٔ سمت‌الرأسی z از بالای سر سنجیده می‌شود. افق طبیعی با عوارض زمین ممکن است با افق هندسی فرق کند.",
        bodyEn:
          "Zenith is the upward vertical and the geometric horizon is perpendicular to it. Altitude h is positive above the horizon; zenith distance z is measured from overhead. Terrain can make the visible horizon differ from the geometric horizon.",
      },
      {
        headingFa: "سمت از شمال به شرق",
        headingEn: "Azimuth north through east",
        bodyFa:
          "اینجا سمت A از شمال صفر، شرق ۹۰، جنوب ۱۸۰ و غرب ۲۷۰ درجه است. قرارداد تاریخی منبع ممکن است فرق کند؛ قبل از استفاده از فرمول مبدأ و جهت را کنترل کنید. در سمت‌الرأس یا سمت‌القدم، سمت تعریف ندارد.",
        bodyEn:
          "Here azimuth A is 0° north, 90° east, 180° south, 270° west. Historical conventions may differ; check origin and direction before using a formula. Azimuth is undefined at zenith and nadir.",
      },
      {
        headingFa: "قطب در هر دو نیم‌کره",
        headingEn: "The pole in both hemispheres",
        bodyFa:
          "ارتفاع قطب شمال برابر عرض علامت‌دار φ است؛ در جنوب زیر افق قرار دارد. آنجا قطب جنوب به ارتفاع قدرمطلق φ دیده می‌شود.",
        bodyEn:
          "The north pole altitude equals signed latitude φ; in the south it lies below the horizon. The south pole is then |φ| above the horizon.",
      },
    ],
    exercises: [
      {
        textFa:
          "در عرض ۳۵ درجه جنوبی، ارتفاع قطب شمال و قطب جنوب چیست؟ برای h = ۲۵ درجه، z را بیابید.",
        textEn:
          "At latitude 35° S find the altitudes of both celestial poles. Find z for h = 25°.",
        answer:
          "h_{NCP}=-35^\\circ,\\quad h_{SCP}=35^\\circ,\\quad z=65^\\circ",
        source: "Original exercise based on Smart / تمرین تألیفی",
      },
      {
        textFa:
          "فرض‌ها و دامنهٔ اعتبار روابط این درس را بنویسید و یک حالت ویژه را با جایگذاری مستقیم بررسی کنید.",
        textEn:
          "State the assumptions and domain of the identities in this lesson. Verify a special case by direct substitution.",
        source: "Original learning check / تمرین تألیفی",
      },
    ],
    example: {
      id: "check-horizontal",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "در عرض ۳۵ درجه جنوبی، ارتفاع قطب شمال و قطب جنوب چیست؟ برای h = ۲۵ درجه، z را بیابید.",
      givenEn:
        "At latitude 35° S find the altitudes of both celestial poles. Find z for h = 25°.",
      findFa: "نتیجه را با روابط همین درس و کنترل واحدها به دست آورید.",
      findEn: "Use this lesson’s identities and check the units.",
      steps: [
        {
          fa: "ابتدا قرارداد علامت‌ها و داده‌های معلوم را مشخص کنید؛ سپس رابطهٔ متناسب را انتخاب کنید.",
          en: "Identify the sign conventions and given parts, then select the corresponding identity.",
        },
        {
          fa: "پس از جایگذاری و ساده‌سازی، نتیجهٔ زیر به دست می‌آید. شرایط وجود و ربع را نیز کنترل کنید.",
          en: "Substitute and simplify to obtain the result below; check existence and quadrant conditions.",
          formula:
            "h_{NCP}=-35^\\circ,\\quad h_{SCP}=35^\\circ,\\quad z=65^\\circ",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
  },
  {
    id: "equatorial",
    chapterId: "ch2",
    titleFa: "میل و زاویهٔ ساعتی",
    titleEn: "Declination and hour angle",
    level: "متوسط",
    minutes: 50,
    spherePreset: "celestial",
    olympiad: "δ · H · موازی میل",
    summaryFa:
      "میل δ از استوا شمال‌مثبت است و بعد α از اعتدال بهاری به شرق بین صفر و ۲۴ ساعت سنجیده می‌شود. مختصات کاتالوگ چارچوب و مبدأ زمانی دارند؛ تقدیم و حرکت خاص را با چرخش روزانه یکی نگیرید.",
    summaryEn:
      "Declination δ is north-positive from the equator; RA α runs east from the vernal equinox in [0,24 h). Catalogue coordinates have a frame and epoch; precession and proper motion differ from daily rotation.",
    smart: {
      chapter: "II",
      sections: "§19",
      pages: "28–30",
      figures: ["12", "13"],
    },
    figures: ["geometry-celestial"],
    englishFormulas: [
      "\\mathrm{NPD}=90^\\circ-\\delta",
      "H_{deg}=15(\\mathrm{LST}_h-\\alpha_h)",
    ],
    formulas: [
      {
        display: "\\mathrm{NPD}=90^\\circ-\\delta",
        tex: "\\mathrm{NPD}=90^\\circ-\\delta",
        nameFa: "فاصلهٔ قطبی شمال",
        nameEn: "North polar distance",
      },
      {
        display: "H_{deg}=15(\\mathrm{LST}_h-\\alpha_h)",
        tex: "H_{deg}=15(\\mathrm{LST}_h-\\alpha_h)",
        nameFa: "زاویهٔ ساعتی به درجه",
        nameEn: "Hour angle in degrees",
      },
    ],
    sections: [
      {
        headingFa: "میل و بعد",
        headingEn: "Declination and right ascension",
        bodyFa:
          "میل δ از استوا شمال‌مثبت است و بعد α از اعتدال بهاری به شرق بین صفر و ۲۴ ساعت سنجیده می‌شود. مختصات کاتالوگ چارچوب و مبدأ زمانی دارند؛ تقدیم و حرکت خاص را با چرخش روزانه یکی نگیرید.",
        bodyEn:
          "Declination δ is north-positive from the equator; RA α runs east from the vernal equinox in [0,24 h). Catalogue coordinates have a frame and epoch; precession and proper motion differ from daily rotation.",
      },
      {
        headingFa: "زاویهٔ ساعتی",
        headingEn: "Hour angle",
        bodyFa:
          "H از نصف‌النهار محلی به غرب مثبت است؛ پیش از عبور بالایی منفی و پس از آن مثبت نوشته می‌شود. بازهٔ منفی ۱۲ تا مثبت ۱۲ ساعت برای محاسبه مناسب است.",
        bodyEn:
          "H runs west-positive from the local meridian, conventionally negative before upper transit and positive after it. The signed range [−12 h,12 h) is convenient.",
        formula: "H=\\mathrm{LST}-\\alpha\\pmod{24\\,\\mathrm h}",
      },
      {
        headingFa: "حرکت روزانه",
        headingEn: "Daily motion",
        bodyFa:
          "چرخش زمین H را افزایش می‌دهد؛ α و δ یک ستاره در مدت کوتاه تقریباً ثابت‌اند. در عبور بالایی H صفر است. حرکت غرب‌سوی آسمان به معنی افزایش بعد نیست.",
        bodyEn:
          "Earth’s rotation increases H; a star’s α and δ are approximately constant over a short interval. At upper transit H = 0. Westward daily motion is not increasing RA.",
      },
    ],
    exercises: [
      {
        textFa:
          "اگر LST برابر ۲ ساعت و بعد ستاره ۲۳ ساعت باشد، H علامت‌دار چند ساعت و درجه است؟",
        textEn:
          "If LST = 2 h and RA = 23 h, find the signed hour angle in hours and degrees.",
        answer: "H=(2-23)\\bmod24=3\\,\\mathrm h=45^\\circ\\quad\\text{west}",
        source: "Original exercise based on Smart / تمرین تألیفی",
      },
      {
        textFa:
          "فرض‌ها و دامنهٔ اعتبار روابط این درس را بنویسید و یک حالت ویژه را با جایگذاری مستقیم بررسی کنید.",
        textEn:
          "State the assumptions and domain of the identities in this lesson. Verify a special case by direct substitution.",
        source: "Original learning check / تمرین تألیفی",
      },
    ],
    example: {
      id: "check-equatorial",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "اگر LST برابر ۲ ساعت و بعد ستاره ۲۳ ساعت باشد، H علامت‌دار چند ساعت و درجه است؟",
      givenEn:
        "If LST = 2 h and RA = 23 h, find the signed hour angle in hours and degrees.",
      findFa: "نتیجه را با روابط همین درس و کنترل واحدها به دست آورید.",
      findEn: "Use this lesson’s identities and check the units.",
      steps: [
        {
          fa: "ابتدا قرارداد علامت‌ها و داده‌های معلوم را مشخص کنید؛ سپس رابطهٔ متناسب را انتخاب کنید.",
          en: "Identify the sign conventions and given parts, then select the corresponding identity.",
        },
        {
          fa: "پس از جایگذاری و ساده‌سازی، نتیجهٔ زیر به دست می‌آید. شرایط وجود و ربع را نیز کنترل کنید.",
          en: "Substitute and simplify to obtain the result below; check existence and quadrant conditions.",
          formula:
            "H=(2-23)\\bmod24=3\\,\\mathrm h=45^\\circ\\quad\\text{west}",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
  },
  {
    id: "rising-setting",
    chapterId: "ch2",
    titleFa: "ستارگان قطبی‌گذر؛ عبور بالا و پایین",
    titleEn: "Circumpolar stars; upper and lower culmination",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "horizon",
    olympiad: "هرگز غروب نمی‌کند · z در عبور",
    summaryFa:
      "در فرمول ارتفاع h را صفر می‌گذاریم. برای ناظر و ستارهٔ غیرقطبی، تقسیم بر cos φ cos δ مجاز است. اگر قدرمطلق طرف راست از یک بیشتر باشد، عبور از افق وجود ندارد.",
    summaryEn:
      "Set h = 0 in the altitude equation. For a nonpolar observer and star, divide by cos φ cos δ. If the resulting cosine has absolute value above one, no horizon crossing exists.",
    smart: {
      chapter: "II",
      sections: "§21",
      pages: "32–33",
      figures: ["15"],
    },
    figures: ["geometry-horizon"],
    englishFormulas: [
      "\\cos H_0=-\\tan\\varphi\\tan\\delta",
      "z_{\\rm upper}=|\\varphi-\\delta|",
    ],
    formulas: [
      {
        display: "\\cos H_0=-\\tan\\varphi\\tan\\delta",
        tex: "\\cos H_0=-\\tan\\varphi\\tan\\delta",
        nameFa: "زاویهٔ افق",
        nameEn: "Horizon hour angle",
      },
      {
        display: "z_{\\rm upper}=|\\varphi-\\delta|",
        tex: "z_{\\rm upper}=|\\varphi-\\delta|",
        nameFa: "فاصلهٔ سمت‌الرأسی عبور بالا",
        nameEn: "Upper-transit zenith distance",
      },
    ],
    sections: [
      {
        headingFa: "حل عبور از افق",
        headingEn: "Solve a horizon crossing",
        bodyFa:
          "در فرمول ارتفاع h را صفر می‌گذاریم. برای ناظر و ستارهٔ غیرقطبی، تقسیم بر cos φ cos δ مجاز است. اگر قدرمطلق طرف راست از یک بیشتر باشد، عبور از افق وجود ندارد.",
        bodyEn:
          "Set h = 0 in the altitude equation. For a nonpolar observer and star, divide by cos φ cos δ. If the resulting cosine has absolute value above one, no horizon crossing exists.",
        formula: "\\cos H_0=-\\tan\\varphi\\tan\\delta",
      },
      {
        headingFa: "آزمون هر دو نیم‌کره",
        headingEn: "A test for both hemispheres",
        bodyFa:
          "کمینهٔ sin h در H = π و بیشینه در H = صفر است. کمینهٔ مثبت یعنی همیشه بالا، بیشینهٔ منفی یعنی همیشه پایین. برابری صفر حالت تماس مماسی است. این آزمون علامت‌دار برای شمال و جنوب یکسان کار می‌کند.",
        bodyEn:
          "Minimum sin h occurs at H = π and maximum at H = 0. Positive minimum means always above; negative maximum means always below. Equality is a grazing case. This signed test works north and south.",
        formula:
          "\\sin h_{\\min}=\\sin\\varphi\\sin\\delta-\\cos\\varphi\\cos\\delta,\\quad\\sin h_{\\max}=\\sin\\varphi\\sin\\delta+\\cos\\varphi\\cos\\delta",
      },
      {
        headingFa: "مدت بالای افق",
        headingEn: "Time above the horizon",
        bodyFa:
          "طلوع در H = منفی H₀ و غروب در مثبت H₀ است. اگر H₀ درجه‌ای باشد، مدت ۲H₀ تقسیم بر ۱۵ ساعت نجومی است. شکست، اندازهٔ قرص و عوارض زمین در این مدل نیستند. در قطب از معادلهٔ تقسیم‌نشده استفاده کنید.",
        bodyEn:
          "Rising is at −H₀, setting at +H₀. With H₀ in degrees the duration is 2H₀/15 sidereal hours. This excludes refraction, disc size, and terrain. At a pole use the undivided altitude equation.",
      },
    ],
    example: {
      id: "ex-rising",
      titleFa: "مدت بالای افق",
      titleEn: "Time above the horizon",
      source: "Original application of Smart II §31, (24)",
      givenFa: "φ = ۴۰°N، δ = +۱۵°.",
      givenEn: "φ = 40°N, δ = +15°.",
      findFa: "زاویهٔ ساعتی غروب و مدت روز ستاره.",
      findEn: "Setting hour angle and time above the horizon.",
      steps: [
        {
          fa: "ارتفاع را صفر می‌گذاریم و معادلهٔ کسینوس را برای H₀ حل می‌کنیم. قدرمطلق طرف راست کمتر از یک است، پس طلوع و غروب وجود دارند.",
          en: "Set altitude to zero and solve the cosine equation for H₀. Its right side lies in [−1,1], so both crossings exist.",
          formula:
            "\\cos H_0=-\\tan40^\\circ\\tan15^\\circ,\\quad H_0\\simeq102.99324^\\circ",
        },
        {
          fa: "فاصلهٔ زاویه‌ای طلوع تا غروب ۲H₀ است. با تقسیم درجه بر ۱۵، ساعت نجومی به دست می‌آید.",
          en: "The hour-angle interval from rising to setting is 2H₀. Divide degrees by 15 to get sidereal hours.",
          formula: "\\Delta t_{\\rm sid}=2H_0/15\\simeq13.73243\\,\\mathrm h",
        },
      ],
      resultFa: "H₀ ≈ ۱۰۳° ≈ ۶ʰ۵۲ᵐ؛ مدت ≈ ۱۳ʰ۴۴ᵐ",
      resultEn: "H₀ ≈ 103° ≈ 6ʰ52ᵐ; duration ≈ 13ʰ44ᵐ",
      widget: "rising",
    },
    exercises: [
      {
        textFa:
          "در عرض ۴۰ درجه شمالی، ستاره‌های با میل مثبت ۶۰ و منفی ۶۰ درجه چه وضعی نسبت به افق دارند؟",
        textEn:
          "At latitude 40° N classify stars at declination +60° and −60° relative to the horizon.",
        answer:
          "\\delta=+60^\\circ:\\ h_{\\min}=10^\\circ;\\quad\\delta=-60^\\circ:\\ h_{\\max}=-10^\\circ",
        source: "Original exercise based on Smart / تمرین تألیفی",
      },
      {
        textFa:
          "فرض‌ها و دامنهٔ اعتبار روابط این درس را بنویسید و یک حالت ویژه را با جایگذاری مستقیم بررسی کنید.",
        textEn:
          "State the assumptions and domain of the identities in this lesson. Verify a special case by direct substitution.",
        source: "Original learning check / تمرین تألیفی",
      },
    ],
  },
  {
    id: "coord-transform",
    chapterId: "ch2",
    titleFa: "کرهٔ سماوی زمین‌مرکز و مثلث PZX",
    titleEn: "The geocentric celestial sphere and triangle PZX",
    level: "المپیاد",
    minutes: 55,
    spherePreset: "astro-tri",
    proofId: "pzx",
    olympiad: "تبدیل استوا ↔ افق",
    summaryFa:
      "P قطب شمال، Z سمت‌الرأس و X جهت ستاره است. اضلاع قطبی متمم عرض و میل و ZX فاصلهٔ سمت‌الرأسی است. زاویهٔ داخلی P کوچک‌ترِ زاویهٔ بین نصف‌النهارهاست؛ برای زمان و سمت از H جهت‌دار استفاده می‌کنیم.",
    summaryEn:
      "P is the north pole, Z the zenith, X the star direction. The polar sides are co-latitude and co-declination; ZX is zenith distance. The interior angle at P is the smaller meridian angle; time and azimuth calculations use signed H.",
    smart: {
      chapter: "II",
      sections: "§§22–23",
      pages: "33–36",
      formulae: ["(3)", "(4)", "(5)", "(6)", "(7)"],
      figures: ["16", "17"],
    },
    figures: ["geometry-astro-tri"],
    englishFormulas: [
      "\\sin h=\\sin\\varphi\\sin\\delta+\\cos\\varphi\\cos\\delta\\cos H",
      "A=\\operatorname{atan2}(-\\cos\\delta\\sin H,\\sin\\delta\\cos\\varphi-\\cos\\delta\\sin\\varphi\\cos H)",
    ],
    formulas: [
      {
        display:
          "\\sin h=\\sin\\varphi\\sin\\delta+\\cos\\varphi\\cos\\delta\\cos H",
        tex: "\\sin h=\\sin\\varphi\\sin\\delta+\\cos\\varphi\\cos\\delta\\cos H",
        nameFa: "ارتفاع هندسی",
        nameEn: "Geometric altitude",
      },
      {
        display:
          "A=\\operatorname{atan2}(-\\cos\\delta\\sin H,\\sin\\delta\\cos\\varphi-\\cos\\delta\\sin\\varphi\\cos H)",
        tex: "A=\\operatorname{atan2}(-\\cos\\delta\\sin H,\\sin\\delta\\cos\\varphi-\\cos\\delta\\sin\\varphi\\cos H)",
        nameFa: "سمت با ربع درست",
        nameEn: "Quadrant-safe azimuth",
      },
    ],
    sections: [
      {
        headingFa: "سه رأس PZX",
        headingEn: "The PZX vertices",
        bodyFa:
          "P قطب شمال، Z سمت‌الرأس و X جهت ستاره است. اضلاع قطبی متمم عرض و میل و ZX فاصلهٔ سمت‌الرأسی است. زاویهٔ داخلی P کوچک‌ترِ زاویهٔ بین نصف‌النهارهاست؛ برای زمان و سمت از H جهت‌دار استفاده می‌کنیم.",
        bodyEn:
          "P is the north pole, Z the zenith, X the star direction. The polar sides are co-latitude and co-declination; ZX is zenith distance. The interior angle at P is the smaller meridian angle; time and azimuth calculations use signed H.",
      },
      {
        headingFa: "ربع را حفظ کنید",
        headingEn: "Keep the quadrant",
        bodyFa:
          "سمت از شمال به شرق و H به غرب مثبت است. کسینوس به تنهایی علامت H یا ربع A را نمی‌دهد. مؤلفه‌های شرقی و شمالی، سمت را با atan2 تعیین می‌کنند.",
        bodyEn:
          "Azimuth is north through east and H west-positive. A cosine alone gives neither H’s sign nor A’s quadrant. East and north components determine A through atan2.",
      },
      {
        headingFa: "تبدیل معکوس",
        headingEn: "The inverse transform",
        bodyFa:
          "از h و A، ابتدا sin δ را با تصویر روی قطب حساب کنید؛ سپس H را از دو مؤلفهٔ زیر با atan2 بیابید. در جهت قطب، بعد و H مستقل تعریف نمی‌شوند.",
        bodyEn:
          "From h,A first compute sin δ by projection on the pole. Then recover H with atan2 from the two components below. At the pole, RA and H are not independently defined.",
        formula:
          "\\begin{aligned}\\sin\\delta&=\\sin\\varphi\\sin h+\\cos\\varphi\\cos h\\cos A\\\\\\cos\\delta\\sin H&=-\\cos h\\sin A\\\\\\cos\\delta\\cos H&=\\sin h\\cos\\varphi-\\cos h\\sin\\varphi\\cos A\\end{aligned}",
      },
    ],
    example: {
      id: "ex-pzx",
      titleFa: "ارتفاع از (φ, δ, H)",
      titleEn: "Altitude from (φ, δ, H)",
      source: "Smart II §23 (3)",
      givenFa: "φ = ۳۵°.۷ N (تهران‌مانند)، δ = +۱۶°.۵، H = +۲ʰ (= ۳۰°).",
      givenEn: "φ = 35°.7 N, δ = +16°.5, H = +2ʰ = 30°.",
      findFa: "سمت‌الرأسی و ارتفاع.",
      findEn: "Zenith distance and altitude.",
      steps: [
        {
          fa: "دو ساعت زاویهٔ ساعتی برابر ۳۰ درجه است. مؤلفهٔ قائم را از قانون کسینوس PZX حساب می‌کنیم.",
          en: "Two hours of hour angle is 30°. Compute the up component using the PZX cosine law.",
          formula:
            "\\sin h=\\sin35.7^\\circ\\sin16.5^\\circ+\\cos35.7^\\circ\\cos16.5^\\circ\\cos30^\\circ",
        },
        {
          fa: "ارتفاع را از معکوس سینوس و فاصلهٔ سمت‌الرأسی را از متمم آن می‌یابیم.",
          en: "Recover altitude with arcsine and zenith distance as its complement.",
          formula:
            "h\\simeq57.14626^\\circ,\\quad z=90^\\circ-h\\simeq32.85374^\\circ",
        },
      ],
      resultFa:
        "فاصلهٔ سمت‌الرأسی تقریباً ۳۲٫۸۵۳۷ درجه و ارتفاع ۵۷٫۱۴۶۳ درجه است.",
      resultEn: "Zenith distance ≈ 32.8537°; altitude ≈ 57.1463°.",
      widget: "pzx",
    },
    exercises: [
      {
        textFa:
          "برای φ = ۳۵٫۷، δ = ۱۶٫۵ و H = ۳۰ درجه، ارتفاع را بیابید و محل ستاره را از نظر شرق یا غرب نصف‌النهار مشخص کنید.",
        textEn:
          "For φ = 35.7°, δ = 16.5°, H = 30°, find altitude and identify the side of the meridian.",
        answer:
          "z\\simeq32.85374^\\circ,\\quad h\\simeq57.14626^\\circ,\\quad H>0:\\ \\text{west}",
        source: "Original exercise based on Smart / تمرین تألیفی",
      },
      {
        textFa:
          "فرض‌ها و دامنهٔ اعتبار روابط این درس را بنویسید و یک حالت ویژه را با جایگذاری مستقیم بررسی کنید.",
        textEn:
          "State the assumptions and domain of the identities in this lesson. Verify a special case by direct substitution.",
        source: "Original learning check / تمرین تألیفی",
      },
    ],
  },
  {
    id: "celestial-sphere",
    chapterId: "ch2",
    titleFa: "بعد، نقطهٔ اعتدال و زمان نجومی",
    titleEn: "Right ascension, the equinox, and sidereal time",
    level: "متوسط",
    minutes: 50,
    spherePreset: "celestial",
    proofId: "sidereal",
    olympiad: "α · LST · ST = H + α",
    summaryFa:
      "زمان نجومی محلی زاویهٔ ساعتی اعتدال بهاری است. برای ستاره در عبور بالایی، LST برابر بعد است. این زمان را با ساعت مدنی یا UTC یکی نگیرید.",
    summaryEn:
      "Local sidereal time is the hour angle of the vernal equinox. A star at upper transit has RA equal to LST. This is not civil time or UTC.",
    smart: {
      chapter: "II",
      sections: "§§24, 27",
      pages: "36–37, 41–42",
      formulae: ["(8)", "(9)", "(13)", "(14)"],
      figures: ["18", "22"],
    },
    figures: ["geometry-celestial"],
    englishFormulas: [
      "\\mathrm{LST}=H+\\alpha\\pmod{24\\,\\mathrm h}",
      "\\mathrm{LST}=\\mathrm{GST}+\\lambda_E/15\\pmod{24\\,\\mathrm h}",
    ],
    formulas: [
      {
        display: "\\mathrm{LST}=H+\\alpha\\pmod{24\\,\\mathrm h}",
        tex: "\\mathrm{LST}=H+\\alpha\\pmod{24\\,\\mathrm h}",
        nameFa: "زمان نجومی محلی",
        nameEn: "Local sidereal time",
      },
      {
        display:
          "\\mathrm{LST}=\\mathrm{GST}+\\lambda_E/15\\pmod{24\\,\\mathrm h}",
        tex: "\\mathrm{LST}=\\mathrm{GST}+\\lambda_E/15\\pmod{24\\,\\mathrm h}",
        nameFa: "طول شرقی به درجه",
        nameEn: "East longitude in degrees",
      },
    ],
    sections: [
      {
        headingFa: "ساعتِ جهت‌گیری زمین",
        headingEn: "A clock for Earth’s orientation",
        bodyFa:
          "زمان نجومی محلی زاویهٔ ساعتی اعتدال بهاری است. برای ستاره در عبور بالایی، LST برابر بعد است. این زمان را با ساعت مدنی یا UTC یکی نگیرید.",
        bodyEn:
          "Local sidereal time is the hour angle of the vernal equinox. A star at upper transit has RA equal to LST. This is not civil time or UTC.",
      },
      {
        headingFa: "حساب پیمانه‌ای و طول",
        headingEn: "Modular arithmetic and longitude",
        bodyFa:
          "LST را به صفر تا ۲۴ ساعت ببرید. برای H می‌توان بازهٔ منفی ۱۲ تا مثبت ۱۲ را انتخاب کرد. همهٔ جمله‌ها باید ساعت باشند؛ طول شرقی درجه‌ای به تقسیم بر ۱۵ نیاز دارد.",
        bodyEn:
          "Reduce LST to [0,24 h); H may use [−12 h,12 h). Keep all terms in hours; east longitude in degrees must be divided by 15.",
      },
      {
        headingFa: "دقت آموزشی آسمان‌نما",
        headingEn: "Educational precision of the sky viewer",
        bodyFa:
          "نمای آسمان از زمان نجومی متوسط تقریبی و مختصات کاتالوگ استفاده می‌کند. محاسبهٔ اخترسنجی دقیق به سازگاری چارچوب و مبدأ زمانی، تقدیم، ترقّص و UT1 نیاز دارد. تعداد رقم نمایش‌داده‌شده تضمین دقت رصدخانه‌ای نیست.",
        bodyEn:
          "The sky viewer uses approximate mean sidereal time and catalogue positions. Precision astrometry requires consistent frame and epoch, precession, nutation, and UT1. Displayed decimal places do not guarantee observatory accuracy.",
      },
    ],
    exercises: [
      {
        textFa:
          "اگر GST برابر ۹٫۲ ساعت و طول ۵۱ درجه شرقی باشد، LST چیست؟ ستارهٔ در عبور بالایی چه بعدی دارد؟",
        textEn:
          "For GST = 9.2 h and longitude 51° east, find LST and the RA of an upper-transiting star.",
        answer:
          "\\mathrm{LST}=9.2+51/15=12.6\\,\\mathrm h,\\quad\\alpha_{\\rm transit}=12.6\\,\\mathrm h",
        source: "Original exercise based on Smart / تمرین تألیفی",
      },
      {
        textFa:
          "فرض‌ها و دامنهٔ اعتبار روابط این درس را بنویسید و یک حالت ویژه را با جایگذاری مستقیم بررسی کنید.",
        textEn:
          "State the assumptions and domain of the identities in this lesson. Verify a special case by direct substitution.",
        source: "Original learning check / تمرین تألیفی",
      },
    ],
    example: {
      id: "check-celestial-sphere",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "اگر GST برابر ۹٫۲ ساعت و طول ۵۱ درجه شرقی باشد، LST چیست؟ ستارهٔ در عبور بالایی چه بعدی دارد؟",
      givenEn:
        "For GST = 9.2 h and longitude 51° east, find LST and the RA of an upper-transiting star.",
      findFa: "نتیجه را با روابط همین درس و کنترل واحدها به دست آورید.",
      findEn: "Use this lesson’s identities and check the units.",
      steps: [
        {
          fa: "ابتدا قرارداد علامت‌ها و داده‌های معلوم را مشخص کنید؛ سپس رابطهٔ متناسب را انتخاب کنید.",
          en: "Identify the sign conventions and given parts, then select the corresponding identity.",
        },
        {
          fa: "پس از جایگذاری و ساده‌سازی، نتیجهٔ زیر به دست می‌آید. شرایط وجود و ربع را نیز کنترل کنید.",
          en: "Substitute and simplify to obtain the result below; check existence and quadrant conditions.",
          formula:
            "\\mathrm{LST}=9.2+51/15=12.6\\,\\mathrm h,\\quad\\alpha_{\\rm transit}=12.6\\,\\mathrm h",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
  },
  {
    id: "ecliptic",
    chapterId: "ch2",
    titleFa: "مدار زمین، دایرة‌البروج و عرض‌طول سماوی",
    titleEn:
      "The Earth’s orbit, the ecliptic, and celestial latitude/longitude",
    level: "المپیاد",
    minutes: 50,
    spherePreset: "ecliptic",
    olympiad: "ε · λ، β · انحراف",
    summaryFa:
      "دایرة‌البروج صفحهٔ مرجع مداری زمین است و روی کره عظیمه می‌سازد. اعتدال بهاری عبور شمال‌سوی خورشید از استوا و مبدأ λ و α است. میل ε میان دو صفحه با مبدأ زمانی تغییر می‌کند.",
    summaryEn:
      "The ecliptic is Earth’s orbital reference plane and cuts a great circle on the sphere. The vernal equinox is the Sun’s northward equator crossing and the origin of λ and α. Obliquity ε varies with epoch.",
    smart: {
      chapter: "II",
      sections: "§§25–26",
      pages: "37–40",
      figures: ["19", "20", "21"],
    },
    figures: ["fig19", "fig21"],
    englishFormulas: [
      "\\sin\\delta=\\sin\\beta\\cos\\varepsilon+\\cos\\beta\\sin\\varepsilon\\sin\\lambda",
      "\\alpha=\\operatorname{atan2}(\\cos\\beta\\sin\\lambda\\cos\\varepsilon-\\sin\\beta\\sin\\varepsilon,\\cos\\beta\\cos\\lambda)",
    ],
    formulas: [
      {
        display:
          "\\sin\\delta=\\sin\\beta\\cos\\varepsilon+\\cos\\beta\\sin\\varepsilon\\sin\\lambda",
        tex: "\\sin\\delta=\\sin\\beta\\cos\\varepsilon+\\cos\\beta\\sin\\varepsilon\\sin\\lambda",
        nameFa: "میل استوایی",
        nameEn: "Equatorial declination",
      },
      {
        display:
          "\\alpha=\\operatorname{atan2}(\\cos\\beta\\sin\\lambda\\cos\\varepsilon-\\sin\\beta\\sin\\varepsilon,\\cos\\beta\\cos\\lambda)",
        tex: "\\alpha=\\operatorname{atan2}(\\cos\\beta\\sin\\lambda\\cos\\varepsilon-\\sin\\beta\\sin\\varepsilon,\\cos\\beta\\cos\\lambda)",
        nameFa: "بعد؛ خروجی زاویه‌ای",
        nameEn: "RA; angular output",
      },
    ],
    sections: [
      {
        headingFa: "صفحه و اعتدال",
        headingEn: "Plane and equinox",
        bodyFa:
          "دایرة‌البروج صفحهٔ مرجع مداری زمین است و روی کره عظیمه می‌سازد. اعتدال بهاری عبور شمال‌سوی خورشید از استوا و مبدأ λ و α است. میل ε میان دو صفحه با مبدأ زمانی تغییر می‌کند.",
        bodyEn:
          "The ecliptic is Earth’s orbital reference plane and cuts a great circle on the sphere. The vernal equinox is the Sun’s northward equator crossing and the origin of λ and α. Obliquity ε varies with epoch.",
      },
      {
        headingFa: "چرخش دستگاه",
        headingEn: "Rotate the coordinate frame",
        bodyFa:
          "بردار دایرة‌البروجی را حول محور مشترک اعتدال به اندازهٔ ε می‌چرخانیم. مؤلفهٔ قائم sin δ و دو مؤلفهٔ استوایی بعد را با atan2 تعیین می‌کنند.",
        bodyEn:
          "Rotate the ecliptic vector by ε about the common equinox axis. The new vertical component is sin δ; the two equatorial components give RA through atan2.",
        formula:
          "\\sin\\delta=\\sin\\beta\\cos\\varepsilon+\\cos\\beta\\sin\\varepsilon\\sin\\lambda",
      },
      {
        headingFa: "خورشید و واحد طول",
        headingEn: "The Sun and longitude units",
        bodyFa:
          "برای β تقریباً صفر، در λ = ۹۰ درجه میل خورشید +ε و در ۲۷۰ درجه −ε است. طول دایرة‌البروجی را معمولاً درجه‌ای می‌نویسیم؛ آن را با بعد ساعتی مخلوط نکنید.",
        bodyEn:
          "For β approximately zero, solar declination is +ε at λ = 90° and −ε at 270°. Ecliptic longitude is normally in degrees; do not confuse it with RA in hours.",
      },
    ],
    exercises: [
      {
        textFa:
          "برای β = صفر و طول‌های دایرة‌البروجی صفر، ۹۰، ۱۸۰ و ۲۷۰ درجه، میل را از فرمول به دست آورید.",
        textEn:
          "For β = 0 and ecliptic longitudes 0°,90°,180°,270°, derive the declinations.",
        answer:
          "\\delta=0,\\ +\\varepsilon,\\ 0,\\ -\\varepsilon\\quad\\text{respectively}",
        source: "Original exercise based on Smart / تمرین تألیفی",
      },
      {
        textFa:
          "فرض‌ها و دامنهٔ اعتبار روابط این درس را بنویسید و یک حالت ویژه را با جایگذاری مستقیم بررسی کنید.",
        textEn:
          "State the assumptions and domain of the identities in this lesson. Verify a special case by direct substitution.",
        source: "Original learning check / تمرین تألیفی",
      },
    ],
    example: {
      id: "check-ecliptic",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "برای β = صفر و طول‌های دایرة‌البروجی صفر، ۹۰، ۱۸۰ و ۲۷۰ درجه، میل را از فرمول به دست آورید.",
      givenEn:
        "For β = 0 and ecliptic longitudes 0°,90°,180°,270°, derive the declinations.",
      findFa: "نتیجه را با روابط همین درس و کنترل واحدها به دست آورید.",
      findEn: "Use this lesson’s identities and check the units.",
      steps: [
        {
          fa: "ابتدا قرارداد علامت‌ها و داده‌های معلوم را مشخص کنید؛ سپس رابطهٔ متناسب را انتخاب کنید.",
          en: "Identify the sign conventions and given parts, then select the corresponding identity.",
        },
        {
          fa: "پس از جایگذاری و ساده‌سازی، نتیجهٔ زیر به دست می‌آید. شرایط وجود و ربع را نیز کنترل کنید.",
          en: "Substitute and simplify to obtain the result below; check existence and quadrant conditions.",
          formula:
            "\\delta=0,\\ +\\varepsilon,\\ 0,\\ -\\varepsilon\\quad\\text{respectively}",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
  },
  {
    id: "time",
    chapterId: "ch2",
    titleFa: "زمان خورشیدی متوسط و نمونهٔ منطقهٔ زمانی",
    titleEn: "Mean solar time and a zone-time example",
    level: "متوسط",
    minutes: 45,
    spherePreset: "celestial",
    olympiad: "معادلهٔ زمان · زمان منطقه",
    summaryFa:
      "روز خورشیدی ظاهری از عبورهای خورشید واقعی تعریف می‌شود و یکنواخت نیست. خورشید متوسط مرجعی قراردادی برای حرکت یکنواخت است. زمان مدنی منطقه‌ای و زمان نجومی نیز تعریف‌های دیگری دارند.",
    summaryEn:
      "Apparent solar days follow real-Sun transits and are unequal. The mean Sun is a conventional uniform reference. Zone civil time and sidereal time are separate concepts.",
    smart: {
      chapter: "II",
      sections: "§§28–29",
      pages: "42–46",
    },
    figures: ["fig22"],
    englishFormulas: [
      "E=\\mathrm{AST}-\\mathrm{MST}",
      "\\mathrm{LMST}\\simeq t_{\\rm zone}+\\frac{\\lambda_E-\\lambda_{\\rm zone}}{15}",
    ],
    formulas: [
      {
        display: "E=\\mathrm{AST}-\\mathrm{MST}",
        tex: "E=\\mathrm{AST}-\\mathrm{MST}",
        nameFa: "معادلهٔ زمان",
        nameEn: "Equation of time",
      },
      {
        display:
          "\\mathrm{LMST}\\simeq t_{\\rm zone}+\\frac{\\lambda_E-\\lambda_{\\rm zone}}{15}",
        tex: "\\mathrm{LMST}\\simeq t_{\\rm zone}+\\frac{\\lambda_E-\\lambda_{\\rm zone}}{15}",
        nameFa: "واحد ساعت؛ بدون ساعت تابستانی",
        nameEn: "Hours; daylight saving removed",
      },
    ],
    sections: [
      {
        headingFa: "چهار مفهوم متفاوت زمان",
        headingEn: "Four distinct time concepts",
        bodyFa:
          "روز خورشیدی ظاهری از عبورهای خورشید واقعی تعریف می‌شود و یکنواخت نیست. خورشید متوسط مرجعی قراردادی برای حرکت یکنواخت است. زمان مدنی منطقه‌ای و زمان نجومی نیز تعریف‌های دیگری دارند.",
        bodyEn:
          "Apparent solar days follow real-Sun transits and are unequal. The mean Sun is a conventional uniform reference. Zone civil time and sidereal time are separate concepts.",
      },
      {
        headingFa: "قرارداد علامت E",
        headingEn: "Choose the E sign convention",
        bodyFa:
          "اینجا E برابر زمان ظاهری منهای متوسط است؛ E مثبت یعنی ساعت آفتابی جلوتر است. بعضی منابع علامت معکوس دارند. E را اگر دقیقه‌ای است قبل از جمع به ساعت تبدیل کنید.",
        bodyEn:
          "Here E is apparent minus mean solar time; positive E means a sundial is ahead. Some sources use the opposite sign. Convert E from minutes to hours before addition.",
        formula: "E=\\mathrm{AST}-\\mathrm{MST}",
      },
      {
        headingFa: "از ساعت منطقه‌ای به H خورشید",
        headingEn: "From zone time to solar H",
        bodyFa:
          "پس از حذف ساعت تابستانی، اختلاف طول مکان و نصف‌النهار منطقه را بر ۱۵ تقسیم و به ساعت اضافه کنید؛ سپس E را اعمال کنید. ظهر ظاهری ۱۲ ساعت است. این تبدیل آموزشی اختلاف دقیق UTC با زمان خورشیدی متوسط را نادیده می‌گیرد.",
        bodyEn:
          "Remove daylight saving, add the location–zone-meridian longitude difference divided by 15, then apply E. Apparent noon is 12 h. This classroom conversion neglects the precision difference between UTC and mean solar time.",
        formula: "H_{\\odot,deg}=15(\\mathrm{AST}_h-12)",
      },
    ],
    exercises: [
      {
        textFa:
          "ساعت منطقه‌ای بدون تغییر تابستانی ۱۲:۰۰ است؛ نصف‌النهار منطقه ۴۵ و مکان ۵۱ درجه شرقی و E = مثبت ۸ دقیقه است. AST و H خورشید چیست؟",
        textEn:
          "Zone time is 12:00 with no DST; zone meridian 45° E, observer 51° E, E = +8 min. Find AST and solar H.",
        answer:
          "\\mathrm{LMST}\\simeq12{:}24,\\quad\\mathrm{AST}\\simeq12{:}32,\\quad H_{\\odot}=8^\\circ",
        source: "Original exercise based on Smart / تمرین تألیفی",
      },
      {
        textFa:
          "فرض‌ها و دامنهٔ اعتبار روابط این درس را بنویسید و یک حالت ویژه را با جایگذاری مستقیم بررسی کنید.",
        textEn:
          "State the assumptions and domain of the identities in this lesson. Verify a special case by direct substitution.",
        source: "Original learning check / تمرین تألیفی",
      },
    ],
    example: {
      id: "check-time",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "ساعت منطقه‌ای بدون تغییر تابستانی ۱۲:۰۰ است؛ نصف‌النهار منطقه ۴۵ و مکان ۵۱ درجه شرقی و E = مثبت ۸ دقیقه است. AST و H خورشید چیست؟",
      givenEn:
        "Zone time is 12:00 with no DST; zone meridian 45° E, observer 51° E, E = +8 min. Find AST and solar H.",
      findFa: "نتیجه را با روابط همین درس و کنترل واحدها به دست آورید.",
      findEn: "Use this lesson’s identities and check the units.",
      steps: [
        {
          fa: "اختلاف طول ۶ درجه معادل ۲۴ دقیقهٔ زمان است. آن را به ۱۲:۰۰ اضافه می‌کنیم تا زمان متوسط محلی ۱۲:۲۴ شود. با افزودن E، زمان ظاهری ۱۲:۳۲ است.",
          en: "The 6° longitude offset is 24 minutes of time. Add it to 12:00 to get local mean solar time 12:24, then add E to get apparent solar time 12:32.",
        },
        {
          fa: "پس از جایگذاری و ساده‌سازی، نتیجهٔ زیر به دست می‌آید. شرایط وجود و ربع را نیز کنترل کنید.",
          en: "Substitute and simplify to obtain the result below; check existence and quadrant conditions.",
          formula:
            "\\mathrm{LMST}\\simeq12{:}24,\\quad\\mathrm{AST}\\simeq12{:}32,\\quad H_{\\odot}=8^\\circ",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
  },
  {
    id: "sidereal-solar-intervals",
    chapterId: "ch2",
    titleFa: "تبدیل بازهٔ زمان خورشیدی و نجومی",
    titleEn: "Solar and sidereal time intervals",
    level: "المپیاد",
    minutes: 35,
    spherePreset: "horizon",
    olympiad: "Smart II · geometry, units, and limiting cases",
    summaryFa:
      "زمین در مدار به جلو می‌رود؛ برای بازگشت خورشید به نصف‌النهار، کمی بیش از یک چرخش نسبت به ستارگان لازم است. پس روز نجومی کوتاه‌تر از روز خورشیدی متوسط است.",
    summaryEn:
      "Earth advances in orbit, so returning the Sun to the meridian requires slightly more than one stellar rotation. A sidereal day is shorter than a mean solar day.",
    smart: {
      chapter: "II",
      sections: "§30",
      pages: "44–46",
    },
    figures: ["geometry-horizon"],
    formulas: [
      {
        display:
          "1\\ \\mathrm{sidereal\\ day}\\simeq23\\,\\mathrm h\\ 56\\,\\mathrm{min}\\ 4.09\\,\\mathrm s",
        nameFa: "طول متوسط روز نجومی",
        nameEn: "Mean sidereal-day duration",
      },
    ],
    sections: [
      {
        headingFa: "یک چرخش، دو مرجع",
        headingEn: "One rotation, two references",
        bodyFa:
          "زمین در مدار به جلو می‌رود؛ برای بازگشت خورشید به نصف‌النهار، کمی بیش از یک چرخش نسبت به ستارگان لازم است. پس روز نجومی کوتاه‌تر از روز خورشیدی متوسط است.",
        bodyEn:
          "Earth advances in orbit, so returning the Sun to the meridian requires slightly more than one stellar rotation. A sidereal day is shorter than a mean solar day.",
      },
      {
        headingFa: "نرخ و مبدأ را جدا کنید",
        headingEn: "Separate rate from origin",
        bodyFa:
          "نسبت نرخ متوسط حدود ۱٫۰۰۲۷۳۷۹ است. این ضریب برای بازهٔ زمانی است؛ با ضرب ساعت مدنیِ مطلق در آن نمی‌توان LST به دست آورد. مبدأ تاریخ و زمان نجومی گرینویچ نیز لازم‌اند.",
        bodyEn:
          "The mean rate ratio is about 1.0027379. This converts intervals, not absolute clock readings. Multiplying a civil clock value alone cannot yield LST; a date-dependent Greenwich origin is also needed.",
        formula:
          "\\Delta t_{\\rm sid}\\simeq1.0027379\\,\\Delta t_{\\rm mean\\ solar}",
      },
      {
        headingFa: "معنای واحد ساعت در حرکت ستاره",
        headingEn: "Interpreting hour angle as time",
        bodyFa:
          "افزایش ۱۵ درجهٔ H برای ستاره تقریباً یک ساعت نجومی است. در مسئلهٔ دقیق زمان خورشیدی باید تبدیل نرخ انجام شود؛ در مدل ثابت‌میل خورشید، H نسبت به خود خورشید ساعت خورشیدی ظاهری را می‌سنجد.",
        bodyEn:
          "For a star, a 15° increase in H is one sidereal hour. Convert the rate when expressing this in mean solar time. For the fixed-declination Sun, solar H refers to apparent solar time.",
      },
    ],
    exercises: [
      {
        textFa:
          "یک بازهٔ ۶ ساعت خورشیدی متوسط، تقریباً چند ساعت و ثانیهٔ نجومی است؟",
        textEn:
          "Convert an interval of 6 mean solar hours to sidereal hours and seconds.",
        source: "Original interval check",
        answer:
          "\\Delta t_{\\rm sid}\\simeq6.0164274\\,\\mathrm h\\simeq6\\,\\mathrm h\\ 59.14\\,\\mathrm s",
      },
    ],
    englishFormulas: [
      "1\\ \\mathrm{sidereal\\ day}\\simeq23\\,\\mathrm h\\ 56\\,\\mathrm{min}\\ 4.09\\,\\mathrm s",
    ],
  },
  {
    id: "daily-coordinate-rates",
    chapterId: "ch2",
    titleFa: "نرخ تغییر ارتفاع و سمت",
    titleEn: "Daily rates of altitude and azimuth",
    level: "المپیاد",
    minutes: 35,
    spherePreset: "horizon",
    olympiad: "Smart II · geometry, units, and limiting cases",
    summaryFa:
      "در بازهٔ کوتاه φ و δ را ثابت می‌گیریم و H متغیر است. همهٔ مشتق‌های زاویه نسبت به زاویه در این درس رادیان بر رادیان‌اند؛ نرخ زمانی با ضرب در dH/dt به دست می‌آید.",
    summaryEn:
      "Over a short interval take φ and δ fixed and H variable. Angular derivatives here are radians per radian; multiply by dH/dt to obtain time rates.",
    smart: {
      chapter: "II",
      sections: "§32",
      pages: "48–51",
    },
    figures: ["geometry-horizon"],
    formulas: [
      {
        display:
          "\\frac{dh}{dH}=-\\frac{\\cos\\varphi\\cos\\delta\\sin H}{\\cos h}",
        nameFa: "مشتق ارتفاع",
        nameEn: "Altitude derivative",
      },
      {
        display: "\\frac{dA}{dH}=\\sin\\varphi-\\cos\\varphi\\tan h\\cos A",
        nameFa: "مشتق سمت شمال به شرق",
        nameEn: "North-through-east azimuth derivative",
      },
    ],
    sections: [
      {
        headingFa: "فرض تغییرات روزانه",
        headingEn: "Assume fixed stellar coordinates",
        bodyFa:
          "در بازهٔ کوتاه φ و δ را ثابت می‌گیریم و H متغیر است. همهٔ مشتق‌های زاویه نسبت به زاویه در این درس رادیان بر رادیان‌اند؛ نرخ زمانی با ضرب در dH/dt به دست می‌آید.",
        bodyEn:
          "Over a short interval take φ and δ fixed and H variable. Angular derivatives here are radians per radian; multiply by dH/dt to obtain time rates.",
      },
      {
        headingFa: "مشتق ارتفاع",
        headingEn: "Differentiate altitude",
        bodyFa:
          "از sin h = sin φ sin δ + cos φ cos δ cos H نسبت به H مشتق می‌گیریم. تقسیم بر cos h فقط دور از سمت‌الرأس و سمت‌القدم مجاز است.",
        bodyEn:
          "Differentiate sin h = sin φ sin δ + cos φ cos δ cos H with respect to H. Division by cos h is valid away from zenith and nadir.",
        formula:
          "\\frac{dh}{dH}=-\\frac{\\cos\\varphi\\cos\\delta\\sin H}{\\cos h}",
      },
      {
        headingFa: "مشتق سمت با قرارداد برنامه",
        headingEn: "Differentiate azimuth in this app’s convention",
        bodyFa:
          "سمت این برنامه شمال به شرق است و با سمت شمال به غرب متن علامت مخالف دارد. از A = atan2(e,n)، مشتق برابر (n e′ − e n′) تقسیم بر (e² + n²) است. با جایگذاری، نتیجهٔ زیر می‌آید.",
        bodyEn:
          "This app uses north-through-east azimuth, opposite in sign to the text’s north-through-west convention. For A = atan2(e,n), the derivative is (n e′−e n′)/(e²+n²). Substitution gives the following result.",
        formula: "\\frac{dA}{dH}=\\sin\\varphi-\\cos\\varphi\\tan h\\cos A",
      },
      {
        headingFa: "تکینگی دستگاه مختصات",
        headingEn: "A coordinate singularity",
        bodyFa:
          "نزدیک سمت‌الرأس، سمت می‌تواند بسیار سریع تغییر کند بدون اینکه حرکت زاویه‌ای واقعی ستاره بی‌نهایت شود. در H = صفر، ارتفاع در عبور معمولی اکسترمم دارد، مگر اینکه خود دستگاه مختصات تکین باشد.",
        bodyEn:
          "Near zenith azimuth may change very rapidly while the star’s actual angular speed remains finite. At ordinary upper transit H = 0, altitude is extremal unless the coordinate chart itself is singular.",
      },
    ],
    exercises: [
      {
        textFa:
          "در استوا و اعتدال، هنگام غروب هندسی H = ۹۰ درجه است. dh/dH و dA/dH را بیابید.",
        textEn:
          "At the equator and equinox, geometric setting has H = 90°. Find dh/dH and dA/dH.",
        source: "Original derivative check",
        answer: "dh/dH=-1,\\quad dA/dH=0",
      },
    ],
    englishFormulas: [
      "\\frac{dh}{dH}=-\\frac{\\cos\\varphi\\cos\\delta\\sin H}{\\cos h}",
      "\\frac{dA}{dH}=\\sin\\varphi-\\cos\\varphi\\tan h\\cos A",
    ],
  },
  {
    id: "twilight",
    chapterId: "ch2",
    titleFa: "شفق و پایان تاریکی نجومی",
    titleEn: "Twilight and astronomical darkness",
    level: "المپیاد",
    minutes: 35,
    spherePreset: "horizon",
    olympiad: "Smart II · geometry, units, and limiting cases",
    summaryFa:
      "بعد از غروب، پراکندگی نور جو آسمان را روشن نگه می‌دارد. آستانه‌های متداول ارتفاع هندسی مرکز خورشید منفی ۶، ۱۲ و ۱۸ درجه به‌ترتیب شفق مدنی، دریایی و نجومی‌اند. اسمارت پایان شفق را با فاصلهٔ سمت‌الرأسی ۱۰۸ درجه بحث می‌کند.",
    summaryEn:
      "Atmospheric scattering illuminates the sky after sunset. Conventional geometric solar-centre altitudes −6°,−12°,−18° define civil, nautical, and astronomical twilight. Smart discusses the end of twilight at zenith distance 108°.",
    smart: {
      chapter: "II",
      sections: "§33",
      pages: "51–52",
    },
    figures: ["geometry-horizon"],
    formulas: [
      {
        display:
          "\\Delta t\\simeq\\frac{H(-18^\\circ)-H(0^\\circ)}{15}\\ \\mathrm h",
        nameFa: "مدت شفق در مدل ثابت‌میل",
        nameEn: "Twilight duration in a fixed-declination model",
      },
    ],
    sections: [
      {
        headingFa: "تعریف آستانه",
        headingEn: "Define the threshold",
        bodyFa:
          "بعد از غروب، پراکندگی نور جو آسمان را روشن نگه می‌دارد. آستانه‌های متداول ارتفاع هندسی مرکز خورشید منفی ۶، ۱۲ و ۱۸ درجه به‌ترتیب شفق مدنی، دریایی و نجومی‌اند. اسمارت پایان شفق را با فاصلهٔ سمت‌الرأسی ۱۰۸ درجه بحث می‌کند.",
        bodyEn:
          "Atmospheric scattering illuminates the sky after sunset. Conventional geometric solar-centre altitudes −6°,−12°,−18° define civil, nautical, and astronomical twilight. Smart discusses the end of twilight at zenith distance 108°.",
      },
      {
        headingFa: "حل دو عبور با یک فرمول",
        headingEn: "Solve two crossings with one formula",
        bodyFa:
          "با ثابت گرفتن میل در یک شب، H را برای افق هندسی و سپس برای h = منفی ۱۸ درجه حساب کنید. اختلاف زاویه در شاخهٔ غروب، تقسیم بر ۱۵، مدت تقریبی شفق را به ساعت خورشیدی ظاهری می‌دهد.",
        bodyEn:
          "Assuming constant declination over a night, solve for H at the geometric horizon and at h = −18°. On the evening branch their difference divided by 15 gives the approximate duration in apparent solar hours.",
        formula:
          "\\cos H(h)=\\frac{\\sin h-\\sin\\varphi\\sin\\delta}{\\cos\\varphi\\cos\\delta}",
      },
      {
        headingFa: "وقتی آستانه رخ نمی‌دهد",
        headingEn: "When the threshold is never reached",
        bodyFa:
          "اگر طرف راست برای ارتفاع منفی ۱۸ درجه کمتر از منفی یک باشد، خورشید آن شب به آستانهٔ تاریکی نجومی نمی‌رسد. اگر خود غروب رخ ندهد، مدت پس از غروب تعریف معمول ندارد. این موارد را با arccos محدودشده به زور جواب نسازید.",
        bodyEn:
          "If the cosine at −18° is below −1, the Sun never reaches astronomical darkness that night. If sunset itself does not occur, an ordinary post-sunset duration is undefined. Do not force an answer by clamping arccos.",
      },
      {
        headingFa: "نور واقعی و مدل هندسی",
        headingEn: "Brightness and the geometric model",
        bodyFa:
          "این آستانه‌ها قرارداد هندسی‌اند؛ ماه، آلودگی نوری، ابر و جو بر تاریکی واقعی اثر دارند. تغییر میل و شکست برای پیش‌بینی دقیق زمان رویداد نیازمند مدل جداست.",
        bodyEn:
          "These are geometric conventions. Moonlight, light pollution, clouds, and atmosphere affect actual darkness. Changing declination and refraction require additional modelling for precision event times.",
      },
    ],
    exercises: [
      {
        textFa:
          "در استوا و اعتدال، مدت شفق از افق هندسی تا ارتفاع منفی ۱۸ درجه تقریباً چند دقیقه است؟",
        textEn:
          "At the equator and equinox, how long from the geometric horizon to altitude −18°?",
        source: "Original twilight check",
        answer:
          "H(0)=90^\\circ,\\quad H(-18^\\circ)=108^\\circ,\\quad\\Delta t=72\\ \\mathrm{min}",
      },
    ],
    englishFormulas: [
      "\\Delta t\\simeq\\frac{H(-18^\\circ)-H(0^\\circ)}{15}\\ \\mathrm h",
    ],
  },
];
