import type { Metadata, Viewport } from "next";
import { Amiri, Vazirmatn } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const display = Amiri({
  variable: "--font-display",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const body = Vazirmatn({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
});

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
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <div className="app-shell flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
