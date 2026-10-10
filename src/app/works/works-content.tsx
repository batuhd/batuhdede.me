"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { HttpCat } from "@/components/http-cat";
import { cn } from "@/lib/utils";
import type { ProjectWithImages, ProjectCategory } from "@/lib/data";

interface WorksContentProps {
  initialProjects: ProjectWithImages[];
  projectCategories: ProjectCategory[];
}

function resolveImage(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/${image}`;
}

export function WorksContent({
  initialProjects,
  projectCategories,
}: WorksContentProps) {
  const [projects] = useState<ProjectWithImages[]>(initialProjects);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { t, getLocalized } = useLanguage();

  const categoryById = new Map(projectCategories.map((c) => [c.id, c]));
  const categoryName = (categoryId?: string | null) => {
    if (!categoryId) return "";
    const cat = categoryById.get(categoryId);
    return cat ? getLocalized(cat, "name") : "";
  };

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category_id === activeCategory);

  return (
    <div className="w-full px-4 sm:px-5 lg:px-0">
      <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
        {t("works.title")}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {t("works.subtitle")}
      </p>

      {projects.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 px-4 text-center">
          <HttpCat status={204} className="max-w-[280px]" />
          <div className="space-y-1">
            <p className="font-normal text-foreground">{t("works.empty")}</p>
            <p className="text-sm text-muted-foreground">{t("works.emptyDesc")}</p>
          </div>
        </div>
      ) : (
        <>
          {projectCategories.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.08em]">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "transition-colors duration-150",
                  activeCategory === "all"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t("works.filterAll")}
              </button>
              {projectCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "transition-colors duration-150",
                    activeCategory === cat.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {getLocalized(cat, "name")}
                </button>
              ))}
            </div>
          )}

          {filteredProjects.length === 0 ? (
            <div className="mt-10 flex h-64 flex-col items-center justify-center gap-4 px-4 text-center">
              <HttpCat status={204} className="max-w-[280px]" />
              <p className="font-normal text-foreground">{t("works.emptyFilter")}</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const title = getLocalized(project, "title", "Untitled Project");
                const image = resolveImage(project.image);
                const label = categoryName(project.category_id);
                return (
                  <Link
                    key={project.id}
                    href={`/works/${project.slug || project.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
                      {image && (
                        <Image
                          src={image}
                          alt={title}
                          fill
                          sizes="(max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <h2 className="mt-2 text-sm text-foreground">{title}</h2>
                    {label && (
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                        {label}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
