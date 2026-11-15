import { pageMetadata } from "@/lib/seo";
import { InfoPage } from "@/components/seo/InfoPage";
export const metadata = pageMetadata(
  "ابزارهای نجوم و هندسهٔ کروی",
  "کرهٔ سه‌بعدی، حسگر ستاره و اطلس صوفی؛ ابزارهای تعاملی فانوس خیال برای فهم آسمان.",
  "/tools",
);
export default function Page() {
  return <InfoPage kind="tools" />;
}
