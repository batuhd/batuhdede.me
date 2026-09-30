"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { FolderKanban, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import type { ProjectWithImages, ProjectCategory } from "@/lib/data";

interface WorksContentProps {
  initialProjects: ProjectWithImages[];
  projectCategories: ProjectCategory[];
}

const GRADIENTS = [
  "from-[#9d5353] via-[#bf8b67] to-[#dacc96]",
  "from-[#632626] via-[#9d5353] to-[#bf8b67]",
  "from-[#bf8b67] via-[#dacc96] to-[#9d5353]",
  "from-[#632626] via-[#bf8b67] to-[#dacc96]",
  "from-[#9d5353] via-[#632626] to-[#bf8b67]",
  "from-[#dacc96] via-[#bf8b67] to-[#632626]",
];

function hostname(url: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function WorksContent({
  initialProjects,
  projectCategories,
}: WorksContentProps) {
  const [projects] = useState<ProjectWithImages[]>(initialProjects);
  const [loading] = useState(false);
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
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          {t("works.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {t("works.subtitle")}
        </p>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("works.loading")}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 px-4 text-center">
            <FolderKanban className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">{t("works.empty")}</p>
              <p className="text-sm text-muted-foreground">{t("works.emptyDesc")}</p>
            </div>
          </div>
        ) : (
          <>
            {projectCategories.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    activeCategory === "all"
                      ? "border-brand bg-brand text-black"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("works.filterAll")}
                </button>
                {projectCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      activeCategory === cat.id
                        ? "border-brand bg-brand text-black"
                        : "border-border bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {getLocalized(cat, "name")}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {filteredProjects.map((project, index) => {
                const title = getLocalized(project, "title", "Untitled Project");
                const description = getLocalized(project, "description");
                const label = categoryName(project.category_id);
                const image =
                  project.image &&
                  (project.image.startsWith("http") || project.image.startsWith("/"))
                    ? project.image
                    : project.image
                      ? `/${project.image}`
                      : null;
                const gradient = GRADIENTS[index % GRADIENTS.length];

              return (
                <FadeIn key={project.id} delay={0.05 + index * 0.03}>
                  <Link
                    href={`/works/${project.slug || project.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card">
                      {image ? (
                        <Image
                          src={image}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
                      )}
                      <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <div className="flex items-start justify-between gap-2">
                          {label && (
                            <span className="rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                              {label}
                            </span>
                          )}
                          {project.link && (
                            <span className="text-xs text-white/80">
                              {hostname(project.link)}
                            </span>
                          )}
                        </div>
                        <div className="rounded-xl bg-black/30 p-3 backdrop-blur-md">
                          <h3 className="text-lg font-bold text-white sm:text-xl">{title}</h3>
                          {description && (
                            <p className="mt-1 line-clamp-2 text-xs text-neutral-200">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
            </div>
          </>
        )}
      </div>
    </>
  );
}