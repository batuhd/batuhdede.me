"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { HttpCat } from "@/components/http-cat";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <HttpCat status={500} title={t("error.server.title")} />
      <h1 className="mt-8 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
        {t("error.server.title")}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {t("error.server.description")}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex min-h-[44px] items-center border border-border px-5 text-[11px] uppercase tracking-[0.08em] text-foreground transition-colors duration-150 hover:bg-muted"
      >
        {t("error.tryAgain")}
      </button>
    </div>
  );
}