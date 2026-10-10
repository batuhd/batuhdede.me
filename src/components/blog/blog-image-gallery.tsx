"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  registerGallery,
  updateGallery,
  useGallery,
} from "@/components/navigation/gallery-store";
import { GalleryControls } from "@/components/navigation/gallery-controls";

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
    () => false,
  );
  const { thumbs } = useGallery();

  const allImages = mainImage
    ? [{ image_url: mainImage, caption: undefined }, ...images]
    : images;
  const count = allImages.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
  }, [count]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === count - 1 ? 0 : prev + 1));
  }, [count]);

  useEffect(() => registerGallery(), []);

  useEffect(() => {
    if (count === 0) return;
    updateGallery({
      hasPrev: count > 1,
      hasNext: count > 1,
      onPrev: handlePrev,
      onNext: handleNext,
    });
  }, [count, handlePrev, handleNext]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (count <= 1) return;
      if (event.key === "ArrowLeft") handlePrev();
      if (event.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, count, handlePrev, handleNext]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [lightboxOpen]);

  if (count === 0) return null;

  const current = allImages[Math.min(currentIndex, count - 1)];

  return (
    <>
      {thumbs && count > 1 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`${title} ${idx + 1}`}
              className={cn(
                "relative aspect-[3/2] w-full overflow-hidden bg-muted",
                idx === currentIndex && "outline outline-2 outline-foreground",
              )}
            >
              <Image
                src={img.image_url}
                alt={`${title} ${idx + 1}`}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative block aspect-[3/2] w-full overflow-hidden bg-muted"
          aria-label={title}
        >
          <Image
            src={current.image_url}
            alt={`${title} - ${currentIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 1356px"
            priority
            className="object-cover"
          />
          {count > 1 && (
            <span className="absolute bottom-3 right-3 text-[11px] uppercase tracking-[0.08em] text-white mix-blend-difference">
              {currentIndex + 1} / {count}
            </span>
          )}
        </button>
      )}

      {current.caption && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {current.caption}
        </p>
      )}

      <GalleryControls variant="inline" />

      {isMounted &&
        createPortal(
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[200] flex flex-col bg-background select-none"
                onClick={() => setLightboxOpen(false)}
              >
                <div className="flex h-14 items-center justify-between border-b border-border px-5">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {count > 1 ? `${currentIndex + 1} / ${count}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(false)}
                    aria-label="Close"
                    className="flex min-h-[44px] min-w-[44px] items-center justify-end text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    <X className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="relative flex flex-1 items-center justify-center p-4">
                  <Image
                    src={current.image_url}
                    alt={`${title} - ${currentIndex + 1}`}
                    fill
                    sizes="100vw"
                    priority
                    className="object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {count > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-foreground transition-opacity duration-150 hover:opacity-60"
                      >
                        <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-foreground transition-opacity duration-150 hover:opacity-60"
                      >
                        <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
