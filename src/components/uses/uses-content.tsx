"use client";

import { useLanguage } from "@/context/language-context";
import type { UsesCategory } from "@/types";

export function UsesContent({ categories }: { categories: UsesCategory[] }) {
  const { t, getLocalized, locale } = useLanguage();

  const getItems = (cat: UsesCategory): string[] => {
    if (locale !== "en") {
      const localized = cat[`items_${locale}`];
      if (Array.isArray(localized) && localized.length > 0) return localized;
    }
    return Array.isArray(cat.items) ? cat.items : [];
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
        {t("uses.title")}
      </h1>
      <p className="mt-3 max-w-2xl text-base text-neutral-400">
        {t("uses.subtitle")}
      </p>

      {categories.length === 0 ? (
        <p className="mt-12 text-neutral-400">{t("uses.empty")}</p>
      ) : (
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.id}>
              <h2 className="text-lg font-bold tracking-tight text-white">
                {getLocalized(cat, "title")}
              </h2>
              <ul className="mt-4 space-y-2">
                {getItems(cat).map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-400">
                    <span className="h-1 w-1 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}