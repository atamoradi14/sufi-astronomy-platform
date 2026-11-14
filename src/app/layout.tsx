import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";
import "katex/dist/katex.min.css";
import "@fontsource-variable/vazirmatn";
import "@fontsource/amiri/arabic-400.css";
import "@fontsource/amiri/arabic-700.css";
import "@fontsource/amiri/latin-400.css";

export const metadata: Metadata = {
  title: "صوفی‌آسمان | آموزش ریاضیات کروی و نجوم",
  description:
    "آموزش تعاملی ریاضیات کروی، قطب‌نما و قبله، نقشه ماهواره‌ای، نمودارهای نجومی و صورت‌های فلکی به سبک عبدالرحمن صوفی — به زبان فارسی.",
  applicationName: "صوفی‌آسمان",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "صوفی‌آسمان",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0c1424",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <body className="antialiased">
        <div className="app-shell flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
