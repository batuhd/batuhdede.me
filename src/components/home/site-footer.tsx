"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 text-center sm:px-6">
      <p className="text-xs text-muted-foreground">{t("home.footer")}</p>
      <p className="mt-2 text-[11px] text-muted-foreground/70">
        &copy;batuhd
        <span className="mx-2 text-muted-foreground/40">·</span>
        <Link href="/credits" className="transition-colors hover:text-foreground">
          Credits
        </Link>
        <span className="mx-2 text-muted-foreground/40">·</span>
        <Link href="/admin" className="transition-colors hover:text-foreground">
          Admin
        </Link>
      </p>
    </footer>
  );
}