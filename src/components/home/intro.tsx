"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Intro() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");

    if (hasSeenIntro) return;

    setShowIntro(true);

    const timer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("hasSeenIntro", "true");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          <video
            autoPlay
            muted
            playsInline
            suppressHydrationWarning
            className="h-full w-full object-cover opacity-80"
          >
            <source src="/media/intro.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
