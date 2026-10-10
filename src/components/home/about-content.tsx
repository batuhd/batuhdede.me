"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { userConfig } from "@/config/user";
import { cn, sanitizeUrl } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Skills } from "@/components/home/skills";
import { ExperienceDetail } from "@/components/home/experience-detail";
import {
  Activities,
  Education,
  Languages,
  Certifications,
} from "@/components/home/profile-sections";

const SECTION_TO_TAB: Record<string, number> = {
  experience: 0,
  activities: 1,
  education: 2,
  languages: 2,
  skills: 3,
  certifications: 3,
};

export function AboutContent() {
  const { t, getLocalized } = useLanguage();
  const { aboutMe } = useSiteData();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [tab, setTab] = useState(0);

  const name = aboutMe?.name || userConfig.name;
  const tagline = aboutMe ? getLocalized(aboutMe, "hero_tagline") : "";
  const aboutBio = aboutMe
    ? getLocalized(aboutMe, "about_bio") || getLocalized(aboutMe, "bio")
    : "";
  const portrait = aboutMe?.about_photo_url
    ? sanitizeUrl(aboutMe.about_photo_url) ||
      (aboutMe.profile_photo_url
        ? sanitizeUrl(aboutMe.profile_photo_url)
        : null)
    : aboutMe?.profile_photo_url
      ? sanitizeUrl(aboutMe.profile_photo_url)
      : null;

  // Mobilde derin bağlantı (/#certifications vb.) ilgili sekmeyi açar.
  useEffect(() => {
    if (!isMobile) return;
    const applyHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      const idx = SECTION_TO_TAB[id];
      if (idx === undefined) return;
      setTab(idx);
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ block: "start" }),
      );
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [isMobile]);

  const mobileTabs = [
    { key: "home.tab.experience", content: <ExperienceDetail /> },
    { key: "home.tab.leadership", content: <Activities /> },
    {
      key: "home.tab.education",
      content: (
        <>
          <Education />
          <Languages />
        </>
      ),
    },
    {
      key: "home.tab.skills",
      content: (
        <>
          <Skills />
          <Certifications variant="grid" />
        </>
      ),
    },
  ];

  return (
    <div className="w-full px-4 sm:px-5 lg:px-0">
      {/* Intro: bio (solda) + portre (sağda) */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-x-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="max-w-[42rem]">
          <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            {t("about.hey")} {t("home.hello")} {name}
          </h1>
          {tagline && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {tagline}
            </p>
          )}
          {aboutBio && (
            <div className="mt-6 leading-relaxed">
              <MarkdownRenderer content={aboutBio} />
            </div>
          )}
        </div>
        {portrait && (
          <Image
            src={portrait}
            alt={name}
            width={640}
            height={800}
            className="w-full object-cover lg:sticky lg:top-[2.875rem]"
          />
        )}
      </div>

      {isMobile ? (
        <div className="mt-12">
          <div
            role="tablist"
            className="grid grid-cols-4 border-y border-border"
          >
            {mobileTabs.map((item, index) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={tab === index}
                onClick={() => setTab(index)}
                className={cn(
                  "flex min-h-[60px] items-center justify-center border-b-2 px-1 text-center text-[10px] uppercase leading-tight tracking-[0.05em] transition-colors duration-150",
                  tab === index
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {t(item.key)}
              </button>
            ))}
          </div>
          <div className="mt-8 space-y-10">{mobileTabs[tab].content}</div>
        </div>
      ) : (
        <>
          {/* Deneyim | Liderlik & Etkinlikler */}
          <div
            id="deneyim-liderlik"
            className="mt-16 grid scroll-mt-16 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-x-16"
          >
            <ExperienceDetail />
            <Activities />
          </div>

          {/* Eğitim | Diller */}
          <div
            id="egitim-diller"
            className="mt-16 grid scroll-mt-16 grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-x-16"
          >
            <Education />
            <Languages />
          </div>

          {/* Yetenekler | Sertifikalar */}
          <div
            id="yetenekler-sertifikalar"
            className="mt-16 grid scroll-mt-16 grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-x-16"
          >
            <Skills />
            <Certifications variant="grid" />
          </div>
        </>
      )}
    </div>
  );
}
