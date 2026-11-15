import { pageMetadata } from "@/lib/seo";
import { InfoPage } from "@/components/seo/InfoPage";
export const metadata = pageMetadata(
  "دربارهٔ ماندریا؛ آموزش هندسهٔ آسمان",
  "دربارهٔ درس‌نامهٔ کروی ماندریا، منابع اسمارت، اطلس عبدالرحمن صوفی و دقت مدل‌های نجومی.",
  "/about",
);
export default function Page() {
  return <InfoPage kind="about" />;
}
