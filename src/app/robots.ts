import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      // Block Wayback Machine / Internet Archive
      {
        userAgent: "ia_archiver",
        disallow: "/",
      },
      {
        userAgent: "archive.org_bot",
        disallow: "/",
      },
    ],
  };
}
