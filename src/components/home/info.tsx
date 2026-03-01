"use client";

import Image from "next/image";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";

export function Info() {
  const { t } = useLanguage();

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-3 sm:gap-4">
        <Image
          src="/media/yuvarlaklogobeyaz.png"
          alt="Logo"
          width={44}
          height={44}
          className="hidden dark:block rounded-full sm:w-12 sm:h-12"
          priority
        />
        <Image
          src="/media/yuvarlaklogo.png"
          alt="Logo"
          width={44}
          height={44}
          className="dark:hidden rounded-full sm:w-12 sm:h-12"
          priority
        />
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
          {userConfig.name}
        </h1>
      </div>
      <p className="text-base sm:text-lg text-muted-foreground">
        {t("user.heroTagline")}
      </p>
    </section>
  );
}
