"use client";

import { useLanguage } from "@/context/language-context";

export function About() {
  const { t } = useLanguage();
  return (
    <section className="space-y-4" id="about">
      <h2 className="text-lg font-semibold tracking-tight">
        {t("home.about")}
      </h2>
      <p className="leading-relaxed text-muted-foreground">{t("user.about")}</p>
    </section>
  );
}
