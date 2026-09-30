import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { fetchHomeData, fetchBlogData, fetchWorksData } from "@/lib/data";

export const revalidate = 60;

export async function GET() {
  const baseUrl = siteConfig.url;

  const [homeData, blogData, worksData] = await Promise.all([
    fetchHomeData(),
    fetchBlogData(),
    fetchWorksData(),
  ]);

  const publishedBlogs = blogData.blogs.filter((blog) => blog.is_published);

  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Overview",
    "",
    `${siteConfig.name} is a full-stack, multilingual portfolio website and headless CMS built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase, and Motion.`,
    "",
    "## Important Pages",
    "",
    `- ${baseUrl}/ - Homepage`,
    `- ${baseUrl}/works - Portfolio works`,
    `- ${baseUrl}/blog - Blog posts`,
    `- ${baseUrl}/certifications - Certifications`,
    `- ${baseUrl}/credits - Tech credits and security details`,
    "",
  ];

  if (publishedBlogs.length > 0) {
    lines.push("## Recent Blog Posts", "");
    publishedBlogs.slice(0, 10).forEach((blog) => {
      const title = blog.title || "Untitled";
      lines.push(`- ${baseUrl}/blog/${blog.slug} - ${title}`);
    });
    lines.push("");
  }

  if (worksData.projects.length > 0) {
    lines.push("## Portfolio Works", "");
    worksData.projects.slice(0, 10).forEach((project) => {
      const title = project.title || "Untitled Project";
      lines.push(`- ${baseUrl}/works/${project.slug} - ${title}`);
    });
    lines.push("");
  }

  if (homeData.certifications.length > 0) {
    lines.push("## Certifications", "");
    homeData.certifications.slice(0, 10).forEach((cert) => {
      const name = cert.name || "Untitled Certification";
      lines.push(`- ${baseUrl}/certifications/${cert.slug} - ${name}`);
    });
    lines.push("");
  }

  lines.push(
    "## Content Management",
    "",
    "All content is managed through the built-in admin dashboard at /admin. The site supports 4 languages: English, Turkish, German, and Spanish.",
    "",
    "## Security",
    "",
    "The project uses Row Level Security (RLS) on Supabase, Cloudflare Turnstile bot protection, Next.js middleware with HTTP-only secure cookies, and a strict Content-Security-Policy.",
    "",
  );

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
