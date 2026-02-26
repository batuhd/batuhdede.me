"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { Star, ExternalLink, Code2, Video, Type, Hammer, Globe } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function CreditsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 sm:space-y-12">
      <FadeIn>
        <div className="space-y-2">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <Star className="h-8 w-8 text-primary" />
            {t("credits.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("credits.subtitle")}
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Source Code */}
        <FadeIn delay={0.1} className="sm:col-span-2">
          <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <Code2 className="h-5 w-5 text-primary" />
                <h2>{t("credits.sourceCode")}</h2>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("credits.sourceCodeDesc")}
            </p>
            <a
              href="https://github.com/batuhd/batuhd.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors mt-2"
            >
              github.com/batuhd/batuhd.github.io{" "}
              <ExternalLink className="h-4 w-4" />
            </a>
          </section>
        </FadeIn>

        {/* Tech Stack */}
        <FadeIn delay={0.2}>
          <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Hammer className="h-5 w-5 text-primary" />
              <h2>{t("credits.techStack")}</h2>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="font-medium text-foreground">
                  {t("credits.tech.frontend")}
                </span>
                <span>React, Next.js, Tailwind CSS</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="font-medium text-foreground">
                  {t("credits.tech.database")}
                </span>
                <span>Firebase Realtime Database</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="font-medium text-foreground">
                  {t("credits.tech.auth")}
                </span>
                <span>Firebase Authentication</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="font-medium text-foreground">
                  {t("credits.tech.hosting")}
                </span>
                <span>Vercel</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="font-medium text-foreground">
                  {t("credits.tech.forms")}
                </span>
                <span>Formspree</span>
              </li>
              <li className="flex justify-between pb-2">
                <span className="font-medium text-foreground">
                  {t("credits.tech.icons")}
                </span>
                <span>Lucide React</span>
              </li>
            </ul>
          </section>
        </FadeIn>

        {/* Typography */}
        <FadeIn delay={0.3}>
          <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Type className="h-5 w-5 text-primary" />
              <h2>{t("credits.typography")}</h2>
            </div>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex flex-col gap-1 border-b border-border/50 pb-3">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">
                    {t("credits.typo.sans")}
                  </span>
                  <span>Geist Sans — Vercel</span>
                </div>
              </li>
              <li className="flex flex-col gap-1 border-b border-border/50 pb-3">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">
                    {t("credits.typo.mono")}
                  </span>
                  <span>Geist Mono — Vercel</span>
                </div>
              </li>
              <li className="flex flex-col gap-1 pb-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-foreground">
                    {t("credits.typo.logo")}
                  </span>
                  <span>Epetri — A Typography</span>
                </div>
                <span className="text-xs">{t("credits.typo.logoNote")}</span>
                <a
                  href="https://atypography.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary mt-1"
                >
                  atypography.com — Epetri{" "}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </section>
        </FadeIn>

        {/* Videos */}
        <FadeIn delay={0.4} className="sm:col-span-2">
          <section className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
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
                atypography.com — Epetri{" "}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>
        </FadeIn>

        {/* Translation */}
        <FadeIn delay={0.45} className="sm:col-span-2">
          <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
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
        <FadeIn delay={0.5} className="sm:col-span-2 text-center py-8">
          <div className="flex justify-center mb-6">
            <img
              src="/media/yuvarlaklogo.png"
              alt="Logo"
              width={48}
              height={48}
              className="dark:hidden drop-shadow-sm opacity-80"
            />
            <img
              src="/media/yuvarlaklogobeyaz.png"
              alt="Logo"
              width={48}
              height={48}
              className="hidden dark:block drop-shadow-sm opacity-80"
            />
          </div>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mb-4">
            {t("credits.footer")}
          </p>
          <p className="text-sm font-medium">{t("home.footer")}</p>
        </FadeIn>
      </div>
    </div>
  );
}
