import { NextResponse } from "next/server";
import { buildFeed } from "@/lib/rss";

export const revalidate = 3600;

export async function GET() {
  const xml = await buildFeed("en");

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}