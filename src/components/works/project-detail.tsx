"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Trophy,
  Award,
  Code,
} from "lucide-react";
import { BlogImageGallery } from "@/components/blog/blog-image-gallery";
import { BackButton } from "@/components/ui/back-button";
import { useLanguage } from "@/context/language-context";
import { sanitizeUrl } from "@/lib/utils";
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

  const safeProjectLink = sanitizeUrl(project.link);
  const safeProjectGithub = sanitizeUrl(project.github);

  const index = projects.findIndex((p) => p.id === project.id);
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject =
    index >= 0 && index < projects.length - 1 ? projects[index + 1] : null;

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

  const entityLinks = [
    { id: project.linked_experience_id, icon: Briefcase, section: "/about" },
    { id: project.linked_education_id, icon: GraduationCap, section: "/about" },
    ...(project.linked_skill_category_ids || []).map((id: string) => ({
      id,
      icon: Code,
      section: "/about",
    })),
    { id: project.linked_language_id, icon: MessageSquare, section: "/about" },
    { id: project.linked_activity_id, icon: Trophy, section: "/about" },
    { id: project.linked_certification_id, icon: Award, section: "/#certifications" },
  ];

  return (
    <div className="w-full px-4 sm:px-5 lg:px-0">
      <div className="flex items-center justify-between gap-4 lg:hidden">
        <BackButton href="/works" label={t("works.back")} />
      </div>

      <header className="mt-6 max-w-3xl lg:mt-0">
        {categoryName && (
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {categoryName}
          </span>
        )}
        <h1 className="mt-3 text-4xl font-light tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {project.link && (
          <p className="mt-3 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {hostname(project.link)}
          </p>
        )}
      </header>

      {(project.image || (project.images?.length ?? 0) > 0) && (
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

      <article className="mt-10 max-w-3xl">
        {Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {project.tags.map((tag) => (
              <span key={String(tag)}>{String(tag)}</span>
            ))}
          </div>
        )}

        {hasEntities && (
          <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.08em]">
            {entityLinks.map(({ id, icon: Icon, section }) => {
              if (!id) return null;
              const entity = entityMap[id];
              if (!entity) return null;
              return (
                <Link
                  key={id}
                  href={section}
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="max-w-[220px] truncate">
                    {getEntityTitle(entity)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {(safeProjectLink || safeProjectGithub) && (
          <div className="flex flex-wrap items-center gap-6 border-t border-border pt-8 text-[11px] uppercase tracking-[0.08em]">
            {safeProjectLink && (
              <a
                href={safeProjectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 text-foreground transition-colors duration-150 hover:text-muted-foreground"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                {t("works.liveDemo")}
              </a>
            )}
            {safeProjectGithub && (
              <a
                href={safeProjectGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 text-foreground transition-colors duration-150 hover:text-muted-foreground"
              >
                <Github className="h-4 w-4" strokeWidth={1.5} />
                {t("works.source")}
              </a>
            )}
          </div>
        )}

        {projectBlogs.length > 0 && (
          <div className="mt-10 border-t border-border pt-8">
            <h3 className="mb-4 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {t("works.relatedBlogs")}
            </h3>
            <div className="divide-y divide-border">
              {projectBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug || blog.id}`}
                  className="group flex items-center justify-between gap-4 py-3"
                >
                  <span className="min-w-0 truncate text-sm text-foreground">
                    {blog.title}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
                    strokeWidth={1.5}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <nav className="mt-14 flex items-center justify-between gap-6 border-t border-border pt-6">
        {prevProject ? (
          <Link
            href={`/works/${prevProject.slug || prevProject.id}`}
            className="group inline-flex min-h-[44px] items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            <span className="max-w-[180px] truncate">
              {getLocalized(prevProject, "title", "Untitled Project")}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {nextProject && (
          <Link
            href={`/works/${nextProject.slug || nextProject.id}`}
            className="group inline-flex min-h-[44px] items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <span className="max-w-[180px] truncate">
              {getLocalized(nextProject, "title", "Untitled Project")}
            </span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        )}
      </nav>
    </div>
  );
}
