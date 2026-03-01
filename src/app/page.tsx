"use client";

import { Info } from "@/components/home/info";
import { About } from "@/components/home/about";
import { Skills } from "@/components/home/skills";
import { GitHubContribution } from "@/components/home/github-contribution";
import { ContactForm } from "@/components/home/contact-form";
import { FadeIn } from "@/components/motion/fade-in";
import { useLanguage } from "@/context/language-context";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="space-y-12 sm:space-y-24">
      <FadeIn delay={0.1}>
        <Info />
      </FadeIn>

      <FadeIn delay={0.2}>
        <About />
      </FadeIn>

      <FadeIn delay={0.3}>
        <Skills />
      </FadeIn>

      <FadeIn delay={0.4}>
        <GitHubContribution />
      </FadeIn>

      <FadeIn delay={0.5}>
        <blockquote className="border-l-2 border-muted-foreground/20 pl-4 sm:pl-6 italic text-muted-foreground">
          <p className="text-base sm:text-lg">
            &ldquo;{t("user.quote.text")}&rdquo;
          </p>
          <footer className="mt-2 text-sm not-italic">
            — {t("user.quote.author")}
          </footer>
        </blockquote>
      </FadeIn>

      <FadeIn delay={0.6}>
        <ContactForm />
      </FadeIn>

      <FadeIn delay={0.7} direction="none">
        <footer className="border-t pt-6 sm:pt-8 pb-16 sm:pb-8 text-center text-sm text-muted-foreground">
          <p>{t("home.footer")}</p>
          <p className="mt-1">&copy;batuhd</p>
        </footer>
      </FadeIn>
    </div>
  );
}
