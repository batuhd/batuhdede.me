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
import { ReactNode } from "react";

export default function Home() {
  const { t, getLocalized } = useLanguage();
  const { aboutMe, loaded, sectionOrder } = useSiteData();

  const quoteText = aboutMe ? (getLocalized(aboutMe, "quote_text") || t("user.quote.text")) : (loaded ? t("user.quote.text") : "");
  const quoteAuthor = aboutMe?.quote_author || (loaded ? t("user.quote.author") : "");

  const componentsMap: Record<string, ReactNode> = {
    skills: <Skills />,
    experience: <Experience />,
    education: <Education />,
    languages: <Languages />,
    activities: <Activities />,
    certifications: <Certifications />,
  };

  const defaultOrder = ["skills", "experience", "education", "languages", "activities", "certifications"];
  const orderedKeys = sectionOrder && sectionOrder.length > 0
    ? [...sectionOrder]
        .filter((s) => !s.section_id.endsWith("_hidden"))
        .sort((a, b) => a.order_index - b.order_index)
        .map((s) => s.section_id)
    : defaultOrder;

  return (
    <div className="space-y-10 sm:space-y-16 max-w-2xl mx-auto w-full">
      <FadeIn delay={0.1}>
        <Info />
      </FadeIn>

      <FadeIn delay={0.2}>
        <About />
      </FadeIn>

      {orderedKeys.map((key, i) => (
        componentsMap[key] ? (
          <FadeIn key={key} delay={0.3 + i * 0.05}>
            {componentsMap[key]}
          </FadeIn>
        ) : null
      ))}

      <FadeIn delay={0.5}>
        <GitHubContribution />
      </FadeIn>

      {aboutMe?.show_quote !== false && quoteText && (
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
