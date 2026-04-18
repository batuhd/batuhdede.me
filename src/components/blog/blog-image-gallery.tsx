"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface BlogImageGalleryProps {
  images: { image_url: string; caption?: string }[];
  mainImage?: string;
  title: string;
}

export function BlogImageGallery({
  images,
  mainImage,
  title,
}: BlogImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Main image + additional images
  const allImages = mainImage
    ? [{ image_url: mainImage, caption: undefined }, ...images]
    : images;

  if (allImages.length === 0) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Main Gallery Display */}
      <div className="space-y-3">
        {/* Main Image */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted cursor-pointer group"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={allImages[currentIndex]?.image_url}
            alt={`${title} - ${currentIndex + 1}`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Navigation Arrows (only if multiple images) */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium">
                {currentIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Navigation (only if multiple images) */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={cn(
                  "relative flex-shrink-0 h-16 w-24 overflow-hidden rounded-lg border-2 transition-all",
                  idx === currentIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/30",
                )}
              >
                <img
                  src={img.image_url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Caption */}
        {allImages[currentIndex]?.caption && (
          <p className="text-sm text-muted-foreground text-center">
            {allImages[currentIndex].caption}
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-4"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-background/20 p-2 text-white hover:bg-background/30 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[80vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={allImages[currentIndex]?.image_url}
                alt={`${title} - ${currentIndex + 1}`}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
              />

              {/* Navigation in Lightbox */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 p-3 text-white hover:bg-background/30 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 p-3 text-white hover:bg-background/30 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Caption in Lightbox */}
            {(allImages[currentIndex]?.caption || allImages.length > 1) && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/20 px-4 py-2 text-center">
                {allImages[currentIndex]?.caption && (
                  <p className="text-sm text-white">
                    {allImages[currentIndex].caption}
                  </p>
                )}
                {allImages.length > 1 && (
                  <p className="text-xs text-white/70">
                    {currentIndex + 1} / {allImages.length}
                  </p>
                )}
              </div>
            )}

            {/* Thumbnail strip at bottom */}
            {allImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] px-4">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={cn(
                      "relative flex-shrink-0 h-12 w-16 overflow-hidden rounded border-2 transition-all",
                      idx === currentIndex
                        ? "border-white ring-2 ring-white/20"
                        : "border-transparent hover:border-white/50",
                    )}
                  >
                    <img
                      src={img.image_url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
