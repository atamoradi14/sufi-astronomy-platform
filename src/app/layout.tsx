import { LanguageRoot } from "@/components/language/Language";
import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { DigitRemount } from "@/components/digits/DigitScript";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";
import "katex/dist/katex.min.css";
import "@fontsource-variable/vazirmatn";
import "@fontsource/amiri/arabic-400.css";
import "@fontsource/amiri/arabic-700.css";
import "@fontsource/amiri/latin-400.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://manderia.daryajan.com"),
  title: "ماندریا | Manderia | آموزش ریاضیات کروی و نجوم",
  description:
    "آموزش تعاملی ریاضیات کروی، قطب‌نما و قبله، نقشه ماهواره‌ای، نمودارهای نجومی و صورت‌های فلکی به سبک عبدالرحمن صوفی — به زبان فارسی.",
  applicationName: "ماندریا",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ماندریا",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ماندریا | Manderia",
    siteName: "Manderia",
    url: "https://manderia.daryajan.com",
    type: "website",
    locale: "fa_IR",
  },
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
        <LanguageRoot>
          <DigitRemount>
            <div className="app-shell flex min-h-dvh flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </DigitRemount>
        </LanguageRoot>
      </body>
    </html>
  );
}
