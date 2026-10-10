"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Rss, X } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { HttpCat } from "@/components/http-cat";
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

export function BlogContent({
  initialBlogs,
  blogCategories,
}: BlogContentProps) {
  const [posts] = useState<BlogWithImages[]>(
    initialBlogs
      .filter((blog) => blog.is_published)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date)),
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [rssOpen, setRssOpen] = useState(false);
  const { t, getLocalized } = useLanguage();

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category_id === activeCategory);

  return (
    <div className="w-full max-w-[45rem] px-4 sm:px-5 lg:px-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            {t("blog.editorialTitle")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {t("blog.subtitle")}
          </p>
        </div>
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          title="RSS"
          onClick={(e) => {
            e.preventDefault();
            setRssOpen(true);
          }}
          className="flex min-h-[44px] shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          <Rss className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span className="hidden sm:inline">RSS</span>
        </a>
      </div>

      {posts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 px-4 text-center">
          <HttpCat status={204} className="max-w-[280px]" />
          <div className="space-y-1">
            <p className="font-normal text-foreground">{t("blog.empty")}</p>
            <p className="text-sm text-muted-foreground">{t("blog.emptyDesc")}</p>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          {blogCategories.length > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.08em]">
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
              {blogCategories.map((cat) => (
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

          {filteredPosts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4 px-4 text-center">
              <HttpCat status={204} className="max-w-[280px]" />
              <p className="font-normal text-foreground">{t("blog.emptyFilter")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border border-t border-border">
              {filteredPosts.map((post) => {
                const title = getLocalized(post, "title", "Untitled");
                const excerpt = getLocalized(post, "excerpt");
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug || post.id}`}
                    className="group block py-6"
                  >
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      {String(post.date || "")}
                    </p>
                    <h2 className="mt-2 text-xl font-light leading-snug text-foreground transition-opacity duration-150 group-hover:opacity-60 sm:text-2xl">
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="mt-2 line-clamp-2 text-base leading-relaxed text-muted-foreground">
                        {excerpt}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {rssOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 px-4"
            onClick={() => setRssOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm border border-border bg-background p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  <Rss className="h-4 w-4" strokeWidth={1.5} />
                  {t("blog.rss.title")}
                </h3>
                <button
                  type="button"
                  onClick={() => setRssOpen(false)}
                  aria-label="Close"
                  className="p-1 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              <p className="mb-5 text-sm text-muted-foreground">
                {t("blog.rss.desc")}
              </p>
              <div className="flex flex-col divide-y divide-border border-y border-border text-[11px] uppercase tracking-[0.08em]">
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setRssOpen(false)}
                  className="flex min-h-[44px] items-center text-foreground transition-colors duration-150 hover:text-muted-foreground"
                >
                  {t("blog.rss.tr")}
                </a>
                <a
                  href="/feed-en.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setRssOpen(false)}
                  className="flex min-h-[44px] items-center text-foreground transition-colors duration-150 hover:text-muted-foreground"
                >
                  {t("blog.rss.en")}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
