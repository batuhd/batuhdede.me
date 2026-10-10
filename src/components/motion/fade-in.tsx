"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

/** Yalnızca opacity fade; kayma/zıplama yok. */
export function FadeIn({
  children,
  delay = 0,
  fullWidth = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
      className={fullWidth ? "w-full" : className}
    >
      {children}
    </motion.div>
  );
}
