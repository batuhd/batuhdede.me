"use client";

import Image from "next/image";
import Link from "next/link";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sanitizeUrl } from "@/lib/utils";
import {
  Linkedin,
  Instagram,
  Github,
  FileText,
  Twitter,
  Youtube,
  Dribbble,
  Link2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { SocialLink } from "@/types";

interface SocialItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Instagram: Instagram,
  "Resume (CV)": FileText,
  Twitter: Twitter,
  YouTube: Youtube,
  Dribbble: Dribbble,
  Other: Link2,
};

const FALLBACK_SOCIAL: SocialItem[] = [
  { href: sanitizeUrl(userConfig.links.linkedin) || "", icon: Linkedin, label: "LinkedIn" },
  { href: sanitizeUrl(userConfig.links.github) || "", icon: Github, label: "GitHub" },
  { href: sanitizeUrl(userConfig.links.instagram) || "", icon: Instagram, label: "Instagram" },
].filter((item) => item.href !== "");

export function Info() {
  const { getLocalized, t } = useLanguage();
  const { aboutMe, loaded } = useSiteData();
  const [socialItems, setSocialItems] = useState<SocialItem[]>(FALLBACK_SOCIAL);

  const name = aboutMe?.name || userConfig.name;
  const tagline = aboutMe
    ? getLocalized(aboutMe, "hero_tagline") || userConfig.heroTagline
    : loaded
      ? userConfig.heroTagline
      : "";

  const [, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from("social_links")
        .select("*")
        .order("order_index", { ascending: true });
      if (cancelled) return;
      if (data && data.length > 0) {
        setSocialItems(
          (data as SocialLink[])
            .map((link) => ({
              href: sanitizeUrl(link.url) || "",
              icon: PLATFORM_ICONS[link.platform] || Link2,
              label: link.platform,
            }))
            .filter((item) => item.href !== ""),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePhotoClick = () => {
    setClickCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount === 52) {
        setShowEasterEgg(true);
        return 0;
      }
      return nextCount;
    });
  };

  const resumeHref = sanitizeUrl(userConfig.links.resume);

  return (
    <section className="space-y-6">
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-muted-foreground">{t("home.hello")} </span>
            <span className="text-foreground">{loaded ? name : ""}</span>
          </h1>
          {tagline && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {tagline}
            </p>
          )}
        </div>
        {aboutMe?.show_profile_photo !== false && (
          <div
            onClick={handlePhotoClick}
            className="relative shrink-0 cursor-pointer select-none transition-transform active:scale-95"
          >
            {aboutMe?.profile_photo_url && sanitizeUrl(aboutMe.profile_photo_url) ? (
              <Image
                src={sanitizeUrl(aboutMe.profile_photo_url) || ""}
                alt={`${name} - Profile Photo`}
                width={96}
                height={96}
                priority
                className="h-16 w-16 rounded-full object-cover ring-1 ring-border sm:h-20 sm:w-20"
              />
            ) : (
              <>
                <Image
                  src="/media/yuvarlaklogobeyaz.png"
                  alt="Logo"
                  width={96}
                  height={96}
                  className="hidden h-16 w-16 rounded-full ring-1 ring-border dark:block sm:h-20 sm:w-20"
                  priority
                />
                <Image
                  src="/media/yuvarlaklogo.png"
                  alt="Logo"
                  width={96}
                  height={96}
                  className="h-16 w-16 rounded-full ring-1 ring-border dark:hidden sm:h-20 sm:w-20"
                  priority
                />
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {socialItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow on ${item.label}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <item.icon className="h-5 w-5" />
          </Link>
        ))}
        {resumeHref && (
          <Link
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <FileText className="h-4 w-4" />
            {t("home.resume")}
          </Link>
        )}
      </div>

      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setShowEasterEgg(false)}
          >
            <motion.div
              initial={{ y: 50, rotate: -5 }}
              animate={{ y: 0, rotate: 0 }}
              exit={{ y: 50, rotate: 5 }}
              className="relative aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-3xl border-4 border-primary/20 shadow-2xl sm:aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src="/media/image.png"
                alt="Easter Egg"
                fill
                className="object-contain"
                priority
              />
              <button
                onClick={() => setShowEasterEgg(false)}
                className="absolute top-4 right-4 rounded-full bg-background/50 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background/80"
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}