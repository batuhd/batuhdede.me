import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const blockedAgents = [
  // Wayback Machine / Internet Archive
  "ia_archiver",
  "archive.org_bot",
  "Wayback",
  "web.archive.org",
  // AI training / content scrapers
  "CCBot",
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "Claude-Spider",
  "anthropic-ai",
  "Bytespider",
  "PerplexityBot",
  "Perplexity-User",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Google-Extended",
  "Amazonbot",
  "meta-externalagent",
  "cohere-ai",
  "embeddingbot",
  "img2dataset",
  "Webzio",
  "Scrapy",
  "PetalBot",
  "Diffbot",
  "Barkrowler",
  "DataForSeoBot",
  // SEO / analytics crawlers
  "SemrushBot",
  "AhrefsBot",
  "MJ12bot",
  "BLEXBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      // Googlebot: explicitly allowed to crawl and cache everything public
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      // Block archive / AI-training / scraping agents entirely
      ...blockedAgents.map((agent) => ({
        userAgent: agent,
        disallow: "/",
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}