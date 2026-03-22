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
import { ReactNode, Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldAlert, Home as HomeIcon } from "lucide-react";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { t, getLocalized } = useLanguage();
  const { aboutMe, loaded, sectionOrder } = useSiteData();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    if (searchParams?.get("unauthorized") === "true") {
      setShowUnauthorized(true);
      // Clean URL after 10 seconds or on close
      const timer = setTimeout(() => {
        router.replace("/");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

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
    <>
      {showUnauthorized && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="flex flex-col items-center gap-6 max-w-md w-full mx-4 p-8 rounded-3xl border bg-card/50 shadow-2xl text-center">
            <div className="w-full rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
              <img
                src="/media/401.jpg"
                alt="401 Unauthorized"
                className="w-full h-auto"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-primary">
                <ShieldAlert className="h-6 w-6" />
                <h2 className="text-2xl font-bold tracking-tight">Erişim Reddedildi</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu alana erişim yetkiniz bulunmuyor veya çok fazla hatalı giriş denemesi yaptınız. Güvenliğiniz için ana sayfaya yönlendirildiniz.
              </p>
            </div>
            <button
              onClick={() => {
                setShowUnauthorized(false);
                router.replace("/");
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
            >
              <HomeIcon className="h-4 w-4" />
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      )}

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
    </>
  );
}
