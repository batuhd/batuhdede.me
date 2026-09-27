import { Suspense } from "react";
import { fetchBlogData, getLocalized } from "@/lib/data";
import { Metadata } from "next";
import { BlogContent } from "./blog-content";
import { siteConfig } from "@/config/site";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/json-ld";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}): Promise<Metadata> {
  const { post } = await searchParams;
  const { blogs } = await fetchBlogData();
  const blog = post ? blogs.find((b) => b.id === post) : null;

  const title = blog ? getLocalized(blog, "title", "en") : "Blog";
  const description = blog
    ? getLocalized(blog, "excerpt", "en")
    : "Thoughts, tutorials, and insights on software development";
  const ogImage = post
    ? `/api/og/blog?post=${encodeURIComponent(post)}`
    : "/opengraph-image";

  const canonical = blog
    ? `${siteConfig.url}/blog?post=${blog.id}`
    : `${siteConfig.url}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: blog ? `/blog?post=${blog.id}` : "/blog",
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog ? title : "Blog — Batuhan Dede",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}) {
  const { post } = await searchParams;
  const { blogs, entityMap, blogCategories } = await fetchBlogData();

  const selectedBlog = post ? blogs.find((b) => b.id === post) : null;
  const articleSchema = selectedBlog
    ? articleJsonLd({
        title: getLocalized(selectedBlog, "title", "en"),
        description: getLocalized(selectedBlog, "excerpt", "en"),
        url: `${siteConfig.url}/blog?post=${selectedBlog.id}`,
        author: siteConfig.name,
        image: selectedBlog.image_url
          ? selectedBlog.image_url.startsWith("/")
            ? `${siteConfig.url}${selectedBlog.image_url}`
            : selectedBlog.image_url
          : undefined,
        datePublished: selectedBlog.date,
      })
    : null;

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    ...(selectedBlog
      ? [
          {
            name: getLocalized(selectedBlog, "title", "en"),
            url: `${siteConfig.url}/blog?post=${selectedBlog.id}`,
          },
        ]
      : []),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {articleSchema && <JsonLd data={articleSchema} />}
      <Suspense fallback={<div className="min-h-screen" />}>
        <BlogContent initialBlogs={blogs} entityMap={entityMap} blogCategories={blogCategories} />
      </Suspense>
    </>
  );
}
