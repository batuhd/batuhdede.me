"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import {
  ExternalLink,
  Github,
  Loader2,
  X,
  PenTool,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Trophy,
  Award,
  Code,
  FolderKanban,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import Image from "next/image";
import { BlogImageGallery } from "@/components/blog/blog-image-gallery";
import { cn } from "@/lib/utils";
import type { ProjectWithImages } from "@/lib/data";
import type { LinkedEntity } from "@/types";

interface RelatedBlog {
  id: string;
  title: string;
  excerpt: string | null;
  date: string;
  read_time: string | null;
  linked_project_id?: string | null;
}

interface WorksContentProps {
  initialProjects: ProjectWithImages[];
  entityMap: Record<string, LinkedEntity>;
  relatedBlogs: RelatedBlog[];
}

const GRADIENTS = [
  "from-pink-400 via-rose-400 to-orange-300",
  "from-sky-400 via-blue-400 to-indigo-300",
  "from-lime-300 via-green-400 to-emerald-300",
  "from-fuchsia-400 via-purple-400 to-violet-300",
  "from-amber-300 via-yellow-300 to-lime-300",
  "from-cyan-300 via-teal-400 to-emerald-300",
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
  entityMap,
  relatedBlogs,
}: WorksContentProps) {
  const [projects] = useState<ProjectWithImages[]>(initialProjects);
  const [loading] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithImages | null>(null);
  const { t, getLocalized } = useLanguage();
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("project");

  /* eslint-disable react-hooks/set-state-in-effect */
  // URL'den proje açma/kapatma — client-only deep link senkronizasyonu
  useEffect(() => {
    if (!projectIdFromUrl) {
      setSelectedProject(null);
      return;
    }
    if (projects.length === 0) return;
    const target = projects.find((p) => p.id === projectIdFromUrl);
    if (target) setSelectedProject(target);
  }, [projectIdFromUrl, projects]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const openProject = (project: ProjectWithImages) => {
    setSelectedProject(project);
    window.history.pushState(null, "", `/works?project=${project.id}`);
  };

  const closeProject = () => {
    setSelectedProject(null);
    window.history.replaceState(null, "", "/works");
  };

  // ESC ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        closeProject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

  const getEntityTitle = (entity: LinkedEntity) => {
    if (!entity.originalObj) return entity.title;
    const obj = entity.originalObj as Record<string, unknown>;
    switch (entity.type) {
      case "experience":
        return `${getLocalized(obj, "title")} - ${String(obj.company ?? "")}`;
      case "education":
        return getLocalized(obj, "university");
      case "language":
        return getLocalized(obj, "name");
      case "activity":
        return getLocalized(obj, "organization");
      case "certification":
        return getLocalized(obj, "name");
      case "skill":
        return getLocalized(obj, "title");
      default:
        return entity.title;
    }
  };

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
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {projects.map((project, index) => {
              const title = getLocalized(project, "title", "Untitled Project");
              const description = getLocalized(project, "description");
              const label =
                String(project.category || "") ||
                (Array.isArray(project.tags) && project.tags[0]
                  ? String(project.tags[0])
                  : "");
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
                  <article
                    onClick={() => openProject(project)}
                    className="group cursor-pointer"
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
                  </article>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 px-0 backdrop-blur-sm sm:items-center sm:px-6"
            onClick={() => closeProject()}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:max-h-[85vh] sm:rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="truncate pr-4 text-sm font-medium text-muted-foreground">
                  {getLocalized(selectedProject, "title", "Project")}
                </h2>
                <button
                  onClick={() => closeProject()}
                  className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 sm:p-8">
                {(selectedProject.image ||
                  selectedProject.images?.length > 0) && (
                  <div className="mb-6">
                    <BlogImageGallery
                      images={(selectedProject.images || []).map((img) => ({
                        image_url: img.image_url,
                        caption: img.caption || undefined,
                      }))}
                      mainImage={selectedProject.image || undefined}
                      title={getLocalized(
                        selectedProject,
                        "title",
                        "Untitled Project",
                      )}
                    />
                  </div>
                )}

                <h1 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {getLocalized(selectedProject, "title", "Untitled Project")}
                </h1>

                <p className="mb-6 text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground sm:text-base">
                  {getLocalized(selectedProject, "description")}
                </p>

                {Array.isArray(selectedProject.tags) &&
                  selectedProject.tags.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-1.5">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={String(tag)}
                          className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-white/10"
                        >
                          {String(tag)}
                        </span>
                      ))}
                    </div>
                  )}

                {(() => {
                  const hasEntities =
                    selectedProject.linked_experience_id ||
                    selectedProject.linked_education_id ||
                    (selectedProject.linked_skill_category_ids &&
                      selectedProject.linked_skill_category_ids.length > 0) ||
                    selectedProject.linked_language_id ||
                    selectedProject.linked_activity_id ||
                    selectedProject.linked_certification_id;
                  if (!hasEntities) return null;

                  return (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {[
                        {
                          id: selectedProject.linked_experience_id,
                          icon: Briefcase,
                          section: "/#experience",
                        },
                        {
                          id: selectedProject.linked_education_id,
                          icon: GraduationCap,
                          section: "/#education",
                        },
                        ...(
                          selectedProject.linked_skill_category_ids || []
                        ).map((id: string) => ({
                          id,
                          icon: Code,
                          section: "/#skills",
                        })),
                        {
                          id: selectedProject.linked_language_id,
                          icon: MessageSquare,
                          section: "/#languages",
                        },
                        {
                          id: selectedProject.linked_activity_id,
                          icon: Trophy,
                          section: "/#activities",
                        },
                        {
                          id: selectedProject.linked_certification_id,
                          icon: Award,
                          section: "/#certifications",
                        },
                      ].map(({ id, icon: Icon, section }) => {
                        if (!id) return null;
                        const entity = entityMap[id];
                        if (!entity) return null;

                        return (
                          <Link
                            key={id}
                            href={
                              entity.type === "certification"
                                ? `/certifications?cert=${entity.id}`
                                : section
                            }
                            onClick={() => setSelectedProject(null)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                          >
                            <Icon className="h-3.5 w-3.5 opacity-70" />
                            <span className="max-w-[200px] truncate">
                              {getEntityTitle(entity)}
                            </span>
                            <ExternalLink className="ml-0.5 h-3 w-3 opacity-50" />
                          </Link>
                        );
                      })}
                    </div>
                  );
                })()}

                <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("works.liveDemo")}
                    </a>
                  )}
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Github className="h-4 w-4" />
                      {t("works.source")}
                    </a>
                  )}
                </div>

                {(() => {
                  const projectBlogs = relatedBlogs.filter(
                    (b) => b.linked_project_id === selectedProject.id,
                  );
                  if (projectBlogs.length === 0) return null;
                  return (
                    <div className="mt-6 border-t border-border pt-6">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <PenTool className="h-4 w-4" />
                        {t("works.relatedBlogs")}
                      </h3>
                      <div className="space-y-2">
                        {projectBlogs.map((blog) => (
                          <Link
                            key={blog.id}
                            href={`/blog?post=${blog.id}`}
                            onClick={() => setSelectedProject(null)}
                            className="group flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                          >
                            <div className="min-w-0 flex-1">
                              <h4 className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                                {blog.title}
                              </h4>
                              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                {blog.excerpt}
                              </p>
                            </div>
                            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}