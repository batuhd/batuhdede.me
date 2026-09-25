"use client";

import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { sanitizeUrl, cn } from "@/lib/utils";
import type { GalleryItem } from "@/types";

const FALLBACK_IMAGES = [
  "/media/102.jpg",
  "/media/401.jpg",
  "/media/503.jpg",
  "/media/530.jpg",
];

const ROTATIONS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3"];

export function PolaroidGallery() {
  const { getLocalized } = useLanguage();
  const { galleryItems } = useSiteData();

  const images = galleryItems.length > 0
    ? galleryItems.map((item: GalleryItem) => ({
        url: sanitizeUrl(item.image_url) || "",
        caption: item.caption ? getLocalized(item, "caption") : null,
      }))
    : FALLBACK_IMAGES.map((url) => ({ url, caption: null }));

  if (images.length === 0) return null;

  return (
    <section className="w-full px-4 pb-20 sm:px-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={img.url + i}
            className={cn(
              "w-full rounded-lg bg-white p-2 pb-3 shadow-xl shadow-black/40 transition-transform duration-300 hover:z-10 hover:rotate-0 sm:p-3 sm:pb-5",
              ROTATIONS[i % ROTATIONS.length],
            )}
          >
            <div className="aspect-square w-full overflow-hidden rounded-sm bg-neutral-200">
              <Image
                src={img.url}
                alt={img.caption || `Photo ${i + 1}`}
                width={600}
                height={600}
                className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
              />
            </div>
            {img.caption && (
              <p className="mt-2 text-center text-[11px] text-neutral-500 sm:text-sm">
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}