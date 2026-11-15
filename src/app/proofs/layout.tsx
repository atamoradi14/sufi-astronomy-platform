import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "اثبات‌های مثلثات کروی",
  "اثبات پیوستهٔ قوانین کسینوس و جیب، فرمول‌های نپر و دلامبر، زیادی کروی و مثلث نجومی؛ با فرمول و شکل دقیق.",
  "/proofs",
);
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
