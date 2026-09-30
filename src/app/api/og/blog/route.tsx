import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { fetchBlogData } from "@/lib/data";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get("slug");

  let title = "Blog";
  let subtitle = "Batuhan Dede";

  if (postSlug) {
    try {
      const { blogs } = await fetchBlogData();
      const post = blogs.find((b) => b.slug === postSlug && b.is_published);
      if (post) {
        title = post.title || title;
        subtitle = post.excerpt || subtitle;
      }
    } catch {
      // fallback to defaults
    }
  }

  const logoPath = join(process.cwd(), "public", "media", "yuvarlaklogobeyaz.png");
  const logoData = readFileSync(logoPath).toString("base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #160b0b 0%, #632626 50%, #9d5353 100%)",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 48,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt=""
            width={80}
            height={80}
            style={{ borderRadius: 16 }}
          />
          <div style={{ fontSize: 28, color: "#dacc96" }}>Batuhan Dede — Blog</div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#dacc96",
            maxWidth: 1000,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
