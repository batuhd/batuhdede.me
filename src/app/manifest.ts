import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Batuhan",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#632626",
    theme_color: "#632626",
    icons: [
      {
        src: "/media/yuvarlaklogobeyaz.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/media/yuvarlaklogobeyaz.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
