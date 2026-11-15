import { pageMetadata } from "@/lib/seo";
import { InfoPage } from "@/components/seo/InfoPage";
export const metadata = pageMetadata(
  "حریم خصوصی فانوس خیال",
  "اطلاعات ذخیره‌شده برای ورود با گوگل، کوکی‌های ضروری و حریم خصوصی حساب‌های فانوس خیال.",
  "/privacy",
);
export default function Page() {
  return <InfoPage kind="privacy" />;
}
