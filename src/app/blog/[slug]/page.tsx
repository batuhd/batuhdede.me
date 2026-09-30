import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchBlogData, getLocalized } from "@/lib/data";
import { Metadata } from "next";
import { BlogContent } from "../blog-content";
import { siteConfig } from "@/config/site";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/json-ld";

export const revalidate = 60;

export async function generateStaticParams() {
  const { blogs } = await fetchBlogData();
  return blogs.filter((b) => b.is_published).map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { blogs } = await fetchBlogData();
  const blog = blogs.find((b) => b.slug === slug && b.is_published);

  if (!blog) {
    return { title: "Blog" };
  }

  const title = getLocalized(blog, "title", "en");
  const description = getLocalized(blog, "excerpt", "en");
  const ogImage = `/api/og/blog?slug=${encodeURIComponent(blog.slug)}`;
  const canonical = `${siteConfig.url}/blog/${blog.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: `/blog/${blog.slug}`,
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { blogs, entityMap, blogCategories } = await fetchBlogData();
  const blog = blogs.find((b) => b.slug === slug && b.is_published);
  if (!blog) notFound();

  const articleSchema = articleJsonLd({
    title: getLocalized(blog, "title", "en"),
    description: getLocalized(blog, "excerpt", "en"),
    url: `${siteConfig.url}/blog/${blog.slug}`,
    author: siteConfig.name,
    image: blog.image_url
      ? blog.image_url.startsWith("/")
        ? `${siteConfig.url}${blog.image_url}`
        : blog.image_url
      : undefined,
    datePublished: blog.date,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    {
      name: getLocalized(blog, "title", "en"),
      url: `${siteConfig.url}/blog/${blog.slug}`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <BlogContent
          initialBlogs={blogs}
          entityMap={entityMap}
          blogCategories={blogCategories}
          initialSelectedSlug={blog.slug}
        />
      </Suspense>
    </>
  );
}