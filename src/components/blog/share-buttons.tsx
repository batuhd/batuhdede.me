"use client";

import { useState } from "react";
import { Share2, Link2, Check, Twitter, Linkedin, MessageCircle, Facebook } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/context/language-context";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
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
    { name: "X", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { name: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}` },
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex min-h-[44px] items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="hidden sm:inline">{t("blog.share")}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-2 min-w-[220px] border border-border bg-background p-2"
            >
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex min-h-[44px] w-full items-center gap-3 px-3 text-left text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={1.5} />
                    {t("blog.linkCopied")}
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" strokeWidth={1.5} />
                    {t("blog.copyLink")}
                  </>
                )}
              </button>
              <div className="my-1 h-px bg-border" />
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center gap-3 px-3 text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  <option.icon className="h-4 w-4" strokeWidth={1.5} />
                  {option.name}
                </a>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
