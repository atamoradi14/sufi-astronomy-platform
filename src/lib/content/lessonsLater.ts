import type { Lesson } from "./lessonTypes";

export const LESSONS_LATER: Lesson[] = [
  {
    id: "refraction-parallax",
    chapterId: "ch3",
    titleFa: "شکست جوّی",
    titleEn: "Astronomical refraction",
    level: "المپیاد",
    minutes: 50,
    spherePreset: "horizon",
    olympiad: "z حقیقی و ظاهری · فرمول کسینی",
    summaryFa:
      "فصل III: پرتو ستاره در جو خم می‌شود؛ سمت‌القدم ظاهری از حقیقی کوچک‌تر است. از ضریب شکست لایه‌ها تا انتگرال عمومی (۲۰) و ثابت‌های A, B کسینی.",
    summaryEn:
      "Smart III: true vs apparent zenith distance; layered atmosphere; general integral; Cassini constants.",
    smart: {
      chapter: "III",
      sections: "full chapter",
      pages: "58–73",
      formulae: ["(20)", "(31)", "(32)"],
    },
    figures: ["fig10"],
    englishFormulas: [
      "Apparent zenith distance ζ = z − R, with R the refraction.",
      "Homogeneous atmosphere (first approximation): R ≈ (μ − 1) tan z.",
      "General: R as an integral in refractive index μ(r) — Smart (20).",
    ],
    formulas: [
      {
        display: "ζ = z − R",
        nameFa: "سمت‌القدم ظاهری",
        nameEn: "Apparent zenith distance",
      },
      {
        display: "R ≈ (μ₀ − 1) tan z    (homogeneous)",
        nameFa: "تقریب جو همگن",
        nameEn: "Homogeneous atmosphere",
      },
    ],
    sections: [
      {
        headingFa: "z حقیقی و ظاهری",
        headingEn: "True and apparent z",
        bodyFa:
          "بدون جو، راستای ستاره خط راست است. جو چگال‌تر در لایه‌های پایین پرتو را به‌سوی قائم خم می‌کند، پس ستاره بالاتر از جای حقیقی دیده می‌شود. z زاویهٔ تابش در مرز بالایی جو (سمت‌القدم حقیقی) است؛ ζ سمت‌القدم مشاهده‌شده است؛ R = z − ζ شکست است. نزدیک افق R حدود ۳۴′ است و طلوع/غروب را جابه‌جا می‌کند.",
        bodyEn:
          "Refraction bends the ray toward the vertical, so a star is seen higher than its true place. True zenith distance z is the incidence angle at the top of the atmosphere; ζ is observed; R = z − ζ. Near the horizon R ≈ 34′.",
      },
      {
        headingFa: "مدل لایه‌ای و انتگرال (۲۰)",
        headingEn: "Layered model and integral (20)",
        bodyFa:
          "اسمارت جو را لایه‌های کروی با ضرایب μ₀ = 1 (خلا)، …، μ در سطح زمین می‌گیرد. قانون اسنل در هر سطح و هندسهٔ شعاع زمین r به انتگرال عمومی شکست می‌انجامد که هم μ و هم r را دربردارد. برای رصد معمولی بسط tan ζ با ضرایب تجربی A, B (کسینی/برادلی) کافی است.",
        bodyEn:
          "Spherical layers from μ = 1 in space to μ at the ground, with Snell’s law at each interface, yield Smart’s general integral (20) in μ and r. For ordinary altitudes a tan ζ series with Cassini constants A, B is used.",
      },
      {
        headingFa: "تعیین A و B از ستارهٔ قطبی‌گرد",
        headingEn: "A and B from a circumpolar star",
        bodyFa:
          "گذار بالا و پایین یک ستارهٔ قطبی‌گرد دو معادله برای A و B می‌دهد اگر φ و δ معلوم باشند — یا با حذف φ، δ را هم می‌توان درآورد. این یکی از تمرین‌های کلاسیک فصل است.",
        bodyEn:
          "Upper and lower culminations of a circumpolar star give two equations for A and B when φ and δ are known; φ can be eliminated if δ is the unknown. This is a classical exercise of the chapter.",
        formula: "z′ = 180° − φ − δ = ζ′ + A tan ζ′ + B tan³ ζ′",
      },
    ],
    exercises: [
      {
        textFa: "دو ستارهٔ همسایه به فاصلهٔ حقیقی D (ثانیهٔ قوس). نشان دهید فاصلهٔ مشاهده‌شده D − k D (1 + cos²ψ tan² z) است (تمرین ۷ فصل III).",
        textEn:
          "Two neighbouring stars, true distance D. Show the observed distance is D − kD(1 + cos²ψ tan² z) (Smart III, Ex. 7).",
        source: "Smart III Exercises 7",
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
    olympiad: "خطای هم‌خطی، تراز، سمت · بسل",
    summaryFa:
      "فصل IV: ابزار بنیادی اندازه‌گیری α و δ. سه خطای کوچک — collimation c، level b، azimuth a — و تصحیح زمان گذار به‌سبک بسل.",
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
        nameFa: "تصحیح بسل زمان گذار (صورت آموزشی)",
        nameEn: "Bessel transit correction (teaching form)",
      },
    ],
    sections: [
      {
        headingFa: "سه خطای هندسی",
        headingEn: "Three geometric errors",
        bodyFa:
          "محور چرخش باید شرقی–غربی و افقی باشد و صفحهٔ هم‌خطی باید بر نصف‌النهار منطبق شود. انحراف‌های کوچک: a سمت (غربِ محور به‌سوی افق)، b تراز (یک سر محور بالا)، c هم‌خطی (سیم مرکزی خارج از صفحهٔ عمود بر محور). ستاره وقتی روی سیم مرکزی دیده می‌شود که هنوز (یا دیگر) روی نصف‌النهار حقیقی نیست.",
        bodyEn:
          "The rotation axis should be east–west and horizontal, and the collimation plane should be the meridian. Small errors: azimuth a, level b, collimation c. The star is observed on the central wire not exactly on the true meridian.",
      },
      {
        headingFa: "از گذار به بعد",
        headingEn: "From transit to right ascension",
        bodyFa:
          "زمان گذار تصحیح‌شده، زمان نجومی محلی در لحظهٔ عبور است و برابر بعد ستاره است (ST = α در نصف‌النهار). مبدأ بعد از عبور خورشید در اعتدال بهاری و از ساعت نجومی نگهداری می‌شود. میل از سمت‌القدم نصف‌النهاری پس از شکست به‌دست می‌آید: δ = φ − z (جنوب سمت‌الرأس با علامت مناسب).",
        bodyEn:
          "The corrected transit time is the local sidereal time of meridian passage, equal to the star’s RA. Declination follows from the meridian zenith distance after refraction: δ = φ − z with the usual sign convention south of the zenith.",
      },
    ],
    exercises: [
      {
        textFa: "با مختصات دو ستاره نزدیک قطب، خطای سمت دایرهٔ نصف‌النهاری را از اختلاف گذارها برآورد کنید (نمونهٔ لندن ۱۹۲۶ در تمرین‌های فصل).",
        textEn:
          "From two near-polar stars, estimate the azimuth error of the meridian circle (London 1926 exercise in Smart IV).",
        source: "Smart IV Exercises",
      },
    ],
  },
  {
    id: "kepler",
    chapterId: "ch5",
    titleFa: "حرکت سیارات و معادلهٔ کپلر",
    titleEn: "Planetary motion and Kepler’s equation",
    level: "المپیاد",
    minutes: 55,
    spherePreset: "ecliptic",
    olympiad: "آنومالی خارج از مرکز · عناصر مدار",
    summaryFa:
      "فصل V: شتاب نیوتن، قوانین کپلر، vis viva، آنومالی حقیقی/متوسط/خارج از مرکز، معادلهٔ کپلر M = E − e sin E، و هفت عنصر مدار.",
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
      "M = n(t − τ) = E − e sin E.",
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
        nameFa: "شعاع حامل",
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
          "شتاب نسبی سیاره نسبت به خورشید −G(M+m)/r² روی خط واصل است. حل در صفحهٔ مدار یک مقطع مخروطی با کانون در خورشید است. برای مدار بسته، بیضی با نیمهقطر بزرگ a و خروج از مرکز e. قانون مساحت‌ها h = r²θ̇ ثابت است. دوره از قانون سوم: n²a³ = μ با n حرکت متوسط.",
        bodyEn:
          "Relative acceleration toward the Sun is −G(M+m)/r². Bound orbits are ellipses with the Sun at a focus. Areal velocity h = r²θ̇ is constant. Mean motion satisfies n² a³ = μ.",
      },
      {
        headingFa: "سه آنومالی",
        headingEn: "Three anomalies",
        bodyFa:
          "آنومالی حقیقی v زاویه از حضیض در کانون است. آنومالی خارج از مرکز E از دایرهٔ کمکی به قطر محور بزرگ. آنومالی متوسط M = n(t−τ) زاویهٔ خیالی یکنواخت است. معادلهٔ کپلر M = E − e sin E E را از زمان می‌دهد؛ سپس r و v از E.",
        bodyEn:
          "True anomaly v is the focus angle from perihelion; eccentric anomaly E is the auxiliary-circle angle; mean anomaly M = n(t−τ) is uniform. Kepler’s equation M = E − e sin E is solved for E, then r and v follow.",
        formula: "M = E − e sin E",
      },
      {
        headingFa: "عناصر و انتقال به استوایی",
        headingEn: "Elements and the equatorial frame",
        bodyFa:
          "عناصر کلاسیک: a, e, i, Ω, ω, τ (یا M₀). اسمارت بردار شعاع را در صفحهٔ مدار می‌سازد، با سه دوران به محورهای دایرة‌البروجی و سپس استوایی می‌برد، و α, δ را از X,Y,Z زمین‌مرکز می‌گیرد.",
        bodyEn:
          "Classical elements a, e, i, Ω, ω, τ. Smart rotates the orbital radius into ecliptic then equatorial axes and reads α, δ from the geocentric vector.",
      },
    ],
    exercises: [
      {
        textFa: "با دانستن a و T سیاره نسبت به زمین، نیمهقطر بزرگ را از قانون سوم به واحد نجومی بیان کنید.",
        textEn: "Given a planet’s period T in years, express its semi-major axis in AU from Kepler III.",
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
    olympiad: "سال اعتدالی · گریگوری · فصول",
    summaryFa:
      "فصل VI: روز نجومی در برابر شمسی، تقدیم اعتدالین به‌عنوان زمینه، سال اعتدالی، ژولین و گریگوری، و معادلهٔ مرکز برای طول فصول.",
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
      "Equation of centre: λ ≈ ϖ + 2e sin M  (first order).",
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
        headingFa: "چرا قطب جابه‌جا می‌شود",
        headingEn: "Why the pole moves",
        bodyFa:
          "اسمارت فصل زمان را با تقدیم باز می‌کند: دو هزار سال پیش قطب ۱۲° از جدی جدا بود؛ دوازده هزار سال بعد نزدیک نسر واقع خواهد بود. سال اعتدالی فاصلهٔ بازگشت خورشید به ♈ است، نه بازگشت به همان ستاره (سال نجومی).",
        bodyEn:
          "Precession: two thousand years ago the pole was 12° from Polaris; in 12 000 years it will lie near Vega. The tropical year is the return of the Sun to ♈, not to the same star (sidereal year).",
      },
      {
        headingFa: "ژولین و گریگوری",
        headingEn: "Julian and Gregorian",
        bodyFa:
          "ژولین هر چهار سال یک کبیسه می‌گذارد (سال متوسط ۳۶۵.۲۵ روز) و نسبت به سال اعتدالی جلو می‌افتد. گریگوری (۱۵۸۲؛ در انگلستان ۱۷۵۲) سال‌های قرن را فقط اگر بر ۴۰۰ بخش‌پذیر باشند کبیسه می‌کند، چنان‌که ۱۷۰۰، ۱۸۰۰، ۱۹۰۰ کبیسه نیستند و ۲۰۰۰ هست.",
        bodyEn:
          "Julian leap years every four years average 365.25 d. Gregorian (1582; Britain 1752) drops century leap years unless divisible by 400: 1700, 1800, 1900 common, 2000 leap.",
      },
      {
        headingFa: "فصول از معادلهٔ مرکز",
        headingEn: "Seasons from the equation of the centre",
        bodyFa:
          "طول فصول از حرکت غیریکنواخت خورشید روی دایرة‌البروج می‌آید. تا مرتبهٔ e، λ = ϖ + 2e sin M. چون حضیض در ژانویه است، زمستان شمالی کوتاه‌تر از تابستان است.",
        bodyEn:
          "Season lengths follow from the Sun’s unequal motion. To first order in e, λ = ϖ + 2e sin M. Perihelion in January makes northern winter shorter than summer.",
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
      "فصل VII: کشیدگی، مقارنه و مقابله، نقاط ایست، فاز، و درخشندگی ظاهری ∝ فاز / ρ². مختصات خورشیدنگاری برای لکه‌های خورشید.",
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
      "Synodic period 1/S = |1/T − 1/T⊕|.",
      "Brightness B ∝ Φ / ρ², with Φ the illuminated fraction (phase).",
    ],
    formulas: [
      {
        display: "1/S = |1/T − 1/T⊕|",
        nameFa: "دورهٔ هلالی",
        nameEn: "Synodic period",
      },
      {
        display: "B ∝ Φ / ρ²",
        number: "VII.(24)",
        nameFa: "درخشندگی ظاهری",
        nameEn: "Apparent brightness",
      },
    ],
    sections: [
      {
        headingFa: "کشیدگی و نقاط ایست",
        headingEn: "Elongation and stationary points",
        bodyFa:
          "کشیدگی زاویهٔ خورشید–زمین–سیاره است. سیارهٔ داخلی به مقارنهٔ زیرین/زبرین می‌رسد؛ سیارهٔ خارجی به مقابله و مقارنه. وقتی dl/dt ظاهری صفر است سیاره ایست است؛ شرط اسمارت از مشتق طول دایرة‌البروجی زمین‌مرکز به‌دست می‌آید.",
        bodyEn:
          "Elongation is the Sun–Earth–planet angle. Inferior planets reach inferior/superior conjunction; superior planets reach opposition and conjunction. A stationary point is where the apparent dl/dt vanishes.",
      },
      {
        headingFa: "فاز و درخشندگی",
        headingEn: "Phase and brightness",
        bodyFa:
          "فاز کسری از قرص روشن است که به هندسهٔ زاویهٔ فاز بستگی دارد. شار رسیده با مربع فاصلهٔ زمین‌مرکز ρ افت می‌کند، پس B ∝ Φ/ρ². قدر ظاهری از همین نسبت ساخته می‌شود.",
        bodyEn:
          "Phase is the illuminated fraction, a function of the phase angle. Flux falls as 1/ρ², so B ∝ Φ/ρ², the basis of a planet’s apparent magnitude.",
      },
    ],
    exercises: [
      {
        textFa: "ثابت کنید وقتی سیاره مطلقاً ایست است (مدار متمایل)، راستای حرکت سیاره و زمین روی خط عقده‌ها تلاقی می‌کنند (تمرین ۹ فصل).",
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
      "فصل VIII: برادلی، انحراف سالانه با ثابت κ، سهم خروج از مرکز، و انحراف روزانه که گذار را به تأخیر می‌اندازد.",
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
        nameFa: "تأخیر گذار به‌سبب انحراف روزانه",
        nameEn: "Diurnal aberration at transit",
      },
    ],
    sections: [
      {
        headingFa: "سالانه",
        headingEn: "Annual aberration",
        bodyFa:
          "حرکت زمین روی مدار، راستای ظاهری ستاره را به‌اندازهٔ κ sin θ جابه‌جا می‌کند، θ زاویه میان راستای ستاره و سرعت زمین است. ثابت κ سرعت مداری میانگین بر سرعت نور است ≈ ۲۰″.۵. خروج از مرکز مدار یک تصحیح بیضوی کوچک می‌افزاید که اسمارت از vis viva فصل V می‌سازد.",
        bodyEn:
          "The Earth’s orbital motion displaces a star by κ sin θ, with κ = v⊕/c ≈ 20″.5. Eccentricity adds a small elliptic term built from the vis-viva velocity of Chapter V.",
      },
      {
        headingFa: "روزانه در دایرهٔ نصف‌النهاری",
        headingEn: "Diurnal aberration on the meridian",
        bodyFa:
          "چرخش زمین ستاره را به شرق جابه‌جا می‌کند، پس گذار دیرتر رخ می‌دهد. در H = 0 فرمول اسمارت تأخیر 0ˢ.021 cos φ sec δ را می‌دهد. در استوا و میل صفر این حدود ۰ˢ.۰۲۱ است.",
        bodyEn:
          "Earth’s rotation displaces the star eastwards, so transit is late. At H = 0 Smart’s formula gives a delay 0ˢ.021 cos φ sec δ.",
        formula: "Δt = 0ˢ.021 cos φ sec δ",
      },
    ],
    exercises: [
      {
        textFa: "تأخیر گذار قطبی (δ = ۶۰°) را در عرض ۴۰° با انحراف روزانه حساب کنید.",
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
    olympiad: "π افقی · عامل اختلاف‌منظر",
    summaryFa:
      "فصل IX: اختلاف‌منظر روزانه برای ماه و سیارات، π افقی استوایی، و اختلاف‌منظر سالانهٔ ستارگان با عامل F در بعد.",
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
      "sin p = (ρ / r) sin z′   (geocentric diurnal parallax).",
      "Moon’s equatorial horizontal parallax ≈ 57′.",
      "Δα cos δ = F Π,   F = Y cos α − X sin α     (67)(68).",
    ],
    formulas: [
      {
        display: "sin p = (ρ / r) sin z′",
        nameFa: "اختلاف‌منظر روزانه",
        nameEn: "Diurnal parallax",
      },
      {
        display: "Δα cos δ = F Π",
        number: "IX.(67)",
        nameFa: "اثر اختلاف‌منظر ستاره‌ای بر بعد",
        nameEn: "Stellar parallax in RA",
      },
    ],
    sections: [
      {
        headingFa: "روزانه و ماه",
        headingEn: "Diurnal parallax and the Moon",
        bodyFa:
          "ناظر روی سطح زمین است، نه در مرکز. راستای ماه از O با راستای از مرکز C اختلاف‌منظر p می‌سازد: sin p = (ρ/r) sin z′. در افق z′ = 90° و p = π افقی. برای ماه π ≈ ۵۷′؛ برای سیاره‌ای چون اروس شاید ۳۰″، پس توان‌های بالاتر ρ/r حذف می‌شوند.",
        bodyEn:
          "The observer is on the surface, not at the centre. The Moon’s direction from O differs from that from C by p, with sin p = (ρ/r) sin z′. On the horizon p is the horizontal parallax, ≈ 57′ for the Moon. For Eros π may be ~30″, so squares of ρ/r are dropped.",
      },
      {
        headingFa: "ستاره‌ای و عامل F",
        headingEn: "Stellar parallax and factor F",
        bodyFa:
          "جا‌به‌جایی سالانه روی بیضی‌ای به نیمهقطر Π (اختلاف‌منظر) است. در بعد، Δα cos δ = F Π که F = Y cos α − X sin α از طول حقیقی خورشید ساخته می‌شود و با طول خورشید عوض می‌شود. اندازه‌گیری Π از همین ضریب در رصدهای عکاسی می‌آید.",
        bodyEn:
          "Annual displacement is an ellipse of semi-axis Π. In RA, Δα cos δ = F Π with F = Y cos α − X sin α, a function of the Sun’s true longitude. Photographic series determine Π from this factor.",
        formula: "F = Y cos α − X sin α",
      },
      {
        headingFa: "سرعت شعاعی روزانه",
        headingEn: "Diurnal radial velocity",
        bodyFa:
          "چرخش زمین مؤلفهٔ شعاعی R′ = 0.47 cos φ cos δ sin H km s⁻¹ به سرعت ستاره می‌افزاید (مثبت در رکود). در H = 0ʰ یا ۱۲ʰ صفر است.",
        bodyEn:
          "Earth rotation adds a radial component R′ = 0.47 cos φ cos δ sin H km s⁻¹ (positive if recession). It vanishes at H = 0ʰ or 12ʰ.",
      },
    ],
    exercises: [
      {
        textFa: "π افقی ماه را ۵۷′ بگیرید. اختلاف‌منظر را در z′ = ۴۵° حساب کنید (sin p = sin π sin z′).",
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
    olympiad: "تاریخ نجوم · قدر",
    summaryFa:
      "صور الکواکب عبدالرحمن صوفی همان ۴۸ صورت بطلمیوسی را با دو منظر کره و آسمان ثبت می‌کند. این درس پل میان هندسهٔ اسمارت و اطلس نسخهٔ خطی سایت است.",
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
          "صوفی هر صورت را چنان‌که بر کرهٔ سماوی نقش می‌شود و چنان‌که در آسمان دیده می‌شود کشید — همان تمایز میان نگاه از بیرون کره و نگاه ناظر که شکل‌های ۱۰–۱۸ اسمارت هندسی می‌کنند.",
        bodyEn:
          "Each constellation is figured as on the globe and as in the sky — the same inside/outside distinction Smart’s diagrams make geometrically.",
      },
    ],
    exercises: [
      {
        textFa: "در اطلس سایت، دب اصغر را در دو نمای «بر کره» و «در آسمان» مقایسه کنید.",
        textEn: "In the site atlas, compare Ursa Minor in globe vs sky aspect.",
        source: "al-Ṣūfī / site atlas",
      },
    ],
  },
];
