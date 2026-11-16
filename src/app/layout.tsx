import { SITE_URL, safeJsonLd } from "@/lib/seo";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageRoot } from "@/components/language/Language";
import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { DigitRemount } from "@/components/digits/DigitScript";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteFrame } from "@/components/layout/SiteFrame";
import { ThemeProvider } from "@/components/layout/Theme";
import { themeBootScript } from "@/lib/theme";
import "./globals.css";
import "./editorial.css";
import "@fontsource-variable/vazirmatn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "فانوس خیال | نجوم، آسمان و میراث ایران",
    template: "%s | فانوس خیال",
  },
  description:
    "فانوس خیال، ساختهٔ عطا مرادی، وب‌سایتی برای شناختن زیبایی‌های آسمان؛ نقشهٔ شب، حسگر ستاره، کرهٔ تعاملی، اطلس صوفی و درس‌نامهٔ کروی در حال توسعه.",
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
  applicationName: "فانوس خیال",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "فانوس خیال",
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
    title: "فانوس خیال | Fanous-e Khial",
    siteName: "Fanous-e Khial",
    url: SITE_URL,
    type: "website",
    locale: "fa_IR",
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "فانوس خیال | Fanous-e Khial — astronomy and Persian heritage",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1723",
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
    <html
      lang="fa"
      dir="rtl"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="antialiased">
        <LanguageRoot>
          <DigitRemount>
            <ThemeProvider>
              <AuthProvider>
                <SiteFrame>
                  <SiteHeader />
                  <main className="flex-1">{children}</main>
                  <SiteFooter />
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: safeJsonLd({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: "فانوس خیال",
                        alternateName: "Fanous-e Khial",
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
                </SiteFrame>
              </AuthProvider>
            </ThemeProvider>
          </DigitRemount>
        </LanguageRoot>
      </body>
    </html>
  );
}
