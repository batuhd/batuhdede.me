import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { SiteDataProvider } from "@/context/site-data-context";
import { ReactQueryProvider } from "@/components/react-query-provider";
import { MaintenanceGuard } from "@/components/maintenance-guard";
import { SiteChrome } from "@/components/site-chrome";
import { Intro } from "@/components/home/intro";
import { HtmlLangUpdater } from "@/components/html-lang-updater";
import { siteConfig } from "@/config/site";
import { fetchMaintenanceMode } from "@/lib/data";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  icons: {
    icon: "/media/yuvarlaklogobeyaz.png",
    apple: "/media/yuvarlaklogobeyaz.png",
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "x-default": siteConfig.url,
    },
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  other: {
    darkreader: "disable",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Bakım modu kararı sunucuda verilir; guard'a prop olarak geçer.
  const isMaintenance = await fetchMaintenanceMode();

  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body
        className="min-h-screen bg-background antialiased"
        suppressHydrationWarning
      >
        <Intro />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <LanguageProvider>
              <HtmlLangUpdater />
              <SiteDataProvider>
                <SiteChrome>
                  <MaintenanceGuard isMaintenance={isMaintenance}>
                    {children}
                  </MaintenanceGuard>
                </SiteChrome>
              </SiteDataProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
