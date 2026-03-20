"use client";

import Image from "next/image";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Info() {
  const { getLocalized } = useLanguage();
  const { aboutMe, loaded } = useSiteData();

  const name = aboutMe?.name || userConfig.name;
  const tagline = aboutMe ? (getLocalized(aboutMe, "hero_tagline") || userConfig.heroTagline) : (loaded ? userConfig.heroTagline : "");

  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handlePhotoClick = () => {
    setClickCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount === 52) {
        setShowEasterEgg(true);
        return 0; // Reset counter after triggering
      }
      return nextCount;
    });
  };

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-4 sm:gap-6">
        <div onClick={handlePhotoClick} className="cursor-pointer select-none relative group transition-transform active:scale-95">
          {aboutMe?.profile_photo_url ? (
            <img
              src={aboutMe.profile_photo_url}
              alt="Profile Photo"
              className="rounded-2xl object-cover w-20 h-20 sm:w-24 sm:h-24 ring-2 ring-transparent group-hover:ring-primary/20 transition-all shadow-md"
            />
          ) : (
            <>
              <Image
                src="/media/yuvarlaklogobeyaz.png"
                alt="Logo"
                width={96}
                height={96}
                className="hidden dark:block rounded-2xl w-20 h-20 sm:w-24 sm:h-24 ring-2 ring-transparent group-hover:ring-primary/20 transition-all shadow-md"
                priority
              />
              <Image
                src="/media/yuvarlaklogo.png"
                alt="Logo"
                width={96}
                height={96}
                className="dark:hidden rounded-2xl w-20 h-20 sm:w-24 sm:h-24 ring-2 ring-transparent group-hover:ring-primary/20 transition-all shadow-md"
                priority
              />
            </>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
          {loaded ? name : ""}
        </h1>
      </div>
      <p className="text-base sm:text-lg text-muted-foreground">
        {tagline}
      </p>

      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setShowEasterEgg(false)}
          >
            <motion.div 
              initial={{ y: 50, rotate: -5 }}
              animate={{ y: 0, rotate: 0 }}
              exit={{ y: 50, rotate: 5 }}
              className="relative w-full max-w-3xl aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src="/media/image.png"
                alt="Easter Egg"
                fill
                className="object-contain"
                priority
              />
              <button 
                onClick={() => setShowEasterEgg(false)}
                className="absolute top-4 right-4 bg-background/50 hover:bg-background/80 backdrop-blur-sm text-foreground rounded-full p-2 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
