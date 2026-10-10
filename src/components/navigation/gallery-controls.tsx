"use client";

import { useLanguage } from "@/context/language-context";
import {
  galleryNext,
  galleryPrev,
  toggleGalleryThumbs,
  useGallery,
} from "./gallery-store";
import { cn } from "@/lib/utils";

const buttonClass =
  "transition-colors duration-150 disabled:opacity-40 disabled:cursor-default text-muted-foreground hover:text-foreground hover:disabled:text-muted-foreground";

/**
 * Önceki/Sonraki + "küçük resimleri göster/gizle".
 * - `sidebar`: masaüstü sidebar alt bloğu (lg+).
 * - `inline`: mobilde içeriğin (görselin) altında, lg'de gizli.
 */
export function GalleryControls({
  variant = "inline",
}: {
  variant?: "inline" | "sidebar";
}) {
  const gallery = useGallery();
  const { t } = useLanguage();

  if (!gallery.active) return null;

  const prev = (
    <button
      type="button"
      onClick={galleryPrev}
      disabled={!gallery.hasPrev}
      className={cn("px-1", buttonClass)}
    >
      {t("nav.prev")}
    </button>
  );
  const next = (
    <button
      type="button"
      onClick={galleryNext}
      disabled={!gallery.hasNext}
      className={cn("px-1", buttonClass)}
    >
      {t("nav.next")}
    </button>
  );
  const thumbs = (
    <button
      type="button"
      onClick={toggleGalleryThumbs}
      className={cn(
        "px-1 transition-colors duration-150 hover:text-foreground",
        gallery.thumbs ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {gallery.thumbs
        ? t("nav.hideThumbnails")
        : t("nav.showThumbnails")}
    </button>
  );

  if (variant === "sidebar") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          {prev}
          <span className="text-muted-foreground/50">/</span>
          {next}
        </div>
        {thumbs}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border py-1 text-[11px] uppercase tracking-[0.08em] lg:hidden">
      <div className="flex items-center gap-1.5">
        {prev}
        <span className="text-muted-foreground/50">/</span>
        {next}
      </div>
      {thumbs}
    </div>
  );
}
