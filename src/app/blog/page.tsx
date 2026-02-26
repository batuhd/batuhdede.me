"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { PenTool, Loader2, Calendar, X, ExternalLink } from "lucide-react";
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

    const blogRef = ref(db, "blog");
    const unsubscribe = onValue(
      blogRef,
      (snapshot) => {
        if (!isMounted) return;
        const data = snapshot.val();
        if (data) {
          const loaded = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setPosts(loaded.reverse());
        } else {
          setPosts([]);
        }
        setLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        console.error("Firebase Blog error:", error);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedPost]);

  return (
    <>
      <div className="space-y-8 sm:space-y-12 pb-24">
        <FadeIn>
          <div className="space-y-2">
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
              <PenTool className="h-8 w-8 text-muted-foreground" />
              {t("blog.title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("blog.subtitle")}
            </p>
          </div>
        </FadeIn>

        {loading ? (
          <FadeIn delay={0.1}>
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t("blog.loading")}</p>
            </div>
          </FadeIn>
        ) : posts.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 text-center">
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
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <FadeIn key={post.id} delay={0.1 + index * 0.05}>
                <article
                  onClick={() => setSelectedPost(post)}
                  className="group flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-primary/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {String(post.date || "Unknown date")}
                      </span>
                      <span>•</span>
                      <span>{String(post.readTime || "5 min read")}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-xl font-semibold tracking-tight transition-colors">
                        {getLocalized(post, "title", "Untitled")}
                      </h2>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0 mt-1" />
                    </div>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {getLocalized(post, "excerpt")}
                    </p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      {/* Blog Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm sm:px-6"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {String(selectedPost.date || "Unknown date")}
                  </span>
                  <span>•</span>
                  <span>{String(selectedPost.readTime || "5 min read")}</span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-6 sm:p-8">
                <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
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
