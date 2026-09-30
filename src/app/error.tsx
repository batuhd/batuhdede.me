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
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t("error.server.title")}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {t("error.server.description")}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
      >
        {t("error.tryAgain")}
      </button>
    </div>
  );
}