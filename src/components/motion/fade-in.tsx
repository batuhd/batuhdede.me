"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  fullWidth = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  fullWidth?: boolean;
  className?: string;
}) {
  const directions = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={fullWidth ? "w-full" : className}
    >
      {children}
    </motion.div>
  );
}
