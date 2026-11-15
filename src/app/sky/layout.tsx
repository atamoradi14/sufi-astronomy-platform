import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "آسمان تعاملی و نقشهٔ ستاره‌ها",
  "نقشهٔ آموزشی آسمان با موقعیت ناظر، زمان رصد، جست‌وجوی ستاره و دستگاه سمت و ارتفاع.",
  "/sky",
);
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
