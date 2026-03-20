"use client";

import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";

export function Skills() {
  const { t, getLocalized } = useLanguage();
  const { skillCategories, loaded } = useSiteData();

  const displayCategories = skillCategories.length > 0
    ? skillCategories
    : (loaded ? userConfig.skillCategories.map((c, i) => ({ id: String(i), title: c.title, skills: c.skills, order_index: i })) : []);

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">
        {t("home.skills")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {displayCategories.map((category: any) => (
          <div key={category.id} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {skillCategories.length > 0 ? getLocalized(category, "title") : category.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(Array.isArray(category.skills) ? category.skills : []).map((skill: string) => (
                <span
                  key={skill}
                  className="rounded-lg border bg-card px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
