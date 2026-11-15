import { SITE_URL, safeJsonLd } from "@/lib/seo";
import { AuthProvider } from "@/components/auth/AuthProvider";
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
  title: {
    default: "ماندریا | پنجره‌ای به زیبایی‌های آسمان",
    template: "%s | ماندریا",
  },
  description:
    "ماندریا، ساختهٔ عطا مرادی، وب‌سایتی برای شناختن زیبایی‌های آسمان؛ نقشهٔ شب، حسگر ستاره، کرهٔ تعاملی، اطلس صوفی و درس‌نامهٔ کروی در حال توسعه.",
  alternates: { canonical: "/" },
  keywords: [
    "درس‌نامه کروی",
    "مثلثات کروی",
    "نجوم اسمارت",
    "اطلس صوفی",
    "حسگر ستاره",
    "spherical astronomy",
  ],
  twitter: { card: "summary_large_image", images: ["/social-card.png"] },
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
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "Manderia — spherical astronomy",
      },
    ],
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
            <AuthProvider>
              <div className="app-shell flex min-h-dvh flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: safeJsonLd({
                      "@context": "https://schema.org",
                      "@type": "WebSite",
                      name: "ماندریا",
                      alternateName: "Manderia",
                      url: SITE_URL,
                      inLanguage: ["fa", "en"],
                      description: "پنجره‌ای برای شناختن زیبایی‌های آسمان",
                      creator: {
                        "@type": "Person",
                        name: "Ata Moradi",
                        alternateName: "عطا مرادی",
                      },
                    }),
                  }}
                />
              </div>
            </AuthProvider>
          </DigitRemount>
        </LanguageRoot>
      </body>
    </html>
  );
}
