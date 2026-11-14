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

// Each step states what is known, the operation, and why it is valid.
export const PROOFS: ProofDef[] = [
  {
    kind: "cosine",
    titleFa: "قانون کسینوس اضلاع",
    titleEn: "Cosine law for sides",
    source: "Smart I §5; vector derivation of (A)",
    figure: "fig3",
    lessonId: "cosine-sides",
    steps: [
      {
        titleFa: "فرض و نمادگذاری",
        titleEn: "Assumptions and notation",
        bodyFa:
          "مثلث محدب و غیرمنحط است؛ a روبه‌روی A است. بردارهای مکان را واحد می‌گیریم. زاویهٔ رأس با طول ضلع تفاوت دارد.",
        bodyEn:
          "Take a nondegenerate convex triangle of minor great-circle arcs. Side a is opposite vertex A. Unit position vectors have dot product equal to the cosine of their separation.",
        formula: "0<a,b,c<\\pi,\\quad \\mathbf u\\cdot\\mathbf v=\\cos c",
      },
      {
        titleFa: "دو جهت مماس",
        titleEn: "Resolve along the radius and tangent plane",
        bodyFa:
          "در A بردارهای مماس واحد به سوی B و C را t و q می‌نامیم. مؤلفهٔ شعاعی B برابر cos c و طول مؤلفهٔ مماسی آن sin c است؛ برای C نیز همین است.",
        bodyEn:
          "At A let t and q be unit tangents toward B and C. Orthogonal resolution gives a radial component cos c and tangent component sin c for B, and similarly for C.",
        formula:
          "\\mathbf v=\\cos c\\,\\mathbf u+\\sin c\\,\\mathbf t,\\quad \\mathbf w=\\cos b\\,\\mathbf u+\\sin b\\,\\mathbf q",
      },
      {
        titleFa: "تعریف زاویه در رأس",
        titleEn: "Use the angle between tangents",
        bodyFa:
          "هر دو مماس بر شعاع A عمودند و زاویهٔ میانشان دقیقاً A است. پس ضرب‌های شعاع و مماس صفر می‌شوند.",
        bodyEn:
          "Both tangents are perpendicular to u and enclose the interior angle A. Thus mixed radial–tangent products vanish.",
        formula:
          "\\mathbf u\\cdot\\mathbf t=\\mathbf u\\cdot\\mathbf q=0,\\quad \\mathbf t\\cdot\\mathbf q=\\cos A",
      },
      {
        titleFa: "بسط ضرب داخلی",
        titleEn: "Expand the dot product",
        bodyFa:
          "ضرب داخلی B و C را از تجزیه‌های قبل بسط می‌دهیم. فاصلهٔ مرکزی B تا C همان a است. این استدلال برای اضلاع منفرجه هم معتبر است و محدودیت ساخت مماس را ندارد.",
        bodyEn:
          "Expand v·w using the preceding orthogonality. The angle between v and w is a. This derivation also covers obtuse sides without the tangent-intersection construction’s restrictions.",
        formula: "\\boxed{\\cos a=\\cos b\\cos c+\\sin b\\sin c\\cos A}",
      },
      {
        titleFa: "نتیجه و آزمون مرزی",
        titleEn: "Consequence and limiting check",
        bodyFa:
          "برای A قائم جملهٔ دوم صفر می‌شود. برای مثلث کوچک بسط کسینوس تا مرتبهٔ دوم قانون کسینوس مسطح را می‌دهد.",
        bodyEn:
          "At A = π/2 the mixed term vanishes. Expanding cosine to second order for a small triangle recovers the plane cosine law.",
        formula:
          "A=\\frac\\pi2\\Rightarrow\\cos a=\\cos b\\cos c,\\qquad a^2\\simeq b^2+c^2-2bc\\cos A",
      },
    ],
  },
  {
    kind: "sine",
    titleFa: "قانون سینوس و ابهام جواب",
    titleEn: "Sine law and the ambiguous case",
    source: "Smart I §6, formula (B)",
    figure: "fig5",
    lessonId: "sine-law",
    steps: [
      {
        titleFa: "شروع از قانون کسینوس",
        titleEn: "Start from the cosine law",
        bodyFa:
          "فرض می‌کنیم همهٔ اضلاع و زوایا بین صفر و π هستند. ابتدا cos A را جدا می‌کنیم؛ مخرج ناصفر است.",
        bodyEn:
          "Assume all sides and angles lie strictly between 0 and π. Isolate cos A; the denominator is nonzero.",
        formula: "\\cos A=\\frac{\\cos a-\\cos b\\cos c}{\\sin b\\sin c}",
      },
      {
        titleFa: "مربع سینوس",
        titleEn: "Compute the squared sine",
        bodyFa:
          "از sin² A = 1 − cos² A استفاده و مخرج را مشترک می‌کنیم؛ سپس sin² b و sin² c را باز می‌کنیم.",
        bodyEn:
          "Use sin² A = 1 − cos² A, put over a common denominator, and expand sin² b sin² c.",
        formula:
          "\\sin^2b\\sin^2c\\sin^2A=1-\\cos^2a-\\cos^2b-\\cos^2c+2\\cos a\\cos b\\cos c=:D",
      },
      {
        titleFa: "تقارن واقعی",
        titleEn: "Divide by the symmetric denominator",
        bodyFa:
          "دو طرف را بر حاصل‌ضرب مربع سینوس هر سه ضلع تقسیم می‌کنیم. طرف راست در a، b، c متقارن است؛ بنابراین جایگزینی چرخه‌ای A با B یا C مقدار را عوض نمی‌کند.",
        bodyEn:
          "Divide by sin²a sin²b sin²c. The right side is symmetric in all three sides, so the same value is obtained cyclically for B and C.",
        formula:
          "\\frac{\\sin^2 A}{\\sin^2 a}=\\frac D{\\sin^2a\\sin^2b\\sin^2c}=\\frac{\\sin^2 B}{\\sin^2 b}=\\frac{\\sin^2 C}{\\sin^2 c}",
      },
      {
        titleFa: "ریشهٔ مثبت",
        titleEn: "Take the positive square root",
        bodyFa:
          "سینوس هر جزء مثبت است؛ پس علامت منفی حذف می‌شود. معکوس نسبت‌ها صورت متداول قانون را می‌دهد.",
        bodyEn:
          "Every sine is positive on (0,π), so take positive square roots and reciprocals.",
        formula:
          "\\boxed{\\frac{\\sin a}{\\sin A}=\\frac{\\sin b}{\\sin B}=\\frac{\\sin c}{\\sin C}}",
      },
      {
        titleFa: "چرا arcsin کافی نیست؟",
        titleEn: "Why arcsin alone is insufficient",
        bodyFa:
          "سینوس زاویه و مکمل آن برابر است. هر دو نامزد را باید با قانون کسینوس و داده‌های مسئله بررسی کرد؛ وجود یک جواب را نمی‌توان پیشاپیش فرض کرد.",
        bodyEn:
          "An angle and its supplement have the same sine. Check both candidates against the cosine law and the remaining data; SSA need not determine a unique triangle.",
        formula:
          "\\sin A=k\\Rightarrow A=\\arcsin k\\ \\text{or}\\ \\pi-\\arcsin k",
      },
    ],
  },
  {
    kind: "analogue",
    titleFa: "فرمول مشابه",
    titleEn: "The analogue formula",
    source: "Smart I §7, formula (C)",
    figure: "fig4",
    lessonId: "analogue-c",
    steps: [
      {
        titleFa: "قانون کسینوس برای b",
        titleEn: "Cosine law for b",
        bodyFa:
          "قانون کسینوس را با ضلع روبه‌روی B می‌نویسیم و جملهٔ شامل cos B را جدا می‌کنیم.",
        bodyEn:
          "Write the cosine law for side b and isolate the term involving cos B.",
        formula: "\\sin a\\cos B=\\frac{\\cos b-\\cos c\\cos a}{\\sin c}",
      },
      {
        titleFa: "جانشینی روشن",
        titleEn: "Substitute explicitly",
        bodyFa:
          "در صورت، cos a را از قانون کسینوس بنیادی جایگزین می‌کنیم؛ هر جمله را پیش از ساده‌سازی نگه می‌داریم.",
        bodyEn:
          "Substitute the fundamental expression for cos a in the numerator before cancelling anything.",
        formula:
          "\\cos b-\\cos c\\cos a=\\cos b-\\cos b\\cos^2c-\\sin b\\sin c\\cos c\\cos A",
      },
      {
        titleFa: "استخراج عامل",
        titleEn: "Factor and cancel",
        bodyFa:
          "دو جملهٔ اول برابر cos b sin² c هستند. عامل sin c را استخراج و تقسیم می‌کنیم؛ این عامل در مثلث غیرمنحط مثبت است.",
        bodyEn:
          "The first two terms equal cos b sin²c. Factor out sin c and cancel it; it is positive for a nondegenerate minor-arc triangle.",
        formula: "\\boxed{\\sin a\\cos B=\\cos b\\sin c-\\sin b\\cos c\\cos A}",
      },
    ],
  },
  {
    kind: "four-parts",
    titleFa: "فرمول چهار جزء",
    titleEn: "Four-parts formula",
    source: "Smart I §8, formula (D)",
    figure: "fig5",
    lessonId: "four-parts",
    steps: [
      {
        titleFa: "انتخاب صورت مناسب",
        titleEn: "Choose the useful analogue",
        bodyFa: "صورت چرخه‌ای فرمول مشابه را طوری می‌گیریم که cos C ظاهر شود.",
        bodyEn: "Choose the cyclic analogue containing cos C.",
        formula: "\\sin b\\cos C=\\cos c\\sin a-\\sin c\\cos a\\cos B",
      },
      {
        titleFa: "حذف cos c",
        titleEn: "Eliminate cos c",
        bodyFa:
          "از قانون کسینوس برای c استفاده می‌کنیم و حاصل‌ضرب sin a را در تمام عبارت پخش می‌کنیم.",
        bodyEn: "Substitute the cosine law for c and distribute sin a.",
        formula:
          "\\sin b\\cos C=\\cos a\\sin a\\cos b+\\sin^2a\\sin b\\cos C-\\sin c\\cos a\\cos B",
      },
      {
        titleFa: "انتقال و حذف مجاز",
        titleEn: "Rearrange with a domain condition",
        bodyFa:
          "جملهٔ cos C را به چپ می‌بریم و ۱ − sin² a = cos² a را به‌کار می‌بریم. اگر cos a ناصفر باشد آن را حذف می‌کنیم. حالت a قائم با پیوستگی یا رابطهٔ قبل برقرار است.",
        bodyEn:
          "Move the cos C term left and use 1 − sin²a = cos²a. Cancel cos a when nonzero; the right-side case follows by continuity or the uncancelled identity.",
        formula: "\\sin b\\cos a\\cos C=\\sin a\\cos b-\\sin c\\cos B",
      },
      {
        titleFa: "استفاده از قانون سینوس",
        titleEn: "Use the sine law",
        bodyFa:
          "بر sin b تقسیم می‌کنیم؛ سپس sin c / sin b را با sin C / sin B عوض می‌کنیم. هر دو مخرج مثبت‌اند.",
        bodyEn:
          "Divide by sin b and use sin c / sin b = sin C / sin B, with positive denominators.",
        formula: "\\boxed{\\cos a\\cos C=\\sin a\\cot b-\\sin C\\cot B}",
      },
    ],
  },
  {
    kind: "polar",
    titleFa: "مثلث قطبی و کسینوس زوایا",
    titleEn: "Polar triangle and the angle cosine law",
    source: "Smart I §11",
    figure: "fig8",
    lessonId: "cosine-angles",
    steps: [
      {
        titleFa: "انتخاب قطب‌های درست",
        titleEn: "Choose the inward poles",
        bodyFa:
          "A′ را قطب عظیمهٔ BC در نیم‌کرهٔ A می‌گیریم و چرخه‌ای ادامه می‌دهیم. انتخاب علامت قطب ضروری است؛ قطب مقابل مثلث دیگری می‌دهد.",
        bodyEn:
          "Choose A′ as the pole of BC in the hemisphere containing A, and cyclically. Fixing the pole signs is essential.",
        formula:
          "\\mathbf u^{\\prime}=\\frac{\\mathbf v\\times\\mathbf w}{\\|\\mathbf v\\times\\mathbf w\\|}\\quad\\text{with inward sign}",
      },
      {
        titleFa: "زاویهٔ بین عمودها",
        titleEn: "Angles between plane normals",
        bodyFa:
          "عمودهای داخلی بر صفحه‌های AB و AC زاویهٔ مکمل زاویهٔ داخلی A می‌سازند. پس ضلع روبه‌روی A′ برابر π − A است. دوباره قطبی گرفتن مثلث اولیه را برمی‌گرداند.",
        bodyEn:
          "The inward normals to planes AB and AC enclose π − A. Hence the opposite polar side is π − A. Taking the polar again recovers the original triangle.",
        formula:
          "a^{\\prime}=\\pi-A,\\ b^{\\prime}=\\pi-B,\\ c^{\\prime}=\\pi-C,\\quad A^{\\prime}=\\pi-a",
      },
      {
        titleFa: "کسینوس روی قطبی",
        titleEn: "Apply the side cosine law to the polar",
        bodyFa:
          "صورت بنیادی را برای مثلث قطبی می‌نویسیم و همهٔ اجزای قطبی را یکجا جایگزین می‌کنیم.",
        bodyEn:
          "Apply the side cosine law to the polar and substitute all complemented parts.",
        formula:
          "\\cos(\\pi-A)=\\cos(\\pi-B)\\cos(\\pi-C)+\\sin(\\pi-B)\\sin(\\pi-C)\\cos(\\pi-a)",
      },
      {
        titleFa: "کنترل علامت‌ها",
        titleEn: "Track the signs",
        bodyFa:
          "کسینوس مکمل منفی و سینوس مکمل مثبت است. پس از ضرب در منفی یک، فرمول زوایا به دست می‌آید.",
        bodyEn:
          "Cosines change sign under supplementation; sines do not. Multiply the resulting identity by −1.",
        formula: "\\boxed{\\cos A=-\\cos B\\cos C+\\sin B\\sin C\\cos a}",
      },
    ],
  },
  {
    kind: "napier",
    titleFa: "مثلث قائم و قواعد نپر",
    titleEn: "Right triangles and Napier’s rules",
    source: "Smart I §10; algebraic explanation",
    figure: "fig7",
    lessonId: "right-angled",
    steps: [
      {
        titleFa: "فرض قائم بودن",
        titleEn: "Fix the right angle",
        bodyFa:
          "فقط C را قائم می‌گیریم؛ c ضلع روبه‌روی آن است. قائمه بودن زاویه با ربعی بودن ضلع یکی نیست.",
        bodyEn:
          "Set angle C to π/2; side c is opposite it. A right angle and a quadrantal side are different conditions.",
        formula: "C=\\frac\\pi2,\\qquad\\cos c=\\cos a\\cos b",
      },
      {
        titleFa: "دو رابطهٔ پایه",
        titleEn: "Two base identities",
        bodyFa: "قانون سینوس چون sin C = ۱ است فوراً این دو رابطه را می‌دهد.",
        bodyEn:
          "Since sin C = 1, the sine law gives both leg identities directly.",
        formula: "\\sin a=\\sin A\\sin c,\\qquad\\sin b=\\sin B\\sin c",
      },
      {
        titleFa: "قاعدهٔ مجاورها",
        titleEn: "Derive an adjacent-parts identity",
        bodyFa:
          "از قانون کسینوس برای b و رابطهٔ cos c = cos a cos b، پس از انتقال جمله‌ها داریم cos b sin² a = sin c sin a cos B. چون sin a مثبت است، sin a cos b = sin c cos B. با sin B = sin b / sin c نتیجه می‌شود tan B = tan b / sin a؛ در صفر شدن کسینوس‌ها از صورت ضربی استفاده کنید. رابطهٔ cos A با جابه‌جایی چرخه‌ای به دست می‌آید.",
        bodyEn:
          "The cosine law for b and cos c = cos a cos b give cos b sin²a = sin c sin a cos B. Since sin a > 0, this becomes sin a cos b = sin c cos B. Combine with sin B = sin b / sin c to get tan B = tan b / sin a; retain undivided forms at vanishing cosines. The cos A identity follows cyclically.",
        formula: "\\cos A=\\sin B\\cos a,\\qquad\\tan b=\\tan B\\sin a",
      },
      {
        titleFa: "دایرهٔ پنج جزء",
        titleEn: "The five circular parts",
        bodyFa:
          "اجزا را با همین ترتیب دور دایره بچینید. برای هر جزء میانه، دو همسایه مجاور و دو جزء دیگر مقابل‌اند. نمونهٔ میانه b رابطهٔ مرحلهٔ قبل را بازگو می‌کند.",
        bodyEn:
          "Arrange these five parts in this cyclic order. For a middle part, the two neighbours are adjacent and the other two are opposite. Middle b reproduces the preceding tangent identity.",
        formula: "a,\\ b,\\ \\frac\\pi2-A,\\ \\frac\\pi2-c,\\ \\frac\\pi2-B",
      },
      {
        titleFa: "معنای دو قاعده",
        titleEn: "Interpret both rules",
        bodyFa:
          "برای میانهٔ π/۲ − c، مقابل‌ها a و b هستند و قاعدهٔ کسینوس همان قانون کسینوس قائم است. قواعد نپر ابزار یادآوری این روابط‌اند؛ در صفر شدن مخرج از صورت ضربی استفاده کنید.",
        bodyEn:
          "With middle π/2 − c the opposite parts are a and b, so the opposite-parts rule is exactly the right cosine law. Napier’s rules organise these identities; use undivided forms at singular tangents.",
        formula:
          "\\sin(\\text{middle})=\\tan(\\text{adjacent}_1)\\tan(\\text{adjacent}_2)=\\cos(\\text{opposite}_1)\\cos(\\text{opposite}_2)",
      },
    ],
  },
  {
    kind: "haversine",
    titleFa: "هاورساین بدون پرش جبری",
    titleEn: "Haversine without skipped algebra",
    source: "Smart I §§12–13, formulae (21)–(23)",
    figure: "fig9",
    lessonId: "haversine-example",
    steps: [
      {
        titleFa: "تعریف",
        titleEn: "Define the function",
        bodyFa:
          "از اتحاد نیم‌زاویه استفاده می‌کنیم؛ hav نام تابع جدیدی بر پایهٔ سینوس است، نه معکوس آن.",
        bodyEn:
          "Use the half-angle identity. The haversine is a function built from sine, not an inverse sine.",
        formula: "\\operatorname{hav}t=\\sin^2\\frac t2=\\frac{1-\\cos t}{2}",
      },
      {
        titleFa: "بازنویسی کسینوس",
        titleEn: "Rewrite the cosine law",
        bodyFa:
          "cos A را با ۱ − ۲ hav A عوض می‌کنیم و دو جملهٔ اول را به cos(b − c) تبدیل می‌کنیم.",
        bodyEn:
          "Replace cos A by 1 − 2 hav A, then combine cos b cos c + sin b sin c.",
        formula: "\\cos a=\\cos(b-c)-2\\sin b\\sin c\\operatorname{hav}A",
      },
      {
        titleFa: "کم کردن از یک",
        titleEn: "Subtract from one",
        bodyFa:
          "هر دو طرف را از ۱ کم کرده بر ۲ تقسیم می‌کنیم. هر عبارت (۱ − cos t)/۲ هاورساین t است.",
        bodyEn:
          "Subtract both sides from 1 and divide by 2. Recognise each (1 − cos t)/2 as hav t.",
        formula:
          "\\boxed{\\operatorname{hav}a=\\operatorname{hav}(b-c)+\\sin b\\sin c\\operatorname{hav}A}",
      },
      {
        titleFa: "بازیابی و دقت عددی",
        titleEn: "Recover the side and discuss accuracy",
        bodyFa:
          "در بازهٔ صفر تا π ریشهٔ مثبت و arcsin جواب یکتا می‌دهند. برای جدایی‌های کوچک، sin²(a/۲) از تفریق دو عدد نزدیک به ۱ جلوگیری می‌کند؛ نزدیک پادپا از atan2 برداری استفاده کنید.",
        bodyEn:
          "On [0,π] use the positive square root and principal arcsine. For small separations this avoids subtracting nearly equal cosines; near antipodes a vector atan2 formulation is preferable.",
        formula: "a=2\\arcsin\\sqrt{\\operatorname{hav}a}",
      },
    ],
  },
  {
    kind: "pzx",
    titleFa: "تبدیل مختصات با قرارداد روشن",
    titleEn: "Coordinate transformation with explicit conventions",
    source: "Smart II §23; north-through-east azimuth",
    figure: "fig17",
    lessonId: "coord-transform",
    steps: [
      {
        titleFa: "قراردادهای جهت و واحد",
        titleEn: "Fix directions and units",
        bodyFa:
          "φ عرض شمالی مثبت، δ میل شمالی مثبت و H زاویهٔ ساعتی به غرب مثبت است. سمت A از شمال به شرق اندازه‌گیری می‌شود. H را اگر برحسب ساعت است در ۱۵ ضرب کنید.",
        bodyEn:
          "Latitude φ and declination δ are positive north; hour angle H is positive west. Azimuth A is measured north through east. Convert H from hours to degrees by multiplying by 15.",
        formula:
          "PZ=\\frac\\pi2-\\varphi,\\quad PX=\\frac\\pi2-\\delta,\\quad ZX=z=\\frac\\pi2-h",
      },
      {
        titleFa: "کسینوس برای ضلع z",
        titleEn: "Apply the cosine law to z",
        bodyFa:
          "دو ضلع متصل به قطب و زاویهٔ شامل H را در قانون کسینوس می‌گذاریم. کسینوس متمم به سینوس تبدیل می‌شود.",
        bodyEn:
          "Insert the two polar sides and included angle H in the side cosine law, then replace cosine of a complement by sine.",
        formula:
          "\\cos z=\\sin\\varphi\\sin\\delta+\\cos\\varphi\\cos\\delta\\cos H=\\sin h",
      },
      {
        titleFa: "مؤلفه‌های افقی",
        titleEn: "Resolve the horizontal components",
        bodyFa:
          "مؤلفهٔ شرقی برای H مثبت منفی است. مؤلفهٔ شمالی از تصویر جهت ستاره روی شمال محلی به دست می‌آید. این دو مؤلفه ربع سمت را مشخص می‌کنند.",
        bodyEn:
          "The east component is negative for positive H. Projecting the star direction onto local north gives the north component. Together they fix the azimuth quadrant.",
        formula:
          "e=-\\cos\\delta\\sin H,\\qquad n=\\sin\\delta\\cos\\varphi-\\cos\\delta\\sin\\varphi\\cos H",
      },
      {
        titleFa: "حل ربع‌دار",
        titleEn: "Recover azimuth without ambiguity",
        bodyFa:
          "ارتفاع از مؤلفهٔ قائم و سمت از atan2 به دست می‌آیند. در سمت‌الرأس یا سمت‌القدم هر دو مؤلفهٔ افقی صفرند و سمت تعریف ندارد.",
        bodyEn:
          "Recover altitude from the up component and azimuth from atan2. At zenith or nadir both horizontal components vanish and azimuth is undefined.",
        formula:
          "h=\\arcsin(\\cos z),\\qquad A=\\operatorname{atan2}(e,n)\\pmod{2\\pi}",
      },
      {
        titleFa: "تبدیل معکوس",
        titleEn: "Invert the rotation",
        bodyFa:
          "برای معکوس، جهت افقی را روی محور قطب تصویر می‌کنیم. برای بازیابی H هر دو مؤلفهٔ سینوسی و کسینوسی لازم‌اند.",
        bodyEn:
          "For the inverse, project the horizontal direction onto the polar axis. Recover H using both sine and cosine components.",
        formula:
          "\\sin\\delta=\\sin\\varphi\\sin h+\\cos\\varphi\\cos h\\cos A",
      },
      {
        titleFa: "آزمون قابل فهم",
        titleEn: "Physical check",
        bodyFa:
          "در عبور بالایی H صفر است و فاصلهٔ سمت‌الرأسی قدرمطلق φ − δ می‌شود. این آزمون، علامت و واحد را پیش از محاسبات پیچیده کنترل می‌کند.",
        bodyEn:
          "At upper culmination H = 0, hence zenith distance is |φ − δ|. This checks signs and units before more complicated calculations.",
        formula: "H=0\\Rightarrow z=|\\varphi-\\delta|",
      },
    ],
  },
  {
    kind: "girard",
    titleFa: "اثبات مساحت با شمارش دقیق",
    titleEn: "Area by explicit lune counting",
    source: "Olympiad supplement; not a numbered Smart I section",
    figure: "fig-lune",
    lessonId: "spherical-area",
    steps: [
      {
        titleFa: "مساحت هلال",
        titleEn: "Area of a lune",
        bodyFa:
          "زاویه‌ها رادیانی‌اند. هلال با زاویهٔ A سهم A/(۲π) از سطح ۴πR² دارد؛ پس مساحت آن ۲AR² است.",
        bodyEn:
          "Angles are in radians. A lune of angle A occupies A/(2π) of a sphere of area 4πR², hence has area 2AR².",
        formula: "L_A=\\frac A{2\\pi}\\,4\\pi R^2=2AR^2",
      },
      {
        titleFa: "تقسیم کره به هشت ناحیه",
        titleEn: "Partition the sphere into eight regions",
        bodyFa:
          "سه عظیمهٔ اضلاع، کره را به چهار جفت ناحیهٔ پادپا تقسیم می‌کنند. مساحت مثلث T و مساحت سه ناحیهٔ دیگر در یک نماینده از هر جفت را U، V، W بنامید. تقارن پادپایی مساحت نیم کره را می‌دهد.",
        bodyEn:
          "The three side great circles partition the sphere into four antipodal pairs. Let T be the triangle area and U,V,W one region from each remaining pair. Antipodal symmetry gives their total as a hemisphere.",
        formula: "T+U+V+W=2\\pi R^2",
      },
      {
        titleFa: "شمارش سه هلال",
        titleEn: "Count the three selected lunes",
        bodyFa:
          "هلال‌های داخلی در سه رأس به‌ترتیب شامل T با یکی از نواحی U، V، W هستند؛ ممکن است نمایندهٔ پادپای همان ناحیه باشد که مساحت برابر دارد. بنابراین T سه بار و هر ناحیهٔ دیگر یک بار شمرده می‌شود.",
        bodyEn:
          "Each interior-angle lune consists of T plus one of U,V,W, possibly represented by its equal-area antipode. Thus T is counted three times and every other region once.",
        formula: "L_A+L_B+L_C=3T+U+V+W=2\\pi R^2+2T",
      },
      {
        titleFa: "حل برای مساحت",
        titleEn: "Solve for the area",
        bodyFa:
          "مساحت هلال‌ها را جایگزین و ۲T را جدا می‌کنیم. این شمارش، جملهٔ اضافی را توضیح می‌دهد؛ فقط ادعای پوشاندن کل کره کافی نیست.",
        bodyEn:
          "Substitute the lune areas and isolate T. The explicit region count explains the excess term.",
        formula: "\\boxed{T=R^2(A+B+C-\\pi)=R^2E}",
      },
      {
        titleFa: "کنترل با هشتک",
        titleEn: "Check an octant",
        bodyFa:
          "سه رأس روی سه محور عمود، سه زاویهٔ قائم دارند. مساحت πR²/۲ دقیقاً یک هشتم کره است. فرمول ل‌هویلیه راه محاسبهٔ E از اضلاع است؛ اثبات آن در این استدلال ادعا نمی‌شود.",
        bodyEn:
          "Three mutually perpendicular radius directions give three right angles. The area πR²/2 is exactly one eighth of the sphere. L’Huilier computes E from sides; its derivation is a separate result.",
        formula:
          "A=B=C=\\frac\\pi2\\Rightarrow E=\\frac\\pi2,\\quad T=\\frac{4\\pi R^2}{8}",
      },
    ],
  },
  {
    kind: "delambre",
    titleFa: "دلامبر و قیاس‌های نپر",
    titleEn: "Delambre identities and Napier’s analogies",
    source:
      "Smart I §16, (45)–(52); full derivation from §5 half-angle identities",
    figure: "fig7",
    lessonId: "delambre-napier",
    steps: [
      {
        titleFa: "از نیم‌زاویه‌های اثبات‌شده",
        titleEn: "Start with the derived half-angle formulae",
        bodyFa:
          "در مثلث معمول، همهٔ نیم‌زاویه‌های رأس در ربع اول‌اند. ریشه‌های مثبت فرمول‌های نیم‌زاویه معتبرند. s نیم‌محیط و Q = cos(C/۲) را تعریف می‌کنیم.",
        bodyEn:
          "For an ordinary triangle all vertex half angles lie in the first quadrant, so the positive half-angle roots apply. Let s be the semiperimeter and define Q = cos(C/2).",
        formula:
          "s=\\frac{a+b+c}{2},\\quad Q=\\sqrt{\\frac{\\sin s\\sin(s-c)}{\\sin a\\sin b}}=\\cos\\frac C2",
      },
      {
        titleFa: "ضرب دو فرمول نیم‌زاویه",
        titleEn: "Multiply two half-angle formulae",
        bodyFa:
          "فرمول sin(A/۲) را در cos(B/۲) ضرب کنید. زیر ریشه، sin²(s−b) ظاهر می‌شود؛ چون صفر < s−b < π، ریشهٔ آن sin(s−b) است. با جابه‌جایی A و B رابطهٔ دوم می‌آید.",
        bodyEn:
          "Multiply sin(A/2) by cos(B/2). The square root contains sin²(s−b); since 0 < s−b < π its positive root is sin(s−b). Interchange A and B for the second identity.",
        formula:
          "\\begin{aligned}\\sin\\frac A2\\cos\\frac B2&=\\frac{Q\\sin(s-b)}{\\sin c}\\\\\\cos\\frac A2\\sin\\frac B2&=\\frac{Q\\sin(s-a)}{\\sin c}\\end{aligned}",
      },
      {
        titleFa: "جمع و تفاضل؛ دو اتحاد نخست",
        titleEn: "Add and subtract: the first pair",
        bodyFa:
          "تفاضل دو رابطه سینوس نیم‌تفاضل و جمعشان سینوس نیم‌مجموع زوایا را می‌دهد. از اتحاد جمع به ضرب برای sin(s−b) ± sin(s−a) و sin c = ۲ sin(c/۲) cos(c/۲) استفاده کنید.",
        bodyEn:
          "Subtract to obtain the sine of the half difference, and add to obtain the sine of the half sum. Apply sum-to-product to sin(s−b) ± sin(s−a) and use sin c = 2 sin(c/2) cos(c/2).",
        formula:
          "\\begin{aligned}\\sin\\frac c2\\sin\\frac{A-B}2&=\\cos\\frac C2\\sin\\frac{a-b}2\\\\\\cos\\frac c2\\sin\\frac{A+B}2&=\\cos\\frac C2\\cos\\frac{a-b}2\\end{aligned}",
      },
      {
        titleFa: "جفت ضربی دوم",
        titleEn: "The second product pair",
        bodyFa:
          "اکنون sin(A/۲) sin(B/۲) و cos(A/۲) cos(B/۲) را با همان فرمول‌های نیم‌زاویه حساب می‌کنیم. این بار عامل مشترک sin(C/۲) است.",
        bodyEn:
          "Now calculate sin(A/2) sin(B/2) and cos(A/2) cos(B/2) using the same half-angle identities. The common factor is now sin(C/2).",
        formula:
          "\\begin{aligned}\\cos\\frac A2\\cos\\frac B2&=\\frac{\\sin(C/2)\\sin s}{\\sin c}\\\\\\sin\\frac A2\\sin\\frac B2&=\\frac{\\sin(C/2)\\sin(s-c)}{\\sin c}\\end{aligned}",
      },
      {
        titleFa: "دو اتحاد باقی‌مانده",
        titleEn: "The remaining two identities",
        bodyFa:
          "جمع دو رابطه کسینوس نیم‌تفاضل و تفاضلشان کسینوس نیم‌مجموع است. با اتحادهای sin s ± sin(s−c)، دو فرمول دیگر دلامبر به دست می‌آیند. اکنون هر چهار هویت از نیم‌زاویه‌ها استنتاج شده‌اند.",
        bodyEn:
          "Adding gives cosine of the half difference; subtracting gives cosine of the half sum. The identities for sin s ± sin(s−c) give the remaining Delambre formulae. All four have now been derived from the half-angle relations.",
        formula:
          "\\begin{aligned}\\sin\\frac c2\\cos\\frac{A-B}2&=\\sin\\frac C2\\sin\\frac{a+b}2\\\\\\cos\\frac c2\\cos\\frac{A+B}2&=\\sin\\frac C2\\cos\\frac{a+b}2\\end{aligned}",
      },
      {
        titleFa: "تقسیم و قیاس مجموع",
        titleEn: "Divide to get the sum analogy",
        bodyFa:
          "دو رابطهٔ مرحلهٔ قبل را تقسیم می‌کنیم؛ عامل sin(C/۲) حذف می‌شود. وقتی مخرج صفر است همان صورت‌های ضربی معتبر می‌مانند و نباید تانژانت متناهی تحمیل کرد.",
        bodyEn:
          "Divide the preceding identities and cancel sin(C/2). When a denominator vanishes retain the undivided identities rather than forcing a finite tangent.",
        formula:
          "\\boxed{\\tan\\frac{a+b}2=\\frac{\\cos((A-B)/2)}{\\cos((A+B)/2)}\\tan\\frac c2}",
      },
      {
        titleFa: "قیاس تفاضل و ربع",
        titleEn: "Difference analogy and quadrant",
        bodyFa:
          "با تقسیم دو رابطهٔ مرحلهٔ سوم، قیاس تفاضل حاصل می‌شود. تانژانت به تنهایی ربع را تعیین نمی‌کند؛ دامنهٔ اجزا و صورت‌های ضربی را برای بازیابی زاویه بررسی کنید.",
        bodyEn:
          "Divide the two identities in the third step to get the difference analogy. A tangent alone does not resolve the quadrant; use the part ranges and undivided identities when recovering angles.",
        formula:
          "\\tan\\frac{a-b}2=\\frac{\\sin((A-B)/2)}{\\sin((A+B)/2)}\\tan\\frac c2",
      },
    ],
  },
  {
    kind: "sidereal",
    titleFa: "زمان نجومی و علامت طول",
    titleEn: "Sidereal time and longitude signs",
    source: "Smart II §§24, 27; east-positive longitude",
    figure: "fig18",
    lessonId: "celestial-sphere",
    steps: [
      {
        titleFa: "مبدأ و جهت",
        titleEn: "Reference and direction",
        bodyFa:
          "بعد α از اعتدال بهاری به شرق و H از نصف‌النهار محلی به غرب سنجیده می‌شود. همهٔ کمیت‌ها را در یک واحد، ترجیحاً ساعت، نگه می‌داریم.",
        bodyEn:
          "Right ascension α runs east from the vernal equinox; H runs west from the local meridian. Keep all quantities in the same unit, preferably hours.",
        formula: "24\\,\\mathrm h=360^\\circ,\\qquad 1\\,\\mathrm h=15^\\circ",
      },
      {
        titleFa: "جمع کمان‌های جهت‌دار",
        titleEn: "Add directed arcs",
        bodyFa:
          "زاویهٔ ساعتی نقطهٔ اعتدال، زمان نجومی محلی است. رفتن از نصف‌النهار به ستاره و سپس به نقطهٔ اعتدال، در جهت غرب، H + α می‌دهد.",
        bodyEn:
          "Local sidereal time is the hour angle of the equinox. The westward directed path from the meridian to the star and then to the equinox adds H + α.",
        formula: "\\boxed{\\mathrm{LST}=H+\\alpha\\pmod{24\\,\\mathrm h}}",
      },
      {
        titleFa: "طول شرقی مثبت",
        titleEn: "Use east-positive longitude",
        bodyFa:
          "نصف‌النهار شرقی زودتر از گرینویچ به یک جهت می‌رسد؛ پس زمان نجومی محلی بیشتر است. طول درجه‌ای λ را بر ۱۵ تقسیم می‌کنیم.",
        bodyEn:
          "An eastern meridian reaches a given direction earlier, so its local sidereal time is ahead of Greenwich. Divide longitude in degrees by 15.",
        formula:
          "\\mathrm{LST}=\\mathrm{GST}+\\frac{\\lambda_E}{15}\\pmod{24\\,\\mathrm h}",
      },
      {
        titleFa: "آزمون عبور",
        titleEn: "Transit check",
        bodyFa:
          "برای ستارهٔ در عبور بالایی، H صفر و LST برابر بعد است. نمونه: اگر GST برابر ۴ ساعت و طول ۳۰ درجه شرقی باشد، LST برابر ۶ ساعت می‌شود.",
        bodyEn:
          "At upper transit H = 0, so LST equals the star’s RA. For example GST = 4 h at longitude 30° east gives LST = 6 h.",
        formula:
          "H=0\\Rightarrow\\mathrm{LST}=\\alpha,\\qquad 4+\\frac{30}{15}=6\\,\\mathrm h",
      },
    ],
  },
];
export function getProof(kind: string): ProofDef {
  return PROOFS.find((p) => p.kind === kind) ?? PROOFS[0];
}
