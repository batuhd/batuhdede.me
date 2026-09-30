import { createClient } from "@supabase/supabase-js";
import { siteConfig } from "@/config/site";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toUTCString();
    return date.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

/** Yayınlanmış bloglardan TR veya EN RSS feed'i üretir. */
export async function buildFeed(lang: "tr" | "en"): Promise<string> {
  const supabase = getSupabase();

  let items = "";
  let lastBuildDate = new Date().toUTCString();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        if (data[0].date) {
          lastBuildDate = parseDate(data[0].date);
        }

        for (const post of data) {
          const titleRaw =
            lang === "tr" ? post.title_tr || post.title : post.title;
          const excerptRaw =
            lang === "tr"
              ? post.excerpt_tr || post.excerpt || post.content_tr || post.content
              : post.excerpt || post.content;
          const contentRaw =
            lang === "tr" ? post.content_tr || post.content : post.content;

          const title = escapeXml(String(titleRaw || "Untitled"));
          const excerpt = escapeXml(String(excerptRaw || ""));
          const link = `${siteConfig.url}/blog/${String(post.slug || post.id)}`;
          const pubDate = parseDate(String(post.date || ""));
          const guid = `${siteConfig.url}/blog/${String(post.slug || post.id)}`;
          // Escape CDATA terminator to prevent XML injection via blog content
          const content = String(contentRaw || "").replace(
            /]]>/g,
            "]]]]><![CDATA[>",
          );

          items += `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${guid}</guid>
      <description>${excerpt}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
    </item>`;
        }
      }
    } catch {
      // Supabase read failed, return empty feed
    }
  }

  const languageLabel = lang === "tr" ? "tr" : "en";
  const feedPath = lang === "tr" ? "feed.xml" : "feed-en.xml";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog (${lang === "tr" ? "Türkçe" : "English"})</title>
    <link>${siteConfig.url}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${languageLabel}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteConfig.url}/${feedPath}" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`;
}