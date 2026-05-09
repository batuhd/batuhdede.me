import { Suspense } from "react";
import { fetchBlogData } from "@/lib/data";
import { Metadata } from "next";
import { BlogContent } from "./blog-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog - Batuhan Akçan",
  description: "Thoughts, tutorials, and insights on software development",
};

export default async function BlogPage() {
  const { blogs, entityMap } = await fetchBlogData();

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <BlogContent initialBlogs={blogs} entityMap={entityMap} />
    </Suspense>
  );
}
