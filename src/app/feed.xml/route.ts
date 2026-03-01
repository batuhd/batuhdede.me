import { NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { siteConfig } from "@/config/site";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
};

function getFirebaseDb() {
  const app =
    getApps().length > 0
      ? getApp()
      : firebaseConfig.apiKey
        ? initializeApp(firebaseConfig)
        : null;
  return app ? getDatabase(app) : null;
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

export async function GET() {
  const db = getFirebaseDb();

  let items = "";
  let lastBuildDate = new Date().toUTCString();

  if (db) {
    try {
      const snapshot = await get(ref(db, "blog"));
      const data = snapshot.val();

      if (data) {
        const posts = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .sort((a: any, b: any) => {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateB - dateA;
          });

        if (posts.length > 0 && posts[0].date) {
          lastBuildDate = parseDate(posts[0].date);
        }

        for (const post of posts) {
          const title = escapeXml(String(post.title || "Untitled"));
          const excerpt = escapeXml(String(post.excerpt || post.content || ""));
          const content = escapeXml(String(post.content || ""));
          const link = `${siteConfig.url}/blog`;
          const pubDate = parseDate(String(post.date || ""));
          const guid = `${siteConfig.url}/blog#${post.id}`;

          items += `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${guid}</guid>
      <description>${excerpt}</description>
      <content:encoded><![CDATA[${String(post.content || "")}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
    </item>`;
        }
      }
    } catch {
      // Firebase read failed, return empty feed
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${siteConfig.url}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>tr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
