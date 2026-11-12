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
  diagram: "distance" | "triangle" | "pzx" | "excess" | "circles";
  values?: Record<string, number>;
};

export const PROBLEMS: Problem[] = [
  {
    id: "p1",
    lessonId: "great-circles",
    title: "عظیمه در برابر صغیره",
    prompt:
      "مدار میل δ=+40° چه نوع دایره‌ای است و شعاع زاویه‌ای‌اش از قطب شمال سماوی چند درجه است؟",
    hint: "فاصله از قطب = ۹۰°−δ.",
    solution:
      "دایرهٔ صغیره (صفحه موازی استوا، نه گذرنده از مرکز سماوی در تصویر جهات). شعاع زاویه‌ای از قطب = ۵۰°.",
    answer: "صغیره · ۵۰°",
    difficulty: "آسان",
    source: "هندسه کروی المپیاد",
    diagram: "circles",
  },
  {
    id: "p2",
    lessonId: "spherical-area",
    title: "زیادی و مساحت",
    prompt: "مثلث با زوایای 72°, 80°, 95°. E و مساحت روی کرهٔ واحد؟",
    hint: "E = A+B+C−180° ؛ Area = E (rad).",
    solution:
      "E = 72+80+95−180 = 67°. Area = 67·π/180 ≈ 1.169 sr. (Girard)",
    answer: "E=67° · Area≈1.169 sr",
    difficulty: "متوسط",
    source: "Girard · Smart I",
    diagram: "excess",
    values: { A: 72, B: 80, C: 95 },
  },
  {
    id: "p3",
    lessonId: "cosine-sides",
    title: "فاصلهٔ دو ستاره",
    prompt:
      "ستارگان (α=5.0ʰ, δ=−8°) و (α=5.6ʰ, δ=+7°). فاصلهٔ زاویه‌ای d را بیابید.",
    hint: "cos d = sinδ₁sinδ₂ + cosδ₁cosδ₂ cosΔα ، Δα=0.6ʰ=9°.",
    solution:
      "Δα=9°. cos d = sin(−8)sin7 + cos(−8)cos7 cos9 ≈ 0.960 ⇒ d ≈ 16.26°.",
    answer: "d ≈ 16.3°",
    difficulty: "متوسط",
    source: "Smart I.3",
    diagram: "distance",
    values: { d1: -8, d2: 7, da: 9 },
  },
  {
    id: "p4",
    lessonId: "sine-law",
    title: "قانون سینوس‌ها",
    prompt: "a=50°, A=120°, b=40°. زاویهٔ B را بیابید (ربع درست).",
    hint: "sin B = sin b · sin A / sin a",
    solution:
      "sin B = sin40 sin120 / sin50 ≈ 0.7266 ⇒ B ≈ 46.6° (نه 133.4°؛ با قانون کسینوس‌ها برای اضلاع/زوایا ربع تأیید می‌شود).",
    answer: "B ≈ 46.6°",
    difficulty: "المپیاد",
    source: "Smart I.4",
    diagram: "triangle",
    values: { a: 50, b: 40, C: 120 },
  },
  {
    id: "p5",
    lessonId: "coord-transform",
    title: "ارتفاع از مثلث PZX",
    prompt: "φ=35°, δ=+20°, H=30°. ارتفاع a را حساب کنید.",
    hint: "sin a = sinδ sinφ + cosδ cosφ cos H",
    solution:
      "sin a = sin20 sin35 + cos20 cos35 cos30 ≈ 0.8649 ⇒ a ≈ 59.9°.",
    answer: "a ≈ 59.9°",
    difficulty: "المپیاد",
    source: "Smart II · المپیاد",
    diagram: "pzx",
    values: {},
  },
  {
    id: "p6",
    lessonId: "rising-setting",
    title: "ساعت زاویهٔ طلوع",
    prompt: "φ=40°N, δ=+15°. H₀ در طلوع/غروب؟ مدت بالای افق؟",
    hint: "cos H₀ = −tanφ tanδ",
    solution:
      "cos H₀ = −tan40 tan15 ≈ −0.224 ⇒ H₀ ≈ 103.0°. مدت ≈ 2H₀ ≈ 13.73ʰ.",
    answer: "H₀≈103° · ≈13.7ʰ",
    difficulty: "المپیاد",
    source: "المپیاد نجوم",
    diagram: "pzx",
  },
  {
    id: "p7",
    lessonId: "spherical-triangle",
    title: "اضلاع مثلث نجومی",
    prompt: "φ=40°N, δ=+10°. اضلاع PZ و PX؟",
    hint: "PZ=90°−φ ، PX=90°−δ",
    solution: "PZ=50°, PX=80°.",
    answer: "PZ=50° · PX=80°",
    difficulty: "آسان",
    source: "Smart II",
    diagram: "pzx",
  },
  {
    id: "p8",
    lessonId: "cosine-angles",
    title: "قانون کسینوس زوایا",
    prompt: "صورت قطبی برای زاویهٔ C را بنویسید.",
    hint: "مثلث قطبی: a′=180°−A",
    solution: "cos C = −cos A cos B + sin A sin B cos c",
    answer: "cos C = −cos A cos B + sin A sin B cos c",
    difficulty: "متوسط",
    source: "Smart I.3 polar",
    diagram: "triangle",
  },
  {
    id: "p9",
    lessonId: "spherical-area",
    title: "L'Huilier",
    prompt: "برای a=b=c=60°، E را از L'Huilier تقریب بزنید.",
    hint: "s=90°, tan(E/4)=√[tan45° tan30°³]",
    solution:
      "s=90°. tan(E/4)=√(1·(1/√3)³)=√(1/(3√3))≈0.439 ⇒ E/4≈23.7° ⇒ E≈94.8° (مثلث متساوی‌الاضلاع بزرگ).",
    answer: "E ≈ 90°…95° (محاسبه ≈94.8°)",
    difficulty: "المپیاد",
    source: "L'Huilier",
    diagram: "excess",
    values: { A: 90, B: 90, C: 90 },
  },
  {
    id: "p10",
    lessonId: "time",
    title: "LST",
    prompt: "GMST=9.2ʰ ، λ=51°E. LST؟",
    hint: "LST = GMST + λ/15",
    solution: "51/15=3.4 ⇒ LST=12.6ʰ",
    answer: "12.6ʰ",
    difficulty: "آسان",
    source: "Smart VI",
    diagram: "circles",
  },
  {
    id: "p11",
    lessonId: "ecliptic",
    title: "میل خورشید",
    prompt: "در λ=90° (انقلاب)، با ε=23.44° میل خورشید؟",
    hint: "sin δ = sin ε sin λ",
    solution: "sin δ = sin23.44 sin90 ⇒ δ = 23.44°",
    answer: "δ = ε ≈ 23.44°",
    difficulty: "آسان",
    source: "Smart II",
    diagram: "circles",
  },
  {
    id: "p12",
    lessonId: "four-parts",
    title: "کاربرد فرمول چهار جزء",
    prompt:
      "در مثلث قائم C=90° با a=30°, B=50°، ضلع c را از روابط قائم بیابید (tan a = cos B tan c).",
    hint: "tan c = tan a / cos B",
    solution: "tan c = tan30/cos50 ≈ 0.577/0.643 ≈ 0.898 ⇒ c ≈ 41.9°",
    answer: "c ≈ 41.9°",
    difficulty: "المپیاد",
    source: "Smart I right-angled",
    diagram: "triangle",
    values: { a: 30, b: 40, C: 90 },
  },
];
