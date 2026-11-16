import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Protected } from "@/components/auth/Protected";
import { AtlasContent } from "@/components/auth/AtlasContent";
export const metadata: Metadata = {
  ...pageMetadata(
    "اطلس صوفی و نگاره\u200cهای صورالکواکب",
    "مرور نگاره\u200cهای نسخه\u200cهای تاریخی صورالکواکب عبدالرحمن صوفی در دو منظر کره و آسمان؛ ورود با گوگل لازم است.",
    "/atlas",
  ),
  robots: { index: false, follow: true },
};
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Protected feature="atlas">
      <AtlasContent />
    </Protected>
  );
}
