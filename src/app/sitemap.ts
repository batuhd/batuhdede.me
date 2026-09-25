import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { fetchHomeData, fetchBlogData, fetchWorksData } from "@/lib/data";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/works`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/certifications`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/credits`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic content routes
  const [homeData, blogData, worksData] = await Promise.all([
    fetchHomeData(),
    fetchBlogData(),
    fetchWorksData(),
  ]);

  const blogPosts = blogData.blogs
    .filter((blog) => blog.is_published)
    .map((blog) => ({
      url: `${baseUrl}/blog?post=${blog.id}`,
      lastModified: blog.date ? new Date(blog.date) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const projects = worksData.projects.map((project) => ({
    url: `${baseUrl}/works?project=${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const certifications = homeData.certifications.map((cert) => ({
    url: `${baseUrl}/certifications?cert=${cert.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogPosts, ...projects, ...certifications];
}
