"use client";

import { Info } from "@/components/home/info";
import { About } from "@/components/home/about";
import { Skills } from "@/components/home/skills";
import { Experience, Education, Languages, Activities, Certifications } from "@/components/home/profile-sections";
import { GitHubContribution } from "@/components/home/github-contribution";
import { ContactForm } from "@/components/home/contact-form";
import { FadeIn } from "@/components/motion/fade-in";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";

export default function Home() {
  const { t, getLocalized } = useLanguage();
  const { aboutMe, loaded } = useSiteData();

  const quoteText = aboutMe ? (getLocalized(aboutMe, "quote_text") || t("user.quote.text")) : (loaded ? t("user.quote.text") : "");
  const quoteAuthor = aboutMe?.quote_author || (loaded ? t("user.quote.author") : "");

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

      <FadeIn delay={0.3}>
        <Experience />
      </FadeIn>

      <FadeIn delay={0.3}>
        <Education />
      </FadeIn>

      <FadeIn delay={0.3}>
        <Languages />
      </FadeIn>

      <FadeIn delay={0.3}>
        <Activities />
      </FadeIn>

      <FadeIn delay={0.3}>
        <Certifications />
      </FadeIn>

      <FadeIn delay={0.4}>
        <GitHubContribution />
      </FadeIn>

      {quoteText && (
        <FadeIn delay={0.5}>
          <blockquote className="border-l-2 border-muted-foreground/20 pl-4 sm:pl-6 italic text-muted-foreground">
            <p className="text-base sm:text-lg">
              &ldquo;{quoteText}&rdquo;
            </p>
            <footer className="mt-2 text-sm not-italic">
              — {quoteAuthor}
            </footer>
          </blockquote>
        </FadeIn>
      )}

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
