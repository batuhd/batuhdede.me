"use client";

import Image from "next/image";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";

export function Info() {
  const { t } = useLanguage();
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-4">
        <Image
          src="/media/yuvarlaklogobeyaz.png"
          alt="Logo"
          width={48}
          height={48}
          className="hidden dark:block rounded-full"
          priority
        />
        <Image
          src="/media/yuvarlaklogo.png"
          alt="Logo"
          width={48}
          height={48}
          className="dark:hidden rounded-full"
          priority
        />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {userConfig.name}
        </h1>
      </div>
      <p className="text-lg text-muted-foreground">{t("user.heroTagline")}</p>
    </section>
  );
}
