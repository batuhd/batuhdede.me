"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6">
      <div className="rounded-2xl border border-brand/30 bg-maroon px-6 py-10 text-center shadow-lg shadow-maroon/30">
        <p className="text-sm text-cream/90">{t("home.footer")}</p>
        <p className="mt-3 text-xs text-cream/60">
          &copy;batuhd
          <span className="mx-2 text-cream/30">·</span>
          <Link href="/credits" className="transition-colors hover:text-cream">
            Credits
          </Link>
          <span className="mx-2 text-cream/30">·</span>
          <Link href="/admin" className="transition-colors hover:text-cream">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}