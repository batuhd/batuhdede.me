import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { Dock } from "@/components/navigation/dock";
import { Intro } from "@/components/home/intro";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import DemoOne from "@/components/demo";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  icons: {
    icon: "/media/yuvarlaklogobeyaz.png",
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-background antialiased" suppressHydrationWarning>
        <Intro />
        <DemoOne />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Link
              href="/"
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 transition-transform hover:scale-105 duration-300"
            >
              <Image
                src="/media/logobeyaz.png"
                alt="Logo"
                width={44}
                height={44}
                className="hidden dark:block drop-shadow-lg sm:w-14 sm:h-14"
                priority
              />
              <Image
                src="/media/yuvarlaklogo.png"
                alt="Logo"
                width={44}
                height={44}
                className="dark:hidden drop-shadow-lg sm:w-14 sm:h-14"
                priority
              />
            </Link>
            <main className="relative mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-16 pb-28 sm:pb-32">
              {children}
            </main>
            <Dock />
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
