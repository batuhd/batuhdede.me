"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import {
  PenTool,
  Loader2,
  Calendar,
  X,
  ExternalLink,
  Rss,
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
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/language-context";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { SectionBox } from "@/components/ui/section-box";
import type { BlogWithImages } from "@/lib/data";
import type { LinkedEntity } from "@/types";

interface BlogContentProps {
  initialBlogs: BlogWithImages[];
  entityMap: Record<string, LinkedEntity>;
}

function parseDate(dateStr: string | null): number {
  if (!dateStr) return 0;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export function BlogContent({ initialBlogs, entityMap }: BlogContentProps) {
  // Sadece yayınlanmış blogları göster, en yeni üstte
  const [posts] = useState<BlogWithImages[]>(
    initialBlogs
      .filter((blog) => blog.is_published)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date)),
  );
  const [loading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogWithImages | null>(null);
  const { t, getLocalized } = useLanguage();
  const searchParams = useSearchParams();
  const postIdFromUrl = searchParams.get("post");

  /* eslint-disable react-hooks/set-state-in-effect */
  // URL'den post açma/kapatma — client-only deep link senkronizasyonu
  useEffect(() => {
    if (!postIdFromUrl) {
      setSelectedPost(null);
      return;
    }
    if (posts.length === 0) return;
    const target = posts.find((p) => p.id === postIdFromUrl);
    if (target) setSelectedPost(target);
  }, [postIdFromUrl, posts]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const openPost = (post: BlogWithImages) => {
    setSelectedPost(post);
    window.history.pushState(null, "", `/blog?post=${post.id}`);
  };

  const closePost = () => {
    setSelectedPost(null);
    window.history.replaceState(null, "", "/blog");
  };

  // ESC ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPost) {
        closePost();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = selectedPost ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedPost]);

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

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              {t("blog.editorialTitle")}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              {t("blog.subtitle")}
            </p>
          </div>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            title="RSS Feed"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Rss className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">RSS</span>
          </a>
        </div>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("blog.loading")}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 px-4 text-center">
            <PenTool className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">{t("blog.empty")}</p>
              <p className="text-sm text-muted-foreground">{t("blog.emptyDesc")}</p>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <SectionBox
              title={t("blog.title")}
              badge={
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {posts.length}
                </span>
              }
            >
              <div className="grid gap-6">
                {posts.map((post, index) => (
                  <FadeIn key={post.id} delay={0.05 + index * 0.03}>
                    <article
                      onClick={() => openPost(post)}
                      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/40 sm:p-7"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {String(post.date || "Unknown date")}
                        </span>
                        {post.read_time && (
                          <span className="text-xs text-muted-foreground/70">
                            {String(post.read_time).replace(
                              "min read",
                              t("common.minRead"),
                            )}
                          </span>
                        )}
                      </div>
                      <h2 className="mt-4 text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
                        {getLocalized(post, "title", "Untitled")}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted-foreground">
                        {getLocalized(post, "excerpt")}
                      </p>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </SectionBox>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 px-0 backdrop-blur-sm sm:items-center sm:px-6"
            onClick={() => closePost()}
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
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {String(selectedPost.date || "Unknown date")}
                  </span>
                  <span>&middot;</span>
                  <span>
                    {String(selectedPost.read_time || "5 min read").replace(
                      "min read",
                      t("common.minRead"),
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButtons
                    title={getLocalized(selectedPost, "title", "Untitled")}
                    url={`${typeof window !== "undefined" ? window.location.origin : ""}/blog?post=${selectedPost.id}`}
                  />
                  <button
                    onClick={() => closePost()}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4 sm:p-8">
                {(selectedPost.image_url ||
                  selectedPost.images?.length > 0) && (
                  <div className="mb-6">
                    <BlogImageGallery
                      images={(selectedPost.images || []).map((img) => ({
                        image_url: img.image_url,
                        caption: img.caption || undefined,
                      }))}
                      mainImage={selectedPost.image_url || undefined}
                      title={getLocalized(selectedPost, "title", "Untitled")}
                    />
                  </div>
                )}
                <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {getLocalized(selectedPost, "title", "Untitled")}
                </h1>
                <div className="prose prose-sm max-w-none leading-relaxed sm:prose-base">
                  <MarkdownRenderer
                    content={getLocalized(selectedPost, "content") || ""}
                  />
                </div>

                {/* Related Entities */}
                {(() => {
                  const hasEntities =
                    selectedPost.linked_project_id ||
                    selectedPost.linked_experience_id ||
                    selectedPost.linked_education_id ||
                    (selectedPost.linked_skill_category_ids &&
                      selectedPost.linked_skill_category_ids.length > 0) ||
                    selectedPost.linked_language_id ||
                    selectedPost.linked_activity_id ||
                    selectedPost.linked_certification_id;
                  if (!hasEntities) return null;

                  return (
                    <div className="mt-8 space-y-6 border-t border-border pt-6">
                      {[
                        {
                          id: selectedPost.linked_project_id,
                          icon: FolderKanban,
                          typeLabel: t("blog.entityType.work"),
                          section: null,
                        },
                        {
                          id: selectedPost.linked_experience_id,
                          icon: Briefcase,
                          typeLabel: t("blog.entityType.experience"),
                          section: "/#experience",
                        },
                        {
                          id: selectedPost.linked_education_id,
                          icon: GraduationCap,
                          typeLabel: t("blog.entityType.education"),
                          section: "/#education",
                        },
                        ...(selectedPost.linked_skill_category_ids || []).map(
                          (id: string) => ({
                            id,
                            icon: Code,
                            typeLabel: t("blog.entityType.skill"),
                            section: "/#skills",
                          }),
                        ),
                        {
                          id: selectedPost.linked_language_id,
                          icon: MessageSquare,
                          typeLabel: t("blog.entityType.language"),
                          section: "/#languages",
                        },
                        {
                          id: selectedPost.linked_activity_id,
                          icon: Trophy,
                          typeLabel: t("blog.entityType.activity"),
                          section: "/#activities",
                        },
                        {
                          id: selectedPost.linked_certification_id,
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
                            <div
                              onClick={() => {
                                if (entity.type === "project") {
                                  window.location.href = `/works?project=${entity.id}`;
                                } else if (entity.type === "certification") {
                                  window.location.href = `/?cert=${entity.id}#certifications`;
                                } else {
                                  window.location.href = section || "#";
                                }
                              }}
                              className="group flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 transition-all hover:bg-muted"
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
                            </div>
                          </div>
                        );
                      })}
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