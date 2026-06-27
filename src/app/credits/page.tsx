"use client";

import { FadeIn } from "@/components/motion/fade-in";
import {
  ExternalLink,
  Github,
  Layers,
  Palette,
  Film,
  Languages,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

function TechStackRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-card border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default function CreditsPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto w-full">
      {/* Header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("credits.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("credits.subtitle")}</p>
        </div>
      </FadeIn>

      <div className="space-y-6">
        {/* Source Code */}
        <FadeIn delay={0.05}>
          <a
            href="https://github.com/batuhd/batuhd.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-2xl bg-card border hover:border-primary/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Github className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{t("credits.sourceCode")}</p>
              <p className="text-sm text-muted-foreground truncate">
                github.com/batuhd/batuhd.github.io
              </p>
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        </FadeIn>

        {/* Tech Stack */}
        <FadeIn delay={0.1}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {t("credits.techStack")}
              </span>
            </div>
            <div className="grid gap-2">
              <TechStackRow label={t("credits.tech.frontend")} value="Next.js 16 · React 19 · TypeScript 5" />
              <TechStackRow label={t("credits.tech.styling")} value="Tailwind CSS 4 · Motion 12" />
              <TechStackRow label={t("credits.tech.database")} value="Supabase PostgreSQL + Auth + RLS" />
              <TechStackRow label={t("credits.tech.auth")} value="Supabase Auth · Cloudflare Turnstile" />
              <TechStackRow label={t("credits.tech.forms")} value="Zod · Sonner" />
              <TechStackRow label={t("credits.tech.icons")} value="Lucide React" />
              <TechStackRow label={t("credits.tech.security")} value="Next.js Middleware · CSP Headers" />
              <TechStackRow label={t("credits.tech.hosting")} value="Vercel" />
            </div>
          </div>
        </FadeIn>

        {/* Typography */}
        <FadeIn delay={0.15}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Palette className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {t("credits.typography")}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-card border text-center">
                <p className="font-medium text-sm">Geist Sans</p>
                <p className="text-xs text-muted-foreground">Body</p>
              </div>
              <div className="p-3 rounded-xl bg-card border text-center">
                <p className="font-medium text-sm">Geist Mono</p>
                <p className="text-xs text-muted-foreground">Code</p>
              </div>
              <div className="p-3 rounded-xl bg-card border text-center">
                <p className="font-medium text-sm">Epetri</p>
                <p className="text-xs text-muted-foreground">Logo</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Media */}
        <FadeIn delay={0.2}>
          <div className="p-4 rounded-2xl bg-card border">
            <div className="flex items-center gap-2 mb-2">
              <Film className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t("credits.media")}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("credits.media.introDesc")}
            </p>
            <p className="text-xs text-primary mt-2">
              {t("credits.media.introCredit")}
            </p>
          </div>
        </FadeIn>

        {/* Translation */}
        <FadeIn delay={0.25}>
          <div className="p-4 rounded-2xl bg-card border">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {t("credits.translationTitle")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("credits.translationNote")}
            </p>
          </div>
        </FadeIn>

        {/* Footer */}
        <FadeIn delay={0.3}>
          <p className="text-center text-sm text-muted-foreground pt-4">
            {t("home.footer")}
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
