"use client";

import { useEffect } from "react";

/** Açık overlay/menü sırasında body scroll'unu kilitler. */
export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
