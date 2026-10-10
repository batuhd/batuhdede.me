"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { useBodyLock } from "@/lib/use-body-lock";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { Brand } from "./brand";
import { SocialLinks } from "./social-links";
import { LanguageThemeControls } from "./prefs-controls";
import { NAV_GROUPS } from "./nav-items";

export function MobileMenu({
  onSocial,
}: {
  onSocial: (href: string, label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  useBodyLock(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-[calc(4.5rem+env(safe-area-inset-top))] items-center justify-between gap-4 bg-background px-5 pt-[env(safe-area-inset-top)] lg:hidden">
        <Brand size="sm" onClick={close} />

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex min-h-[44px] min-w-[44px] items-center justify-end text-[11px] uppercase tracking-[0.08em] text-foreground"
        >
          {t("nav.menu")}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-background px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] lg:hidden"
          >
            <div className="flex h-10 items-center justify-between">
              <Brand size="sm" onClick={close} />
              <button
                type="button"
                onClick={close}
                className="flex min-h-[44px] min-w-[44px] items-center justify-end text-[11px] uppercase tracking-[0.08em] text-foreground"
              >
                {t("nav.close")}
              </button>
            </div>

            <nav aria-label="Main" className="mt-6 flex flex-col items-start">
              {NAV_GROUPS.map((group, groupIndex) => (
                <ul
                  key={groupIndex}
                  className={cn(
                    "flex w-full flex-col items-start",
                    groupIndex > 0 && "mt-5",
                  )}
                >
                  {group.map((item) => (
                    <li key={item.key} className="w-full">
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cn(
                          "flex min-h-[52px] w-full items-center text-[26px] font-light leading-none transition-colors duration-150",
                          isActive(item.href)
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-6 pt-8">
              <SocialLinks
                onSelect={(href, label) => {
                  close();
                  onSocial(href, label);
                }}
                className="gap-4"
                iconClassName="h-5 w-5"
              />
              <a
                href={`/api/cv?lang=${locale}&download=1`}
                onClick={close}
                className="w-fit text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {t("nav.cv")}
              </a>
              <LanguageThemeControls />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
