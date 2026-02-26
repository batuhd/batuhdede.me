import type { Metadata } from "next";
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
import "./globals.css";

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
      <body className="min-h-screen bg-background antialiased">
        <Intro />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Link
              href="/"
              className="fixed top-6 right-6 z-50 transition-transform hover:scale-105 duration-300"
            >
              <Image
                src="/media/logobeyaz.png"
                alt="Logo"
                width={56}
                height={56}
                className="hidden dark:block drop-shadow-lg"
                priority
              />
              <Image
                src="/media/yuvarlaklogo.png"
                alt="Logo"
                width={56}
                height={56}
                className="dark:hidden drop-shadow-lg"
                priority
              />
            </Link>
            <main className="relative mx-auto max-w-2xl px-6 py-16 pb-32">
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
