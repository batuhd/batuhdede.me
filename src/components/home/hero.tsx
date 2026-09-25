"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { sanitizeUrl } from "@/lib/utils";
import {
  Twitter,
  Instagram,
  Github,
  Linkedin,
  Youtube,
  Dribbble,
  Link2,
  FileText,
  ArrowRight,
  ExternalLink,
  Mail,
  X as XIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import type { SocialLink } from "@/types";
import { WorkCard } from "@/components/home/work-card";
import { ContactForm } from "@/components/home/contact-form";

interface SocialItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  X: Twitter,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  GitHub: Github,
  Instagram: Instagram,
  "Resume (CV)": FileText,
  YouTube: Youtube,
  Dribbble: Dribbble,
  Other: Link2,
};

const FALLBACK_SOCIAL: SocialItem[] = [
  { href: sanitizeUrl(userConfig.links.linkedin) || "", icon: Linkedin, label: "LinkedIn" },
  { href: sanitizeUrl(userConfig.links.github) || "", icon: Github, label: "GitHub" },
  { href: sanitizeUrl(userConfig.links.instagram) || "", icon: Instagram, label: "Instagram" },
].filter((item) => item.href !== "");

export function Hero() {
  const { getLocalized, t } = useLanguage();
  const { aboutMe, loaded, contactEmails } = useSiteData();
  const [socialItems, setSocialItems] = useState<SocialItem[]>(FALLBACK_SOCIAL);
  const visibleSocial = socialItems.filter(
    (item) =>
      item.label.toLowerCase() !== "resume (cv)" &&
      item.label.toLowerCase() !== "cv",
  );
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string>("");
  const [contactOpen, setContactOpen] = useState(false);

  const handleSocialClick = (href: string, label: string) => {
    setPendingLink(href);
    setPendingLabel(label);
  };

  const confirmRedirect = () => {
    if (pendingLink) {
      window.open(pendingLink, "_blank", "noopener,noreferrer");
    }
    setPendingLink(null);
    setPendingLabel("");
  };

  const name = aboutMe?.name || userConfig.name;
  const bio = aboutMe ? getLocalized(aboutMe, "bio") : null;
  const tagline = aboutMe
    ? getLocalized(aboutMe, "hero_tagline") || userConfig.heroTagline
    : loaded
      ? userConfig.heroTagline
      : "";

  const avatarUrl = aboutMe?.profile_photo_url
    ? sanitizeUrl(aboutMe.profile_photo_url)
    : null;

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

  // Split bio into paragraphs (blank-line separated) for the classic editorial look
  const paragraphs = (bio || tagline)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        {/* Left: avatar + greeting + bio + socials */}
        <div className="min-w-0 flex-1">
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt={`${name} - Profile Photo`}
              width={128}
              height={128}
              priority
              className="h-28 w-28 rounded-2xl border border-border object-cover grayscale transition-all duration-500 hover:grayscale-0 sm:h-32 sm:w-32"
            />
          )}
          <p className="mt-6 text-xl font-bold text-brand">{t("home.hi")}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            {t("home.hello")} {loaded ? name : ""}
          </h1>

          <div className="mt-6 max-w-2xl space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-base leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand hover:underline"
            >
              {t("home.readMore")}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-brand hover:text-brand sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {t("home.contactMe")}
              </button>

              {visibleSocial.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSocialClick(item.href, item.label)}
                  aria-label={`Follow on ${item.label}`}
                  className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-medium text-black opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Work experience card */}
        <div className="w-full shrink-0 lg:w-[500px]">
          <WorkCard />
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {contactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 px-0 backdrop-blur-sm sm:items-center sm:px-6"
            onClick={() => setContactOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-card p-6 shadow-2xl sm:rounded-2xl sm:p-8"
            >
              <button
                onClick={() => setContactOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <XIcon className="h-5 w-5" />
              </button>

              {contactEmails.length > 0 && (
                <div className="mb-5 space-y-2 border-b border-border pb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("about.email")}
                  </p>
                  {contactEmails.map((ce) => (
                    <a
                      key={ce.email}
                      href={`mailto:${ce.email}`}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{ce.email}</span>
                    </a>
                  ))}
                </div>
              )}

              <ContactForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Redirect Warning Modal */}
      <AnimatePresence>
        {pendingLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => setPendingLink(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                  <ExternalLink className="h-5 w-5 text-brand" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {t("social.redirect.title")}
                </h3>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {t("social.redirect.message", { platform: pendingLabel })}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setPendingLink(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {t("social.redirect.cancel")}
                </button>
                <button
                  onClick={confirmRedirect}
                  className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-black transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  {t("social.redirect.accept")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}