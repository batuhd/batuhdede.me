"use client";

import { useState } from "react";
import {
  Share2,
  Link2,
  Check,
  Twitter,
  Linkedin,
  MessageCircle,
  Facebook,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
}

export function ShareButtons({ title, url, excerpt }: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareOptions = [
    {
      name: "Twitter/X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: "bg-black hover:bg-black/80",
      lightColor: "bg-gray-100 hover:bg-gray-200",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "bg-[#0A66C2] hover:bg-[#0A66C2]/80",
      lightColor: "bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      color: "bg-[#25D366] hover:bg-[#25D366]/80",
      lightColor: "bg-[#25D366]/10 hover:bg-[#25D366]/20",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "bg-[#1877F2] hover:bg-[#1877F2]/80",
      lightColor: "bg-[#1877F2]/10 hover:bg-[#1877F2]/20",
    },
  ];

  return (
    <div className="relative">
      {/* Main Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
          isOpen
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        )}
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">{t("blog.share") || "Paylaş"}</span>
      </button>

      {/* Share Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute z-50 min-w-[240px] rounded-xl border bg-card p-4 shadow-xl",
                "right-0 top-full mt-2 sm:left-auto sm:right-0",
              )}
            >
              <div className="space-y-3">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    copied
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "hover:bg-muted",
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{t("blog.linkCopied") || "Link kopyalandı!"}</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4" />
                      <span>{t("blog.copyLink") || "Link kopyala"}</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Social Share Buttons */}
                <div className="space-y-1">
                  <p className="px-3 text-xs font-medium text-muted-foreground">
                    {t("blog.shareOn") || "Şurada paylaş:"}
                  </p>
                  {shareOptions.map((option) => (
                    <a
                      key={option.name}
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors",
                          option.lightColor,
                          "dark:" + option.color,
                        )}
                      >
                        <option.icon
                          className="h-4 w-4 dark:text-white"
                          style={{ color: "inherit" }}
                        />
                      </span>
                      <span className="text-foreground">{option.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
