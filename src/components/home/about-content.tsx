"use client";

import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { sanitizeUrl } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Skills } from "@/components/home/skills";
import { ExperienceDetail } from "@/components/home/experience-detail";
import {
  Activities,
  Education,
  Languages,
  Certifications,
} from "@/components/home/profile-sections";

export function AboutContent() {
  const { t, getLocalized } = useLanguage();
  const { aboutMe } = useSiteData();

  const name = aboutMe?.name || "";
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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        {/* Left: Hey! + bio */}
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl">
            {t("about.hey")}
          </h1>
          {aboutBio && (
            <div className="mt-6 max-w-2xl space-y-4">
              <MarkdownRenderer content={aboutBio} />
            </div>
          )}
        </div>

        {/* Right: portrait */}
        <div>
          {portrait && (
            <Image
              src={portrait}
              alt={name}
              width={640}
              height={800}
              className="w-full rounded-2xl border border-border object-cover"
            />
          )}
        </div>
      </div>

      {/* Experience | Leadership & Activities (side by side) */}
      <div className="mt-16 grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-x-14">
        <ExperienceDetail />
        <Activities />
      </div>

      {/* Education | Languages */}
      <div className="mt-16 grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-x-14">
        <Education />
        <Languages />
      </div>

      {/* Skills | Certifications (side by side) */}
      <div className="mt-16 grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-x-14">
        <Skills />
        <Certifications variant="grid" />
      </div>
    </div>
  );
}