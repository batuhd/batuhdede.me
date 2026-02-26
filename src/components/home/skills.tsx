"use client";

import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";

const categoryKeys: Record<string, string> = {
  "Frontend Excellence": "user.skill.frontend",
  "Backend Development": "user.skill.backend",
  "Systems & Multimedia": "user.skill.systems",
};

export function Skills() {
  const { t } = useLanguage();
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">
        {t("home.skills")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {userConfig.skillCategories.map((category) => (
          <div key={category.title} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t(categoryKeys[category.title] || category.title)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
