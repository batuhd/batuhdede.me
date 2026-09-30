import { Suspense } from "react";
import { fetchBlogData } from "@/lib/data";
import { Metadata } from "next";
import { BlogContent } from "./blog-content";
import { siteConfig } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description: "Thoughts, tutorials, and insights on software development",
    alternates: {
      canonical: `${siteConfig.url}/blog`,
    },
    openGraph: {
      title: "Blog",
      description: "Thoughts, tutorials, and insights on software development",
      url: "/blog",
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Blog — Batuhan Dede",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog",
      description: "Thoughts, tutorials, and insights on software development",
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogPage() {
  const { blogs, blogCategories } = await fetchBlogData();

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <BlogContent
          initialBlogs={blogs}
          blogCategories={blogCategories}
        />
      </Suspense>
    </>
  );
}