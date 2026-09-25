"use client";

import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { sanitizeUrl } from "@/lib/utils";
import { Play } from "lucide-react";
import type { Prototype } from "@/types";

export function PrototypesContent({ prototypes }: { prototypes: Prototype[] }) {
  const { t, getLocalized } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
        {t("prototypes.title")}
      </h1>
      <p className="mt-3 max-w-2xl text-base text-neutral-400">
        {t("prototypes.subtitle")}
      </p>

      {prototypes.length === 0 ? (
        <p className="mt-12 text-neutral-400">{t("prototypes.empty")}</p>
      ) : (
        <div className="mt-12 divide-y divide-white/10">
          {prototypes.map((proto) => {
          const imageUrl = proto.image_url ? sanitizeUrl(proto.image_url) : null;
          const videoUrl = proto.video_url ? sanitizeUrl(proto.video_url) : null;
          const title = getLocalized(proto, "title");
          const description = getLocalized(proto, "description");

          const phoneInner = (
            <div className="relative mx-auto w-36 shrink-0 sm:w-44">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border border-white/15 bg-[#0a0a0a]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-b from-neutral-800 to-neutral-900" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                    <Play className="h-6 w-6 text-white" />
                  </span>
                </div>
              </div>
              <div className="mx-auto -mt-1 h-1.5 w-20 rounded-b-full bg-white/20" />
            </div>
          );

          return (
            <div
              key={proto.id}
              className="flex items-center justify-between gap-6 py-8 sm:gap-10 sm:py-10"
            >
              <div className="max-w-xl">
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {title}
                </h2>
                {description && (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400 sm:text-base">
                    {description}
                  </p>
                )}
              </div>
              {videoUrl ? (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={title}
                >
                  {phoneInner}
                </a>
              ) : (
                phoneInner
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}