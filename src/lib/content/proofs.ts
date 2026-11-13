export type ProofKind =
  | "cosine"
  | "sine"
  | "analogue"
  | "four-parts"
  | "polar"
  | "napier"
  | "haversine"
  | "pzx"
  | "girard"
  | "delambre"
  | "sidereal";

export type ProofStep = {
  titleFa: string;
  titleEn: string;
  bodyFa: string;
  bodyEn: string;
  formula: string;
};

export type ProofDef = {
  kind: ProofKind;
  titleFa: string;
  titleEn: string;
  source: string;
  figure: string;
  lessonId: string;
  steps: ProofStep[];
};

export const PROOFS: ProofDef[] = [
  {
    kind: "cosine",
    titleFa: "فرمول کسینوس (A)",
    titleEn: "The cosine-formula (A)",
    source: "Smart I §5, Fig. 3, pp. 6–8",
    figure: "fig3",
    lessonId: "cosine-sides",
    steps: [
      {
        titleFa: "۱. مماس‌ها در A",
        titleEn: "1. Tangents at A",
        bodyFa:
          "از A مماس بر AB تا D روی امتداد OB، و مماس بر AC تا E روی امتداد OC. OA بر صفحهٔ مماس عمود است، پس ∠DAE = زاویهٔ کروی A.",
        bodyEn:
          "Tangents at A to AB and AC meet OB and OC produced at D and E. OA ⊥ tangent plane, so ∠DAE = A.",
        formula: "AD = OA tan c,   AE = OA tan b,   OD = OA sec c,   OE = OA sec b",
      },
      {
        titleFa: "۲. DE² در مثلث DAE",
        titleEn: "2. DE² in plane triangle DAE",
        bodyFa: "قانون کسینوس مسطح با زاویهٔ A.",
        bodyEn: "Plane cosine law in DAE.",
        formula: "DE² = OA² [tan²c + tan²b − 2 tan b tan c cos A]",
      },
      {
        titleFa: "۳. DE² در مثلث DOE",
        titleEn: "3. DE² in DOE",
        bodyFa: "زاویهٔ DOE = a. با sec² = 1 + tan² دو عبارت برابر می‌شوند.",
        bodyEn: "Angle DOE = a. Equate the two DE² using sec² = 1 + tan².",
        formula: "DE² = OA² [sec²c + sec²b − 2 sec b sec c cos a]",
      },
      {
        titleFa: "۴. صورت (A)",
        titleEn: "4. Formula (A)",
        bodyFa: "پس از ساده‌سازی، فرمول بنیادی اسمارت.",
        bodyEn: "Simplification yields Smart’s fundamental formula.",
        formula: "cos a = cos b cos c + sin b sin c cos A     (A)",
      },
      {
        titleFa: "۵. همراهان و نیم‌زاویه",
        titleEn: "5. Companions and half-angles",
        bodyFa: "دو گردش (۷)(۸). اگر سه ضلع معلوم باشند (۹) یا پایدارتر (۱۱)–(۱۳) با ۲s = a+b+c.",
        bodyEn: "Cyclic (7)(8). Three sides: (9) or half-angles (11)–(13) with 2s = a+b+c.",
        formula: "sin(A/2) = √[sin(s−b) sin(s−c) / (sin b sin c)]     (11)",
      },
    ],
  },
  {
    kind: "sine",
    titleFa: "فرمول سینوس (B)",
    titleEn: "The sine-formula (B)",
    source: "Smart I §6, pp. 9–10",
    figure: "fig5",
    lessonId: "sine-law",
    steps: [
      {
        titleFa: "۱. از (A) کسینوس را جدا کنید",
        titleEn: "1. Isolate the cosine from (A)",
        bodyFa: "sin b sin c cos A = cos a − cos b cos c.",
        bodyEn: "sin b sin c cos A = cos a − cos b cos c.",
        formula: "sin b sin c cos A = cos a − cos b cos c",
      },
      {
        titleFa: "۲. مربع و جایگزینی ۱−cos²",
        titleEn: "2. Square and replace 1 − cos²",
        bodyFa: "چندجمله‌ای متقارن سه ضلع پدید می‌آید.",
        bodyEn: "A symmetric polynomial in the three sides appears.",
        formula: "sin²b sin²c sin²A = 1 − cos²a − cos²b − cos²c + 2 cos a cos b cos c",
      },
      {
        titleFa: "۳. کمیت مثبت X",
        titleEn: "3. Positive quantity X",
        bodyFa: "X چنان است که X² sin²a sin²c برابر همان چندجمله‌ای باشد. پس sin A / sin a = ±X.",
        bodyEn: "Define X so that X² sin²a sin²c equals that polynomial. Then sin A / sin a = ±X.",
        formula: "X = sin A / sin a",
      },
      {
        titleFa: "۴. حذف علامت منفی",
        titleEn: "4. Drop the minus sign",
        bodyFa: "اضلاع و زوایا میان ۰° و ۱۸۰°اند؛ سینوس‌ها مثبت‌اند.",
        bodyEn: "Sides and angles lie in (0°, 180°); sines are positive.",
        formula: "sin a / sin A = sin b / sin B = sin c / sin C     (B)",
      },
      {
        titleFa: "۵. ابهام SSA",
        titleEn: "5. SSA ambiguity",
        bodyFa: "از (B) فقط sin A معلوم است: A یا ۱۸۰°−A. بدون قرینهٔ دیگر نمی‌توان شاخه را برگزید.",
        bodyEn: "(B) yields sin A, hence A or 180°−A, as in plane SSA.",
        formula: "sin A = sin a sin B / sin b",
      },
    ],
  },
  {
    kind: "analogue",
    titleFa: "فرمول مشابه (C)",
    titleEn: "The analogue formula (C)",
    source: "Smart I §7, Fig. 4, pp. 10–11",
    figure: "fig4",
    lessonId: "analogue-c",
    steps: [
      {
        titleFa: "۱. بازنویسی (۷)",
        titleEn: "1. Rewrite (7)",
        bodyFa: "sin c sin a cos B = cos b − cos c cos a.",
        bodyEn: "sin c sin a cos B = cos b − cos c cos a.",
        formula: "sin a cos B = (cos b − cos c cos a)/sin c",
      },
      {
        titleFa: "۲. جایگزینی (A) برای cos a",
        titleEn: "2. Substitute (A) for cos a",
        bodyFa: "پس از تقسیم بر sin c صورت (C) ظاهر می‌شود.",
        bodyEn: "Division by sin c produces (C).",
        formula: "sin a cos B = cos b sin c − sin b cos c cos A     (C)",
      },
      {
        titleFa: "۳. ساخت شکل ۴",
        titleEn: "3. Fig. 4 construction",
        bodyFa: "BA را تا D ادامه دهید با BD = 90°. آن‌گاه AD = 90°−c و CÂD = 180°−A.",
        bodyEn: "Produce BA to D with BD = 90°. Then AD = 90°−c and CÂD = 180°−A.",
        formula: "AD = 90° − c,   CÂD = 180° − A",
      },
      {
        titleFa: "۴. حذف کمان x = CD",
        titleEn: "4. Eliminate x = CD",
        bodyFa: "(A) در CAD و در BCD دو عبارت برای cos x می‌دهد.",
        bodyEn: "(A) in CAD and in BCD gives two expressions for cos x.",
        formula: "cos x = sin c cos b − cos c sin b cos A = sin a cos B",
      },
    ],
  },
  {
    kind: "four-parts",
    titleFa: "فرمول چهار جزء (D)",
    titleEn: "The four-parts formula (D)",
    source: "Smart I §8, Fig. 5, p. 12",
    figure: "fig5",
    lessonId: "four-parts",
    steps: [
      {
        titleFa: "۱. زنجیرهٔ B, a, C, b",
        titleEn: "1. Consecutive parts B, a, C, b",
        bodyFa: "C زاویهٔ داخلی، a ضلع داخلی.",
        bodyEn: "C is the inner angle, a the inner side.",
        formula: "inner angle C, inner side a",
      },
      {
        titleFa: "۲. دو صورت (A)",
        titleEn: "2. Two copies of (A)",
        bodyFa: "cos b و cos c را بنویسید و cos c را در اولی بگذارید.",
        bodyEn: "Write (A) for cos b and cos c; substitute the latter into the former.",
        formula: "cos b = cos a cos c + sin a sin c cos B",
      },
      {
        titleFa: "۳. تقسیم و (B)",
        titleEn: "3. Divide and use (B)",
        bodyFa: "بر sin a sin b تقسیم کنید؛ sin c / sin b = sin C / sin B.",
        bodyEn: "Divide by sin a sin b and replace the sine ratio by (B).",
        formula: "cos a cos C = sin a cot b − sin C cot B     (D)",
      },
      {
        titleFa: "۴. قاعدهٔ حافظه",
        titleEn: "4. Memory rule",
        bodyFa: "کسینوس داخلی‌ها = سینوس ضلع داخلی × کتانژانت ضلع دیگر − سینوس زاویهٔ داخلی × کتانژانت زاویهٔ دیگر.",
        bodyEn:
          "cos(inner side)·cos(inner angle) = sin(inner side)·cot(other side) − sin(inner angle)·cot(other angle).",
        formula: "Smart’s memory aid, p. 12",
      },
    ],
  },
  {
    kind: "polar",
    titleFa: "مثلث قطبی",
    titleEn: "The polar triangle",
    source: "Smart I §11, Fig. 8, pp. 15–16",
    figure: "fig8",
    lessonId: "cosine-angles",
    steps: [
      {
        titleFa: "۱. قطب‌های اضلاع",
        titleEn: "1. Poles of the sides",
        bodyFa: "A′ قطب BC در نیم‌کرهٔ A است؛ به‌همین‌سان B′ و C′.",
        bodyEn: "A′ is the pole of BC in A’s hemisphere; similarly B′, C′.",
        formula: "A′ = pole of BC",
      },
      {
        titleFa: "۲. اضلاع و زوایای قطبی",
        titleEn: "2. Polar parts",
        bodyFa: "کمان میان قطب‌های دو ضلع متمم زاویهٔ مشمول است.",
        bodyEn: "The arc joining the poles of two sides is the supplement of the included angle.",
        formula: "a′ = 180° − A,   A′ = 180° − a",
      },
      {
        titleFa: "۳. اعمال (A) بر قطبی",
        titleEn: "3. Apply (A) to the polar",
        bodyFa: "جایگزینی متمم‌ها کسینوس زوایای اصلی را می‌دهد.",
        bodyEn: "Substituting the supplements yields the polar cosine-formula.",
        formula: "cos A = −cos B cos C + sin B sin C cos a",
      },
      {
        titleFa: "۴. انتقال همهٔ فرمول‌ها",
        titleEn: "4. Transfer the set",
        bodyFa: "در (A)–(D) هر زاویه را با ۱۸۰°−ضلع روبه‌رو عوض کنید.",
        bodyEn: "Replace each angle by 180° minus the opposite side throughout (A)–(D).",
        formula: "A ↔ 180° − a  (cyclic)",
      },
    ],
  },
  {
    kind: "napier",
    titleFa: "قواعد نپر",
    titleEn: "Napier’s rules",
    source: "Smart I §10, Fig. 7, pp. 14–15",
    figure: "fig7",
    lessonId: "right-angled",
    steps: [
      {
        titleFa: "۱. قائم در C",
        titleEn: "1. Right-angled at C",
        bodyFa: "(A) می‌شود cos c = cos a cos b. (B) می‌شود sin a = sin A sin c.",
        bodyEn: "(A) becomes cos c = cos a cos b. (B) becomes sin a = sin A sin c.",
        formula: "cos c = cos a cos b     (C = 90°)",
      },
      {
        titleFa: "۲. پنج جزء دایره‌ای",
        titleEn: "2. Five circular parts",
        bodyFa: "داخل دایره: a, b, 90°−A, 90°−c, 90°−B.",
        bodyEn: "Inside the circle: a, b, 90°−A, 90°−c, 90°−B.",
        formula: "Fig. 7",
      },
      {
        titleFa: "۳. دو قاعده",
        titleEn: "3. Two rules",
        bodyFa: "سینوس میانه = حاصل تانژانت مجاورها = حاصل کسینوس مقابل‌ها.",
        bodyEn: "sin(middle) = tan adj · tan adj = cos opp · cos opp.",
        formula: "sin(middle) = Π tan(adjacents) = Π cos(opposites)",
      },
      {
        titleFa: "۴. مثلث ربعی",
        titleEn: "4. Quadrantal triangle",
        bodyFa: "اگر c = 90° همان پنج جزء بیرون دایره‌اند. اسمارت ترجیح می‌دهد (A)–(D) را مستقیماً خاص کنید.",
        bodyEn: "If c = 90° the same five parts sit outside the circle. Smart prefers specialising (A)–(D).",
        formula: "c = 90°:  cos C = −cos A cos B",
      },
    ],
  },
  {
    kind: "haversine",
    titleFa: "هاورساین",
    titleEn: "The haversine formula",
    source: "Smart I §13, formulae (21)–(23), pp. 18–19",
    figure: "fig9",
    lessonId: "haversine-example",
    steps: [
      {
        titleFa: "۱. تعریف",
        titleEn: "1. Definition",
        bodyFa: "hav θ = (1 − cos θ)/2 = sin²(θ/2). روی ۰°…۱۸۰° نامنفی است.",
        bodyEn: "hav θ = (1 − cos θ)/2 = sin²(θ/2), non-negative on 0°–180°.",
        formula: "hav θ = ½(1 − cos θ) = sin²(θ/2)     (21)",
      },
      {
        titleFa: "۲. معکوس",
        titleEn: "2. Inverse",
        bodyFa: "cos θ = 1 − 2 hav θ.",
        bodyEn: "cos θ = 1 − 2 hav θ.",
        formula: "cos θ = 1 − 2 hav θ     (22)",
      },
      {
        titleFa: "۳. جایگزینی در (A)",
        titleEn: "3. Substitute in (A)",
        bodyFa: "۱ − ۲ hav a = cos(b−c) − ۲ sin b sin c hav A، سپس hav(b−c) ظاهر می‌شود.",
        bodyEn: "1 − 2 hav a = cos(b−c) − 2 sin b sin c hav A, hence the haversine form.",
        formula: "hav a = hav(b − c) + sin b sin c hav A     (23)",
      },
      {
        titleFa: "۴. بازآزمایی بند ۱۲",
        titleEn: "4. Check of §12",
        bodyFa: "با جداول Inman همان AB = ۸۳°۴۹′ به‌دست می‌آید.",
        bodyEn: "Inman’s tables recover AB = 83°49′, matching formula (A).",
        formula: "hav AB = hav(PA−PB) + sin PA sin PB hav APB",
      },
    ],
  },
  {
    kind: "pzx",
    titleFa: "مثلث نجومی PZX",
    titleEn: "Astronomical triangle PZX",
    source: "Smart II §23, Fig. 17, formulae (3)–(7)",
    figure: "fig17",
    lessonId: "coord-transform",
    steps: [
      {
        titleFa: "۱. اضلاع",
        titleEn: "1. The sides",
        bodyFa: "PZ = 90°−φ، PX = 90°−δ، ZX = z. زاویه در P برابر H (غرب نصف‌النهار).",
        bodyEn: "PZ = 90°−φ, PX = 90°−δ, ZX = z. Angle at P is H west of the meridian.",
        formula: "PZ = 90°−φ,   PX = 90°−δ,   ZX = z",
      },
      {
        titleFa: "۲. اعمال (A) بر ZX",
        titleEn: "2. Apply (A) to ZX",
        bodyFa: "دو ضلع PZ, PX و زاویهٔ مشمول H.",
        bodyEn: "Two sides PZ, PX and included angle H.",
        formula: "cos z = sin φ sin δ + cos φ cos δ cos H     (3)",
      },
      {
        titleFa: "۳. صورت هاورساین",
        titleEn: "3. Haversine form",
        bodyFa: "پایدار برای کار لگاریتمی.",
        bodyEn: "Stable for logarithmic work.",
        formula: "hav z = hav(φ−δ) + cos φ cos δ hav H     (4)",
      },
      {
        titleFa: "۴. میل و سمت",
        titleEn: "4. Declination and azimuth",
        bodyFa: "(A) روی PX، δ را از z و A می‌دهد. معکوس آن سمت است.",
        bodyEn: "(A) on PX yields δ from z and A, or azimuth conversely.",
        formula: "sin δ = sin φ cos z + cos φ sin z cos A     (5)",
      },
      {
        titleFa: "۵. زاویهٔ ساعتی",
        titleEn: "5. Hour angle",
        bodyFa: "از (۳) حل برای H.",
        bodyEn: "Solve (3) for H.",
        formula: "cos H = cos z sec φ sec δ − tan φ tan δ     (7)",
      },
    ],
  },
  {
    kind: "girard",
    titleFa: "مساحت — ژیرار",
    titleEn: "Area — Girard",
    source: "Olympiad supplement (not a numbered Smart I section)",
    figure: "fig-lune",
    lessonId: "spherical-area",
    steps: [
      {
        titleFa: "۱. مساحت هلال",
        titleEn: "1. Area of a lune",
        bodyFa: "هلال زاویهٔ A روی کرهٔ واحد مساحت ۲A دارد.",
        bodyEn: "A lune of angle A has area 2A on the unit sphere.",
        formula: "Area(lune A) = 2A",
      },
      {
        titleFa: "۲. سه هلال",
        titleEn: "2. Three lunes",
        bodyFa: "مجموع ۲(A+B+C) کره را با شمارش اضافهٔ مثلث و پادمثلث می‌پوشاند.",
        bodyEn: "2(A+B+C) covers the sphere, counting the triangle and antipode extra.",
        formula: "2(A+B+C) = 2π + 2E",
      },
      {
        titleFa: "۳. قضیه",
        titleEn: "3. The theorem",
        bodyFa: "مساحت = زیادی کروی.",
        bodyEn: "Area equals spherical excess.",
        formula: "Area = E = A+B+C−π",
      },
      {
        titleFa: "۴. لاهوئیلیه",
        titleEn: "4. L’Huilier",
        bodyFa: "اگر فقط اضلاع معلوم باشند.",
        bodyEn: "When only the sides are known.",
        formula: "tan(E/4) = √[tan(s/2) tan((s−a)/2) tan((s−b)/2) tan((s−c)/2)]",
      },
    ],
  },
  {
    kind: "delambre",
    titleFa: "دلامبر و قیاسی‌های نپر",
    titleEn: "Delambre and Napier’s analogies",
    source: "Smart I §16, (45)–(52), pp. 22–23",
    figure: "fig7",
    lessonId: "delambre-napier",
    steps: [
      {
        titleFa: "۱. چهار اتحاد دلامبر",
        titleEn: "1. Delambre’s four formulae",
        bodyFa: "از فرمول‌های اصلی با جمع و تفریق نیم‌زاویه‌ها.",
        bodyEn: "From the principal formulae by sum-to-product on half-angles.",
        formula: "sin(c/2) sin((A−B)/2) = cos(C/2) sin((a−b)/2)     (45)",
      },
      {
        titleFa: "۲. جفت‌کردن",
        titleEn: "2. Take them in pairs",
        bodyFa: "نسبت دو اتحاد دلامبر قیاسی نپر را می‌سازد.",
        bodyEn: "The ratio of two Delambre formulae is a Napier analogy.",
        formula: "tan ½(a+b) = [cos ½(A−B)/cos ½(A+B)] tan ½c     (49)",
      },
      {
        titleFa: "۳. کاربرد",
        titleEn: "3. Use",
        bodyFa: "دو ضلع و زاویهٔ مشمول، یا دو زاویه و ضلع مشمول — پایدارتر از (A) تنها.",
        bodyEn: "Two sides and included angle, or two angles and included side — stabler than (A) alone.",
        formula: "(49)–(52)",
      },
    ],
  },
  {
    kind: "sidereal",
    titleFa: "زمان نجومی",
    titleEn: "Sidereal time",
    source: "Smart II §§24, 27, Figs. 18, 22, (8)(9)(13)(14)",
    figure: "fig18",
    lessonId: "celestial-sphere",
    steps: [
      {
        titleFa: "۱. بعد از ♈",
        titleEn: "1. RA from ♈",
        bodyFa: "α کمان استوایی از نقطهٔ حمل به شرق تا دایرهٔ ساعتی ستاره است، ۰ʰ…۲۴ʰ.",
        bodyEn: "α is the equatorial arc from ♈ eastwards to the star’s hour circle, 0ʰ–24ʰ.",
        formula: "α eastwards from ♈",
      },
      {
        titleFa: "۲. جمع کمان‌ها",
        titleEn: "2. Add the arcs",
        bodyFa: "H به غرب از نصف‌النهار؛ α به شرق از ♈. مجموع = زاویهٔ ساعتی ♈ = زمان نجومی.",
        bodyEn: "H west from the meridian, α east from ♈. Sum = H.A. of ♈ = sidereal time.",
        formula: "S.T. = H + α     (9)",
      },
      {
        titleFa: "۳. طول جغرافیایی",
        titleEn: "3. Longitude",
        bodyFa: "H در گرینویچ = H در l + طول غربی l (به زمان).",
        bodyEn: "H at Greenwich = H at l + west longitude of l in time measure.",
        formula: "GST = LST ± long     (14)",
      },
    ],
  },
];

export function getProof(kind: string): ProofDef {
  return PROOFS.find((p) => p.kind === kind) ?? PROOFS[0];
}
