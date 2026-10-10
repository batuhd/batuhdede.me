"use client";

import { useLanguage } from "@/context/language-context";

export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-foreground focus:outline-none"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}
