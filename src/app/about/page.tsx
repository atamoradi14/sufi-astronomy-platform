import { pageMetadata } from "@/lib/seo";
import { BuilderStory } from "@/components/home/BuilderStory";
import { InfoPage } from "@/components/seo/InfoPage";
export const metadata = pageMetadata(
  "دربارهٔ فانوس خیال و عطا مرادی",
  "داستان فانوس خیال و سازنده‌اش، عطا مرادی؛ علاقه به نجوم، المپیاد و تلاش برای کمک به جامعهٔ نجومی ایران.",
  "/about",
);
export default function Page() {
  return (
    <>
      <InfoPage kind="about" />
      <BuilderStory />
    </>
  );
}
