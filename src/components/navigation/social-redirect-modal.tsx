"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useBodyLock } from "@/lib/use-body-lock";
import { useFocusTrap } from "@/lib/use-focus-trap";

export function SocialRedirectModal({
  data,
  onClose,
}: {
  data: { href: string; label: string } | null;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyLock(!!data);
  useFocusTrap(panelRef, !!data);

  const confirm = () => {
    if (data) window.open(data.href, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 px-4"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm border border-border bg-background p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {t("social.redirect.title")}
              </h3>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {t("social.redirect.message", { platform: data.label })}
            </p>

            <div className="flex items-center justify-end gap-4 text-[11px] uppercase tracking-[0.12em]">
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {t("social.redirect.cancel")}
              </button>
              <button
                type="button"
                onClick={confirm}
                className="text-foreground transition-colors duration-150 hover:text-muted-foreground"
              >
                {t("social.redirect.accept")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
