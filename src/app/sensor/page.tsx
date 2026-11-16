import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Protected } from "@/components/auth/Protected";
import { SensorContent } from "@/components/auth/SensorContent";
export const metadata: Metadata = {
  ...pageMetadata(
    "حسگر ستاره و حل نجومی تصویر",
    "تطبیق الگوهای ستاره\u200cای عکس با فهرست مرجع و محاسبهٔ مختصات مرکز تصویر در صورت حل موفق؛ ورود با گوگل لازم است.",
    "/sensor",
  ),
  robots: { index: false, follow: true },
};
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Protected feature="sensor">
      <SensorContent />
    </Protected>
  );
}
