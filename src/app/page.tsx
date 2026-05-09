import { fetchHomeData, getLocalized } from "@/lib/data";
import { userConfig } from "@/config/user";
import { LanguageProvider } from "@/context/language-context";
import { SiteDataProvider } from "@/context/site-data-context";
import { Info } from "@/components/home/info";
import { About } from "@/components/home/about";
import { Skills } from "@/components/home/skills";
import {
  Experience,
  Education,
  Languages,
  Activities,
  Certifications,
} from "@/components/home/profile-sections";
import { GitHubContribution } from "@/components/home/github-contribution";
import { ContactForm } from "@/components/home/contact-form";
import { FadeIn } from "@/components/motion/fade-in";
import { ReactNode } from "react";

// ISR: 60 saniyede bir yenile
export const revalidate = 60;

// Metadata
export const metadata = {
  title: "Batuhan Akçan - Portfolio",
  description: "Full Stack Developer & Software Engineer",
};

// Server Component
export default async function Home() {
  // Server'da veriyi çek - cache'li
  const data = await fetchHomeData();

  // SiteData formatına dönüştür (context beklediği formatta)
  const siteData = {
    aboutMe: data.aboutMe,
    skillCategories: data.skillCategories,
    experiences: data.experiences,
    educations: data.educations,
    languages: data.languages,
    activities: data.activities,
    certifications: data.certifications,
    certificationSkills: data.certificationSkills,
    sectionOrder: data.sectionOrder,
    projects: [], // Ana sayfada kullanılmıyor
    blogs: [], // Ana sayfada kullanılmıyor
    loaded: true, // Server'da yüklendi
    isMaintenance: data.sectionOrder.some(
      (s) => s.section_id === "maintenance_mode",
    ),
  };

  // Varsayılan dil ve section order
  const defaultLang = "en";
  const defaultOrder = [
    "skills",
    "experience",
    "education",
    "languages",
    "activities",
    "certifications",
  ];
  const orderedKeys =
    data.sectionOrder.length > 0
      ? [...data.sectionOrder]
          .filter((s) => !s.section_id.endsWith("_hidden"))
          .sort((a, b) => a.order_index - b.order_index)
          .map((s) => s.section_id)
      : defaultOrder;

  const componentsMap: Record<string, ReactNode> = {
    skills: <Skills />,
    experience: <Experience />,
    education: <Education />,
    languages: <Languages />,
    activities: <Activities />,
    certifications: <Certifications />,
  };

  // Quote verileri
  const quoteText = data.aboutMe?.quote_text || userConfig.favoriteQuote.text;
  const quoteAuthor =
    data.aboutMe?.quote_author || userConfig.favoriteQuote.author;
  const showQuote = data.aboutMe?.show_quote !== false;

  return (
    <LanguageProvider>
      <SiteDataProvider initialData={siteData}>
        <div className="space-y-10 sm:space-y-16 max-w-2xl mx-auto w-full">
          <FadeIn delay={0.1}>
            <Info />
          </FadeIn>

          <FadeIn delay={0.2}>
            <About />
          </FadeIn>

          {orderedKeys.map((key, i) =>
            componentsMap[key] ? (
              <FadeIn key={key} delay={0.3 + i * 0.05}>
                {componentsMap[key]}
              </FadeIn>
            ) : null,
          )}

          <FadeIn delay={0.5}>
            <GitHubContribution />
          </FadeIn>

          {showQuote && quoteText && (
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
              <p>Designed & Built with passion</p>
              <p className="mt-1">&copy;batuhd</p>
            </footer>
          </FadeIn>
        </div>
      </SiteDataProvider>
    </LanguageProvider>
  );
}
