"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6">
      <div className="flex overflow-hidden rounded-2xl border border-brand/30 bg-maroon shadow-lg shadow-maroon/30">
        <Link
          href="/"
          aria-label={t("nav.home")}
          className="block w-32 shrink-0 sm:w-44"
        >
          <Image
            src="/media/yuvarlaklogobeyaz.png"
            alt=""
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 px-5 py-8 sm:px-8">
          <p className="text-sm text-cream/90">{t("home.footer")}</p>
          <p className="text-xs text-cream/60">
            &copy;batuhd
            <span className="mx-2 text-cream/30">·</span>
            <Link
              href="/credits"
              className="transition-colors hover:text-cream"
            >
              Credits
            </Link>
            <span className="mx-2 text-cream/30">·</span>
            <Link href="/admin" className="transition-colors hover:text-cream">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}