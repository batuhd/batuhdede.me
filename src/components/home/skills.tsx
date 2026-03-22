"use client";

import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { FolderKanban, PenTool } from "lucide-react";

export function Skills() {
  const { t, getLocalized } = useLanguage();
  const { skillCategories, loaded, projects, blogs } = useSiteData();

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
            {(() => {
              const relatedProjects = projects ? projects.filter((p: any) => p.linked_skill_category_ids?.includes(category.id)) : [];
              const relatedBlogs = blogs ? blogs.filter((b: any) => b.linked_skill_category_ids?.includes(category.id)) : [];
              if (relatedProjects.length === 0 && relatedBlogs.length === 0) return null;
              
              return (
                <div className="pt-2 mt-2 border-t border-border/50 flex flex-wrap gap-2">
                  {relatedProjects.map((p: any) => (
                    <a key={p.id} href={`/works?project=${p.id}`} className="inline-flex items-center gap-1.5 rounded-[4px] bg-background/50 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground hover:bg-background/80 hover:text-foreground transition-colors border shadow-sm group/link">
                      <FolderKanban className="h-3 w-3 opacity-70" />
                      <span>{getLocalized(p, "title")}</span>
                    </a>
                  ))}
                  {relatedBlogs.map((b: any) => (
                    <a key={b.id} href={`/blog?post=${b.id}`} className="inline-flex items-center gap-1.5 rounded-[4px] bg-background/50 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground hover:bg-background/80 hover:text-foreground transition-colors border shadow-sm group/link">
                      <PenTool className="h-3 w-3 opacity-70" />
                      <span>{getLocalized(b, "title")}</span>
                    </a>
                  ))}
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </section>
  );
}
