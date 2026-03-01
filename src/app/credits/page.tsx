"use client";

import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import {
  Star,
  ExternalLink,
  Code2,
  Video,
  Type,
  Hammer,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

const techStack = [
  { labelKey: "credits.tech.frontend", value: "React, Next.js, Tailwind CSS" },
  { labelKey: "credits.tech.database", value: "Firebase Realtime Database" },
  { labelKey: "credits.tech.auth", value: "Firebase Authentication" },
  { labelKey: "credits.tech.hosting", value: "Vercel" },
  { labelKey: "credits.tech.forms", value: "Formspree" },
  { labelKey: "credits.tech.icons", value: "Lucide React" },
];

const typography = [
  { labelKey: "credits.typo.sans", value: "Geist Sans — Vercel" },
  { labelKey: "credits.typo.mono", value: "Geist Mono — Vercel" },
];

export default function CreditsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 sm:space-y-12">
      <FadeIn>
        <div className="space-y-2">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <Star className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            {t("credits.title")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("credits.subtitle")}
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Source Code */}
        <FadeIn delay={0.1} className="sm:col-span-2">
          <section className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Code2 className="h-5 w-5 text-primary" />
              <h2>{t("credits.sourceCode")}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("credits.sourceCodeDesc")}
            </p>
            <a
              href="https://github.com/batuhd/batuhd.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              github.com/batuhd/batuhd.github.io
              <ExternalLink className="h-4 w-4" />
            </a>
          </section>
        </FadeIn>

        {/* Tech Stack */}
        <FadeIn delay={0.2}>
          <section className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Hammer className="h-5 w-5 text-primary" />
              <h2>{t("credits.techStack")}</h2>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {techStack.map((item, i) => (
                <li
                  key={item.labelKey}
                  className={`flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-4 ${i < techStack.length - 1 ? "border-b border-border/50 pb-2" : "pb-2"}`}
                >
                  <span className="font-medium text-foreground">
                    {t(item.labelKey)}
                  </span>
                  <span className="text-xs sm:text-sm">{item.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>

        {/* Typography */}
        <FadeIn delay={0.3}>
          <section className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Type className="h-5 w-5 text-primary" />
              <h2>{t("credits.typography")}</h2>
            </div>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {typography.map((item) => (
                <li
                  key={item.labelKey}
                  className="flex flex-col sm:flex-row sm:justify-between gap-0.5 border-b border-border/50 pb-3"
                >
                  <span className="font-medium text-foreground">
                    {t(item.labelKey)}
                  </span>
                  <span className="text-xs sm:text-sm">{item.value}</span>
                </li>
              ))}
              <li className="flex flex-col gap-1 pb-1">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 mb-1">
                  <span className="font-medium text-foreground">
                    {t("credits.typo.logo")}
                  </span>
                  <span className="text-xs sm:text-sm">
                    Epetri — A Typography
                  </span>
                </div>
                <span className="text-xs">{t("credits.typo.logoNote")}</span>
                <a
                  href="https://atypography.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary mt-1 text-xs sm:text-sm"
                >
                  atypography.com — Epetri
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </section>
        </FadeIn>

        {/* Media & Video */}
        <FadeIn delay={0.4} className="sm:col-span-2">
          <section className="space-y-6 rounded-2xl border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Video className="h-5 w-5 text-primary" />
              <h2>{t("credits.media")}</h2>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground tracking-tight underline underline-offset-4 mb-2">
                {t("credits.media.introTitle")}
              </h3>
              <p className="text-sm text-foreground">
                {t("credits.media.introDesc")}
              </p>
              <p className="text-sm font-medium mb-4 text-primary">
                {t("credits.media.introCredit")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("credits.typo.logoNote")}
              </p>
              <a
                href="https://atypography.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors mt-2"
              >
                atypography.com — Epetri
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>
        </FadeIn>

        {/* Translation */}
        <FadeIn delay={0.45} className="sm:col-span-2">
          <section className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Globe className="h-5 w-5 text-primary" />
              <h2>{t("credits.translationTitle")}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("credits.translationNote")}
            </p>
          </section>
        </FadeIn>

        {/* Footer */}
        <FadeIn delay={0.5} className="sm:col-span-2 text-center py-6 sm:py-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/media/yuvarlaklogo.png"
              alt="Logo"
              width={48}
              height={48}
              className="dark:hidden drop-shadow-sm opacity-80"
            />
            <Image
              src="/media/yuvarlaklogobeyaz.png"
              alt="Logo"
              width={48}
              height={48}
              className="hidden dark:block drop-shadow-sm opacity-80"
            />
          </div>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mb-4 px-4">
            {t("credits.footer")}
          </p>
          <p className="text-sm font-medium">{t("home.footer")}</p>
        </FadeIn>
      </div>
    </div>
  );
}
