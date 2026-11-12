/** صورت‌های فلکی برگرفته از سنت کتاب صور الکواکب عبدالرحمن صوفی */
export type Star = {
  id: string;
  nameFa: string;
  ra: number; // hours
  dec: number; // degrees
  mag: number;
};

export type Constellation = {
  id: string;
  nameFa: string;
  nameAr: string;
  ptolemy: string;
  description: string;
  stars: Star[];
  lines: Array<[string, string]>;
};

export const CONSTELLATIONS: Constellation[] = [
  {
    id: "ursa-major",
    nameFa: "دب اکبر",
    nameAr: "الدب الأكبر",
    ptolemy: "Ursa Major",
    description:
      "صوفی هفت ستارهٔ درخشان را «بنات‌النعش» می‌نامد. در آموزش ریاضیات کروی، فاصلهٔ زاویه‌ای میان مراق و جناح نمونهٔ کلاسیک است.",
    stars: [
      { id: "dubhe", nameFa: "دُبّه", ra: 11.062, dec: 61.75, mag: 1.8 },
      { id: "merak", nameFa: "مراق", ra: 11.031, dec: 56.38, mag: 2.4 },
      { id: "phecda", nameFa: "فَخْذ", ra: 11.897, dec: 53.69, mag: 2.4 },
      { id: "megrez", nameFa: "مَغْرِز", ra: 12.257, dec: 57.03, mag: 3.3 },
      { id: "alioth", nameFa: "علیوث", ra: 12.9, dec: 55.96, mag: 1.8 },
      { id: "mizar", nameFa: "مِیزَر", ra: 13.399, dec: 54.93, mag: 2.2 },
      { id: "alkaid", nameFa: "القاید", ra: 13.792, dec: 49.31, mag: 1.9 },
    ],
    lines: [
      ["dubhe", "merak"],
      ["merak", "phecda"],
      ["phecda", "megrez"],
      ["megrez", "alioth"],
      ["alioth", "mizar"],
      ["mizar", "alkaid"],
      ["megrez", "dubhe"],
    ],
  },
  {
    id: "orion",
    nameFa: "جبار",
    nameAr: "الجوزاء",
    ptolemy: "Orion",
    description:
      "جبار با سه ستارهٔ کمربند، محور روشنی برای آموزش میل و بعد و ارتفاع طلوع است.",
    stars: [
      { id: "betelgeuse", nameFa: "ابط‌الجوزا", ra: 5.919, dec: 7.41, mag: 0.5 },
      { id: "bellatrix", nameFa: "نجاد", ra: 5.418, dec: 6.35, mag: 1.6 },
      { id: "mintaka", nameFa: "منطقه‌ای", ra: 5.533, dec: -0.3, mag: 2.2 },
      { id: "alnilam", nameFa: "نظام", ra: 5.603, dec: -1.2, mag: 1.7 },
      { id: "alnitak", nameFa: "نطاق", ra: 5.679, dec: -1.94, mag: 1.8 },
      { id: "saiph", nameFa: "سیف", ra: 5.796, dec: -9.67, mag: 2.1 },
      { id: "rigel", nameFa: "رجل‌الجبار", ra: 5.242, dec: -8.2, mag: 0.1 },
    ],
    lines: [
      ["betelgeuse", "bellatrix"],
      ["bellatrix", "mintaka"],
      ["mintaka", "alnilam"],
      ["alnilam", "alnitak"],
      ["alnitak", "saiph"],
      ["saiph", "rigel"],
      ["rigel", "mintaka"],
      ["betelgeuse", "alnitak"],
    ],
  },
  {
    id: "cassiopeia",
    nameFa: "ذات‌الکرسی",
    nameAr: "ذات الكرسي",
    ptolemy: "Cassiopeia",
    description:
      "شکل W مشهور ذات‌الکرسی برای تمرین تبدیل مختصات استوایی به افقی در عرض‌های میانه مناسب است.",
    stars: [
      { id: "schedar", nameFa: "صدر", ra: 0.675, dec: 56.54, mag: 2.2 },
      { id: "caph", nameFa: "کف", ra: 0.153, dec: 59.15, mag: 2.3 },
      { id: "gamma-cas", nameFa: "ناف", ra: 0.945, dec: 60.72, mag: 2.5 },
      { id: "ruchbah", nameFa: "رکبه", ra: 1.43, dec: 60.24, mag: 2.7 },
      { id: "segin", nameFa: "ساق", ra: 1.91, dec: 63.67, mag: 3.4 },
    ],
    lines: [
      ["caph", "schedar"],
      ["schedar", "gamma-cas"],
      ["gamma-cas", "ruchbah"],
      ["ruchbah", "segin"],
    ],
  },
  {
    id: "cygnus",
    nameFa: "دجاجه",
    nameAr: "الدجاجة",
    ptolemy: "Cygnus",
    description:
      "صلیب شمالی در سنت صوفی با بال‌های گسترده تصویر می‌شود؛ برای آموزش سمت و ارتفاع نزدیک السمت مفید است.",
    stars: [
      { id: "deneb", nameFa: "ذنب‌الدجاجه", ra: 20.69, dec: 45.28, mag: 1.3 },
      { id: "sadr", nameFa: "صدر", ra: 20.37, dec: 40.26, mag: 2.2 },
      { id: "gienah", nameFa: "جناح", ra: 19.75, dec: 33.97, mag: 2.5 },
      { id: "delta-cyg", nameFa: "فخذ", ra: 19.75, dec: 45.13, mag: 2.9 },
      { id: "albireo", nameFa: "منقار", ra: 19.512, dec: 27.96, mag: 3.1 },
    ],
    lines: [
      ["deneb", "sadr"],
      ["sadr", "albireo"],
      ["gienah", "sadr"],
      ["sadr", "delta-cyg"],
    ],
  },
  {
    id: "scorpius",
    nameFa: "عقرب",
    nameAr: "العقرب",
    ptolemy: "Scorpius",
    description:
      "قلب‌العقرب (آنترِس) نقطهٔ مرجع میل جنوبی است و منحنی دم عقرب برای تمرین فاصلهٔ زاویه‌ای زنجیره‌ای عالی است.",
    stars: [
      { id: "antares", nameFa: "قلب‌العقرب", ra: 16.49, dec: -26.43, mag: 1.1 },
      { id: "graffias", nameFa: "جبهة", ra: 16.09, dec: -19.8, mag: 2.6 },
      { id: "dschubba", nameFa: "جبهة‌الثانية", ra: 16.0, dec: -22.62, mag: 2.3 },
      { id: "shaula", nameFa: "شولة", ra: 17.56, dec: -37.1, mag: 1.6 },
      { id: "lesath", nameFa: "لسعة", ra: 17.621, dec: -37.3, mag: 2.7 },
    ],
    lines: [
      ["graffias", "dschubba"],
      ["dschubba", "antares"],
      ["antares", "shaula"],
      ["shaula", "lesath"],
    ],
  },
  {
    id: "leo",
    nameFa: "اسد",
    nameAr: "الأسد",
    ptolemy: "Leo",
    description:
      "مَلَکِ‌البرج (رِگولوس) نزدیک دایرة‌البروج است؛ صوفی شکل شیر را برای آموزش طول دایرة‌البروجی به کار می‌برد.",
    stars: [
      { id: "regulus", nameFa: "قلب‌الأسد", ra: 10.139, dec: 11.97, mag: 1.4 },
      { id: "denebola", nameFa: "ذنب‌الأسد", ra: 11.818, dec: 14.57, mag: 2.1 },
      { id: "algeiba", nameFa: "عنق", ra: 10.333, dec: 19.84, mag: 2.6 },
      { id: "zorabal", nameFa: "ظهر", ra: 11.235, dec: 20.52, mag: 2.6 },
      { id: "adhafera", nameFa: "ضفيرة", ra: 10.278, dec: 23.42, mag: 3.4 },
    ],
    lines: [
      ["regulus", "algeiba"],
      ["algeiba", "adhafera"],
      ["algeiba", "zorabal"],
      ["zorabal", "denebola"],
    ],
  },
];

export function findConstellation(id: string) {
  return CONSTELLATIONS.find((c) => c.id === id);
}
