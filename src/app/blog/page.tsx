"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { PenTool, Loader2, Calendar, X, ExternalLink, Rss } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/language-context";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { t, getLocalized } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onValue(
      ref(db, "blog"),
      (snapshot) => {
        if (!isMounted) return;
        const data = snapshot.val();
        setPosts(
          data
            ? Object.keys(data)
                .map((key) => ({ id: key, ...data[key] }))
                .reverse()
            : []
        );
        setLoading(false);
      },
      () => {
        if (isMounted) setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedPost ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedPost]);

  return (
    <>
      <div className="space-y-8 sm:space-y-12 pb-24">
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
                <p className="font-medium text-foreground">
                  {t("blog.empty")}
                </p>
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
                        {String(post.readTime || "5 min read")}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-lg sm:text-xl font-semibold tracking-tight transition-colors">
                        {getLocalized(post, "title", "Untitled")}
                      </h2>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0 mt-1 hidden sm:block" />
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
                  <span>{String(selectedPost.readTime || "5 min read")}</span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 sm:p-8">
                <h1 className="mb-6 text-xl sm:text-3xl font-bold tracking-tight">
                  {getLocalized(selectedPost, "title", "Untitled")}
                </h1>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {getLocalized(selectedPost, "content")}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
