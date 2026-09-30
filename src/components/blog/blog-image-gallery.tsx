"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface BlogImageGalleryProps {
  images: { image_url: string; caption?: string }[];
  mainImage?: string;
  title: string;
}

const emptySubscribe = () => () => {};

export function BlogImageGallery({
  images,
  mainImage,
  title,
}: BlogImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [lightboxOpen]);

  // Main image + additional images
  const allImages = mainImage
    ? [{ image_url: mainImage, caption: undefined }, ...images]
    : images;

  const handlePrev = useCallback((e?: { stopPropagation: () => void }) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback((e?: { stopPropagation: () => void }) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation for the gallery and lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allImages.length <= 1) return;
      if (e.key === "ArrowLeft") {
        handlePrev(e);
      } else if (e.key === "ArrowRight") {
        handleNext(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allImages.length, handlePrev, handleNext]);

  // Close lightbox with Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) {
        e.stopPropagation();
        setLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  if (allImages.length === 0) return null;

  return (
    <>
      {/* Main Gallery Display */}
      <div className="space-y-3">
        {/* Main Image */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted cursor-pointer group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={allImages[currentIndex]?.image_url}
            alt={`${title} - ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                  "relative flex-shrink-0 h-20 w-32 overflow-hidden rounded-lg border-2 transition-all",
                  idx === currentIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/30",
                )}
              >
                <Image
                  src={img.image_url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="128px"
                  className="object-cover"
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
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex flex-col bg-black/95 select-none"
                onClick={() => setLightboxOpen(false)}
              >
                {/* Top bar (Close button & Counter/Title) */}
                <div className="relative flex items-center justify-between p-4 z-[210] text-white">
                  <div className="text-sm font-medium opacity-80 pl-2">
                    {allImages.length > 1 && `${currentIndex + 1} / ${allImages.length}`}
                  </div>
                  <button
                    onClick={() => setLightboxOpen(false)}
                    className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Main content (Image + Nav arrows) */}
                <div className="relative flex-1 flex items-center justify-center px-4 md:px-16 min-h-0">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full h-full max-w-6xl max-h-[70vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image
                      src={allImages[currentIndex]?.image_url}
                      alt={`${title} - ${currentIndex + 1}`}
                      fill
                      sizes="90vw"
                      className="object-contain rounded-lg select-none pointer-events-none"
                      priority
                    />
                  </motion.div>

                  {/* Navigation Arrows inside the main container but overlaying the image */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/80 transition-colors z-[210] cursor-pointer"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/80 transition-colors z-[210] cursor-pointer"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Bottom Bar (Caption + Thumbnails) */}
                <div className="p-4 flex flex-col items-center gap-4 z-[210] bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  {allImages[currentIndex]?.caption && (
                    <p className="text-sm text-white/90 text-center max-w-2xl px-4 line-clamp-2">
                      {allImages[currentIndex].caption}
                    </p>
                  )}

                  {allImages.length > 1 && (
                    <div
                      className="flex gap-2 overflow-x-auto max-w-[85vw] pb-2 scrollbar-thin px-4 scrollbar-thumb-white/20 scrollbar-track-transparent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={cn(
                            "relative flex-shrink-0 h-16 w-24 overflow-hidden rounded border-2 transition-all cursor-pointer",
                            idx === currentIndex
                              ? "border-white ring-2 ring-white/20"
                              : "border-transparent hover:border-white/50",
                          )}
                        >
                          <Image
                            src={img.image_url}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
