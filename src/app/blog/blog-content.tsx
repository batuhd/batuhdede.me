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
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { sanitizeUrl } from "@/lib/utils";
import type { BlogWithImages } from "@/lib/data";

const customSchema = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema.attributes || {}),
    "*": [...(defaultSchema.attributes?.["*"] || []), "className"],
  },
};

interface LinkedEntity {
  id: string;
  title: string;
  type: string;
  originalObj: any;
}

interface BlogContentProps {
  initialBlogs: BlogWithImages[];
  entityMap: Record<string, LinkedEntity>;
}

export function BlogContent({ initialBlogs, entityMap }: BlogContentProps) {
  const [posts] = useState<BlogWithImages[]>(initialBlogs);
  const [loading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogWithImages | null>(null);
  const { t, getLocalized } = useLanguage();
  const searchParams = useSearchParams();
  const postIdFromUrl = searchParams.get("post");

  // URL'den post açma
  useEffect(() => {
    if (postIdFromUrl && posts.length > 0 && !selectedPost) {
      const target = posts.find((p) => p.id === postIdFromUrl);
      if (target) setSelectedPost(target);
    }
  }, [postIdFromUrl, posts, selectedPost]);

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
      <div className="space-y-8 sm:space-y-12 pb-24 max-w-2xl mx-auto w-full">
        <FadeIn>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-3 text-2xl sm:text-4xl font-bold tracking-tight">
                <PenTool className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                {t("blog.title")}
              </h1>
              <a
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                title="RSS Feed"
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Rss className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">RSS</span>
              </a>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground">
              {t("blog.subtitle")}
            </p>
          </div>
        </FadeIn>

        {loading ? (
          <FadeIn delay={0.1}>
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t("blog.loading")}
              </p>
            </div>
          </FadeIn>
        ) : posts.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 text-center px-4">
              <PenTool className="h-10 w-10 text-muted-foreground/50" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">{t("blog.empty")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("blog.emptyDesc")}
                </p>
              </div>
            </div>
          </FadeIn>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {posts.map((post, index) => (
              <FadeIn key={post.id} delay={0.1 + index * 0.05}>
                <article
                  onClick={() => setSelectedPost(post)}
                  className="group flex flex-col justify-between rounded-2xl border bg-card p-5 sm:p-6 shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-primary/50 active:scale-[0.99]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {String(post.date || "Unknown date")}
                      </span>
                      <span className="hidden sm:inline">&middot;</span>
                      <span className="hidden sm:inline">
                        {String(post.read_time || "5 min read").replace(
                          "min read",
                          t("common.minRead"),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-lg sm:text-xl font-semibold tracking-tight transition-colors">
                        {getLocalized(post, "title", "Untitled")}
                      </h2>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0 mt-1 hidden sm:block" />
                    </div>

                    {post.image_url && typeof post.image_url === "string" && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted mt-2 mb-2">
                        <img
                          src={
                            post.image_url.startsWith("http") ||
                            post.image_url.startsWith("/")
                              ? post.image_url
                              : `/${post.image_url}`
                          }
                          alt={String(post.title || "")}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Linked Entity Badges */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {[
                        {
                          id: post.linked_project_id,
                          icon: FolderKanban,
                          section: null,
                        },
                        {
                          id: post.linked_experience_id,
                          icon: Briefcase,
                          section: "/#experience",
                        },
                        {
                          id: post.linked_education_id,
                          icon: GraduationCap,
                          section: "/#education",
                        },
                        ...(post.linked_skill_category_ids || []).map(
                          (id: string) => ({
                            id,
                            icon: Code,
                            section: "/#skills",
                          }),
                        ),
                        {
                          id: post.linked_language_id,
                          icon: MessageSquare,
                          section: "/#languages",
                        },
                        {
                          id: post.linked_activity_id,
                          icon: Trophy,
                          section: "/#activities",
                        },
                        {
                          id: post.linked_certification_id,
                          icon: Award,
                          section: "/#certifications",
                        },
                      ].map(({ id, icon: Icon, section }) => {
                        if (!id) return null;
                        const entity = entityMap[id];
                        if (!entity) return null;

                        return (
                          <div
                            key={id}
                            className="inline-flex w-fit items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground cursor-pointer hover:bg-secondary/70 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (entity.type === "project") {
                                window.location.href = `/works?project=${entity.id}`;
                              } else {
                                window.location.href = section || "#";
                              }
                            }}
                          >
                            <span className="opacity-70 flex items-center">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="truncate max-w-[200px]">
                              {entity.type === "project"
                                ? t("blog.entityType.work")
                                : getEntityTitle(entity)}
                            </span>
                            <ExternalLink className="h-3 w-3 opacity-50 ml-0.5" />
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
                      {getLocalized(post, "excerpt")}
                    </p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-background/80 px-0 sm:px-6 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] sm:max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4">
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
                    excerpt={getLocalized(selectedPost, "excerpt", "")}
                  />
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
                <h1 className="mb-6 text-xl sm:text-3xl font-bold tracking-tight">
                  {getLocalized(selectedPost, "title", "Untitled")}
                </h1>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed">
                  <ReactMarkdown
                    rehypePlugins={[[rehypeSanitize, customSchema]]}
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      a: ({ node, ...props }) => {
                        const href = props.href || "";
                        const safeHref = sanitizeUrl(href);
                        return safeHref ? (
                          <a
                            {...props}
                            href={safeHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          />
                        ) : (
                          <>{props.children}</>
                        );
                      },
                      img: ({ node, src, ...props }) => {
                        const srcStr = typeof src === "string" ? src : "";
                        const safeSrc = sanitizeUrl(srcStr);
                        return safeSrc ? (
                          <img
                            {...props}
                            src={safeSrc}
                            className="rounded-lg my-4 max-w-full"
                          />
                        ) : null;
                      },
                    }}
                  >
                    {getLocalized(selectedPost, "content") || ""}
                  </ReactMarkdown>
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
                    <div className="mt-8 pt-6 border-t space-y-6">
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
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-4">
                              <Icon className="h-4 w-4" />
                              {t("blog.related")} {typeLabel}
                            </h3>
                            <div
                              onClick={() => {
                                if (entity.type === "project") {
                                  window.location.href = `/works?project=${entity.id}`;
                                } else {
                                  window.location.href = section || "#";
                                }
                              }}
                              className="flex items-center justify-between rounded-xl border p-4 transition-all hover:bg-muted/50 hover:border-primary/30 cursor-pointer group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                    {getEntityTitle(entity)}
                                  </h4>
                                </div>
                              </div>
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
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
