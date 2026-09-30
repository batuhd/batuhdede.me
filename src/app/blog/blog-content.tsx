"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { PenTool, Loader2, Calendar, Rss, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/language-context";
import { SectionBox } from "@/components/ui/section-box";
import { cn } from "@/lib/utils";
import type { BlogWithImages, BlogCategory } from "@/lib/data";

interface BlogContentProps {
  initialBlogs: BlogWithImages[];
  blogCategories: BlogCategory[];
}

function parseDate(dateStr: string | null): number {
  if (!dateStr) return 0;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export function BlogContent({ initialBlogs, blogCategories }: BlogContentProps) {
  // Sadece yayınlanmış blogları göster, en yeni üstte
  const [posts] = useState<BlogWithImages[]>(
    initialBlogs
      .filter((blog) => blog.is_published)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date)),
  );
  const [loading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [rssOpen, setRssOpen] = useState(false);
  const { t, getLocalized } = useLanguage();

  const categoryById = new Map(blogCategories.map((c) => [c.id, c]));
  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category_id === activeCategory);

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
            onClick={(e) => {
              e.preventDefault();
              setRssOpen(true);
            }}
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
            {blogCategories.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
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
                {blogCategories.map((cat) => (
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
            <SectionBox
              title={t("blog.title")}
              badge={
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {filteredPosts.length}
                </span>
              }
            >
              <div className="grid gap-6">
                {filteredPosts.map((post, index) => {
                  const catName = post.category_id
                    ? categoryById.get(post.category_id)
                      ? getLocalized(categoryById.get(post.category_id)!, "name")
                      : ""
                    : "";
                  return (
                  <FadeIn key={post.id} delay={0.05 + index * 0.03}>
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/40 sm:p-7"
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
                      {catName && (
                        <span className="mt-3 w-fit rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                          {catName}
                        </span>
                      )}
                      <h2 className="mt-3 text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
                        {getLocalized(post, "title", "Untitled")}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted-foreground">
                        {getLocalized(post, "excerpt")}
                      </p>
                    </Link>
                  </FadeIn>
                  );
                })}
              </div>
            </SectionBox>
          </div>
        )}
      </div>

      {/* RSS Language Dialog */}
      <AnimatePresence>
        {rssOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => setRssOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
                  <Rss className="h-5 w-5 text-brand" />
                  {t("blog.rss.title")}
                </h3>
                <button
                  onClick={() => setRssOpen(false)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                {t("blog.rss.desc")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setRssOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-medium text-black transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  🇹🇷 {t("blog.rss.tr")}
                </a>
                <a
                  href="/feed-en.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setRssOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  🇬🇧 {t("blog.rss.en")}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}