"use client";

import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";

export function About() {
  const { t, getLocalized } = useLanguage();
  const { aboutMe, loaded } = useSiteData();

  const bio = aboutMe ? getLocalized(aboutMe, "bio") : null;

  return (
    <section className="space-y-4" id="about">
      <h2 className="text-lg font-semibold tracking-tight">
        {t("home.about")}
      </h2>
      <p className="leading-relaxed text-muted-foreground">
        {loaded ? (bio || t("user.about")) : ""}
      </p>
    </section>
  );
}
