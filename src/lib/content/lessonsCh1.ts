import type { Lesson } from "./lessonTypes";

export const LESSONS_CH1: Lesson[] = [
  {
    id: "great-circles",
    chapterId: "ch1",
    titleFa: "دایرهٔ عظیمه، دایرهٔ صغیره و زاویهٔ کروی",
    titleEn: "Great circles, small circles, and the spherical angle",
    level: "مقدماتی",
    minutes: 45,
    spherePreset: "circles",
    olympiad: "هندسهٔ کروی پایه · قطب یک عظیمه",
    summaryFa:
      "فصل اول اسمارت با کرهٔ سماوی شروع می‌شود: جهت ستارگان نقاطی روی کره‌اند، نه فاصله‌های خطی. عظیمه، صغیره، قطب و زاویهٔ کروی در همین بندها تعریف می‌شوند.",
    summaryEn:
      "Smart I §§1–3: directions on the celestial sphere, great and small circles, poles, and the spherical angle (Fig. 1).",
    smart: {
      chapter: "I",
      sections: "§§1–3",
      pages: "1–4",
      formulae: ["(1)"],
      figures: ["1"],
    },
    figures: ["fig1"],
    englishFormulas: [
      "Great circle = intersection of the sphere with a plane through the centre O.",
      "Small circle = intersection with a plane not through O.",
      "CD = AB sin PC   (Smart 1) — arc of a small circle from the polar distance of its pole.",
    ],
    formulas: [
      {
        display: "AY = R × ∠AOY  (radians)",
        nameFa: "طول کمان عظیمه",
        nameEn: "Great-circle arc length",
      },
      {
        display: "CD = AB · sin PC",
        number: "(1)",
        nameFa: "طول کمان صغیره",
        nameEn: "Small-circle arc (Smart 1)",
      },
    ],
    sections: [
      {
        headingFa: "کرهٔ سماوی به‌عنوان مکان جهت‌ها",
        headingEn: "The celestial sphere as a sphere of directions",
        bodyFa:
          "اسمارت در بند ۱ یادآوری می‌کند که چشم فاصلهٔ ستارگان را نشان نمی‌دهد؛ آنچه اندازه می‌گیریم زاویهٔ میان راستاهاست. بنابراین جایگاه هر ستاره نقطهٔ تقاطع راستای ناظر–ستاره با کره‌ای به مرکز ناظر است. شعاع این کره اختیاری است و بعداً واحد گرفته می‌شود.",
        bodyEn:
          "Smart §1: the eye gives no indication of stellar distances. Spherical astronomy is concerned with directions. A star’s position is the intersection of the line of sight with a sphere centred on the observer — the celestial sphere — whose radius is arbitrary.",
      },
      {
        headingFa: "عظیمه و صغیره (شکل ۱)",
        headingEn: "Great and small circles (Fig. 1)",
        bodyFa:
          "هر صفحهٔ گذرنده از مرکز O کره را در یک دایرهٔ عظیمه قطع می‌کند (EAB). هر صفحهٔ ناگذر از مرکز یک دایرهٔ صغیره می‌سازد (FCD). قطر عمود بر صفحهٔ عظیمه، کره را در دو قطب P و Q قطع می‌کند. هر نقطهٔ عظیمه از هر قطب ۹۰° فاصله دارد.",
        bodyEn:
          "A plane through the centre cuts the sphere in a great circle; any other plane yields a small circle. The diameter perpendicular to the plane of a great circle meets the sphere in its poles P, Q. Every point of the great circle is 90° from either pole.",
      },
      {
        headingFa: "زاویهٔ کروی",
        headingEn: "The spherical angle",
        bodyFa:
          "زاویهٔ کروی میان دو عظیمه در نقطهٔ تقاطع P برابر است با زاویهٔ میان مماس‌های آن دو عظیمه در P — یا معادل آن، زاویهٔ مسطح میان صفحات آن دو عظیمه در مرکز. اسمارت تأکید می‌کند که زاویهٔ کروی فقط نسبت به دو عظیمهٔ متقاطع تعریف می‌شود، نه نسبت به صغیره‌ها.",
        bodyEn:
          "The spherical angle at P between great circles PA and PB is the angle of the tangents at P (equal to the plane angle AOB). A spherical angle is defined only with reference to two intersecting great circles.",
      },
      {
        headingFa: "مثلث کروی و طول ضلع",
        headingEn: "The spherical triangle and length of a side",
        bodyFa:
          "سه نقطه در یک نیم‌کره که با کمان‌های عظیمه به هم وصل شوند مثلث کروی می‌سازند. ضلع AY روی کرهٔ شعاع R برابر R×∠AOY است. با گرفتن R=1، ضلع همان زاویهٔ مرکزی بر حسب رادیان (یا درجه) است. هیچ ضلعی از تعریف اسمارت از ۱۸۰° بزرگ‌تر گرفته نمی‌شود، هرچند می‌تواند برابر یا کوچک‌تر باشد. کمان صغیره CD مثلث کروی نیست.",
        bodyEn:
          "Three points of one hemisphere joined by great-circle arcs form a spherical triangle. With R = 1 a side is the central angle. Smart takes sides ≤ 180°. A small-circle arc such as CD is not a side of a spherical triangle.",
        formula: "AY = ∠AOY  (R = 1)",
      },
      {
        headingFa: "طول کمان صغیره — فرمول (۱)",
        headingEn: "Length of a small-circle arc — formula (1)",
        bodyFa:
          "اگر CD صغیره‌ای موازی عظیمهٔ AB باشد و P قطب AB، آن‌گاه صفحهٔ صغیره موازی صفحهٔ AB است و CD = AB · sin PC. چون PA = 90°، همین را می‌توان CD = AB · cos AC نوشت. این همان رابطهٔ بعداً برای مدار میل ثابت و مدار ارتفاع ثابت است.",
        bodyEn:
          "For small circle CD parallel to great circle AB, with P the pole of AB, CD = AB sin PC. Since PA = 90°, equivalently CD = AB cos AC. Parallels of declination and of altitude obey this relation.",
        formula: "CD = AB sin PC = AB cos AC   … (1)",
      },
    ],
    example: {
      id: "ex-small-arc",
      titleFa: "کمان مدار ۵۰° شمالی",
      titleEn: "Arc along the parallel of 50° N",
      source: "Smart I §3–4, formulae (1)–(2)",
      givenFa: "روی مدار عرض ۵۰°، اختلاف طول جغرافیایی ۲۰°.",
      givenEn: "Along the parallel of latitude 50°, a difference of longitude of 20°.",
      findFa: "طول کمان مدار نسبت به کمان استوایی متناظر.",
      findEn: "The parallel arc in terms of the equatorial arc.",
      steps: [
        {
          fa: "کمان استوایی متناظر LY = ۲۰°.",
          en: "The corresponding equatorial arc LY is 20°.",
        },
        {
          fa: "فرمول (۲): HX = LY cos θ با θ = ۵۰°.",
          en: "Smart (2): HX = LY cos θ with θ = 50°.",
          formula: "HX = 20° · cos 50° ≈ 12°.86",
        },
      ],
      resultFa: "کمان مدار ≈ ۱۲°.۸۶؛ به مایل دریایی ≈ ۷۷۲ مایل.",
      resultEn: "Parallel arc ≈ 12°.86 ≈ 772 nautical miles.",
      widget: "small-circle",
    },
    exercises: [
      {
        textFa: "سه نقطه در یک نیم‌کره را با عظیمه‌ها وصل کنید و اضلاع و زوایا را نام‌گذاری کنید (درس «مثلث کروی»).",
        textEn: "Join three points of one hemisphere by great-circle arcs and name sides and angles (see the spherical-triangle lesson).",
        source: "Smart I §2",
      },
      {
        textFa: "نشان دهید قطب هر عظیمه از تمام نقاط آن ۹۰° فاصله دارد.",
        textEn: "Show that either pole of a great circle is 90° from every point of it.",
        source: "Smart I §2",
      },
      {
        textFa: "چرا FCD در شکل ۱ مثلث کروی نیست؟",
        textEn: "Why is FCD in Fig. 1 not a spherical triangle?",
        source: "Smart I §2",
        answer: "CD is a small-circle arc, not a great-circle side.",
      },
    ],
  },
  {
    id: "spherical-triangle",
    chapterId: "ch1",
    titleFa: "مثلث کروی",
    titleEn: "The spherical triangle",
    level: "مقدماتی",
    minutes: 35,
    spherePreset: "triangle",
    olympiad: "ضلع و زاویه · قرارداد ≤۱۸۰°",
    summaryFa:
      "بند ۲ اسمارت: سه نقطه در یک نیم‌کره که با کمان‌های عظیمه وصل شوند مثلث کروی می‌سازند. ضلع = زاویهٔ مرکزی؛ زاویه = زاویهٔ میان صفحات (یا مماس‌ها).",
    summaryEn:
      "Smart I §2: a spherical triangle is three points of one hemisphere joined by great-circle arcs. Sides are central angles; angles are dihedral (or tangent) angles.",
    smart: {
      chapter: "I",
      sections: "§2",
      pages: "2–3",
      figures: ["1"],
    },
    figures: ["fig1", "fig5"],
    englishFormulas: [
      "Sides a, b, c are great-circle arcs (central angles), taken ≤ 180°.",
      "Angle A is the dihedral angle of planes OAB and OAC, equal to the tangent angle at A.",
      "Side a is opposite angle A.",
    ],
    formulas: [
      {
        display: "a = ∠BOC  (central angle, R = 1)",
        nameFa: "ضلع به‌عنوان زاویهٔ مرکزی",
        nameEn: "Side as central angle",
      },
      {
        display: "A = dihedral∠(OAB, OAC) = tangent angle at A",
        nameFa: "زاویهٔ کروی",
        nameEn: "Spherical angle",
      },
    ],
    sections: [
      {
        headingFa: "تعریف",
        headingEn: "Definition",
        bodyFa:
          "اگر سه نقطه در یک نیم‌کره با کمان‌های عظیمه وصل شوند، شکل حاصل مثلث کروی است. اسمارت مثال می‌آورد که AXY در شکل ۱ چنین مثلثی است، اما FCD نیست چون CD صغیره است. هیچ ضلعی از ۱۸۰° بزرگ‌تر گرفته نمی‌شود.",
        bodyEn:
          "Three points of one hemisphere joined by great-circle arcs form a spherical triangle. In Fig. 1, AXY is such a triangle; FCD is not, because CD is a small-circle arc. Sides are taken ≤ 180°.",
      },
      {
        headingFa: "ضلع و زاویه",
        headingEn: "Side and angle",
        bodyFa:
          "ضلع a روبه‌روی A فاصلهٔ زاویه‌ای B و C است (∠BOC). زاویه در A زاویهٔ میان صفحات OAB و OAC است، برابر زاویهٔ مماس‌ها در A. مثلث نجومی PZX همین تعریف را روی کرهٔ سماوی به کار می‌برد: PZ = 90°−φ، PX = 90°−δ، ZX = z.",
        bodyEn:
          "Side a opposite A is the angular distance BC. Angle A is the angle of planes OAB and OAC. The astronomical triangle PZX is the same object: PZ = 90°−φ, PX = 90°−δ, ZX = z.",
        formula: "PZ = 90°−φ,   PX = 90°−δ,   ZX = z",
      },
    ],
    exercises: [
      {
        textFa: "برای φ = ۴۰°N و δ = +۱۰° اضلاع PZ و PX را بنویسید.",
        textEn: "For φ = 40°N and δ = +10°, write PZ and PX.",
        source: "Smart II + I §2",
        answer: "PZ = 50°, PX = 80°",
      },
    ],
  },
  {
    id: "terrestrial-latlong",
    chapterId: "ch1",
    titleFa: "عرض و طول جغرافیایی زمینی",
    titleEn: "Terrestrial latitude and longitude",
    level: "مقدماتی",
    minutes: 40,
    spherePreset: "circles",
    olympiad: "کرهٔ زمین · مدار عرض · مایل دریایی",
    summaryFa:
      "بند ۴ اسمارت مفاهیم عظیمه و قطب را روی زمین پیاده می‌کند: استوا، نصف‌النهار گرینویچ، عرض، طول، هم‌عرض، و فرمول (۲).",
    summaryEn:
      "Smart I §4 and Fig. 2: equator, Greenwich meridian, latitude, longitude, parallels, and HX = LY cos θ.",
    smart: {
      chapter: "I",
      sections: "§4",
      pages: "4–6",
      formulae: ["(2)"],
      figures: ["2"],
    },
    figures: ["fig2"],
    englishFormulas: [
      "Latitude φ = angular distance from the equator along the meridian.",
      "Colatitude = 90° − φ.",
      "HX = LY cos θ   (Smart 2) along a parallel of latitude θ.",
    ],
    formulas: [
      {
        display: "colat = 90° − lat",
        nameFa: "متمم عرض",
        nameEn: "Colatitude",
      },
      {
        display: "HX = LY cos θ",
        number: "(2)",
        nameFa: "کمان مدار عرض",
        nameEn: "Arc along a parallel",
      },
    ],
    sections: [
      {
        headingFa: "استوا، قطب و نصف‌النهار",
        headingEn: "Equator, poles, meridian",
        bodyFa:
          "زمین کره‌ای است که حول قطر PQ می‌چرخد؛ P قطب شمال و Q قطب جنوب است. عظیمهٔ عمود بر PQ استواست. هر نیم‌عظیمه از P تا Q یک نصف‌النهار است. نصف‌النهار گذرنده از آلت انتقالی رصدخانهٔ گرینویچ، نصف‌النهار مبدأ است.",
        bodyEn:
          "The Earth is treated as a sphere spinning about PQ (north and south poles). The great circle perpendicular to PQ is the equator. Any semi-great circle from P to Q is a meridian. The meridian of the Greenwich transit circle is the principal meridian.",
      },
      {
        headingFa: "طول و عرض",
        headingEn: "Longitude and latitude",
        bodyFa:
          "طول جغرافیایی زاویهٔ کروی در قطب میان نصف‌النهار مکان و گرینویچ است، از ۰° تا ۱۸۰° شرق یا غرب. عرض زاویه از استوا روی نصف‌النهار مکان است، شمال یا جنوب. متمم عرض فاصله تا قطب مرتفع است: colat = 90° − φ.",
        bodyEn:
          "Longitude is the spherical angle at the pole between the place’s meridian and Greenwich, 0°–180° E or W. Latitude is the arc from the equator along the meridian. Colatitude = 90° − φ.",
      },
      {
        headingFa: "مدار عرض و مایل دریایی",
        headingEn: "Parallels and the nautical mile",
        bodyFa:
          "مکان‌های هم‌عرض روی یک صغیرهٔ موازی استوایند. اگر θ عرض گرینویچ باشد، طول کمان مدار برابر کمان استوایی متناظر ضربدر cos θ است — فرمول (۲). مایل دریایی طول یک دقیقهٔ قوس عظیمه در مرکز زمین است (تقریباً ۶۰۸۰ فوت)؛ اسمارت بیضی‌بودن زمین را در این فصل نادیده می‌گیرد.",
        bodyEn:
          "Places of equal latitude lie on a small circle parallel to the equator. Smart (2): HX = LY cos θ. One nautical mile is the great-circle arc of one minute at the Earth’s centre (about 6080 ft). The Earth is treated as a sphere.",
        formula: "HX = LY cos θ   … (2)",
      },
    ],
    exercises: [
      {
        textFa: "دو کشتی روی مدار ۴۸°N و ۱۵°S با سرعت ۱۵ گره حرکت می‌کنند و همواره روی یک نصف‌النهارند. سرعت کشتی جنوبی را بیابید. (تمرین ۴ اسمارت)",
        textEn:
          "Two ships steam along 48° N and 15° S, always on the same meridian. If X’s speed is 15 knots, find Y’s speed. (Smart I, Ex. 4)",
        source: "Smart I Exercises 4",
        answer: "Speed_Y / Speed_X = cos 15° / cos 48°",
      },
    ],
  },
  {
    id: "cosine-sides",
    chapterId: "ch1",
    titleFa: "فرمول کسینوس — صورت (A)",
    titleEn: "The cosine-formula (A)",
    level: "متوسط",
    minutes: 55,
    spherePreset: "triangle",
    proofId: "cosine",
    olympiad: "قانون کسینوس کروی · فاصلهٔ زاویه‌ای",
    summaryFa:
      "بند ۵ اسمارت فرمول بنیادی مثلثات کروی را با ساخت مماس در رأس A به‌دست می‌آورد. همهٔ فرمول‌های بعدی از (A) مشتق می‌شوند.",
    summaryEn:
      "Smart I §5, Fig. 3: the fundamental cosine-formula, derived from tangent planes at A.",
    smart: {
      chapter: "I",
      sections: "§5",
      pages: "6–9",
      formulae: ["(A)", "(7)", "(8)", "(9)", "(11)", "(12)", "(13)"],
      figures: ["3"],
    },
    figures: ["fig3"],
    englishFormulas: [
      "cos a = cos b cos c + sin b sin c cos A     (A)",
      "cos A = (cos a − cos b cos c) / (sin b sin c)     (9)",
      "sin(A/2) = √[sin(s−b) sin(s−c) / (sin b sin c)]     (11)",
    ],
    formulas: [
      {
        display: "cos a = cos b cos c + sin b sin c cos A",
        number: "(A)",
        nameFa: "فرمول کسینوس (صورت بنیادی)",
        nameEn: "The cosine-formula",
      },
      {
        display: "cos b = cos c cos a + sin c sin a cos B",
        number: "(7)",
        nameFa: "همراه (A) برای ضلع b",
        nameEn: "Companion for side b",
      },
      {
        display: "cos c = cos a cos b + sin a sin b cos C",
        number: "(8)",
        nameFa: "همراه (A) برای ضلع c",
        nameEn: "Companion for side c",
      },
      {
        display: "sin(A/2) = √[sin(s−b) sin(s−c) / (sin b sin c)]",
        number: "(11)",
        nameFa: "نیم‌زاویه سینوسی",
        nameEn: "Half-angle sine formula",
      },
      {
        display: "cos(A/2) = √[sin s sin(s−a) / (sin b sin c)]",
        number: "(12)",
        nameFa: "نیم‌زاویه کسینوسی",
        nameEn: "Half-angle cosine formula",
      },
      {
        display: "tan(A/2) = √[sin(s−b) sin(s−c) / (sin s sin(s−a))]",
        number: "(13)",
        nameFa: "نیم‌زاویه تانژانتی",
        nameEn: "Half-angle tangent formula",
      },
    ],
    sections: [
      {
        headingFa: "ساخت اسمارت (شکل ۳)",
        headingEn: "Smart’s construction (Fig. 3)",
        bodyFa:
          "مثلث ABC روی کره به مرکز O. مماس در A بر عظیمهٔ AB را تا تقاطع با امتداد OB در D، و مماس در A بر AC را تا امتداد OC در E رسم کنید. OA بر صفحهٔ مماس در A عمود است، پس DA و EA مماس‌اند و زاویهٔ DAE همان زاویهٔ کروی A است. در مثلث‌های قائم OAD و OAE: AD = OA tan c، AE = OA tan b، OD = OA sec c، OE = OA sec b.",
        bodyEn:
          "From A draw the tangent to AB meeting OB produced at D, and the tangent to AC meeting OC produced at E. OA is perpendicular to the tangent plane, so ∠DAE = A. Right triangles OAD, OAE give AD = OA tan c, AE = OA tan b, OD = OA sec c, OE = OA sec b.",
      },
      {
        headingFa: "دو بسط برای DE²",
        headingEn: "Two expansions of DE²",
        bodyFa:
          "در مثلث مسطح DAE قانون کسینوس مسطح DE² را بر حسب b، c و A می‌دهد. در مثلث DOE همان DE² بر حسب a و اضلاع sec نوشته می‌شود. برابر نهادن و استفاده از sec²θ = 1 + tan²θ به صورت (A) می‌رسد.",
        bodyEn:
          "The plane cosine law in triangle DAE and again in DOE, with sec² = 1 + tan², simplifies to formula (A).",
        formula: "cos a = cos b cos c + sin b sin c cos A",
      },
      {
        headingFa: "دو کاربرد عملی",
        headingEn: "Two practical applications",
        bodyFa:
          "اسمارت صریحاً می‌گوید: (۱) اگر دو ضلع و زاویهٔ مشمول معلوم باشند، (A) ضلع سوم را می‌دهد. (۲) اگر هر سه ضلع معلوم باشند، زوایا از (۹) یا پایدارتر از نیم‌زاویه‌های (۱۱)–(۱۳) به‌دست می‌آیند. صورت (۹) برای کار لگاریتمی نامناسب است؛ نیم‌زاویه با جداول لگاریتمی دورهٔ اسمارت سازگار بود.",
        bodyEn:
          "(1) Two sides and the included angle determine the third side by (A). (2) Three sides determine the angles by (9) or, for logarithmic work, by (11)–(13) with 2s = a+b+c.",
      },
    ],
    example: {
      id: "ex-cosine-star",
      titleFa: "فاصلهٔ زاویه‌ای دو ستاره",
      titleEn: "Angular distance of two stars",
      source: "Application of Smart (A) on the polar triangle of two stars",
      givenFa: "ستارهٔ ۱: δ₁ = +۲۰°؛ ستارهٔ ۲: δ₂ = +۴۰°؛ اختلاف بعد Δα = ۳۰°.",
      givenEn: "Star 1: δ₁ = +20°; star 2: δ₂ = +40°; Δα = 30°.",
      findFa: "فاصلهٔ زاویه‌ای d.",
      findEn: "Angular separation d.",
      steps: [
        {
          fa: "در مثلث قطبی–دو ستاره: اضلاع ۹۰°−δ و زاویهٔ مشمول Δα.",
          en: "Polar triangle: sides 90°−δ, included angle Δα.",
          formula: "cos d = sin δ₁ sin δ₂ + cos δ₁ cos δ₂ cos Δα",
        },
      ],
      resultFa: "d ≈ ۲۸°.۸",
      resultEn: "d ≈ 28°.8",
    },
    exercises: [
      {
        textFa: "در مثلث کروی ABC با C = ۹۰°، a = ۱۱۹°۴۶′۳۶″، B = ۹۲°۲۵′۳۸″ اضلاع b و c و زاویهٔ A را بیابید.",
        textEn:
          "Spherical triangle ABC with C = 90°, a = 119°46′36″, B = 92°25′38″. Find b, c and A. (Smart I, Ex. 1)",
        source: "Smart I Exercises 1",
        answer: "48°28′49″, 109°14′0″, 113°10′46″",
      },
    ],
  },
  {
    id: "sine-law",
    chapterId: "ch1",
    titleFa: "فرمول سینوس — صورت (B)",
    titleEn: "The sine-formula (B)",
    level: "متوسط",
    minutes: 45,
    spherePreset: "triangle",
    proofId: "sine",
    olympiad: "ابهام SSA · نسبت سینوس‌ها",
    summaryFa:
      "بند ۶: از مربع‌کردن (A) نسبت سینوس ضلع به سینوس زاویهٔ روبه‌رو ثابت می‌شود. اسمارت صریحاً ابهام ۱۸۰°−A را گوشزد می‌کند.",
    summaryEn:
      "Smart I §6: the sine-formula from (A) by algebra, with the SSA ambiguity.",
    smart: {
      chapter: "I",
      sections: "§6",
      pages: "9–10",
      formulae: ["(B)"],
    },
    figures: ["fig5"],
    englishFormulas: [
      "sin a / sin A = sin b / sin B = sin c / sin C     (B)",
      "Given a, b, B: sin A = sin a sin B / sin b — A or 180°−A.",
    ],
    formulas: [
      {
        display: "sin a / sin A = sin b / sin B = sin c / sin C",
        number: "(B)",
        nameFa: "فرمول سینوس",
        nameEn: "The sine-formula",
      },
    ],
    sections: [
      {
        headingFa: "استخراج از (A)",
        headingEn: "Derivation from (A)",
        bodyFa:
          "از (A): sin b sin c cos A = cos a − cos b cos c. مربع کنید و ۱ − cos² را جایگزین کنید. اسمارت کمیت مثبت X را چنان تعریف می‌کند که X² sin²a sin²c برابر همان چندجمله‌ای متقارن سه ضلع باشد. آنگاه sin A / sin a = X. چون اضلاع و زوایا میان ۰° و ۱۸۰°اند، سینوس‌ها مثبت‌اند و علامت منفی حذف می‌شود.",
        bodyEn:
          "Square (A), replace 1 − cos², and introduce a positive quantity X built from the three sides. Then sin A / sin a = X. Sides and angles lie between 0° and 180°, so sines are positive and the minus sign is inadmissible.",
        formula: "sin a : sin b : sin c = sin A : sin B : sin C",
      },
      {
        headingFa: "ابهام در محاسبات عددی",
        headingEn: "The numerical ambiguity",
        bodyFa:
          "اگر a، b و B معلوم باشند، (B) مقدار sin A را می‌دهد نه خود A را. هر دو A و ۱۸۰°−A سینوس یکسان دارند. بدون اطلاع اضافه (مثلاً اینکه زاویه تند است، یا مقایسه با ضلع روبه‌رو) نمی‌توان شاخه را برگزید. اسمارت این را با ابهام مشابه در مثلثات مسطح مقایسه می‌کند.",
        bodyEn:
          "Given two sides and the angle opposite one of them, (B) yields sin A, hence A or 180°−A. Further information is required — exactly as in the plane SSA ambiguity.",
      },
    ],
    exercises: [
      {
        textFa: "دو ضلع یک مثلث کروی برابرند اگر و فقط اگر زوایای روبه‌رو برابر باشند. ثابت کنید.",
        textEn: "Prove that two sides of a spherical triangle are equal iff the opposite angles are equal. (Smart I, Ex. 9)",
        source: "Smart I Exercises 9",
      },
    ],
  },
  {
    id: "analogue-c",
    chapterId: "ch1",
    titleFa: "فرمول مشابه کسینوس — صورت (C)",
    titleEn: "The analogue formula (C)",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "triangle",
    proofId: "analogue",
    olympiad: "سه ضلع و دو زاویهٔ مجاور",
    summaryFa:
      "بند ۷: رابطه‌ای میان هر سه ضلع و دو زاویه، مشابه (A) اما با یک سینوس در سمت چپ. اثبات دوم با امتداد BA تا BD = ۹۰° (شکل ۴).",
    summaryEn:
      "Smart I §7, Fig. 4: the analogue of the cosine-formula.",
    smart: {
      chapter: "I",
      sections: "§7",
      pages: "10–11",
      formulae: ["(C)", "(14)", "(15)", "(16)"],
      figures: ["4"],
    },
    figures: ["fig4"],
    englishFormulas: [
      "sin a cos B = cos b sin c − sin b cos c cos A     (C)",
      "sin a cos C = cos c sin b − sin c cos b cos A     (14)",
    ],
    formulas: [
      {
        display: "sin a cos B = cos b sin c − sin b cos c cos A",
        number: "(C)",
        nameFa: "فرمول مشابه (آنالوگ)",
        nameEn: "The analogue formula",
      },
    ],
    sections: [
      {
        headingFa: "استخراج جبری",
        headingEn: "Algebraic derivation",
        bodyFa:
          "از همراه (۷): sin c sin a cos B = cos b − cos c cos a. سمت راست را با (A) بر حسب a و A بازنویسی کنید و بر sin c تقسیم کنید تا (C) به‌دست آید. این رابطه هر سه ضلع و دو زاویهٔ مجاور ضلع a را درگیر می‌کند.",
        bodyEn:
          "Write (7) as sin c sin a cos B = cos b − cos c cos a, substitute (A) for cos a, divide by sin c: that is (C).",
        formula: "sin a cos B = cos b sin c − sin b cos c cos A",
      },
      {
        headingFa: "اثبات هندسی شکل ۴",
        headingEn: "Geometric proof (Fig. 4)",
        bodyFa:
          "ضلع c را کمتر از ۹۰° بگیرید. عظیمهٔ BA را تا D ادامه دهید چنان‌که BD = ۹۰°. آن‌گاه AD = 90°−c و زاویهٔ در A از مثلث CAD برابر ۱۸۰°−A است. کمان CD را x بنامید. اعمال (A) در CAD و در BCD (که در B قائمه است چون BD=۹۰°) دو عبارت برای cos x می‌دهد؛ حذف x همان (C) است.",
        bodyEn:
          "Produce BA to D with BD = 90°. Then AD = 90°−c and CÂD = 180°−A. Let CD = x. Formula (A) in CAD and in right triangle BCD yields two expressions for cos x; eliminating x gives (C).",
        formula: "cos x = sin c cos b − cos c sin b cos A = sin a cos B",
      },
    ],
    exercises: [
      {
        textFa: "حالت c > ۹۰° را به‌عنوان تمرین دانشجو کامل کنید (یادداشت اسمارت در ص. ۱۱).",
        textEn: "Complete the proof of (C) when c > 90°, as Smart leaves to the student (p. 11).",
        source: "Smart I §7",
      },
    ],
  },
  {
    id: "four-parts",
    chapterId: "ch1",
    titleFa: "فرمول چهار جزء — صورت (D)",
    titleEn: "The four-parts formula (D)",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "triangle",
    proofId: "four-parts",
    olympiad: "زنجیرهٔ چهار جزء متوالی",
    summaryFa:
      "بند ۸: چهار جزء متوالی B، a، C، b. زاویهٔ C «زاویهٔ داخلی» و ضلع a «ضلع داخلی» است. قاعدهٔ حافظهٔ اسمارت.",
    summaryEn:
      "Smart I §8, Fig. 5: four consecutive parts and the cotangent formula.",
    smart: {
      chapter: "I",
      sections: "§8",
      pages: "12",
      formulae: ["(D)", "(17)", "(18)"],
      figures: ["5"],
    },
    figures: ["fig5"],
    englishFormulas: [
      "cos a cos C = sin a cot b − sin C cot B     (D)",
      "cos(inner side)·cos(inner angle) = sin(inner side)·cot(other side) − sin(inner angle)·cot(other angle)",
    ],
    formulas: [
      {
        display: "cos a cos C = sin a cot b − sin C cot B",
        number: "(D)",
        nameFa: "فرمول چهار جزء",
        nameEn: "Four-parts formula",
      },
    ],
    sections: [
      {
        headingFa: "چهار جزء متوالی",
        headingEn: "Four consecutive parts",
        bodyFa:
          "در شکل ۵ زنجیرهٔ B، a، C، b را ببینید. C میان a و b است (زاویهٔ داخلی)؛ a میان B و C است (ضلع داخلی). از (A) برای cos b و cos c، مقدار cos c را در اولی بگذارید، بر sin a sin b تقسیم کنید، و sin c / sin b را با (B) جایگزین کنید تا (D) به‌دست آید.",
        bodyEn:
          "The consecutive parts are B, a, C, b. C is the inner angle, a the inner side. Substitute the cosine-formula for c into that for b, divide by sin a sin b, and use (B).",
        formula: "cos a cos C = sin a cot b − sin C cot B",
      },
      {
        headingFa: "قاعدهٔ حافظه",
        headingEn: "Memory rule",
        bodyFa:
          "کسینوس (ضلع داخلی) × کسینوس (زاویهٔ داخلی) = سینوس (ضلع داخلی) × کتانژانت (ضلع دیگر) − سینوس (زاویهٔ داخلی) × کتانژانت (زاویهٔ دیگر).",
        bodyEn:
          "cos(inner side)·cos(inner angle) = sin(inner side)·cot(other side) − sin(inner angle)·cot(other angle).",
      },
    ],
    exercises: [
      {
        textFa: "با C = ۹۰° نشان دهید (D) به tan a = tan c cos B می‌انجامد (از قواعد نپر).",
        textEn: "With C = 90°, reduce (D) to tan a = tan c cos B (a Napier rule).",
        source: "Smart I §8–10",
      },
    ],
  },
  {
    id: "right-angled",
    chapterId: "ch1",
    titleFa: "مثلث قائم و قواعد نپر",
    titleEn: "Right-angled and quadrantal triangles; Napier’s rules",
    level: "المپیاد",
    minutes: 45,
    spherePreset: "triangle",
    proofId: "napier",
    olympiad: "قواعد نپر · مثلث ربعی",
    summaryFa:
      "بندهای ۹–۱۰: اثبات هندسی جایگزین (A)(B)(C) با عمودها از نقطه‌ای روی شعاع (شکل ۶)، سپس مثلث قائم و ربعی و دایرهٔ اجزای نپر (شکل ۷).",
    summaryEn:
      "Smart I §§9–10, Figs. 6–7: geometric proofs and Napier’s circular parts.",
    smart: {
      chapter: "I",
      sections: "§§9–10",
      pages: "12–15",
      formulae: ["(19)", "(20)"],
      figures: ["6", "7"],
    },
    figures: ["fig6", "fig7"],
    englishFormulas: [
      "C = 90°:  cos c = cos a cos b,   sin a = sin A sin c,   tan a = tan c cos B.",
      "Napier: sin(middle) = product of tangents of adjacents = product of cosines of opposites.",
    ],
    formulas: [
      {
        display: "cos c = cos a cos b     (C = 90°)",
        nameFa: "کسینوس وتر قائم‌الزاویه",
        nameEn: "Right-angled cosine of hypotenuse",
      },
      {
        display: "sin(middle) = tan(adj₁) tan(adj₂) = cos(opp₁) cos(opp₂)",
        nameFa: "دو قاعدهٔ نپر",
        nameEn: "Napier’s two rules",
      },
    ],
    sections: [
      {
        headingFa: "اثبات هندسی شکل ۶",
        headingEn: "Geometric proof (Fig. 6)",
        bodyFa:
          "از نقطهٔ P روی OC عمودهای PQ و PR را بر صفحات OAB و OB فرود آورید؛ در صفحهٔ OAB عمودهای از Q بر OA و OB در S به‌هم می‌رسند. PS بر صفحهٔ AOB عمود است. مثلث‌های قائم OPQ و OPR می‌دهند PQ = OP sin b و PR = OP sin a. تانژانت زاویهٔ در S همان tan b cos A است و به (A) می‌انجامد. همین شکل (B) و (C) را نیز می‌دهد.",
        bodyEn:
          "From P on OC drop perpendiculars to the faces; they meet so that PS ⊥ plane AOB. Right triangles OPQ, OPR give PQ = OP sin b, PR = OP sin a. The same figure yields (A), (B) and (C).",
      },
      {
        headingFa: "قائم‌الزاویه و ربعی",
        headingEn: "Right-angled and quadrantal",
        bodyFa:
          "اگر یکی از زوایا ۹۰° باشد، (A)(B)(C)(D) ساده می‌شوند. اگر یکی از اضلاع ۹۰° باشد مثلث ربعی است. نپر پنج «جزء دایره‌ای» را روی یک دایره می‌چیند (شکل ۷). برای قائم در C اجزای داخلی‌اند: a، b، ۹۰°−A، ۹۰°−c، ۹۰°−B. برای ربعی با c=۹۰° همان پنج جزء بیرون دایره‌اند: A، B، ۹۰°−a، C−۹۰°، ۹۰°−b.",
        bodyEn:
          "If an angle is 90° the four formulae simplify; if a side is 90° the triangle is quadrantal. Napier arranges five circular parts (Fig. 7). For C = 90° the parts inside the circle are a, b, 90°−A, 90°−c, 90°−B.",
      },
      {
        headingFa: "دو قاعده",
        headingEn: "The two rules",
        bodyFa:
          "هر جزء را می‌توان «میانه» گرفت؛ دو همسایه «مجاور» و دو باقی «مقابل»اند. سینوس میانه = حاصل تانژانت‌های مجاور = حاصل کسینوس‌های مقابل. اسمارت هشدار می‌دهد که حفظ این قواعد خود بار حافظه است و اغلب ساده‌تر است که (A) تا (D) را در حالت خاص بنویسید.",
        bodyEn:
          "sin(middle) = product of tangents of the two adjacents = product of cosines of the two opposites. Smart notes that applying (A)–(D) directly is often simpler than memorising the pentagon.",
      },
    ],
    exercises: [
      {
        textFa: "در مثلث قائم در C، از قواعد نپر sin a = sin A sin c و tan a = tan c cos B را بنویسید.",
        textEn: "For C = 90°, write sin a = sin A sin c and tan a = tan c cos B from Napier’s rules.",
        source: "Smart I §10",
      },
    ],
  },
  {
    id: "cosine-angles",
    chapterId: "ch1",
    titleFa: "مثلث قطبی و فرمول زوایا",
    titleEn: "The polar triangle and polar formulae",
    level: "متوسط",
    minutes: 40,
    spherePreset: "triangle",
    proofId: "polar",
    olympiad: "دوگان قطبی · کسینوس زوایا",
    summaryFa:
      "بند ۱۱ و شکل ۸: قطب‌های اضلاع، مثلث قطبی می‌سازند. a′ = ۱۸۰°−A و A′ = ۱۸۰°−a. اعمال (A) روی قطبی، کسینوس زوایای اصلی را می‌دهد.",
    summaryEn:
      "Smart I §11, Fig. 8: the polar triangle and the polar of formula (A).",
    smart: {
      chapter: "I",
      sections: "§11",
      pages: "15–16",
      formulae: ["polar of (A)"],
      figures: ["8"],
    },
    figures: ["fig8"],
    englishFormulas: [
      "a′ = 180° − A,   A′ = 180° − a   (and cyclic)",
      "− cos A = cos B cos C − sin B sin C cos a",
    ],
    formulas: [
      {
        display: "a′ = 180° − A,  A′ = 180° − a",
        nameFa: "اضلاع و زوایای مثلث قطبی",
        nameEn: "Polar sides and angles",
      },
      {
        display: "cos A = − cos B cos C + sin B sin C cos a",
        nameFa: "کسینوس زوایا (قطبیِ A)",
        nameEn: "Polar cosine-formula",
      },
    ],
    sections: [
      {
        headingFa: "ساخت شکل ۸",
        headingEn: "Construction of Fig. 8",
        bodyFa:
          "عظیمهٔ BC دو قطب دارد؛ آن‌که در همان نیم‌کرهٔ A است رأس A′ مثلث قطبی است. به‌همین‌سان B′ و C′. چون A′ قطب BC است، کمان A′B′ برابر متمم کمان میان قطب‌های AB و AC است و به a′ = 180° − A می‌انجامد. دوگان همین استدلال A′ = 180° − a را می‌دهد.",
        bodyEn:
          "The pole of BC lying in A’s hemisphere is A′. Then a′ = 180° − A and A′ = 180° − a, and cyclic. Smart’s Fig. 8 marks L, M on the great circle of which A′ is pole.",
      },
      {
        headingFa: "انتقال فرمول‌ها",
        headingEn: "Transfer of formulae",
        bodyFa:
          "اعمال (A) بر A′B′C′ و جایگزینی a′ = 180°−A و غیره، بلافاصله کسینوس زوایای ABC را بر حسب دو زاویهٔ دیگر و ضلع مشمول می‌دهد. هر یک از (A) تا (D) یک همراه قطبی دارد: A را با ۱۸۰°−a عوض کنید.",
        bodyEn:
          "Apply (A) to the polar triangle and substitute a′ = 180°−A. The same replacement 180°−a for A in (A)–(D) generates the whole polar set.",
        formula: "−cos A = cos B cos C − sin B sin C cos a",
      },
    ],
    exercises: [
      {
        textFa: "از فرمول قطبی (A) نشان دهید اگر هر سه زاویه معلوم باشند، اضلاع یکتا تعیین می‌شوند (تا هم‌نهشتی).",
        textEn: "From the polar of (A), three angles determine the sides.",
        source: "Smart I §11",
      },
    ],
  },
  {
    id: "haversine-example",
    chapterId: "ch1",
    titleFa: "مثال عددی اسمارت و فرمول هاورساین",
    titleEn: "Smart’s numerical example and the haversine formula",
    level: "المپیاد",
    minutes: 55,
    spherePreset: "circles",
    proofId: "haversine",
    olympiad: "فاصلهٔ دایرهٔ عظیمه · هاورساین",
    summaryFa:
      "بندهای ۱۲–۱۴: دو نقطه روی زمین، فاصلهٔ عظیمه، زاویهٔ مسیر، و شمالی‌ترین عرض. سپس هاورساین hav θ = (1−cos θ)/2 و بازآزمایی همان مثال.",
    summaryEn:
      "Smart I §§12–14, Fig. 9: the Glasgow-style worked example and haversines.",
    smart: {
      chapter: "I",
      sections: "§§12–14",
      pages: "16–21",
      formulae: ["(21)", "(22)", "(23)", "(24)–(34)"],
      figures: ["9"],
    },
    figures: ["fig9"],
    englishFormulas: [
      "hav θ = (1 − cos θ)/2 = sin²(θ/2)     (21)",
      "hav a = hav(b − c) + sin b sin c hav A     (23)",
    ],
    formulas: [
      {
        display: "hav θ = ½(1 − cos θ) = sin²(θ/2)",
        number: "(21)",
        nameFa: "تعریف هاورساین",
        nameEn: "Haversine",
      },
      {
        display: "hav a = hav(b − c) + sin b sin c hav A",
        number: "(23)",
        nameFa: "صورت هاورساین (A)",
        nameEn: "Haversine form of (A)",
      },
    ],
    sections: [
      {
        headingFa: "صورت مسئلهٔ بند ۱۲ (شکل ۹)",
        headingEn: "The §12 problem (Fig. 9)",
        bodyFa:
          "A: عرض ۲۴°۱۸′ N، طول ۱۳۳°۳۹′ E. B: عرض ۳۶°۴۷′ N، طول ۱۲۵°۲۴′ W. خواسته: (i) کمان عظیمهٔ AB؛ (ii) زاویهٔ PAB در قطب شمال؛ (iii) شمالی‌ترین عرض روی AB. اضلاع قطبی PA = ۶۵°۴۲′ و PB = ۵۳°۱۳′اند. اختلاف طول کوتاه‌تر APB = ۱۰۰°۵۷′ است (نه کمان بلند ۲۵۹°۳′).",
        bodyEn:
          "A: 24°18′ N, 133°39′ E. B: 36°47′ N, 125°24′ W. Find AB, angle PAB, and the highest latitude on AB. Polar distances PA = 65°42′, PB = 53°13′. The shorter longitude difference is APB = 100°57′.",
      },
      {
        headingFa: "نتیجهٔ اسمارت با (A) و (۱۱)",
        headingEn: "Smart’s results from (A) and (11)",
        bodyFa:
          "با لگاریتم پنج‌رقمی: cos AB = 0.10776 ⇒ AB = 83°48′.8 ≈ 83°49′ = ۵۰۲۸.۸ مایل دریایی. زاویهٔ در A از نیم‌زاویه (۱۱) برابر ۵۲°۱۶′ است. شمالی‌ترین نقطهٔ C جایی است که نصف‌النهار بر AB عمود است؛ sin PC = sin PA sin PAC ⇒ عرض C = ۴۳°۵۳′ N.",
        bodyEn:
          "Five-figure logs: cos AB = 0.10776 ⇒ AB = 83°48′.8 ≈ 83°49′ = 5028.8 nautical miles. Angle at A from (11) is 52°16′. Highest latitude: sin PC = sin PA sin PAC ⇒ lat C = 43°53′ N.",
        formula: "AB = 83°49′ = 5028.8 nmi",
      },
      {
        headingFa: "هاورساین — بند ۱۳",
        headingEn: "Haversines — §13",
        bodyFa:
          "hav θ همیشه نامنفی است در ۰°…۱۸۰°. جایگزینی cos = 1 − 2 hav در (A) صورت (۲۳) را می‌دهد. اسمارت همان AB را با جداول هاورساین Inman دوباره حساب می‌کند و همان ۸۳°۴۹′ را می‌گیرد. بند ۱۴ روش کمکی D را برای یافتن هم‌زمان ضلع سوم و یک زاویه معرفی می‌کند.",
        bodyEn:
          "hav θ ≥ 0 on 0°–180°. Substituting cos = 1 − 2 hav in (A) yields (23). Smart repeats AB with Inman’s Nautical Tables and recovers 83°49′. §14 introduces an auxiliary angle D to find the third side and an angle together.",
        formula: "hav AB = hav(PA − PB) + sin PA sin PB hav APB",
      },
    ],
    example: {
      id: "ex-smart-12",
      titleFa: "بازتولید عددی بند ۱۲",
      titleEn: "Reproduce Smart §12",
      source: "Smart I §12, pp. 16–18, Fig. 9",
      givenFa: "A: ۲۴°۱۸′N، ۱۳۳°۳۹′E · B: ۳۶°۴۷′N، ۱۲۵°۲۴′W",
      givenEn: "A: 24°18′N, 133°39′E · B: 36°47′N, 125°24′W",
      findFa: "AB، زاویهٔ در A، عرض شمالی‌ترین نقطه.",
      findEn: "AB, angle at A, highest latitude on AB.",
      steps: [
        {
          fa: "PA = ۶۵°۴۲′، PB = ۵۳°۱۳′، APB = ۱۰۰°۵۷′.",
          en: "PA = 65°42′, PB = 53°13′, APB = 100°57′.",
        },
        {
          fa: "فرمول (A) برای AB.",
          en: "Formula (A) for AB.",
          formula: "cos AB = cos PA cos PB + sin PA sin PB cos APB",
        },
      ],
      resultFa: "AB ≈ ۸۳°۴۹′ · ۵۰۲۹ مایل دریایی · A ≈ ۵۲°۱۶′ · عرض C ≈ ۴۳°۵۳′N",
      resultEn: "AB ≈ 83°49′ · 5029 nmi · A ≈ 52°16′ · lat C ≈ 43°53′N",
      widget: "gc-distance",
    },
    exercises: [
      {
        textFa: "طول جغرافیایی نقطهٔ C (شمالی‌ترین نقطهٔ AB) را به‌عنوان تمرین اسمارت حساب کنید.",
        textEn: "Find the longitude of C, left as an exercise by Smart on p. 18.",
        source: "Smart I §12",
      },
    ],
  },
  {
    id: "delambre-napier",
    chapterId: "ch1",
    titleFa: "زاویه‌های کوچک، دلامبر و قیاسی‌های نپر",
    titleEn: "Small angles, Delambre’s and Napier’s analogies",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "triangle",
    proofId: "delambre",
    olympiad: "قیاسی‌های نپر · sin 1″",
    summaryFa:
      "بندهای ۱۵–۱۶: تقریب زاویهٔ کوچک، تبدیل ساعت↔درجه، سپس چهار اتحاد دلامبر و چهار قیاسی نپر. تمرین‌های پایان فصل.",
    summaryEn:
      "Smart I §§15–16: small-angle formulae, Delambre (45)–(48), Napier (49)–(52).",
    smart: {
      chapter: "I",
      sections: "§§15–16",
      pages: "21–24",
      formulae: ["(35)–(52)"],
    },
    figures: ["fig7"],
    englishFormulas: [
      "1 radian = 206265″,   sin 1″ = 1/206265     (36)",
      "tan ½(a+b) = [cos ½(A−B) / cos ½(A+B)] tan ½c     (49)",
    ],
    formulas: [
      {
        display: "sin 1″ = 1/206265",
        number: "(36)",
        nameFa: "سینوس یک ثانیهٔ قوس",
        nameEn: "Sine of one arcsecond",
      },
      {
        display: "24ʰ = 360°,   1ʰ = 15°,   1ᵐ = 15′,   1ˢ = 15″",
        number: "(40)",
        nameFa: "تبدیل زمان و قوس",
        nameEn: "Time–arc conversion",
      },
      {
        display: "sin(c/2) sin((A−B)/2) = cos(C/2) sin((a−b)/2)",
        number: "(45)",
        nameFa: "دلامبر (یکی از چهار)",
        nameEn: "Delambre’s analogy (one of four)",
      },
      {
        display: "tan ½(a+b) = [cos ½(A−B)/cos ½(A+B)] tan ½c",
        number: "(49)",
        nameFa: "قیاسی نپر برای مجموع اضلاع",
        nameEn: "Napier’s analogy for sum of sides",
      },
    ],
    sections: [
      {
        headingFa: "زاویه‌های کوچک",
        headingEn: "Small angles",
        bodyFa:
          "در اندازهٔ دایره‌ای، sin θ ≈ θ و tan θ ≈ θ. یک رادیان = ۵۷°۱۷′۴۵″ = ۲۰۶۲۶۵″. بنابراین sin 1″ = 1/206265 و sin 1′ ≈ 1/3438. اگر زاویه بر حسب ثانیه θ″ باشد، sin θ ≈ θ″ / 206265. برای زاویهٔ ساعتی کوچک بر حسب دقیقهٔ زمان: sin H ≈ Hᵐ · 15 · sin 1′.",
        bodyEn:
          "In circular measure sin θ ≈ θ. One radian = 206265″, so sin 1″ = 1/206265. For a small hour angle in minutes of time, sin H ≈ 15 Hᵐ sin 1′.",
        formula: "sin θ″ = θ″ sin 1″     (38)",
      },
      {
        headingFa: "دلامبر و نپر",
        headingEn: "Delambre and Napier",
        bodyFa:
          "چهار اتحاد دلامبر (۴۵)–(۴۸) با جفت‌کردن به قیاسی‌های نپر (۴۹)–(۵۲) می‌رسند: مجموع/تفاضل اضلاع از مجموع/تفاضل زوایا (و برعکس). این‌ها وقتی دو زاویه و ضلع مشمول، یا دو ضلع و زاویهٔ مشمول معلوم‌اند، پایدارتر از (A) به‌تنهایی‌اند.",
        bodyEn:
          "Delambre’s four formulae (45)–(48), taken in pairs, give Napier’s analogies (49)–(52). They are the preferred logarithmic route when two angles and the included side, or two sides and the included angle, are given.",
      },
    ],
    exercises: [
      {
        textFa: "اگر اجزاء a,b,c,A,B,C نمو da,…,dC بگیرند، نشان دهید da = cos C db + cos B dc + K sin b sin c dA با K = sin A / sin a. (تمرین ۸)",
        textEn:
          "If the elements receive increments da,…,dC, show da = cos C db + cos B dc + K sin b sin c dA, with K = sin A / sin a. (Smart I, Ex. 8)",
        source: "Smart I Exercises 8",
      },
      {
        textFa: "در مثلث متساوی‌الاضلاع، da/dA = cos(A/2) cot(a/2). (گلاسکو ۱۹۶۷)",
        textEn: "For an equilateral spherical triangle, da/dA = cos(A/2) cot(a/2). [Glas. 1967]",
        source: "Smart I Exercises 9 (Glas. 1967)",
      },
    ],
  },
  {
    id: "spherical-area",
    chapterId: "ch1",
    titleFa: "مساحت مثلث کروی (مکمل المپیاد)",
    titleEn: "Area of a spherical triangle (olympiad supplement)",
    level: "متوسط",
    minutes: 35,
    spherePreset: "area",
    proofId: "girard",
    olympiad: "زیادی کروی · ژیرار · لاهوئیلیه",
    summaryFa:
      "اسمارت در فصل I مساحت را موضوع اصلی نمی‌کند؛ المپیاد ایران زیادی کروی را می‌خواهد. قضیهٔ ژیرار و فرمول لاهوئیلیه به‌عنوان مکمل، با ارجاع به هندسهٔ کلاسیک.",
    summaryEn:
      "Not a numbered Smart I section; Girard and L’Huilier are supplied for the olympiad track.",
    smart: {
      chapter: "I",
      sections: "supplement (Girard / L’Huilier)",
      pages: "—",
      formulae: ["E = A+B+C−π"],
    },
    figures: ["fig-lune"],
    englishFormulas: [
      "Spherical excess E = A + B + C − π",
      "Area (unit sphere) = E steradians; on radius R: R² E",
      "tan(E/4) = √[tan(s/2) tan((s−a)/2) tan((s−b)/2) tan((s−c)/2)]",
    ],
    formulas: [
      {
        display: "E = A + B + C − π",
        nameFa: "زیادی کروی",
        nameEn: "Spherical excess",
      },
      {
        display: "Area = R² E",
        nameFa: "قضیهٔ ژیرار",
        nameEn: "Girard’s theorem",
      },
    ],
    sections: [
      {
        headingFa: "هلال و ژیرار",
        headingEn: "Lunes and Girard",
        bodyFa:
          "هلال با زاویهٔ A روی کرهٔ واحد مساحت ۲A دارد. سه هلال زوایای مثلث کره را می‌پوشانند و مثلث و پادمثلث را اضافه می‌شمارند، پس مساحت = E = A+B+C−π.",
        bodyEn:
          "A lune of angle A has area 2A on the unit sphere. Summing the three lunes and correcting the over-count of the triangle and its antipode yields Area = E = A+B+C−π.",
        formula: "Area = E = A + B + C − π",
      },
    ],
    exercises: [
      {
        textFa: "برای مثلث متساوی‌الاضلاع با ضلع ۶۰° زیادی را از لاهوئیلیه حساب کنید.",
        textEn: "Equilateral triangle, side 60°: compute E from L’Huilier.",
        source: "olympiad supplement",
        answer: "E ≈ 31°.59",
      },
    ],
  },
];
