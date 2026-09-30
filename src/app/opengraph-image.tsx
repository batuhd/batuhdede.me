import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #160b0b 0%, #632626 50%, #9d5353 100%)",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
          padding: 60,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={180}
          height={180}
          style={{
            borderRadius: 32,
            marginBottom: 40,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#dacc96",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
