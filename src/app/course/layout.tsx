import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "درس‌نامهٔ کروی اسمارت",
  "آموزش مرحله‌به‌مرحلهٔ هندسه و مثلثات کروی، کرهٔ سماوی و شکست جو؛ همراه اثبات‌های منطقی، مثال‌های عددی و تمرین.",
  "/course",
);
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
