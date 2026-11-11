export type Problem = {
  id: string;
  lessonId: string;
  title: string;
  prompt: string;
  hint: string;
  solution: string;
  answer: string;
  difficulty: "آسان" | "متوسط" | "المپیاد";
  source: string;
};

export const PROBLEMS: Problem[] = [
  {
    id: "p1",
    lessonId: "great-small",
    title: "تشخیص عظیمه و صغیره",
    prompt:
      "مدار میل δ = +۴۰° روی کرهٔ سماوی چه نوع دایره‌ای است؟ شعاع زاویه‌ای آن نسبت به قطب شمال سماوی چند درجه است؟",
    hint: "مدار میل ثابت = دایرهٔ صغیره حول قطب؛ فاصله از قطب = ۹۰°−δ.",
    solution:
      "دایرهٔ صغیره است. فاصلهٔ زاویه‌ای از قطب شمال = ۹۰°−۴۰° = ۵۰°. پس شعاع زاویه‌ای نسبت به قطب ۵۰° است.",
    answer: "صغیره · ۵۰°",
    difficulty: "آسان",
    source: "المپیاد نجوم · هندسه کروی",
  },
  {
    id: "p2",
    lessonId: "spherical-triangle",
    title: "زیادی کروی",
    prompt:
      "مثلث کروی با زوایای ۷۲°، ۸۰° و ۹۵° چه زیادی و چه مساحتی (استرادیان روی کرهٔ واحد) دارد؟",
    hint: "E = A+B+C−۱۸۰° ؛ مساحت = E بر حسب رادیان.",
    solution: "E = ۷۲+۸۰+۹۵−۱۸۰ = ۶۷° = ۶۷π/۱۸۰ ≈ ۱.۱۶۹ sr.",
    answer: "E≈۶۷° ≈ ۱٫۱۷ sr",
    difficulty: "متوسط",
    source: "Smart I · Girard",
  },
  {
    id: "p3",
    lessonId: "cosine-law",
    title: "فاصلهٔ دو ستاره",
    prompt:
      "دو ستاره با (α₁=۵ʰ، δ₁=−۸°) و (α₂=۵.۶ʰ، δ₂=+۷°) دارید. فاصلهٔ زاویه‌ای را با قانون کسینوس‌ها بیابید.",
    hint: "Δα را به درجه تبدیل کنید (×۱۵). cos c = sinδ₁sinδ₂ + cosδ₁cosδ₂cosΔα.",
    solution:
      "Δα = ۰.۶ʰ = ۹°. cos c = sin(−۸)sin۷ + cos(−۸)cos۷ cos۹ ≈ −۰.۰۱۷ + ۰.۹۷۷ ≈ ۰.۹۶ ⇒ c ≈ ۱۶.۳°.",
    answer: "≈ ۱۶٫۳°",
    difficulty: "متوسط",
    source: "Smart I.3 · جبار",
  },
  {
    id: "p4",
    lessonId: "sine-law",
    title: "سمت از قانون سینوس‌ها",
    prompt:
      "در مثلث نجومی، a = ۵۰°، A = ۱۲۰°، b = ۴۰°. زاویهٔ B را از قانون سینوس‌ها تقریب بزنید.",
    hint: "sin B = sin b · sin A / sin a",
    solution:
      "sin B = sin۴۰·sin۱۲۰ / sin۵۰ ≈ ۰.۶۴۳·۰.۸۶۶ / ۰.۷۶۶ ≈ ۰.۷۲۷ ⇒ B ≈ ۴۶.۶° (یا ۱۸۰−… که با بررسی کسینوس رد می‌شود).",
    answer: "B ≈ ۴۶٫۶°",
    difficulty: "المپیاد",
    source: "المپیاد نجوم · مثلث نجومی",
  },
  {
    id: "p5",
    lessonId: "celestial-sphere",
    title: "ارتفاع خورشید در ظهر",
    prompt:
      "در عرض φ = ۳۲° در انقلاب تابستانی (δ≈+۲۳.۴°) ارتفاع خورشید در ظهر چقدر است؟",
    hint: "در ظهر H=۰؛ a = ۹۰° − |φ − δ| برای این حالت.",
    solution: "a = ۹۰° − (۳۲−۲۳.۴) = ۸۱.۴°.",
    answer: "۸۱٫۴°",
    difficulty: "آسان",
    source: "Smart II",
  },
  {
    id: "p6",
    lessonId: "celestial-sphere",
    title: "تبدیل ارتفاع",
    prompt:
      "برای φ=۳۵°، δ=+۲۰°، H=۳۰° ارتفاع را از sin a = sinδ sinφ + cosδ cosφ cosH بیابید.",
    hint: "مستقیماً در فرمول Smart برای مثلث PZX جایگذاری کنید.",
    solution:
      "sin a = sin۲۰ sin۳۵ + cos۲۰ cos۳۵ cos۳۰ ≈ ۰.۱۹۷ + ۰.۶۶۸ ≈ ۰.۸۶۵ ⇒ a ≈ ۵۹.۹°.",
    answer: "a ≈ ۶۰°",
    difficulty: "المپیاد",
    source: "گنجینه المپیاد نجوم · سادات موسوی",
  },
  {
    id: "p7",
    lessonId: "time-systems",
    title: "LST از GMST",
    prompt: "GMST = ۹.۲ʰ و λ = ۵۱°E. مقدار LST؟",
    hint: "LST = GMST + λ/۱۵",
    solution: "۵۱/۱۵ = ۳.۴ ⇒ LST = ۱۲.۶ʰ",
    answer: "۱۲٫۶ʰ",
    difficulty: "آسان",
    source: "Smart VI",
  },
  {
    id: "p8",
    lessonId: "great-small",
    title: "کوتاه‌ترین مسیر",
    prompt:
      "آیا مسیر ثابت‌بودن میل بین دو نقطه روی کرهٔ سماوی لزوماً کوتاه‌ترین مسیر است؟ چرا؟",
    hint: "مدار میل عموماً دایرهٔ صغیره است مگر δ=۰.",
    solution:
      "خیر. کوتاه‌ترین مسیر همواره کمان دایرهٔ عظیمه است. مدار میل غیرصفر صغیره است و از ژئودزیک بلندتر است.",
    answer: "خیر — فقط عظیمه ژئودزیک است",
    difficulty: "متوسط",
    source: "هندسه کروی المپیاد",
  },
  {
    id: "p9",
    lessonId: "cosine-law",
    title: "قانون کسینوس برای زوایا",
    prompt:
      "صورت قطبی قانون کسینوس‌ها برای زاویهٔ C را بنویسید و بگویید از کجا می‌آید.",
    hint: "مثلث قطبی را در نظر بگیرید.",
    solution:
      "cos C = −cos A cos B + sin A sin B cos c. با اعمال قانون اضلاع روی مثلث قطبی (اضلاع ۱۸۰°−زوایا و برعکس) به‌دست می‌آید.",
    answer: "cos C = −cos A cos B + sin A sin B cos c",
    difficulty: "المپیاد",
    source: "Smart I.3 polar",
  },
  {
    id: "p10",
    lessonId: "spherical-triangle",
    title: "مثلث نجومی — اضلاع",
    prompt:
      "برای ناظر در φ=۴۰°N و ستاره با δ=+۱۰°، اضلاع PZ و PX در مثلث PZX چند درجه‌اند؟",
    hint: "PZ = ۹۰°−φ ، PX = ۹۰°−δ",
    solution: "PZ = ۵۰° ، PX = ۸۰°.",
    answer: "PZ=۵۰° ، PX=۸۰°",
    difficulty: "آسان",
    source: "المپیاد نجوم",
  },
];
