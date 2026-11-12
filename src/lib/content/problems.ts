/**
 * Olympiad / Smart sample bank.
 * Each problem carries an exact sphere diagram spec so the 3D figure matches the solution.
 */

export type SphereDiagram =
  | {
      kind: "small-circle";
      /** Declination of the small circle (parallel). */
      delta: number;
      caption: string;
    }
  | {
      kind: "star-distance";
      /** Right ascension in hours. */
      ra1h: number;
      dec1: number;
      ra2h: number;
      dec2: number;
      caption: string;
    }
  | {
      kind: "triangle-ssa";
      /** Side a opposite A, side b, angle A (degrees) — sine-law sample. */
      a: number;
      A: number;
      b: number;
      caption: string;
    }
  | {
      kind: "triangle-sas";
      a: number;
      b: number;
      C: number;
      caption: string;
    }
  | {
      /** Right-angled at C; known side a and angle B. */
      kind: "triangle-right";
      a: number;
      B: number;
      caption: string;
    }
  | {
      kind: "triangle-angles";
      A: number;
      B: number;
      C: number;
      caption: string;
    }
  | {
      kind: "triangle-equilateral";
      side: number;
      caption: string;
    }
  | {
      kind: "polar-dual";
      a: number;
      b: number;
      c: number;
      caption: string;
    }
  | {
      kind: "pzx";
      phi: number;
      delta: number;
      /** Hour angle degrees; omit / use rising H0 when rising=true. */
      H?: number;
      rising?: boolean;
      caption: string;
    }
  | {
      kind: "ecliptic";
      epsilon: number;
      lambda: number;
      caption: string;
    }
  | {
      kind: "lst";
      gmst: number;
      lonEast: number;
      caption: string;
    };

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
  diagram: SphereDiagram;
};

export const PROBLEMS: Problem[] = [
  {
    id: "p1",
    lessonId: "great-circles",
    title: "عظیمه در برابر صغیره",
    prompt:
      "مدار میل δ=+40° چه نوع دایره‌ای است و شعاع زاویه‌ای‌اش از قطب شمال سماوی چند درجه است؟",
    hint: "فاصله از قطب = ۹۰°−δ. صفحهٔ موازی استوا از مرکز نمی‌گذرد → صغیره.",
    solution:
      "موازی δ=+40° دایرهٔ صغیره است (صفحه موازی استوا، نه گذرنده از مرکز کرهٔ سماوی). شعاع زاویه‌ای از قطب شمال = ۹۰°−۴۰° = ۵۰°.",
    answer: "صغیره · ۵۰°",
    difficulty: "آسان",
    source: "هندسه کروی المپیاد",
    diagram: {
      kind: "small-circle",
      delta: 40,
      caption: "استوا (عظیمه) · موازی δ=+۴۰° (صغیره) · شعاع از N = ۵۰°",
    },
  },
  {
    id: "p2",
    lessonId: "spherical-area",
    title: "زیادی و مساحت",
    prompt: "مثلث با زوایای 72°, 80°, 95°. E و مساحت روی کرهٔ واحد؟",
    hint: "E = A+B+C−180° ؛ روی کرهٔ واحد Area = E (رادیان).",
    solution:
      "E = 72+80+95−180 = 67°. Area = 67·π/180 ≈ 1.169 sr (قضیهٔ ژیرار).",
    answer: "E=67° · Area≈1.169 sr",
    difficulty: "متوسط",
    source: "Girard · Smart I",
    diagram: {
      kind: "triangle-angles",
      A: 72,
      B: 80,
      C: 95,
      caption: "مثلث کروی · E = A+B+C−۱۸۰° = ۶۷°",
    },
  },
  {
    id: "p3",
    lessonId: "cosine-sides",
    title: "فاصلهٔ دو ستاره",
    prompt:
      "ستارگان (α=5.0ʰ, δ=−8°) و (α=5.6ʰ, δ=+7°). فاصلهٔ زاویه‌ای d را بیابید.",
    hint: "cos d = sinδ₁sinδ₂ + cosδ₁cosδ₂ cosΔα ، با Δα=0.6ʰ=9°.",
    solution:
      "Δα=9°. cos d = sin(−8)sin7 + cos(−8)cos7 cos9 ≈ 0.9540 ⇒ d = arccos(0.9540) ≈ 17.48°.",
    answer: "d ≈ 17.5°",
    difficulty: "متوسط",
    source: "Smart I.3",
    diagram: {
      kind: "star-distance",
      ra1h: 5.0,
      dec1: -8,
      ra2h: 5.6,
      dec2: 7,
      caption: "کمان عظیمه بین دو ستاره · Δα=۹° · d≈۱۷.۵°",
    },
  },
  {
    id: "p4",
    lessonId: "sine-law",
    title: "قانون سینوس‌ها",
    prompt: "a=50°, A=120°, b=40°. زاویهٔ B را بیابید (ربع درست).",
    hint: "sin B / sin b = sin A / sin a  ⇒  sin B = sin b · sin A / sin a. ربع را با کسینوس اضلاع تأیید کنید.",
    solution:
      "sin B = sin40°·sin120°/sin50° ≈ 0.7266 ⇒ B ≈ 46.55° یا ۱۳۳.۴۵°. با قانون کسینوس‌ها برای ضلع c و زاویه، ربع حاد (۴۶.۶°) سازگار است.",
    answer: "B ≈ 46.6°",
    difficulty: "المپیاد",
    source: "Smart I.4",
    diagram: {
      kind: "triangle-ssa",
      a: 50,
      A: 120,
      b: 40,
      caption: "SSA · sin B = sin b sin A / sin a · B≈۴۶.۶°",
    },
  },
  {
    id: "p5",
    lessonId: "coord-transform",
    title: "ارتفاع از مثلث PZX",
    prompt: "φ=35°, δ=+20°, H=30°. ارتفاع a را حساب کنید.",
    hint: "sin a = sinδ sinφ + cosδ cosφ cos H  (ZX = z = ۹۰°−a).",
    solution:
      "sin a = sin20°sin35° + cos20°cos35°cos30° ≈ 0.8630 ⇒ a ≈ 59.63°. اضلاع: PZ=۵۵°, PX=۷۰°, ZX=۹۰°−a≈۳۰.۴°.",
    answer: "a ≈ 59.6°",
    difficulty: "المپیاد",
    source: "Smart II · المپیاد",
    diagram: {
      kind: "pzx",
      phi: 35,
      delta: 20,
      H: 30,
      caption: "مثلث نجومی PZX · φ=۳۵° · δ=۲۰° · H=۳۰° · a≈۵۹.۶°",
    },
  },
  {
    id: "p6",
    lessonId: "rising-setting",
    title: "ساعت زاویهٔ طلوع",
    prompt: "φ=40°N, δ=+15°. H₀ در طلوع/غروب؟ مدت بالای افق؟",
    hint: "در افق a=0 ⇒ cos H₀ = −tanφ tanδ. مدت ≈ ۲H₀ بر حسب ساعت.",
    solution:
      "cos H₀ = −tan40°tan15° ≈ −0.2247 ⇒ H₀ ≈ 103.0°. مدت ≈ ۲H₀/۱۵ ≈ ۱۳.۷۳ʰ.",
    answer: "H₀≈103° · ≈13.7ʰ",
    difficulty: "المپیاد",
    source: "المپیاد نجوم",
    diagram: {
      kind: "pzx",
      phi: 40,
      delta: 15,
      rising: true,
      caption: "افق · مسیر روزانه δ=+۱۵° · H₀≈۱۰۳° از نصف‌النهار",
    },
  },
  {
    id: "p7",
    lessonId: "spherical-triangle",
    title: "اضلاع مثلث نجومی",
    prompt: "φ=40°N, δ=+10°. اضلاع PZ و PX؟",
    hint: "PZ = co-latitude = ۹۰°−φ ، PX = co-declination = ۹۰°−δ.",
    solution: "PZ = ۹۰°−۴۰° = ۵۰°. PX = ۹۰°−۱۰° = ۸۰°. (ZX به H بستگی دارد.)",
    answer: "PZ=50° · PX=80°",
    difficulty: "آسان",
    source: "Smart II",
    diagram: {
      kind: "pzx",
      phi: 40,
      delta: 10,
      H: 45,
      caption: "P قطب · Z سمت‌الرأس · X ستاره · PZ=۵۰° · PX=۸۰°",
    },
  },
  {
    id: "p8",
    lessonId: "cosine-angles",
    title: "قانون کسینوس زوایا",
    prompt: "صورت قطبی برای زاویهٔ C را بنویسید.",
    hint: "مثلث قطبی: a′=۱۸۰°−A و دور. کسینوس اضلاع روی قطبی → کسینوس زوایا روی اصلی.",
    solution:
      "از مثلث قطبی: cos C = −cos A cos B + sin A sin B cos c.",
    answer: "cos C = −cos A cos B + sin A sin B cos c",
    difficulty: "متوسط",
    source: "Smart I.3 polar",
    diagram: {
      kind: "polar-dual",
      a: 70,
      b: 65,
      c: 55,
      caption: "مثلث اصلی (طلایی) و قطبی (فیروزه‌ای) · a′=۱۸۰°−A",
    },
  },
  {
    id: "p9",
    lessonId: "spherical-area",
    title: "L'Huilier",
    prompt: "برای a=b=c=60°، E را از L'Huilier تقریب بزنید.",
    hint: "s=۹۰°. (s−a)/۲=۱۵°. tan(E/۴)=√[tan(s/۲) tan((s−a)/۲)³].",
    solution:
      "s=90°. tan(E/4)=√[tan45°·tan15°³]≈√0.01924≈0.1387 ⇒ E/4≈7.90° ⇒ E≈31.59°. از کسینوس اضلاع: cos A=(cos60−cos²60)/sin²60=1/3 ⇒ A=arccos(1/3)≈70.53°؛ E=3A−180≈31.59°.",
    answer: "E ≈ 31.6° · A≈70.5°",
    difficulty: "المپیاد",
    source: "L'Huilier",
    diagram: {
      kind: "triangle-equilateral",
      side: 60,
      caption: "متساوی‌الاضلاع a=b=c=۶۰° · E≈۳۱.۶° · A=B=C≈۷۰.۵°",
    },
  },
  {
    id: "p10",
    lessonId: "time",
    title: "LST",
    prompt: "GMST=9.2ʰ ، λ=51°E. LST؟",
    hint: "LST = GMST + λ/۱۵ (λ شرقی مثبت).",
    solution: "λ/۱۵ = ۵۱/۱۵ = ۳.۴ʰ ⇒ LST = ۹.۲ + ۳.۴ = ۱۲.۶ʰ.",
    answer: "12.6ʰ",
    difficulty: "آسان",
    source: "Smart VI",
    diagram: {
      kind: "lst",
      gmst: 9.2,
      lonEast: 51,
      caption: "گرینویچ → ناظر · LST = GMST + λ/۱۵ = ۱۲.۶ʰ",
    },
  },
  {
    id: "p11",
    lessonId: "ecliptic",
    title: "میل خورشید",
    prompt: "در λ=90° (انقلاب)، با ε=23.44° میل خورشید؟",
    hint: "sin δ = sin ε sin λ",
    solution: "sin δ = sin23.44°·sin90° ⇒ δ = +23.44° (انقلاب تابستانی).",
    answer: "δ = ε ≈ 23.44°",
    difficulty: "آسان",
    source: "Smart II",
    diagram: {
      kind: "ecliptic",
      epsilon: 23.44,
      lambda: 90,
      caption: "استوا · دایرةالبروج ε=۲۳.۴۴° · خورشید در λ=۹۰°",
    },
  },
  {
    id: "p12",
    lessonId: "four-parts",
    title: "کاربرد فرمول چهار جزء",
    prompt:
      "در مثلث قائم C=90° با a=30°, B=50°، ضلع c را از روابط قائم بیابید (tan a = cos B tan c).",
    hint: "از فرمول چهار جزء / ناپیر قائم: tan a = cos B · tan c ⇒ tan c = tan a / cos B.",
    solution:
      "tan c = tan30°/cos50° ≈ 0.57735/0.64279 ≈ 0.898 ⇒ c ≈ 41.94°.",
    answer: "c ≈ 41.9°",
    difficulty: "المپیاد",
    source: "Smart I right-angled",
    diagram: {
      kind: "triangle-right",
      a: 30,
      B: 50,
      caption: "قائم‌الزاویه در C · a=۳۰° · B=۵۰° · c≈۴۱.۹°",
    },
  },
];
