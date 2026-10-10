"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/language-context";
import { localeLabels, type Locale } from "@/config/translations";
import { cn } from "@/lib/utils";

const LOCALES: Locale[] = ["tr", "en", "de", "es"];
const emptySubscribe = () => () => {};

/** Dil (TR/EN/DE/ES) ve tema (AÇIK/KOYU) metin tabanlı kontrolleri. */
export function LanguageThemeControls({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isDark = mounted && theme === "dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-[11px] uppercase tracking-[0.08em]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        {LOCALES.map((code, index) => (
          <span key={code} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-muted-foreground/50">/</span>}
            <button
              type="button"
              onClick={() => setLocale(code)}
              aria-current={locale === code ? "true" : undefined}
              className={cn(
                "transition-colors duration-150",
                locale === code
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {localeLabels[code]}
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "transition-colors duration-150",
            !isDark
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t("nav.themeLight")}
        </button>
        <span className="text-muted-foreground/50">/</span>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "transition-colors duration-150",
            isDark
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t("nav.themeDark")}
        </button>
      </div>
    </div>
  );
}
