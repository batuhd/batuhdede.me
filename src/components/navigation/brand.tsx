"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteData } from "@/context/site-data-context";
import { useLanguage } from "@/context/language-context";
import { userConfig } from "@/config/user";
import { cn } from "@/lib/utils";

/**
 * Sol üst marka bloğu: isim (üst) → logo (orta) → unvan (alt).
 * Koyu temada logo `dark:invert` ile beyaza döner.
 */
export function Brand({
  size = "lg",
  onClick,
}: {
  size?: "sm" | "lg";
  onClick?: () => void;
}) {
  const { aboutMe } = useSiteData();
  const { getLocalized } = useLanguage();
  const name = aboutMe?.name || userConfig.name;
  const role = (aboutMe ? getLocalized(aboutMe, "role") : "") || userConfig.role;
  const isLarge = size === "lg";

  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={name}
      className="inline-flex flex-col items-start"
    >
      <span
        className={cn(
          "uppercase leading-none tracking-[0.12em] text-foreground",
          isLarge ? "mb-2 text-[11px]" : "mb-1 text-[9px]",
        )}
      >
        {name}
      </span>
      <Image
        src="/media/logosiyah.png"
        alt=""
        width={1782}
        height={230}
        priority
        className={cn("w-auto dark:invert", isLarge ? "h-6" : "h-5")}
      />
      {role && (
        <span
          className={cn(
            "leading-tight tracking-[0.02em] text-muted-foreground",
            isLarge ? "mt-2 text-[10px]" : "mt-1 text-[9px]",
          )}
        >
          {role}
        </span>
      )}
    </Link>
  );
}
