/** Canonical public pages; account-only tools and redirect aliases stay out. */
export const PUBLIC_PAGES = [
  { path: "/", fa: "خانهٔ فانوس خیال", en: "Fanous-e Khial home" },
  { path: "/course", fa: "درس‌نامهٔ کروی", en: "Spherical course" },
  { path: "/proofs", fa: "اثبات‌های مثلثات کروی", en: "Spherical proofs" },
  { path: "/sky", fa: "نقشهٔ آسمان و ستاره‌ها", en: "Interactive night sky" },
  { path: "/charts", fa: "داده‌های لایو نجومی", en: "Live astronomy data" },
  { path: "/map", fa: "نقشه و هندسهٔ زمین", en: "Map and Earth geometry" },
  { path: "/compass", fa: "قطب‌نما و سمت قبله", en: "Compass and Qibla" },
  {
    path: "/about",
    fa: "دربارهٔ فانوس خیال و سازنده",
    en: "About the site and builder",
  },
  { path: "/tools", fa: "راهنمای ابزارهای نجوم", en: "Astronomy tool guide" },
  { path: "/privacy", fa: "حریم خصوصی", en: "Privacy" },
  {
    path: "/directory",
    fa: "نقشهٔ سایت و فهرست درس‌ها",
    en: "Site and lesson directory",
  },
] as const;
