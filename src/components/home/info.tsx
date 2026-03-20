"use client";

import Image from "next/image";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";

export function Info() {
  const { getLocalized } = useLanguage();
  const { aboutMe, loaded } = useSiteData();

  const name = aboutMe?.name || userConfig.name;
  const tagline = aboutMe ? (getLocalized(aboutMe, "hero_tagline") || userConfig.heroTagline) : (loaded ? userConfig.heroTagline : "");

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-3 sm:gap-4">
        <Image
          src="/media/yuvarlaklogobeyaz.png"
          alt="Logo"
          width={44}
          height={44}
          className="hidden dark:block rounded-full sm:w-12 sm:h-12"
          priority
        />
        <Image
          src="/media/yuvarlaklogo.png"
          alt="Logo"
          width={44}
          height={44}
          className="dark:hidden rounded-full sm:w-12 sm:h-12"
          priority
        />
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
          {loaded ? name : ""}
        </h1>
      </div>
      <p className="text-base sm:text-lg text-muted-foreground">
        {tagline}
      </p>
    </section>
  );
}
