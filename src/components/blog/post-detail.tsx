"use client";

import Link from "next/link";
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  FolderKanban,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Trophy,
  Award,
  Code,
  ExternalLink,
} from "lucide-react";
import { BlogImageGallery } from "@/components/blog/blog-image-gallery";
import { ShareButtons } from "@/components/blog/share-buttons";
import { BackButton } from "@/components/ui/back-button";
import { FadeIn } from "@/components/motion/fade-in";
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

export function PostDetail({ post, entityMap, categoryName, posts }: PostDetailProps) {
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
    if (entity.type === "certification")
      return `/certifications/${entity.originalObj?.slug || entity.id}`;
    return section || "#";
  };

  const hasEntities =
    post.linked_project_id ||
    post.linked_experience_id ||
    post.linked_education_id ||
    (post.linked_skill_category_ids && post.linked_skill_category_ids.length > 0) ||
    post.linked_language_id ||
    post.linked_activity_id ||
    post.linked_certification_id;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-10 sm:px-6 sm:pt-14">
      <FadeIn>
        <div className="flex items-center justify-between gap-4">
          <BackButton href="/blog" label={t("blog.back")} />
          <ShareButtons title={title} url={shareUrl} />
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
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {String(post.date || "Unknown date")}
            </span>
            {post.read_time && (
              <>
                <span>&middot;</span>
                <span>
                  {String(post.read_time).replace("min read", t("common.minRead"))}
                </span>
              </>
            )}
          </div>
        </header>

        {(post.image_url || post.images?.length > 0) && (
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
          <div className="prose prose-sm max-w-none leading-relaxed sm:prose-base">
            <MarkdownRenderer content={content} />
          </div>
        </article>

        {hasEntities && (
          <div className="mt-12 space-y-6 border-t border-border pt-8">
            {[
              {
                id: post.linked_project_id,
                icon: FolderKanban,
                typeLabel: t("blog.entityType.work"),
                section: null,
              },
              {
                id: post.linked_experience_id,
                icon: Briefcase,
                typeLabel: t("blog.entityType.experience"),
                section: "/#experience",
              },
              {
                id: post.linked_education_id,
                icon: GraduationCap,
                typeLabel: t("blog.entityType.education"),
                section: "/#education",
              },
              ...(post.linked_skill_category_ids || []).map((id: string) => ({
                id,
                icon: Code,
                typeLabel: t("blog.entityType.skill"),
                section: "/#skills",
              })),
              {
                id: post.linked_language_id,
                icon: MessageSquare,
                typeLabel: t("blog.entityType.language"),
                section: "/#languages",
              },
              {
                id: post.linked_activity_id,
                icon: Trophy,
                typeLabel: t("blog.entityType.activity"),
                section: "/#activities",
              },
              {
                id: post.linked_certification_id,
                icon: Award,
                typeLabel: t("blog.entityType.certification"),
                section: "/#certifications",
              },
            ].map(({ id, icon: Icon, typeLabel, section }) => {
              if (!id) return null;
              const entity = entityMap[id];
              if (!entity) return null;

              return (
                <div key={id}>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    {t("blog.related")} {typeLabel}
                  </h3>
                  <Link
                    href={entityHref(entity, section)}
                    className="group flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:bg-muted"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                          {getEntityTitle(entity)}
                        </h4>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <nav className="mt-14 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug || prevPost.id}`}
              className="group flex flex-col gap-1.5 rounded-xl border border-border p-4 transition-colors hover:border-brand/40 hover:bg-muted"
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("blog.previous")}
              </span>
              <span className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                {getLocalized(prevPost, "title")}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug || nextPost.id}`}
              className="group flex flex-col items-end gap-1.5 rounded-xl border border-border p-4 text-right transition-colors hover:border-brand/40 hover:bg-muted"
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {t("blog.next")}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                {getLocalized(nextPost, "title")}
              </span>
            </Link>
          )}
        </nav>
      </FadeIn>
    </div>
  );
}