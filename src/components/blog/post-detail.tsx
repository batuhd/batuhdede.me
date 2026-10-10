"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FolderKanban,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Trophy,
  Award,
  Code,
} from "lucide-react";
import { BlogImageGallery } from "@/components/blog/blog-image-gallery";
import { ShareButtons } from "@/components/blog/share-buttons";
import { BackButton } from "@/components/ui/back-button";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { useLanguage } from "@/context/language-context";
import type { BlogWithImages } from "@/lib/data";
import type { LinkedEntity } from "@/types";

interface PostDetailProps {
  post: BlogWithImages;
  entityMap: Record<string, LinkedEntity>;
  categoryName: string;
  posts: BlogWithImages[];
}

export function PostDetail({
  post,
  entityMap,
  categoryName,
  posts,
}: PostDetailProps) {
  const { t, getLocalized } = useLanguage();

  const index = posts.findIndex((p) => p.id === post.id);
  const prevPost = index > 0 ? posts[index - 1] : null;
  const nextPost = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;

  const title = getLocalized(post, "title", "Untitled");
  const content = getLocalized(post, "content") || "";
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${post.slug || post.id}`;

  const getEntityTitle = (entity: LinkedEntity) => {
    if (!entity.originalObj) return entity.title;
    switch (entity.type) {
      case "project":
        return getLocalized(entity.originalObj, "title");
      case "experience":
        return `${getLocalized(entity.originalObj, "title")} - ${entity.originalObj.company}`;
      case "education":
        return getLocalized(entity.originalObj, "university");
      case "language":
        return getLocalized(entity.originalObj, "name");
      case "activity":
        return getLocalized(entity.originalObj, "organization");
      case "certification":
        return getLocalized(entity.originalObj, "name");
      case "skill":
        return getLocalized(entity.originalObj, "title");
      default:
        return entity.title;
    }
  };

  const entityHref = (entity: LinkedEntity, section: string | null) => {
    if (entity.type === "project")
      return `/works/${entity.originalObj?.slug || entity.id}`;
    if (entity.type === "certification") return "/#certifications";
    return section || "#";
  };

  const entities = [
    { id: post.linked_project_id, icon: FolderKanban, typeLabel: t("blog.entityType.work"), section: null },
    { id: post.linked_experience_id, icon: Briefcase, typeLabel: t("blog.entityType.experience"), section: "/about" },
    { id: post.linked_education_id, icon: GraduationCap, typeLabel: t("blog.entityType.education"), section: "/about" },
    ...(post.linked_skill_category_ids || []).map((id: string) => ({
      id,
      icon: Code,
      typeLabel: t("blog.entityType.skill"),
      section: "/about",
    })),
    { id: post.linked_language_id, icon: MessageSquare, typeLabel: t("blog.entityType.language"), section: "/about" },
    { id: post.linked_activity_id, icon: Trophy, typeLabel: t("blog.entityType.activity"), section: "/about" },
    { id: post.linked_certification_id, icon: Award, typeLabel: t("blog.entityType.certification"), section: "/#certifications" },
  ];

  return (
    <div className="w-full max-w-[45rem] px-4 sm:px-5 lg:px-0">
      <div className="flex items-center justify-between gap-4 lg:hidden">
        <BackButton href="/blog" label={t("blog.back")} />
        <ShareButtons title={title} url={shareUrl} />
      </div>

      <header className="mt-6 lg:mt-0">
        {categoryName && (
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {categoryName}
          </span>
        )}
        <h1 className="mt-3 text-4xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          <span>{String(post.date || "")}</span>
          {post.read_time && (
            <>
              <span className="text-muted-foreground/50">/</span>
              <span>
                {String(post.read_time).replace("min read", t("common.minRead"))}
              </span>
            </>
          )}
        </div>
      </header>

      {(post.image_url || (post.images?.length ?? 0) > 0) && (
        <div className="mt-8">
          <BlogImageGallery
            images={(post.images || []).map((img) => ({
              image_url: img.image_url,
              caption: img.caption || undefined,
            }))}
            mainImage={post.image_url || undefined}
            title={title}
          />
        </div>
      )}

      <article className="mt-10">
        <div className="prose max-w-none leading-relaxed">
          <MarkdownRenderer content={content} />
        </div>
      </article>

      {entities.some((e) => e.id) && (
        <div className="mt-12 border-t border-border pt-6">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.08em]">
            {entities.map(({ id, icon: Icon, typeLabel, section }) => {
              if (!id) return null;
              const entity = entityMap[id];
              if (!entity) return null;
              return (
                <Link
                  key={id}
                  href={entityHref(entity, section)}
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="max-w-[220px] truncate">
                    {t("blog.related")} {typeLabel}: {getEntityTitle(entity)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <nav className="mt-14 flex items-center justify-between gap-6 border-t border-border pt-6">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug || prevPost.id}`}
            className="group inline-flex min-h-[44px] items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            <span className="max-w-[180px] truncate">
              {getLocalized(prevPost, "title")}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug || nextPost.id}`}
            className="group inline-flex min-h-[44px] items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <span className="max-w-[180px] truncate">
              {getLocalized(nextPost, "title")}
            </span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        )}
      </nav>
    </div>
  );
}
