import type { Lesson } from "./lessonTypes";

export const LESSONS_LATER: Lesson[] = [
  {
    id: "refraction-parallax",
    chapterId: "ch3",
    titleFa: "شکست نور",
    titleEn: "Astronomical refraction",
    level: "المپیاد",
    minutes: 50,
    spherePreset: "horizon",
    olympiad: "z حقیقی و ظاهری · فرمول کسینوس",
    summaryFa: "فصل III: پرتو ستاره از هوا خم می‌شود؛ سمت‌الرأسی ظاهری از حقیقی به‌اندازهٔ شکست کوچک‌تر است. از جو همگن تا انتگرال عمومی (۲۰) و ثابت‌های Cassini.",
    summaryEn: "Smart III: true vs apparent zenith distance; layered atmosphere; general integral; Cassini constants.",
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
      { display: "ζ = z − R", nameFa: "سمت‌الرأسی ظاهری", nameEn: "Apparent zenith distance" },
      { display: "R ≈ (μ₀ − 1) tan z   (homogeneous)", nameFa: "تقریب جو همگن", nameEn: "Homogeneous atmosphere" },
    ],
    sections: [
      {
        headingFa: "z حقیقی و ظاهری",
        headingEn: "True and apparent z",
        bodyFa: "شکست نور پرتو را به سوی شاقول خم می‌کند، پس ستاره بالاتر از جای حقیقی دیده می‌شود. z زاویهٔ تابش در بالای جو (سمت‌الرأسی حقیقی) است؛ ζ سمت‌الرأسی مشاهده‌شده است؛ R = z − ζ شکست است. نزدیک افق R ≈ ۳۴′ است و طلوع/غروب را چند دقیقه جابه‌جا می‌کند.",
        bodyEn: "Refraction bends the ray toward the vertical, so a star is seen higher than its true place. True zenith distance z is the incidence angle at the top of the atmosphere; ζ is observed; R = z − ζ. Near the horizon R ≈ 34′.",
      },
      {
        headingFa: "مدل لایه‌ای و انتگرال (۲۰)",
        headingEn: "Layered model and integral (20)",
        bodyFa: "اسمارت جو را لایه‌های کروی با μ₀ = 1 (خلا) تا μ در سطح زمین می‌گذارد. قانون اسنل در هر مرز، قضیهٔ سینوس از هر لایه، و پنج جزء شعاع r به انتگرال عمومی شکست می‌انجامد که تابع μ و r است. برای ارتفاع‌های معمولی بسط tan ζ با ثابت‌های A، B (کسینوس/سینوس) به‌کار می‌رود.",
        bodyEn: "Spherical layers from μ = 1 in space to μ at the ground, with Snell’s law at each interface, yield Smart’s general integral (20) in μ and r. For ordinary altitudes a tan ζ series with Cassini constants A, B is used.",
      },
      {
        headingFa: "ثابت‌های A و B از ستارهٔ قطبی‌گذر",
        headingEn: "A and B from a circumpolar star",
        bodyFa: "عبور بالا و پایین یک ستارهٔ قطبی‌گذر با فاصلهٔ قطبی معلوم دو معادله برای A و B می‌دهد اگر φ و δ معلوم باشند — یا φ، δ را از حذف یکی در دو عبور می‌یابند. این یکی از تمرین‌های کلاسیک فصل است.",
        bodyEn: "Upper and lower culminations of a circumpolar star give two equations for A and B when φ and δ are known; φ can be eliminated if δ is the unknown. This is a classical exercise of the chapter.",
        formula: "z′ = 180° − φ − δ = ζ′ + A tan ζ′ + B tan³ ζ′",
      },
    ],

    exercises: [
      {
        textFa: "دو ستارهٔ همسایه با فاصلهٔ حقیقی D (ثانیهٔ قوس). نشان دهید فاصلهٔ مشاهده‌شده D − k D (1 + cos²θ tan² z) است (تمرین ۷ فصل III).",
        textEn: "Two neighbouring stars, true distance D. Show the observed distance is D − k D (1 + cos²θ tan² z) (Smart III, Ex. 7).",
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
    olympiad: "خطای همخطی، تراز، سمت · بسل",
    summaryFa: "فصل IV: ابزار بنیادی تعیین α و δ. سه خطای هندسی — collimation c، level b، azimuth a — و تصحیح زمان عبور بسل.",
    summaryEn: "Smart IV: collimation, level and azimuth errors; Bessel’s transit reduction; RA and Dec from the instrument.",
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
      { display: "Δt = c sec δ + (b cos z + a sin z) sec δ", nameFa: "تصحیح بسل زمان عبور (صورت آموزشی)", nameEn: "Bessel transit correction (teaching form)" },
    ],
    sections: [
      {
        headingFa: "سه خطای هندسی",
        headingEn: "Three geometric errors",
        bodyFa: "محور دوران باید شرق–غرب و افقی باشد و صفحهٔ همخطی باید نصف‌النهار باشد. خطاهای کوچک: سمت a (غروب‌تر از شاقول افق)، تراز b (یک سر محور بالاتر)، همخطی c (صفحهٔ سیم‌ها از صفحهٔ عمود بر محور جداست). ستاره روی سیم مرکزی نه دقیقاً روی نصف‌النهار حقیقی دیده می‌شود.",
        bodyEn: "The rotation axis should be east–west and horizontal, and the collimation plane should be the meridian. Small errors: azimuth a, level b, collimation c. The star is observed on the central wire not exactly on the true meridian.",
      },
      {
        headingFa: "از عبور تا بعد",
        headingEn: "From transit to right ascension",
        bodyFa: "زمان عبور تصحیح‌شده، زمان نجومی محلی عبور نصف‌النهار است و برابر بعد ستاره است (ST = α در نصف‌النهار). بعد از عبور خورشید در انحراف بهاری و از ساعت نجومی کالیبره می‌شود. میل از سمت‌الرأسی نصف‌النهاری پس از شکست به‌دست می‌آید: δ = φ − z (جنوب سمت‌الرأس با قرارداد علامت معمول).",
        bodyEn: "The corrected transit time is the local sidereal time of meridian passage, equal to the star’s RA. Declination follows from the meridian zenith distance after refraction: δ = φ − z with the usual sign convention south of the zenith.",
      },
    ],

    exercises: [
      {
        textFa: "با دو ستارهٔ نزدیک‌قطب، خطای سمت دایرهٔ نصف‌النهاری را برآورد کنید (تمرین لندن ۱۹۲۶ در فصل IV).",
        textEn: "From two near-polar stars, estimate the azimuth error of the meridian circle (London 1926 exercise in Smart IV).",
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
    summaryFa: "فصل V: قانون مربع معکوس، قوانین کپلر، vis viva، آنومالی خارج از مرکز/متوسط/حقیقی، معادلهٔ کپلر M = E − e sin E، و هفت عنصر مدار.",
    summaryEn: "Smart V: inverse-square motion, vis viva, eccentric anomaly, Kepler’s equation, orbital elements.",
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
      { display: "M = E − e sin E", nameFa: "معادلهٔ کپلر", nameEn: "Kepler’s equation" },
      { display: "r = a (1 − e cos E)", nameFa: "طول شعاع حامل", nameEn: "Radius vector" },
      { display: "v² = μ (2/r − 1/a)", nameFa: "vis viva", nameEn: "Vis-viva integral" },
    ],
    sections: [
      {
        headingFa: "از نیوتن تا کپلر",
        headingEn: "From Newton to Kepler",
        bodyFa: "شتاب نسبی به سوی خورشید −G(M+m)/r² روی جرم است. مدارهای بسته بیضی‌اند با خورشید در کانون. سرعت مساحتی h = r²θ̇ ثابت است. حرکت متوسط n² a³ = μ را با n حرکت متوسط سیاره برآورده می‌کند.",
        bodyEn: "Relative acceleration toward the Sun is −G(M+m)/r². Bound orbits are ellipses with the Sun at a focus. Areal velocity h = r²θ̇ is constant. Mean motion satisfies n² a³ = μ.",
      },
      {
        headingFa: "سه آنومالی",
        headingEn: "Three anomalies",
        bodyFa: "آنومالی حقیقی v زاویه از حضیض در کانون است. آنومالی خارج از مرکز E زاویه روی دایرهٔ کمکی است. آنومالی متوسط M = n(t−T) زاویهٔ یکنواخت است. معادلهٔ کپلر M = E − e sin E را برای E حل می‌کنند، سپس r و v از E.",
        bodyEn: "True anomaly v is the focus angle from perihelion; eccentric anomaly E is the auxiliary-circle angle; mean anomaly M = n(t−T) is uniform. Kepler’s equation M = E − e sin E is solved for E, then r and v follow.",
        formula: "M = E − e sin E",
      },
      {
        headingFa: "عناصر و تبدیل به استوا",
        headingEn: "Elements and the equatorial frame",
        bodyFa: "عناصر کلاسیک: a, e, i, Ω, ω, T (یا M₀). اسمارت بردار شعاع مدار را با سه دوران به محورهای دایرة‌البروج و سپس استوا می‌برد و α، δ را از X,Y,Z زمین‌مرکز می‌خواند.",
        bodyEn: "Classical elements a, e, i, Ω, ω, T. Smart rotates the orbital radius into ecliptic then equatorial axes and reads α, δ from the geocentric vector.",
      },
    ],

    exercises: [
      {
        textFa: "با دورهٔ سیاره T به سال، نیم‌قطر بزرگ را به AU از کپلر III بنویسید.",
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
    olympiad: "سال اعتدالی · گرگوری · فرمول مرکز",
    summaryFa: "فصل VI: روز نجومی در برابر روز خورشیدی، سال اعتدالی، تقویم‌های ژولیانی/گرگوری، معادلهٔ مرکز و فصل‌ها از طول خورشید.",
    summaryEn: "Smart VI: sidereal vs solar day; tropical year; Julian/Gregorian calendars; equation of centre and the seasons.",
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
      { display: "tropical year ≈ 365.2422 d", nameFa: "سال اعتدالی", nameEn: "Tropical year" },
      { display: "λ ≈ L₀ + 2e sin M", nameFa: "معادلهٔ مرکز (مرتبهٔ e)", nameEn: "Equation of the centre" },
    ],
    sections: [
      {
        headingFa: "چرا قطب حرکت می‌کند",
        headingEn: "Why the pole moves",
        bodyFa: "اسمارت فصل زمان را با تقدیم می‌گذارد: دو هزار سال پیش قطب ۱۲° از Polarist فاصله داشت؛ در ۱۲۰۰۰ سال نزدیک Vega خواهد نشست. سال اعتدالی فاصلهٔ بازگشت خورشید به ♈ است، نه به همان ستاره (سال نجومی).",
        bodyEn: "Precession: two thousand years ago the pole was 12° from Polaris; in 12 000 years it will lie near Vega. The tropical year is the return of the Sun to ♈, not to the same star (sidereal year).",
      },
      {
        headingFa: "ژولیانی و گرگوری",
        headingEn: "Julian and Gregorian",
        bodyFa: "ژولیانی هر چهار سال یک سال کبیسه می‌گذارد (سال متوسط ۳۶۵.۲۵ روز) و نسبت به سال اعتدالی کمی زیاد است. گرگوری (۱۵۸۲؛ بریتانیا ۱۷۵۲) سال‌های قرن را مگر بخش‌پذیر بر ۴۰۰ کبیسه نمی‌گذارد: ۱۷۰۰، ۱۸۰۰، ۱۹۰۰ عادی، ۲۰۰۰ کبیسه.",
        bodyEn: "Julian leap years every four years average 365.25 d. Gregorian (1582; Britain 1752) drops century leap years unless divisible by 400: 1700, 1800, 1900 common, 2000 leap.",
      },
      {
        headingFa: "فصل‌ها از معادلهٔ مرکز",
        headingEn: "Seasons from the equation of the centre",
        bodyFa: "طول فصل از حرکت ناهموار خورشید روی دایرة‌البروج به‌دست می‌آید. تا مرتبهٔ اول در e، λ = L + 2e sin M. حضیض در ژانویه زمستان شمالی را از تابستان کوتاه‌تر می‌کند.",
        bodyEn: "Season lengths follow from the Sun’s unequal motion. To first order in e, λ = L + 2e sin M. Perihelion in January makes northern winter shorter than summer.",
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
    summaryFa: "فصل VII: کشیدگی، مقارنه و مقابله، نقطهٔ ایست، فاز، و درخشندگی ظاهری ∝ فاز / Δ². مختصات خورشیدمرکزی روی قرص خورشید.",
    summaryEn: "Smart VII: elongation, conjunction, opposition, stationary points, phase, brightness; heliographic coordinates.",
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
      { display: "1/S = |1/T − 1/T′|", nameFa: "دورهٔ هلالی", nameEn: "Synodic period" },
      { display: "B ∝ ψ / Δ²", number: "VII.(24)", nameFa: "درخشندگی ظاهری", nameEn: "Apparent brightness" },
    ],
    sections: [
      {
        headingFa: "کشیدگی و نقطهٔ ایست",
        headingEn: "Elongation and stationary points",
        bodyFa: "کشیدگی زاویهٔ خورشید–زمین–سیاره است. سیاره‌های داخلی به مقارنهٔ داخلی/خارجی می‌رسند؛ سیاره‌های خارجی به مقابله و مقارنه. وقتی dl/dt ظاهری صفر شود نقطهٔ ایست است؛ شرط کلاسیک از توازی طول روی دایرة‌البروج مدار زمین به‌دست می‌آید.",
        bodyEn: "Elongation is the Sun–Earth–planet angle. Inferior planets reach inferior/superior conjunction; superior planets reach opposition and conjunction. A stationary point is where the apparent dl/dt vanishes.",
      },
      {
        headingFa: "فاز و درخشندگی",
        headingEn: "Phase and brightness",
        bodyFa: "فاز کسر روشن قرص است، تابعی از زاویهٔ فاز. شار با ۱/Δ² می‌افتد، پس B ∝ ψ/Δ²، پایهٔ قدر ظاهری سیاره. قدر ظاهری از همین نسبت و قدر پایه ساخته می‌شود.",
        bodyEn: "Phase is the illuminated fraction, a function of the phase angle. Flux falls as 1/Δ², so B ∝ ψ/Δ², the basis of a planet’s apparent magnitude.",
      },
    ],

    exercises: [
      {
        textFa: "ثابت کنید وقتی سیاره با میل غیرصفر مطلقاً ایست است، دو جهت سرعت روی خط گره‌ها به هم می‌رسند (تمرین ۹ فصل).",
        textEn: "If a planet with non-zero inclination is absolutely stationary, the two velocity directions meet on the line of nodes (Smart VII, Ex. 9).",
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
    summaryFa: "فصل VIII: بردلی؛ انحراف سالانه با ثابت κ؛ جملهٔ بیضوی از vis viva؛ و انحراف روزانه در عبور که از دوران زمین می‌آید.",
    summaryEn: "Smart VIII: Bradley; annual aberration constant κ; elliptic term; diurnal aberration at transit.",
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
      { display: "κ = v⊕ / c ≈ 20″.5", nameFa: "ثابت انحراف سالانه", nameEn: "Annual aberration constant" },
      { display: "Δt = 0ˢ.021 cos φ sec δ", nameFa: "تأخیر عبور از انحراف روزانه", nameEn: "Diurnal aberration at transit" },
    ],
    sections: [
      {
        headingFa: "سالانه",
        headingEn: "Annual aberration",
        bodyFa: "حرکت مداری زمین جای ظاهری ستاره را به‌اندازهٔ κ sin θ جابه‌جا می‌کند، با κ = v⊕/c ≈ 20″.5. خروج از مرکز مدار جملهٔ بیضوی کوچکی از vis viva فصل V می‌افزاید که اسمارت در vis viva مرتبهٔ e تصحیح می‌کند.",
        bodyEn: "The Earth’s orbital motion displaces a star by κ sin θ, with κ = v⊕/c ≈ 20″.5. Eccentricity adds a small elliptic term built from the vis-viva velocity of Chapter V.",
      },
      {
        headingFa: "روزانه روی دایرهٔ نصف‌النهاری",
        headingEn: "Diurnal aberration on the meridian",
        bodyFa: "گردش زمین ستاره را به شرق جابه‌جا می‌کند، پس عبور دیرتر رخ می‌دهد. در H = 0 فرمول اسمارت تأخیر ۰ˢ.۰۲۱ cos φ sec δ را می‌دهد. روی استوا و میل صفر این تأخیر ۰ˢ.۰۲۱ است.",
        bodyEn: "Earth’s rotation displaces the star eastwards, so transit is late. At H = 0 Smart’s formula gives a delay 0ˢ.021 cos φ sec δ.",
        formula: "Δt = 0ˢ.021 cos φ sec δ",
      },
    ],

    exercises: [
      {
        textFa: "تأخیر عبور قطبی (δ = ۶۰°) را در عرض ۴۰° از انحراف روزانه حساب کنید.",
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
    summaryFa: "فصل IX: اختلاف‌منظر روزانهٔ ماه و سیارات؛ سمت‌الرأسی افقی استوایی؛ و اختلاف‌منظر ستاره‌ای سالانه با عامل F در بعد.",
    summaryEn: "Smart IX: diurnal parallax of Moon and planets; equatorial horizontal parallax; stellar parallax factor.",
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
      { display: "sin p = (Δ / r) sin z′", nameFa: "اختلاف‌منظر روزانه", nameEn: "Diurnal parallax" },
      { display: "Δα cos δ = F ϖ", number: "IX.(67)", nameFa: "اثر اختلاف‌منظر ستاره‌ای در بعد", nameEn: "Stellar parallax in RA" },
    ],
    sections: [
      {
        headingFa: "روزانه و ماه",
        headingEn: "Diurnal parallax and the Moon",
        bodyFa: "ناظر روی سطح است نه در مرکز. جهت ماه از O با آن از C به‌اندازهٔ p فرق دارد: sin p = (Δ/r) sin z′. در افق z′ = 90° و p = π افقی. برای ماه π ≈ ۵۷′؛ برای سیارات کوچک‌تر است و برای اروس π ممکن است ~۳۰″ باشد، پس مربعات Δ/r را می‌اندازند.",
        bodyEn: "The observer is on the surface, not at the centre. The Moon’s direction from O differs from that from C by p, with sin p = (Δ/r) sin z′. On the horizon p is the horizontal parallax, ≈ 57′ for the Moon. For Eros π may be ~30″, so squares of Δ/r are dropped.",
      },
      {
        headingFa: "اختلاف‌منظر ستاره‌ای و عامل F",
        headingEn: "Stellar parallax and factor F",
        bodyFa: "جابه‌جایی سالانه روی بیضی با نیم‌قطر ϖ (اختلاف‌منظر) است. در بعد، Δα cos δ = F ϖ که F = Y cos α − X sin α از طول حقیقی خورشید ساخته می‌شود و با طول خورشید وقتی شرق است تمام می‌شود. سری‌های عکاسی ϖ را از این عامل تعیین می‌کنند.",
        bodyEn: "Annual displacement is an ellipse of semi-axis ϖ. In RA, Δα cos δ = F ϖ with F = Y cos α − X sin α, a function of the Sun’s true longitude. Photographic series determine ϖ from this factor.",
        formula: "F = Y cos α − X sin α",
      },
      {
        headingFa: "سرعت شعاعی روزانه",
        headingEn: "Diurnal radial velocity",
        bodyFa: "گردش زمین مؤلفهٔ شعاعی R′ = 0.47 cos φ cos δ sin H km s⁻¹ به سرعت شعاعی می‌افزاید (مثبت اگر receding). در H = 0ʰ یا ۱۲ʰ صفر است.",
        bodyEn: "Earth rotation adds a radial component R′ = 0.47 cos φ cos δ sin H km s⁻¹ (positive if recession). It vanishes at H = 0ʰ or 12ʰ.",
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
    olympiad: "قدر بصری · دو منظر",
    summaryFa: "عبدالرحمن صوفی در صور الکواکب هر ۴۸ صورت بطلمیوسی را در دو منظر کره و آسمان ثبت کرد — همدم تاریخی کرهٔ اسمارت. این درس قدر، دو منظر و اطلس سایت را به فصل II گره می‌زند.",
    summaryEn: "al-Ṣūfī’s Book of the Fixed Stars records Ptolemy’s 48 constellations in globe and sky aspect — the historical companion to Smart’s sphere.",
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
      { display: "F₁ / F₂ = 10^{0.4 (m₂ − m₁)}", nameFa: "نسبت شار قدرها", nameEn: "Magnitude–flux ratio" },
    ],
    sections: [
      {
        headingFa: "دو منظر",
        headingEn: "Two aspects",
        bodyFa: "صوفی هر صورت را روی کرهٔ سماوی می‌کشد و از آسمان شب می‌بیند — همان تمایز داخل/خارج که شکل‌های اسمارت هندسی می‌کنند. این درس قدر بصری مکمل المپیاد است نه بند اسمارت.",
        bodyEn: "Each constellation is figured as on the globe and as in the sky — the same inside/outside distinction Smart’s diagrams make geometrically.",
      },
    ],

    exercises: [
      {
        textFa: "در اطلس سایت، دب اصغر را در دو منظر «کره» و «آسمان» مقایسه کنید.",
        textEn: "In the site atlas, compare Ursa Minor in globe vs sky aspect.",
        source: "al-Ṣūfī / site atlas",
      },
    ],
  },
];
