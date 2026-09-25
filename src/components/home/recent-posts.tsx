"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { SectionBox } from "@/components/ui/section-box";
import { ArrowUpRight } from "lucide-react";
import type { Blog } from "@/types";

function parseDate(dateStr: string | null): number {
  if (!dateStr) return 0;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export function RecentPosts() {
  const { t, getLocalized } = useLanguage();
  const { blogs } = useSiteData();

  const posts = blogs
    .filter((b) => b.is_published !== false)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog">
      <SectionBox
        title={t("blog.recent")}
        badge={
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {posts.length}
          </span>
        }
        actions={
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
          >
            {t("blog.viewAll")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="divide-y divide-border">
          {posts.map((post: Blog) => (
            <Link
              key={post.id}
              href={`/blog?post=${post.id}`}
              className="group flex items-start justify-between gap-4 py-3.5"
            >
              <div className="min-w-0">
                <h3 className="font-bold text-foreground transition-colors group-hover:text-brand">
                  {getLocalized(post, "title", "Untitled")}
                </h3>
                {getLocalized(post, "excerpt") && (
                  <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {getLocalized(post, "excerpt")}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">{post.date}</p>
              </div>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
            </Link>
          ))}
        </div>
      </SectionBox>
    </section>
  );
}