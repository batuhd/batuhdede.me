"use client";

import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { sanitizeUrl } from "@/lib/utils";
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
  const bio = aboutMe ? getLocalized(aboutMe, "bio") : "";
  const paragraphs = bio.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const portrait = aboutMe?.profile_photo_url
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
          <div className="mt-6 max-w-2xl space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-base leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Right: portrait */}
        <div>
          {portrait && (
            <Image
              src={portrait}
              alt={name}
              width={640}
              height={800}
              className="w-full rounded-2xl border border-border object-cover grayscale transition-all duration-500 hover:grayscale-0"
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