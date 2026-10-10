"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { HttpCat } from "@/components/http-cat";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <HttpCat status={404} title={t("error.notFound.title")} />
      <h1 className="mt-8 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
        {t("error.notFound.title")}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {t("error.notFound.description")}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[44px] items-center border border-border px-5 text-[11px] uppercase tracking-[0.08em] text-foreground transition-colors duration-150 hover:bg-muted"
      >
        {t("error.backHome")}
      </Link>
    </div>
  );
}