"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  PenTool,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Trophy,
  Award,
  Code,
} from "lucide-react";
import { BlogImageGallery } from "@/components/blog/blog-image-gallery";
import { BackButton } from "@/components/ui/back-button";
import { FadeIn } from "@/components/motion/fade-in";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import type { ProjectWithImages } from "@/lib/data";
import type { LinkedEntity } from "@/types";

interface RelatedBlog {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  date: string;
  read_time: string | null;
  linked_project_id?: string | null;
}

interface ProjectDetailProps {
  project: ProjectWithImages;
  entityMap: Record<string, LinkedEntity>;
  relatedBlogs: RelatedBlog[];
  categoryName: string;
  projects: ProjectWithImages[];
}

function hostname(url: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function ProjectDetail({
  project,
  entityMap,
  relatedBlogs,
  categoryName,
  projects,
}: ProjectDetailProps) {
  const { t, getLocalized } = useLanguage();

  const index = projects.findIndex((p) => p.id === project.id);
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject = index >= 0 && index < projects.length - 1 ? projects[index + 1] : null;

  const title = getLocalized(project, "title", "Untitled Project");
  const description = getLocalized(project, "description");

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

  const hasEntities =
    project.linked_experience_id ||
    project.linked_education_id ||
    (project.linked_skill_category_ids &&
      project.linked_skill_category_ids.length > 0) ||
    project.linked_language_id ||
    project.linked_activity_id ||
    project.linked_certification_id;

  const projectBlogs = relatedBlogs.filter(
    (b) => b.linked_project_id === project.id,
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">
      <FadeIn>
        <div className="flex items-center justify-between gap-4">
          <BackButton href="/works" label={t("works.back")} />
          {project.link && (
            <span className="hidden truncate text-xs text-muted-foreground sm:inline">
              {hostname(project.link)}
            </span>
          )}
        </div>

        <header className="mt-8">
          {categoryName && (
            <span className="inline-flex w-fit items-center rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              {categoryName}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-base whitespace-pre-wrap leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </header>

        {(project.image || project.images?.length > 0) && (
          <div className="mt-8">
            <BlogImageGallery
              images={(project.images || []).map((img) => ({
                image_url: img.image_url,
                caption: img.caption || undefined,
              }))}
              mainImage={project.image || undefined}
              title={title}
            />
          </div>
        )}

        <article className="mt-10">
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={String(tag)}
                  className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-white/10"
                >
                  {String(tag)}
                </span>
              ))}
            </div>
          )}

          {hasEntities && (
            <div className="mb-8 flex flex-wrap gap-2">
              {[
                {
                  id: project.linked_experience_id,
                  icon: Briefcase,
                  section: "/#experience",
                },
                {
                  id: project.linked_education_id,
                  icon: GraduationCap,
                  section: "/#education",
                },
                ...(project.linked_skill_category_ids || []).map(
                  (id: string) => ({
                    id,
                    icon: Code,
                    section: "/#skills",
                  }),
                ),
                {
                  id: project.linked_language_id,
                  icon: MessageSquare,
                  section: "/#languages",
                },
                {
                  id: project.linked_activity_id,
                  icon: Trophy,
                  section: "/#activities",
                },
                {
                  id: project.linked_certification_id,
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
                        ? `/certifications/${entity.originalObj?.slug || entity.id}`
                        : section
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium",
                      "text-muted-foreground transition-colors hover:bg-muted",
                    )}
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
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <ExternalLink className="h-4 w-4" />
                {t("works.liveDemo")}
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Github className="h-4 w-4" />
                {t("works.source")}
              </a>
            )}
          </div>

          {projectBlogs.length > 0 && (
            <div className="mt-10 border-t border-border pt-8">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <PenTool className="h-4 w-4" />
                {t("works.relatedBlogs")}
              </h3>
              <div className="space-y-2">
                {projectBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug || blog.id}`}
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
          )}
        </article>

        <nav className="mt-14 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {prevProject ? (
            <Link
              href={`/works/${prevProject.slug || prevProject.id}`}
              className="group flex flex-col gap-1.5 rounded-xl border border-border p-4 transition-colors hover:border-brand/40 hover:bg-muted"
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("works.previous")}
              </span>
              <span className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                {getLocalized(prevProject, "title", "Untitled Project")}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {nextProject && (
            <Link
              href={`/works/${nextProject.slug || nextProject.id}`}
              className="group flex flex-col items-end gap-1.5 rounded-xl border border-border p-4 text-right transition-colors hover:border-brand/40 hover:bg-muted"
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {t("works.next")}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                {getLocalized(nextProject, "title", "Untitled Project")}
              </span>
            </Link>
          )}
        </nav>
      </FadeIn>
    </div>
  );
}