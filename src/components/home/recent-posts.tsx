"use client";

import Link from "next/link";
import Image from "next/image";
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
          {posts.map((post: Blog) => {
            const image =
              post.image_url &&
              (post.image_url.startsWith("http") || post.image_url.startsWith("/"))
                ? post.image_url
                : post.image_url
                  ? `/${post.image_url}`
                  : null;
            return (
            <Link
              key={post.id}
              href={`/blog/${post.slug || post.id}`}
              className="group flex items-center gap-4 py-3.5"
            >
              <div className="min-w-0 flex-1">
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
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:h-20 sm:w-32">
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9d5353] via-[#bf8b67] to-[#dacc96]" />
                )}
              </div>
            </Link>
            );
          })}
        </div>
      </SectionBox>
    </section>
  );
}