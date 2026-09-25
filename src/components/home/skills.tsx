"use client";

import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { SectionBox } from "@/components/ui/section-box";

interface SkillsCategory {
  id: string;
  title: string;
  skills: string[];
  skills_en?: string[];
  skills_tr?: string[];
  skills_de?: string[];
  skills_es?: string[];
  title_tr?: string;
  title_de?: string;
  title_es?: string;
}

export function Skills() {
  const { t, getLocalized, locale } = useLanguage();
  const { skillCategories, loaded } = useSiteData();

  const displayCategories: SkillsCategory[] =
    skillCategories.length > 0
      ? skillCategories
      : loaded
        ? userConfig.skillCategories.map((c, i) => ({
            id: String(i),
            title: c.title,
            skills: c.skills,
            order_index: i,
          }))
        : [];

  // Get localized skills based on current locale
  const getLocalizedSkills = (category: SkillsCategory): string[] => {
    if (skillCategories.length === 0) {
      return Array.isArray(category.skills) ? category.skills : [];
    }

    // Try to get skills in current locale, fallback to default
    const localizedSkills = category[`skills_${locale}`];
    if (Array.isArray(localizedSkills) && localizedSkills.length > 0) {
      return localizedSkills;
    }

    // Fallback to default skills
    return Array.isArray(category.skills) ? category.skills : [];
  };

  return (
    <section id="skills">
      <SectionBox title={t("home.skills")}>
        <div className="space-y-5">
          {displayCategories.map((category) => (
            <div key={category.id}>
              <h3 className="mb-2.5 text-sm font-semibold text-foreground">
                {skillCategories.length > 0
                  ? getLocalized(category, "title")
                  : category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {getLocalizedSkills(category).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionBox>
    </section>
  );
}