import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Protected } from "@/components/auth/Protected";
import { LabContent } from "@/components/auth/LabContent";
export const metadata: Metadata = {
  ...pageMetadata(
    "کرهٔ سه\u200cبعدی و هندسهٔ کروی",
    "ساخت و بررسی عظیمه، صغیره و مثلث کروی روی کرهٔ تعاملی فانوس خیال؛ برای استفاده با حساب گوگل وارد شوید.",
    "/lab",
  ),
  robots: { index: false, follow: true },
};
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Protected feature="lab">
      <LabContent />
    </Protected>
  );
}
