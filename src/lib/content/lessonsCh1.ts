import type { Lesson } from "./lessonTypes";
export const LESSONS_CH1: Lesson[] = [
  {
    id: "great-circles",
    chapterId: "ch1",
    titleFa: "عظیمه‌ها، صغیره‌ها و زاویهٔ کروی",
    titleEn: "Great circles, small circles, and the spherical angle",
    level: "مقدماتی",
    minutes: 45,
    spherePreset: "circles",
    olympiad: "هندسهٔ کروی پایه · قطب یک عظیمه",
    summaryFa:
      "برای یک ناظر ثابت، هر خط دید نقطه‌ای روی کره تعیین می‌کند. شعاع انتخابی فاصلهٔ واقعی ستاره نیست. تغییر شعاع، زاویه‌ها را ثابت نگه می‌دارد ولی طول کمان‌ها را تغییر می‌دهد.",
    summaryEn:
      "For a fixed observer, each line of sight determines a point on a sphere. The chosen radius is not the star’s physical distance. Changing radius preserves angles and scales arc lengths.",
    smart: {
      chapter: "I",
      sections: "§§1–3",
      pages: "1–4",
      formulae: ["(1)"],
      figures: ["1"],
    },
    figures: ["geometry-circles"],
    englishFormulas: [
      "\\ell_{\\rm great}=R\\sigma",
      "\\ell_{\\rm small}=R\\sin\\theta\\,|\\Delta\\lambda|",
    ],
    formulas: [
      {
        display: "\\ell_{\\rm great}=R\\sigma",
        tex: "\\ell_{\\rm great}=R\\sigma",
        nameFa: "طول عظیمه؛ σ رادیانی",
        nameEn: "Great-circle length; σ in radians",
      },
      {
        display: "\\ell_{\\rm small}=R\\sin\\theta\\,|\\Delta\\lambda|",
        tex: "\\ell_{\\rm small}=R\\sin\\theta\\,|\\Delta\\lambda|",
        nameFa: "طول مسیر صغیره",
        nameEn: "Small-circle path length",
      },
    ],
    sections: [
      {
        headingFa: "کره، مدل جهت است",
        headingEn: "A sphere models directions",
        bodyFa:
          "برای یک ناظر ثابت، هر خط دید نقطه‌ای روی کره تعیین می‌کند. شعاع انتخابی فاصلهٔ واقعی ستاره نیست. تغییر شعاع، زاویه‌ها را ثابت نگه می‌دارد ولی طول کمان‌ها را تغییر می‌دهد.",
        bodyEn:
          "For a fixed observer, each line of sight determines a point on a sphere. The chosen radius is not the star’s physical distance. Changing radius preserves angles and scales arc lengths.",
      },
      {
        headingFa: "صفحه، قطب و دایره",
        headingEn: "Planes, poles, and circles",
        bodyFa:
          "صفحهٔ گذرنده از مرکز عظیمه می‌سازد. صفحهٔ با فاصلهٔ d از مرکز، برای قدرمطلق d کمتر از R، صغیره‌ای به شعاع ریشهٔ R² − d² می‌سازد. دو جهت عمود بر صفحه قطب‌های پادپا هستند.",
        bodyEn:
          "A plane through the centre cuts a great circle. A plane at distance d, with |d| < R, cuts a small circle of radius √(R²−d²). The two plane-normal directions give antipodal poles.",
        formula: "\\rho=R\\sin\\theta,\\quad d=R\\cos\\theta",
      },
      {
        headingFa: "زاویهٔ رأس و زاویهٔ مرکزی",
        headingEn: "Vertex angle versus central angle",
        bodyFa:
          "زاویهٔ کروی در P زاویهٔ مماس‌های دو کمان عظیمه در P است. تنها اگر A و B روی استوای قطب P باشند این زاویه با AOB برابر است. میان منحنی‌های دیگر هم زاویهٔ مماسی تعریف می‌شود، اما ضلع مثلث کروی معمول از عظیمه است.",
        bodyEn:
          "A spherical angle at P is the angle between the tangents to its great-circle arcs. It equals central angle AOB only if A and B lie on the equator of P. Other curves also have tangent angles, but ordinary spherical triangles use great-circle sides.",
      },
      {
        headingFa: "طول صغیره از کدام زاویه؟",
        headingEn: "Which angle measures the small-circle path?",
        bodyFa:
          "برای چرخش Δλ حول قطب با فاصلهٔ قطبی θ، طول مسیر R sin θ ضرب در قدرمطلق Δλ است؛ Δλ باید رادیانی باشد. این طول با جدایی عظیمهٔ دو انتها برابر نیست.",
        bodyEn:
          "A rotation Δλ about a pole at polar distance θ gives path length R sin θ |Δλ|, with Δλ in radians. This differs from the great-circle separation of the endpoints.",
        formula: "\\ell_{\\rm small}=R\\sin\\theta\\,|\\Delta\\lambda|",
      },
    ],
    example: {
      id: "ex-small-arc",
      titleFa: "کمان موازی ۵۰° شمالی",
      titleEn: "Arc along the parallel of 50° N",
      source: "Smart I §§3–4, formulae (1)–(2)",
      givenFa: "روی موازی عرض ۵۰°، اختلاف طول جغرافیایی ۲۰°.",
      givenEn:
        "Along the parallel of latitude 50°, a difference of longitude of 20°.",
      findFa: "طول کمان موازی بر حسب کمان استوایی.",
      findEn: "The parallel arc in terms of the equatorial arc.",
      steps: [
        {
          fa: "اختلاف طول را به رادیان می‌بریم و در شعاع موازی ضرب می‌کنیم.",
          en: "Convert the longitude sweep to radians and multiply by the parallel radius.",
          formula: "\\ell/R=(20\\pi/180)\\cos50^\\circ\\simeq0.2243752",
        },
      ],
      resultFa:
        "طول مسیر ۰٫۲۲۴۳۷۵۲R است؛ زاویهٔ معادل عظیمه ۱۲٫۸۵۵۷۵ درجه است، نه جدایی عظیمهٔ دو انتها.",
      resultEn:
        "Path length is 0.2243752R, equivalent to 12.85575° on a great circle, not the endpoint great-circle separation.",
      widget: "small-circle",
    },
    exercises: [
      {
        textFa:
          "صغیره‌ای با فاصلهٔ قطبی ۳۰ درجه و شعاع کرهٔ ۲ داریم. شعاع صغیره و طول یک دور کامل آن چیست؟",
        textEn:
          "A small circle has polar distance 30° on a sphere of radius 2. Find its radius and circumference.",
        answer: "\\rho=2\\sin30^\\circ=1,\\quad L=2\\pi",
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
    id: "spherical-triangle",
    chapterId: "ch1",
    titleFa: "تعریف مثلث کروی",
    titleEn: "Definition of the spherical triangle",
    level: "مقدماتی",
    minutes: 20,
    spherePreset: "triangle",
    olympiad: "اضلاع PZ و PX در مثلث نجومی",
    summaryFa:
      "سه رأس متمایز، غیرپادپا و غیرواقع بر یک عظیمه در یک نیم‌کرهٔ باز، با کمان‌های کوتاه عظیمه مثلث محدب می‌سازند. هم‌مکانی یا هم‌خطی کروی، حالت منحط است.",
    summaryEn:
      "Distinct, non-antipodal vertices not on one great circle and contained in an open hemisphere define an ordinary convex triangle through their minor arcs. Coincidence or great-circle collinearity is degenerate.",
    smart: {
      chapter: "I",
      sections: "§§2–3",
      pages: "2–4",
      figures: ["1"],
    },
    figures: ["geometry-triangle"],
    englishFormulas: ["0<a,b,c,A,B,C<\\pi", "\\pi<A+B+C<3\\pi"],
    formulas: [
      {
        display: "0<a,b,c,A,B,C<\\pi",
        tex: "0<a,b,c,A,B,C<\\pi",
        nameFa: "دامنهٔ اجزا",
        nameEn: "Part ranges",
      },
      {
        display: "\\pi<A+B+C<3\\pi",
        tex: "\\pi<A+B+C<3\\pi",
        nameFa: "مجموع زوایا",
        nameEn: "Angle sum",
      },
    ],
    sections: [
      {
        headingFa: "مثلث معمول و شرایط وجود",
        headingEn: "Ordinary triangles and existence",
        bodyFa:
          "سه رأس متمایز، غیرپادپا و غیرواقع بر یک عظیمه در یک نیم‌کرهٔ باز، با کمان‌های کوتاه عظیمه مثلث محدب می‌سازند. هم‌مکانی یا هم‌خطی کروی، حالت منحط است.",
        bodyEn:
          "Distinct, non-antipodal vertices not on one great circle and contained in an open hemisphere define an ordinary convex triangle through their minor arcs. Coincidence or great-circle collinearity is degenerate.",
      },
      {
        headingFa: "قرارداد اضلاع مقابل",
        headingEn: "Opposite-side notation",
        bodyFa:
          "a فاصلهٔ زاویه‌ای B تا C و A زاویهٔ مماس‌ها در رأس A است؛ همین قرارداد چرخه‌ای ادامه دارد. ضلع و زاویهٔ هم‌نام لزوماً برابر نیستند.",
        bodyEn:
          "Side a is the angular distance B to C; A is the tangent angle at A, with cyclic notation. A side and its opposite angle need not be equal.",
        formula:
          "a=\\widehat{BC},\\quad b=\\widehat{CA},\\quad c=\\widehat{AB}",
      },
      {
        headingFa: "پیش از معکوس مثلثاتی",
        headingEn: "Before inverse trigonometry",
        bodyFa:
          "هر ضلع باید بین صفر و π، از مجموع دو ضلع دیگر کوچک‌تر و مجموع اضلاع کمتر از ۲π باشد. محدود کردن ورودی arccos دادهٔ نامعتبر را معتبر نمی‌کند.",
        bodyEn:
          "Every side must lie in (0,π), be less than the sum of the other two, and the perimeter must be below 2π. Clamping an arccos argument cannot validate invalid side data.",
        formula: "|b-c|<a<\\min(b+c,2\\pi-b-c)",
      },
    ],
    exercises: [
      {
        textFa:
          "آیا اضلاع ۲۰، ۳۰، ۶۰ درجه مثلث معمول می‌سازند؟ اضلاع ۹۰، ۹۰، ۹۰ درجه چطور؟",
        textEn:
          "Do sides 20°,30°,60° define an ordinary triangle? What about 90°,90°,90°?",
        answer:
          "20+30<60:\\ \\text{invalid};\\quad(90^\\circ,90^\\circ,90^\\circ):\\ \\text{valid octant}",
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
      id: "check-spherical-triangle",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "آیا اضلاع ۲۰، ۳۰، ۶۰ درجه مثلث معمول می‌سازند؟ اضلاع ۹۰، ۹۰، ۹۰ درجه چطور؟",
      givenEn:
        "Do sides 20°,30°,60° define an ordinary triangle? What about 90°,90°,90°?",
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
            "20+30<60:\\ \\text{invalid};\\quad(90^\\circ,90^\\circ,90^\\circ):\\ \\text{valid octant}",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
  },
  {
    id: "terrestrial-latlong",
    chapterId: "ch1",
    titleFa: "عرض و طول جغرافیایی زمینی",
    titleEn: "Terrestrial latitude and longitude",
    level: "مقدماتی",
    minutes: 40,
    spherePreset: "circles",
    olympiad: "کرهٔ زمین · موازی عرض · مایل دریایی",
    summaryFa:
      "عرض φ از استوا شمال‌مثبت و طول λ از گرینویچ شرق‌مثبت است. فاصلهٔ قطبی شمال π/۲ − φ است و در جنوب از π/۲ بزرگ‌تر می‌شود. مدل کروی تفاوت عرض ژئودتیک و زمین‌مرکزی را نادیده می‌گیرد.",
    summaryEn:
      "Latitude φ is north-positive from the equator; longitude λ is east-positive from Greenwich. North polar distance is π/2−φ and exceeds π/2 in the south. The spherical model neglects geodetic versus geocentric latitude.",
    smart: {
      chapter: "I",
      sections: "§4",
      pages: "4–6",
      formulae: ["(2)"],
      figures: ["2"],
    },
    figures: ["fig2"],
    englishFormulas: [
      "\\theta_N=\\frac\\pi2-\\varphi",
      "\\ell=R\\cos\\varphi\\,|\\Delta\\lambda|",
    ],
    formulas: [
      {
        display: "\\theta_N=\\frac\\pi2-\\varphi",
        tex: "\\theta_N=\\frac\\pi2-\\varphi",
        nameFa: "فاصلهٔ قطبی شمال",
        nameEn: "North polar distance",
      },
      {
        display: "\\ell=R\\cos\\varphi\\,|\\Delta\\lambda|",
        tex: "\\ell=R\\cos\\varphi\\,|\\Delta\\lambda|",
        nameFa: "طول مسیر موازی",
        nameEn: "Parallel path length",
      },
    ],
    sections: [
      {
        headingFa: "قرارداد زمین کروی",
        headingEn: "Spherical-Earth conventions",
        bodyFa:
          "عرض φ از استوا شمال‌مثبت و طول λ از گرینویچ شرق‌مثبت است. فاصلهٔ قطبی شمال π/۲ − φ است و در جنوب از π/۲ بزرگ‌تر می‌شود. مدل کروی تفاوت عرض ژئودتیک و زمین‌مرکزی را نادیده می‌گیرد.",
        bodyEn:
          "Latitude φ is north-positive from the equator; longitude λ is east-positive from Greenwich. North polar distance is π/2−φ and exceeds π/2 in the south. The spherical model neglects geodetic versus geocentric latitude.",
      },
      {
        headingFa: "شعاع موازی و مسیر",
        headingEn: "Parallel radius and path",
        bodyFa:
          "تصویر شعاع مکان بر استوا R cos φ است. پس مسیر روی موازی طول R cos φ ضرب در اختلاف طول رادیانی دارد؛ جز روی استوا، این مسیر ژئودزیک نیست.",
        bodyEn:
          "The parallel radius is R cos φ. Its path length is that radius times the longitude sweep in radians; except at the equator this path is not a geodesic.",
        formula: "\\ell=R\\cos\\varphi\\,|\\Delta\\lambda|",
      },
      {
        headingFa: "مایل دریایی امروزی",
        headingEn: "The modern nautical mile",
        bodyFa:
          "مایل دریایی امروزی دقیقاً ۱۸۵۲ متر است. یک دقیقهٔ کمان زمین تقریب وابسته به مدل است. تبدیل ۶۰ مایل دریایی بر درجه در مسائل کروی تقریبی است.",
        bodyEn:
          "The modern nautical mile is exactly 1852 metres. One arcminute of Earth is a model-dependent approximation. The classroom conversion of 60 nautical miles per degree is approximate.",
      },
    ],
    exercises: [
      {
        textFa:
          "دو کشتی روی موازی‌های ۴۸ درجه شمالی و ۱۵ درجه جنوبی با هم‌طولی حرکت می‌کنند. نسبت سرعت جنوبی به شمالی را بیابید.",
        textEn:
          "Ships on parallels 48° N and 15° S maintain equal longitude. Find the south-to-north speed ratio.",
        answer:
          "\\frac{v_S}{v_N}=\\frac{\\cos15^\\circ}{\\cos48^\\circ}\\simeq1.44355",
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
      id: "check-terrestrial-latlong",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "دو کشتی روی موازی‌های ۴۸ درجه شمالی و ۱۵ درجه جنوبی با هم‌طولی حرکت می‌کنند. نسبت سرعت جنوبی به شمالی را بیابید.",
      givenEn:
        "Ships on parallels 48° N and 15° S maintain equal longitude. Find the south-to-north speed ratio.",
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
            "\\frac{v_S}{v_N}=\\frac{\\cos15^\\circ}{\\cos48^\\circ}\\simeq1.44355",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
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
    olympiad: "قانون کسینوس کروی · فرمول‌های نیم‌زاویه",
    summaryFa:
      "دو ضلع b و c و زاویهٔ شامل A ضلع a را یکتا تعیین می‌کنند. اگر سه ضلع معلوم باشد، ابتدا وجود مثلث را کنترل و سپس cos A را جدا می‌کنیم. اثبات برداری پایین، برای ضلع منفرجه هم معتبر است.",
    summaryEn:
      "Two sides b,c and their included angle A uniquely determine a. For three given sides, first check existence, then isolate cos A. The vector proof below also applies to obtuse sides.",
    smart: {
      chapter: "I",
      sections: "§5",
      pages: "6–9",
      formulae: ["(A)", "(7)", "(8)", "(9)", "(11)", "(12)", "(13)"],
      figures: ["3"],
    },
    figures: ["geometry-triangle"],
    englishFormulas: [
      "\\cos a=\\cos b\\cos c+\\sin b\\sin c\\cos A",
      "\\cos A=\\frac{\\cos a-\\cos b\\cos c}{\\sin b\\sin c}",
      "\\sin\\frac A2=\\sqrt{\\frac{\\sin(s-b)\\sin(s-c)}{\\sin b\\sin c}}",
      "\\cos\\frac A2=\\sqrt{\\frac{\\sin s\\sin(s-a)}{\\sin b\\sin c}}",
    ],
    formulas: [
      {
        display: "\\cos a=\\cos b\\cos c+\\sin b\\sin c\\cos A",
        tex: "\\cos a=\\cos b\\cos c+\\sin b\\sin c\\cos A",
        nameFa: "کسینوس اضلاع",
        nameEn: "Side cosine law",
      },
      {
        display: "\\cos A=\\frac{\\cos a-\\cos b\\cos c}{\\sin b\\sin c}",
        tex: "\\cos A=\\frac{\\cos a-\\cos b\\cos c}{\\sin b\\sin c}",
        nameFa: "زاویه از سه ضلع",
        nameEn: "Angle from three sides",
      },
      {
        display:
          "\\sin\\frac A2=\\sqrt{\\frac{\\sin(s-b)\\sin(s-c)}{\\sin b\\sin c}}",
        tex: "\\sin\\frac A2=\\sqrt{\\frac{\\sin(s-b)\\sin(s-c)}{\\sin b\\sin c}}",
        nameFa: "نیم‌زاویهٔ سینوسی",
        nameEn: "Half-angle sine",
      },
      {
        display:
          "\\cos\\frac A2=\\sqrt{\\frac{\\sin s\\sin(s-a)}{\\sin b\\sin c}}",
        tex: "\\cos\\frac A2=\\sqrt{\\frac{\\sin s\\sin(s-a)}{\\sin b\\sin c}}",
        nameFa: "نیم‌زاویهٔ کسینوسی",
        nameEn: "Half-angle cosine",
      },
    ],
    sections: [
      {
        headingFa: "از داده تا مجهول",
        headingEn: "From data to unknown",
        bodyFa:
          "دو ضلع b و c و زاویهٔ شامل A ضلع a را یکتا تعیین می‌کنند. اگر سه ضلع معلوم باشد، ابتدا وجود مثلث را کنترل و سپس cos A را جدا می‌کنیم. اثبات برداری پایین، برای ضلع منفرجه هم معتبر است.",
        bodyEn:
          "Two sides b,c and their included angle A uniquely determine a. For three given sides, first check existence, then isolate cos A. The vector proof below also applies to obtuse sides.",
      },
      {
        headingFa: "استخراج نیم‌زاویه",
        headingEn: "Derive the half angle",
        bodyFa:
          "صورت ۱ − cos A برابر cos(b−c) − cos a بر مخرج sin b sin c است. اتحاد تفاضل کسینوس‌ها صورت را ۲ sin(s−b) sin(s−c) می‌کند. نصف این عبارت sin²(A/۲) است.",
        bodyEn:
          "The numerator of 1−cos A is cos(b−c)−cos a over sin b sin c. The cosine-difference identity gives 2 sin(s−b) sin(s−c). Half the resulting expression is sin²(A/2).",
        formula:
          "s=\\frac{a+b+c}{2},\\quad\\sin^2\\frac A2=\\frac{\\sin(s-b)\\sin(s-c)}{\\sin b\\sin c}",
      },
      {
        headingFa: "هندسه و دقت عددی",
        headingEn: "Geometry and numerical precision",
        bodyFa:
          "نزدیک صفر یا π، معکوس کسینوس حساس است. برای جدایی کوچک از هاورساین و برای کل بازه از atan2 طول ضرب‌برداری و ضرب‌داخلی استفاده کنید. نیم‌زاویه‌ها کاربرد عددی هم دارند.",
        bodyEn:
          "Inverse cosine is sensitive near 0 or π. Use haversine for small separations, or atan2 of cross-product norm and dot product over the full range. Half-angle identities also have numerical uses.",
      },
    ],
    example: {
      id: "ex-cosine-star",
      titleFa: "فاصلهٔ زاویه‌ای دو ستاره",
      titleEn: "Angular distance of two stars",
      source: "Application of Smart (A) on the polar triangle of two stars",
      givenFa: "ستاره ۱: δ₁ = +۲۰°؛ ستاره ۲: δ₂ = +۴۰°؛ اختلاف بعد Δα = ۳۰°.",
      givenEn: "Star 1: δ₁ = +20°; star 2: δ₂ = +40°; Δα = 30°.",
      findFa: "فاصلهٔ زاویه‌ای d.",
      findEn: "Angular separation d.",
      steps: [
        {
          fa: "از مثلث قطبی دو ستاره، قانون کسینوس را با متمم میل‌ها به کار می‌بریم.",
          en: "Use the polar triangle of the stars and apply the cosine law with co-declinations.",
          formula:
            "\\cos d=\\sin20^\\circ\\sin40^\\circ+\\cos20^\\circ\\cos40^\\circ\\cos30^\\circ",
        },
        {
          fa: "arccos را به درجه حساب و با جایگذاری در رابطه کنترل می‌کنیم.",
          en: "Evaluate arccos in degrees and check by substitution.",
          formula: "d\\simeq32.51492^\\circ",
        },
      ],
      resultFa: "جدایی زاویه‌ای تقریباً ۳۲٫۵۱۴۹۲ درجه است.",
      resultEn: "Angular separation is approximately 32.51492°.",
    },
    exercises: [
      {
        textFa:
          "برای b = c = ۶۰ درجه و A = ۹۰ درجه، ضلع a را بیابید و با بسط مسطح مقایسه کنید.",
        textEn:
          "For b = c = 60° and A = 90°, find a and compare with the planar approximation.",
        answer: "\\cos a=\\frac14,\\quad a\\simeq75.52249^\\circ",
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
    id: "sine-law",
    chapterId: "ch1",
    titleFa: "فرمول سینوس — صورت (B)",
    titleEn: "The sine-formula (B)",
    level: "متوسط",
    minutes: 45,
    spherePreset: "triangle",
    proofId: "sine",
    olympiad: "ابهام SSA · نسبت سینوس اضلاع",
    summaryFa:
      "در اثبات پایین، مربع قانون کسینوس چندجمله‌ای متقارنی می‌دهد. تقسیم بر مربع سینوس هر سه ضلع، نسبتی یکسان برای سه رأس می‌سازد. مثبت بودن سینوس اجزا، ریشهٔ مثبت را توجیه می‌کند.",
    summaryEn:
      "The proof below turns the squared cosine law into a symmetric polynomial. Dividing by the squared sines of all three sides gives a common ratio. Positivity of the parts’ sines justifies the positive root.",
    smart: {
      chapter: "I",
      sections: "§6",
      pages: "9–10",
      formulae: ["(B)"],
    },
    figures: ["geometry-triangle"],
    englishFormulas: [
      "\\frac{\\sin a}{\\sin A}=\\frac{\\sin b}{\\sin B}=\\frac{\\sin c}{\\sin C}",
    ],
    formulas: [
      {
        display:
          "\\frac{\\sin a}{\\sin A}=\\frac{\\sin b}{\\sin B}=\\frac{\\sin c}{\\sin C}",
        tex: "\\frac{\\sin a}{\\sin A}=\\frac{\\sin b}{\\sin B}=\\frac{\\sin c}{\\sin C}",
        nameFa: "قانون سینوس",
        nameEn: "Sine law",
      },
    ],
    sections: [
      {
        headingFa: "از تقارن تا نسبت مشترک",
        headingEn: "From symmetry to a common ratio",
        bodyFa:
          "در اثبات پایین، مربع قانون کسینوس چندجمله‌ای متقارنی می‌دهد. تقسیم بر مربع سینوس هر سه ضلع، نسبتی یکسان برای سه رأس می‌سازد. مثبت بودن سینوس اجزا، ریشهٔ مثبت را توجیه می‌کند.",
        bodyEn:
          "The proof below turns the squared cosine law into a symmetric polynomial. Dividing by the squared sines of all three sides gives a common ratio. Positivity of the parts’ sines justifies the positive root.",
      },
      {
        headingFa: "ابهام دو ضلع و زاویهٔ غیرشامل",
        headingEn: "The SSA ambiguity",
        bodyFa:
          "arcsin تنها یک نامزد می‌دهد و مکملش هم ممکن است معتبر باشد. هر دو را با قانون کسینوس و شرط وجود کنترل کنید؛ بسته به داده، صفر، یک یا دو جواب ممکن است.",
        bodyEn:
          "Arcsin gives one candidate; its supplement may also be valid. Test both with the cosine law and existence conditions. Depending on the data, zero, one, or two solutions may occur.",
      },
    ],
    exercises: [
      {
        textFa:
          "برای a = ۵۰، b = ۴۰ و A = ۱۲۰ درجه، دو نامزد B را بیابید. چرا نامزد منفرجه رد می‌شود؟",
        textEn:
          "For a = 50°, b = 40°, A = 120°, find both B candidates. Why is the obtuse one rejected?",
        answer:
          "B\\simeq46.60892^\\circ\\ \\text{or}\\ 133.39108^\\circ;\\quad a>b\\Rightarrow A>B",
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
      id: "check-sine-law",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "برای a = ۵۰، b = ۴۰ و A = ۱۲۰ درجه، دو نامزد B را بیابید. چرا نامزد منفرجه رد می‌شود؟",
      givenEn:
        "For a = 50°, b = 40°, A = 120°, find both B candidates. Why is the obtuse one rejected?",
      findFa: "نتیجه را با روابط همین درس و کنترل واحدها به دست آورید.",
      findEn: "Use this lesson’s identities and check the units.",
      steps: [
        {
          fa: "قانون سینوس می‌دهد sin B = sin ۴۰ درجه ضرب در sin ۱۲۰ درجه تقسیم بر sin ۵۰ درجه. معکوس سینوس و مکملش دو نامزد می‌دهند.",
          en: "The sine law gives sin B = sin 40° sin 120° / sin 50°. Principal arcsine and its supplement give the two candidates.",
        },
        {
          fa: "چون a از b بزرگ‌تر است، زاویهٔ مقابلش A باید از B بزرگ‌تر باشد. نامزد ۱۳۳٫۳۹۱۰۸ درجه از ۱۲۰ درجه بزرگ‌تر است، پس رد می‌شود.",
          en: "Since a > b, the opposite angle A must exceed B. Reject 133.39108° because it exceeds A = 120°.",
          formula:
            "B\\simeq46.60892^\\circ\\ \\text{or}\\ 133.39108^\\circ;\\quad a>b\\Rightarrow A>B",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
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
    olympiad: "سه ضلع و دو زاویه مجاور",
    summaryFa:
      "قانون سینوس فقط sin B را می‌دهد؛ فرمول مشابه cos B را نیز می‌دهد. با هر دو مؤلفه، atan2 ابهام مکمل را برطرف می‌کند.",
    summaryEn:
      "The sine law supplies sin B; the analogue supplies cos B. Using both in atan2 resolves the supplementary-angle ambiguity.",
    smart: {
      chapter: "I",
      sections: "§7",
      pages: "10–11",
      formulae: ["(C)", "(14)", "(15)", "(16)"],
      figures: ["4"],
    },
    figures: ["geometry-triangle"],
    englishFormulas: ["\\sin a\\cos B=\\cos b\\sin c-\\sin b\\cos c\\cos A"],
    formulas: [
      {
        display: "\\sin a\\cos B=\\cos b\\sin c-\\sin b\\cos c\\cos A",
        tex: "\\sin a\\cos B=\\cos b\\sin c-\\sin b\\cos c\\cos A",
        nameFa: "فرمول مشابه",
        nameEn: "Analogue formula",
      },
    ],
    sections: [
      {
        headingFa: "دلیل نیاز به فرمول مشابه",
        headingEn: "Why the analogue is useful",
        bodyFa:
          "قانون سینوس فقط sin B را می‌دهد؛ فرمول مشابه cos B را نیز می‌دهد. با هر دو مؤلفه، atan2 ابهام مکمل را برطرف می‌کند.",
        bodyEn:
          "The sine law supplies sin B; the analogue supplies cos B. Using both in atan2 resolves the supplementary-angle ambiguity.",
      },
      {
        headingFa: "جانشینی بدون شکل اضافی",
        headingEn: "Derivation without an extra construction",
        bodyFa:
          "قانون کسینوس برای b را بنویسید و cos a را از صورت بنیادی جایگزین کنید. در اثبات پایین عامل‌گیری و حذف sin c به طور کامل آمده است؛ این عامل در مثلث معمول مثبت است.",
        bodyEn:
          "Write the cosine law for b and substitute the fundamental expression for cos a. The proof below explicitly factors and cancels sin c, positive for an ordinary triangle.",
      },
    ],
    exercises: [
      {
        textFa:
          "در هشتک با سه ضلع ۹۰ درجه، هر دو طرف فرمول مشابه را حساب کنید. آیا رابطه B = ۹۰ درجه را تأیید می‌کند؟",
        textEn:
          "For the three-right-side octant, evaluate both sides of the analogue. Does it confirm B = 90°?",
        answer: "\\sin a\\cos B=0=\\cos b\\sin c-\\sin b\\cos c\\cos A",
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
      id: "check-analogue-c",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "در هشتک با سه ضلع ۹۰ درجه، هر دو طرف فرمول مشابه را حساب کنید. آیا رابطه B = ۹۰ درجه را تأیید می‌کند؟",
      givenEn:
        "For the three-right-side octant, evaluate both sides of the analogue. Does it confirm B = 90°?",
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
          formula: "\\sin a\\cos B=0=\\cos b\\sin c-\\sin b\\cos c\\cos A",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
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
      "روی مرز مثلث B، a، C، b را دنبال کنید. ضلع داخلی a میان دو زاویه و زاویهٔ داخلی C میان دو ضلع است. رابطهٔ نهایی c و A را حذف می‌کند.",
    summaryEn:
      "Trace B,a,C,b along the boundary. Inner side a lies between the two angles; inner angle C lies between the sides. The final identity eliminates c and A.",
    smart: {
      chapter: "I",
      sections: "§8",
      pages: "12",
      formulae: ["(D)", "(17)", "(18)"],
      figures: ["5"],
    },
    figures: ["geometry-triangle"],
    englishFormulas: ["\\cos a\\cos C=\\sin a\\cot b-\\sin C\\cot B"],
    formulas: [
      {
        display: "\\cos a\\cos C=\\sin a\\cot b-\\sin C\\cot B",
        tex: "\\cos a\\cos C=\\sin a\\cot b-\\sin C\\cot B",
        nameFa: "رابطهٔ چهار جزء",
        nameEn: "Four-parts identity",
      },
    ],
    sections: [
      {
        headingFa: "چهار جزء متوالی",
        headingEn: "Four consecutive parts",
        bodyFa:
          "روی مرز مثلث B، a، C، b را دنبال کنید. ضلع داخلی a میان دو زاویه و زاویهٔ داخلی C میان دو ضلع است. رابطهٔ نهایی c و A را حذف می‌کند.",
        bodyEn:
          "Trace B,a,C,b along the boundary. Inner side a lies between the two angles; inner angle C lies between the sides. The final identity eliminates c and A.",
      },
      {
        headingFa: "قاعدهٔ حفظی پس از استنتاج",
        headingEn: "The mnemonic follows the derivation",
        bodyFa:
          "اثبات پایین جایگزینی cos c، انتقال جمله و استفاده از قانون سینوس را جدا نشان می‌دهد. حذف یک عامل فقط وقتی ناصفر است مجاز است؛ حالت حدی را از صورت تقسیم‌نشده یا پیوستگی کنترل کنید.",
        bodyEn:
          "The proof separates substitution for cos c, rearrangement, and use of the sine law. Cancel a factor only when nonzero; check limiting cases using the undivided form or continuity.",
      },
    ],
    exercises: [
      {
        textFa:
          "برای C = ۹۰ درجه، فرمول چهار جزء چه رابطه‌ای برای tan B می‌دهد؟ شرط تقسیم را بنویسید.",
        textEn:
          "At C = 90°, what relation for tan B follows from the four-parts formula? State the division conditions.",
        answer: "\\cot B=\\sin a\\cot b,\\quad\\tan B=\\frac{\\tan b}{\\sin a}",
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
      id: "check-four-parts",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "برای C = ۹۰ درجه، فرمول چهار جزء چه رابطه‌ای برای tan B می‌دهد؟ شرط تقسیم را بنویسید.",
      givenEn:
        "At C = 90°, what relation for tan B follows from the four-parts formula? State the division conditions.",
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
            "\\cot B=\\sin a\\cot b,\\quad\\tan B=\\frac{\\tan b}{\\sin a}",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
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
      "قائمه بودن C شرط روی زاویه است؛ ربعی بودن c شرط روی ضلع. قطبی گرفتن این دو را به هم تبدیل می‌کند. در هندسهٔ کروی وتر لزوماً از هر دو ساق بلندتر نیست.",
    summaryEn:
      "C = π/2 is a condition on an angle; c = π/2 is a condition on a side. Polar duality interchanges them. A spherical hypotenuse need not exceed both legs.",
    smart: {
      chapter: "I",
      sections: "§§9–10",
      pages: "12–15",
      formulae: ["(19)", "(20)"],
      figures: ["6", "7"],
    },
    figures: ["geometry-triangle"],
    englishFormulas: [
      "C=\\frac\\pi2\\Rightarrow\\cos c=\\cos a\\cos b",
      "\\sin a=\\sin A\\sin c,\\quad\\sin b=\\sin B\\sin c",
    ],
    formulas: [
      {
        display: "C=\\frac\\pi2\\Rightarrow\\cos c=\\cos a\\cos b",
        tex: "C=\\frac\\pi2\\Rightarrow\\cos c=\\cos a\\cos b",
        nameFa: "کسینوس قائم",
        nameEn: "Right-triangle cosine",
      },
      {
        display: "\\sin a=\\sin A\\sin c,\\quad\\sin b=\\sin B\\sin c",
        tex: "\\sin a=\\sin A\\sin c,\\quad\\sin b=\\sin B\\sin c",
        nameFa: "روابط سینوسی ساق‌ها",
        nameEn: "Leg sine identities",
      },
    ],
    sections: [
      {
        headingFa: "قائم‌الزاویه با ربعی فرق دارد",
        headingEn: "Right-angled differs from quadrantal",
        bodyFa:
          "قائمه بودن C شرط روی زاویه است؛ ربعی بودن c شرط روی ضلع. قطبی گرفتن این دو را به هم تبدیل می‌کند. در هندسهٔ کروی وتر لزوماً از هر دو ساق بلندتر نیست.",
        bodyEn:
          "C = π/2 is a condition on an angle; c = π/2 is a condition on a side. Polar duality interchanges them. A spherical hypotenuse need not exceed both legs.",
      },
      {
        headingFa: "ترتیب پنج جزء",
        headingEn: "The five-part order",
        bodyFa:
          "اجزای دایره را به ترتیب a، b، متمم A، متمم c، متمم B قرار دهید. همسایه و مقابل از همین ترتیب تعریف می‌شوند؛ ترتیب دلخواه مجاز نیست. هر قاعده را با قانون سینوس یا کسینوس قائم کنترل کنید.",
        bodyEn:
          "Arrange a,b,π/2−A,π/2−c,π/2−B cyclically. Adjacent and opposite are defined by this order, not an arbitrary rearrangement. Check each rule against the right-triangle sine or cosine laws.",
      },
    ],
    exercises: [
      {
        textFa: "برای a = ۳۰ درجه و B = ۵۰ درجه و C قائم، c را به دست آورید.",
        textEn: "For a = 30°, B = 50°, and right angle C, determine c.",
        answer:
          "\\tan c=\\frac{\\tan30^\\circ}{\\cos50^\\circ},\\quad c\\simeq41.93011^\\circ",
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
      id: "check-right-angled",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa: "برای a = ۳۰ درجه و B = ۵۰ درجه و C قائم، c را به دست آورید.",
      givenEn: "For a = 30°, B = 50°, and right angle C, determine c.",
      findFa: "نتیجه را با روابط همین درس و کنترل واحدها به دست آورید.",
      findEn: "Use this lesson’s identities and check the units.",
      steps: [
        {
          fa: "از فرمول چهار جزء برای C قائم داریم tan a = cos B tan c. چون a حاد و cos B مثبت است، c را در بازهٔ حاد انتخاب می‌کنیم.",
          en: "The right-triangle four-parts relation is tan a = cos B tan c. Since a is acute and cos B is positive, c is acute.",
        },
        {
          fa: "پس از جایگذاری و ساده‌سازی، نتیجهٔ زیر به دست می‌آید. شرایط وجود و ربع را نیز کنترل کنید.",
          en: "Substitute and simplify to obtain the result below; check existence and quadrant conditions.",
          formula:
            "\\tan c=\\frac{\\tan30^\\circ}{\\cos50^\\circ},\\quad c\\simeq41.93011^\\circ",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
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
      "هر ضلع دو قطب پادپا دارد. قطب BC را در نیم‌کرهٔ A انتخاب کنید و چرخه‌ای ادامه دهید. علامت ناسازگار روابط مکمل را تغییر می‌دهد.",
    summaryEn:
      "Each side has two antipodal poles. Choose the BC pole in A’s hemisphere, and cyclically. Inconsistent pole signs change the complement relations.",
    smart: {
      chapter: "I",
      sections: "§11",
      pages: "15–16",
      formulae: ["polar of (A)"],
      figures: ["8"],
    },
    figures: ["geometry-triangle"],
    englishFormulas: [
      "a^{\\prime}=\\pi-A,\\quad A^{\\prime}=\\pi-a",
      "\\cos A=-\\cos B\\cos C+\\sin B\\sin C\\cos a",
    ],
    formulas: [
      {
        display: "a^{\\prime}=\\pi-A,\\quad A^{\\prime}=\\pi-a",
        tex: "a^{\\prime}=\\pi-A,\\quad A^{\\prime}=\\pi-a",
        nameFa: "روابط قطبی",
        nameEn: "Polar relations",
      },
      {
        display: "\\cos A=-\\cos B\\cos C+\\sin B\\sin C\\cos a",
        tex: "\\cos A=-\\cos B\\cos C+\\sin B\\sin C\\cos a",
        nameFa: "کسینوس زوایا",
        nameEn: "Angle cosine law",
      },
    ],
    sections: [
      {
        headingFa: "انتخاب قطب‌های داخلی",
        headingEn: "Choose the inward poles",
        bodyFa:
          "هر ضلع دو قطب پادپا دارد. قطب BC را در نیم‌کرهٔ A انتخاب کنید و چرخه‌ای ادامه دهید. علامت ناسازگار روابط مکمل را تغییر می‌دهد.",
        bodyEn:
          "Each side has two antipodal poles. Choose the BC pole in A’s hemisphere, and cyclically. Inconsistent pole signs change the complement relations.",
      },
      {
        headingFa: "دوگانگی و حل از سه زاویه",
        headingEn: "Duality and solving from three angles",
        bodyFa:
          "ضلع قطبی مکمل زاویهٔ اصلی است، نه برابر آن. جانشینی کامل در قانون اضلاع، قانون زوایا را می‌دهد. در هندسهٔ کروی، سه زاویه می‌توانند اضلاع را تعیین کنند؛ اندازهٔ زاویه‌ای مستقل از شکل نیست.",
        bodyEn:
          "A polar side supplements the original angle rather than equalling it. Full substitution in the side law gives the angle law. Three angles can determine spherical sides; angular size is not independent of shape.",
      },
    ],
    exercises: [
      {
        textFa:
          "مثلثی با اضلاع ۹۰ درجه چه مثلث قطبی‌ای دارد؟ فرمول مکمل را کنترل کنید.",
        textEn:
          "What is the polar of a triangle whose three sides are 90°? Check the supplement relations.",
        answer:
          "a=b=c=A=B=C=90^\\circ\\Rightarrow a^{\\prime}=b^{\\prime}=c^{\\prime}=90^\\circ",
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
      id: "check-cosine-angles",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "مثلثی با اضلاع ۹۰ درجه چه مثلث قطبی‌ای دارد؟ فرمول مکمل را کنترل کنید.",
      givenEn:
        "What is the polar of a triangle whose three sides are 90°? Check the supplement relations.",
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
            "a=b=c=A=B=C=90^\\circ\\Rightarrow a^{\\prime}=b^{\\prime}=c^{\\prime}=90^\\circ",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
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
    olympiad: "فاصلهٔ عظیمهٔ زمینی · هاورساین",
    summaryFa:
      "دو مکان A و B را به قطب شمال وصل کنید. اضلاع قطبی متمم عرض‌ها و زاویهٔ شامل اختلاف طول است. از اختلاف طول جهت‌دار هم می‌توان استفاده کرد چون کسینوس و هاورساین زوج‌اند.",
    summaryEn:
      "Join places A,B to the north pole. The polar sides are co-latitudes and the included angle is the longitude difference. Signed differences also work because cosine and haversine are even.",
    smart: {
      chapter: "I",
      sections: "§§12–14",
      pages: "16–21",
      formulae: ["(21)", "(22)", "(23)", "(24)–(34)"],
      figures: ["9"],
    },
    figures: ["geometry-circles"],
    englishFormulas: [
      "\\operatorname{hav}t=\\sin^2\\frac t2",
      "\\operatorname{hav}a=\\operatorname{hav}(b-c)+\\sin b\\sin c\\operatorname{hav}A",
    ],
    formulas: [
      {
        display: "\\operatorname{hav}t=\\sin^2\\frac t2",
        tex: "\\operatorname{hav}t=\\sin^2\\frac t2",
        nameFa: "تعریف هاورساین",
        nameEn: "Haversine definition",
      },
      {
        display:
          "\\operatorname{hav}a=\\operatorname{hav}(b-c)+\\sin b\\sin c\\operatorname{hav}A",
        tex: "\\operatorname{hav}a=\\operatorname{hav}(b-c)+\\sin b\\sin c\\operatorname{hav}A",
        nameFa: "فرمول هاورساین",
        nameEn: "Haversine identity",
      },
    ],
    sections: [
      {
        headingFa: "ساخت مثلث دو مکان",
        headingEn: "Build the two-place triangle",
        bodyFa:
          "دو مکان A و B را به قطب شمال وصل کنید. اضلاع قطبی متمم عرض‌ها و زاویهٔ شامل اختلاف طول است. از اختلاف طول جهت‌دار هم می‌توان استفاده کرد چون کسینوس و هاورساین زوج‌اند.",
        bodyEn:
          "Join places A,B to the north pole. The polar sides are co-latitudes and the included angle is the longitude difference. Signed differences also work because cosine and haversine are even.",
      },
      {
        headingFa: "فاصله با هاورساین",
        headingEn: "Separation by haversine",
        bodyFa:
          "جانشینی فاصله‌های قطبی فرمول زیر را می‌دهد. q را فقط برای خطای کوچک گردکردن به بازهٔ صفر تا یک محدود کنید؛ این کار جای اعتبارسنجی داده نیست.",
        bodyEn:
          "Substituting polar distances gives the following formula. Clamp q into [0,1] only for small roundoff, not as a replacement for input validation.",
        formula:
          "q=\\operatorname{hav}(\\varphi_2-\\varphi_1)+\\cos\\varphi_1\\cos\\varphi_2\\operatorname{hav}(\\Delta\\lambda),\\quad\\sigma=2\\arcsin\\sqrt q",
      },
      {
        headingFa: "فاصلهٔ فیزیکی و پادپا",
        headingEn: "Physical distance and antipodes",
        bodyFa:
          "طول عظیمه Rσ است با σ رادیانی. روی زمین واقعی، مدل کروی تقریبی است. نزدیک پادپا جهت مسیر حساس و در پادپای دقیق مسیر کوتاه غیر یکتا است.",
        bodyEn:
          "Great-circle length is Rσ with σ in radians. This is an approximation for real Earth. Near antipodes the route direction is sensitive; at exact antipodes the shortest route is not unique.",
      },
    ],
    example: {
      id: "ex-smart-12",
      titleFa: "بازآزمایی مثال بند ۱۲",
      titleEn: "Reproduce Smart §12",
      source: "Smart I §12, pp. 16–18, Fig. 9",
      givenFa: "A: ۲۴°۱۸′N، ۱۳۳°۳۹′E · B: ۳۶°۴۷′N، ۱۲۵°۲۴′W",
      givenEn: "A: 24°18′N, 133°39′E · B: 36°47′N, 125°24′W",
      findFa: "AB، زاویه در A، عرض بالاترین نقطهٔ AB.",
      findEn: "AB, angle at A, highest latitude on AB.",
      steps: [
        {
          fa: "PA = ۶۵°۴۲′، PB = ۵۳°۱۳′، APB = ۱۰۰°۵۷′.",
          en: "PA = 65°42′, PB = 53°13′, APB = 100°57′.",
        },
        {
          fa: "فرمول (A) برای AB.",
          en: "Formula (A) for AB.",
          formula:
            "\\cos AB=\\cos PA\\cos PB+\\sin PA\\sin PB\\cos H,\\quad AB\\simeq83.81404^\\circ",
        },
        {
          fa: "زاویهٔ A روبه‌روی PB است. آن را با صورت حل‌شدهٔ قانون کسینوس از سه ضلع می‌یابیم؛ ترتیب اضلاع را جابه‌جا نکنید.",
          en: "Angle A is opposite PB. Recover it from the rearranged cosine law using all three sides, keeping the opposite-side ordering.",
          formula:
            "\\cos A=\\frac{\\cos PB-\\cos PA\\cos AB}{\\sin PA\\sin AB},\\quad A\\simeq52.27241^\\circ",
        },
        {
          fa: "از A تا نزدیک‌ترین نقطه به قطب، مثلث قائم با قطب می‌سازیم. قانون سینوس در آن، فاصلهٔ قطبی کمینه را از زاویهٔ A تعیین می‌کند؛ برای مسیر این مثال، نقطهٔ بیشینه روی کمان کوتاه قرار دارد.",
          en: "The northernmost point of the route forms a right spherical triangle with A and the pole. The sine law gives its minimum polar distance; for this example the maximum lies on the minor route arc.",
          formula: "\\cos\\varphi_{\\max}=\\sin PA\\sin A",
        },
      ],
      resultFa:
        "جدایی، زاویهٔ A و بیشینهٔ عرض از روابط بالا به دست می‌آیند؛ تبدیل ۶۰ مایل دریایی بر درجه تقریبی است.",
      resultEn:
        "AB ≈ 83.81404°; spherical-model distance ≈ 5028.84 nmi; A ≈ 52.27241°; maximum latitude ≈ 43.87486° N.",
      widget: "gc-distance",
    },
    exercises: [
      {
        textFa:
          "دو مکان روی استوا با اختلاف طول ۰٫۰۰۱ درجه چه جدایی زاویه‌ای دارند؟ چرا هاورساین مناسب است؟",
        textEn:
          "Two equatorial places differ by 0.001° in longitude. What is their separation? Why is haversine useful?",
        answer: "\\sigma=0.001^\\circ=1.74532925\\times10^{-5}\\ \\mathrm{rad}",
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
    id: "delambre-napier",
    chapterId: "ch1",
    titleFa: "زوایای کوچک، دلامبر و قیاسی‌های نپر",
    titleEn: "Small angles, Delambre’s and Napier’s analogies",
    level: "المپیاد",
    minutes: 40,
    spherePreset: "triangle",
    proofId: "delambre",
    olympiad: "قیاسی‌های نپر · sin 1″",
    summaryFa:
      "sin θ تقریباً θ فقط برای θ رادیانی درست است. یک دقیقهٔ زمان ۱۵ دقیقهٔ قوسی، یعنی ۹۰۰ ثانیهٔ قوسی است؛ ضریب ۱۵ تقسیم بر ۲۰۶۲۶۵ برای دقیقهٔ زمان یک عامل ۶۰ کم دارد.",
    summaryEn:
      "sin θ ≈ θ assumes radians. One minute of time is 15 arcminutes, or 900 arcseconds. The factor 15/206265 for time minutes is missing a factor of 60.",
    smart: {
      chapter: "I",
      sections: "§§15–16",
      pages: "21–24",
      formulae: ["(35)–(52)"],
    },
    figures: ["geometry-triangle"],
    englishFormulas: [
      "1\\,\\mathrm h=15^\\circ,\\quad1\\,\\mathrm{min}_{time}=900^{\\prime\\prime}",
      "\\tan\\frac{a+b}2=\\frac{\\cos((A-B)/2)}{\\cos((A+B)/2)}\\tan\\frac c2",
    ],
    formulas: [
      {
        display:
          "1\\,\\mathrm h=15^\\circ,\\quad1\\,\\mathrm{min}_{time}=900^{\\prime\\prime}",
        tex: "1\\,\\mathrm h=15^\\circ,\\quad1\\,\\mathrm{min}_{time}=900^{\\prime\\prime}",
        nameFa: "تبدیل دقیق زمان و قوس",
        nameEn: "Exact time–arc conversion",
      },
      {
        display:
          "\\tan\\frac{a+b}2=\\frac{\\cos((A-B)/2)}{\\cos((A+B)/2)}\\tan\\frac c2",
        tex: "\\tan\\frac{a+b}2=\\frac{\\cos((A-B)/2)}{\\cos((A+B)/2)}\\tan\\frac c2",
        nameFa: "قیاس مجموع اضلاع",
        nameEn: "Sum-of-sides analogy",
      },
    ],
    sections: [
      {
        headingFa: "واحد تقریب زاویهٔ کوچک",
        headingEn: "Small angles need radians",
        bodyFa:
          "sin θ تقریباً θ فقط برای θ رادیانی درست است. یک دقیقهٔ زمان ۱۵ دقیقهٔ قوسی، یعنی ۹۰۰ ثانیهٔ قوسی است؛ ضریب ۱۵ تقسیم بر ۲۰۶۲۶۵ برای دقیقهٔ زمان یک عامل ۶۰ کم دارد.",
        bodyEn:
          "sin θ ≈ θ assumes radians. One minute of time is 15 arcminutes, or 900 arcseconds. The factor 15/206265 for time minutes is missing a factor of 60.",
        formula: "H_{\\rm rad}=\\frac{\\pi}{720}H_{\\rm time\\ minutes}",
      },
      {
        headingFa: "تقریب را با تساوی جدا کنید",
        headingEn: "Distinguish approximation from equality",
        bodyFa:
          "یک رادیان دقیقاً ۶۴۸۰۰۰ تقسیم بر π ثانیهٔ قوسی است. ۲۰۶۲۶۵ گرد شده و سینوس یک ثانیه فقط تقریباً معکوس آن است.",
        bodyEn:
          "One radian is exactly 648000/π arcseconds. 206265 is rounded, and the sine of one arcsecond is only approximately its reciprocal.",
      },
      {
        headingFa: "قیاس از نسبت هویت‌ها",
        headingEn: "Analogies from ratios of identities",
        bodyFa:
          "در اثبات پایین، چهار هویت دلامبر از ضرب فرمول‌های نیم‌زاویه و اتحادهای جمع به ضرب ساخته می‌شوند؛ سپس تقسیم جفت‌های مشخص، قیاس‌های نپر را می‌دهد. برای معکوس تانژانت، ربع را جداگانه کنترل کنید.",
        bodyEn:
          "The derivation below constructs all four Delambre identities from half-angle products and sum-to-product identities, then divides explicit pairs to obtain Napier’s analogies. Resolve quadrants when inverting tangents.",
      },
    ],
    exercises: [
      {
        textFa:
          "یک دقیقهٔ زمان چند ثانیهٔ قوسی و چند رادیان است؟ تقریب سینوس آن را بنویسید.",
        textEn:
          "Convert one minute of time to arcseconds and radians. Give its small-angle sine approximation.",
        answer:
          "1\\,\\mathrm{min}_{time}=900^{\\prime\\prime}=\\pi/720\\ \\mathrm{rad},\\quad\\sin H\\simeq0.00436332",
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
      id: "check-delambre-napier",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "یک دقیقهٔ زمان چند ثانیهٔ قوسی و چند رادیان است؟ تقریب سینوس آن را بنویسید.",
      givenEn:
        "Convert one minute of time to arcseconds and radians. Give its small-angle sine approximation.",
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
            "1\\,\\mathrm{min}_{time}=900^{\\prime\\prime}=\\pi/720\\ \\mathrm{rad},\\quad\\sin H\\simeq0.00436332",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
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
    olympiad: "زیادی کروی · ژیرار · ل‌هویلیه",
    summaryFa:
      "زیادی E مجموع زاویه‌ها منهای π است و زاویه‌ها باید رادیانی باشند. روی کرهٔ واحد مساحت عددی برابر E است؛ زاویهٔ فضایی استرادیان و مساحت فیزیکی واحد طول مربع دارد.",
    summaryEn:
      "Excess E is the angle sum minus π, with angles in radians. Unit-sphere area is numerically E; solid angle is in steradians and physical area in squared length units.",
    smart: {
      chapter: "I",
      sections: "supplement (Girard / L’Huilier)",
      pages: "—",
      formulae: ["E = A+B+C−π"],
    },
    figures: ["geometry-area"],
    englishFormulas: ["E=A+B+C-\\pi,\\quad S=R^2E"],
    formulas: [
      {
        display: "E=A+B+C-\\pi,\\quad S=R^2E",
        tex: "E=A+B+C-\\pi,\\quad S=R^2E",
        nameFa: "قضیهٔ ژیرار",
        nameEn: "Girard theorem",
      },
    ],
    sections: [
      {
        headingFa: "مساحت از زیادی کروی",
        headingEn: "Area from spherical excess",
        bodyFa:
          "زیادی E مجموع زاویه‌ها منهای π است و زاویه‌ها باید رادیانی باشند. روی کرهٔ واحد مساحت عددی برابر E است؛ زاویهٔ فضایی استرادیان و مساحت فیزیکی واحد طول مربع دارد.",
        bodyEn:
          "Excess E is the angle sum minus π, with angles in radians. Unit-sphere area is numerically E; solid angle is in steradians and physical area in squared length units.",
      },
      {
        headingFa: "اگر تنها اضلاع معلوم‌اند",
        headingEn: "When only sides are known",
        bodyFa:
          "فرمول ل‌هویلیه از اضلاع، E را بدون تفریق مجموع زاویه‌های تقریباً مسطح می‌دهد. این نتیجهٔ محاسباتی مستقل است؛ اثبات ژیرار پایین با شمارش صریح هلال‌ها انجام می‌شود.",
        bodyEn:
          "L’Huilier computes E from sides without subtracting an almost planar angle sum. This is a separate computational result; the Girard proof below explicitly counts lunes.",
        formula:
          "\\tan\\frac E4=\\sqrt{\\tan\\frac s2\\tan\\frac{s-a}2\\tan\\frac{s-b}2\\tan\\frac{s-c}2},\\quad s=\\frac{a+b+c}2",
      },
    ],
    exercises: [
      {
        textFa:
          "مثلث با اضلاع هر یک ۶۰ درجه را حل کنید: زاویهٔ رأس، زیادی و مساحت کرهٔ واحد چیست؟",
        textEn:
          "Solve the equilateral 60°-side triangle: vertex angle, excess, and unit-sphere area.",
        answer:
          "A=\\arccos(1/3)\\simeq70.52878^\\circ,\\quad E\\simeq31.58634^\\circ,\\quad S\\simeq0.5512856",
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
      id: "check-spherical-area",
      titleFa: "مثال حل‌شده و کنترل نتیجه",
      titleEn: "Worked check",
      source: "Original worked application / کاربرد تألیفی",
      givenFa:
        "مثلث با اضلاع هر یک ۶۰ درجه را حل کنید: زاویهٔ رأس، زیادی و مساحت کرهٔ واحد چیست؟",
      givenEn:
        "Solve the equilateral 60°-side triangle: vertex angle, excess, and unit-sphere area.",
      findFa: "نتیجه را با روابط همین درس و کنترل واحدها به دست آورید.",
      findEn: "Use this lesson’s identities and check the units.",
      steps: [
        {
          fa: "از قانون کسینوس برای اضلاع مساوی داریم cos A = cos ۶۰ تقسیم بر (۱ + cos ۶۰) = یک سوم. سپس E = ۳A − π را با A رادیانی حساب می‌کنیم.",
          en: "The equilateral cosine law gives cos A = cos 60°/(1+cos 60°) = 1/3. Then compute E = 3A−π with A in radians.",
        },
        {
          fa: "پس از جایگذاری و ساده‌سازی، نتیجهٔ زیر به دست می‌آید. شرایط وجود و ربع را نیز کنترل کنید.",
          en: "Substitute and simplify to obtain the result below; check existence and quadrant conditions.",
          formula:
            "A=\\arccos(1/3)\\simeq70.52878^\\circ,\\quad E\\simeq31.58634^\\circ,\\quad S\\simeq0.5512856",
        },
      ],
      resultFa:
        "نتیجهٔ نهایی در رابطهٔ بالا آمده است؛ زاویه و طول را با یکدیگر مخلوط نکنید.",
      resultEn:
        "The result is shown above; keep angular and physical units distinct.",
    },
  },
];
