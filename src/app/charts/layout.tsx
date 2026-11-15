import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "داده های لایو نجومی",
  "داده‌ها و نمودارهای خورشید، ماه و مدار زمین، مختصات ناظر و موقعیت ایستگاه فضایی با زمان مرجع مشخص.",
  "/charts",
);
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
