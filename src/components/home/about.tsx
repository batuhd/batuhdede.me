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

      {loaded && aboutMe && (aboutMe.started_coding_year || aboutMe.projects_count || aboutMe.years_experience) && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 pt-6 mt-4 border-t">
          {aboutMe.started_coding_year && (
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">{aboutMe.started_coding_year}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("user.stats.started")}</span>
            </div>
          )}
          {aboutMe.projects_count && (
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">{aboutMe.projects_count}+</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("user.stats.projects")}</span>
            </div>
          )}
          {aboutMe.years_experience && (
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">{aboutMe.years_experience}+</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("user.stats.experience")}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
