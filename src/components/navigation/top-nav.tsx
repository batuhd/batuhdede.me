"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe, X, Menu, Sparkles } from "lucide-react";
import { cn, sanitizeUrl } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { type Locale } from "@/config/translations";
import { motion, AnimatePresence } from "motion/react";

const emptySubscribe = () => () => {};

const NAV_ITEMS: { href: string; labelKey: string }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/works", labelKey: "nav.works" },
  { href: "/blog", labelKey: "nav.articles" },
];

const LOCALE_LIST: { code: Locale; flag: string; name: string }[] = [
  { code: "tr", flag: "🇹🇷", name: "Türkçe" },
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "es", flag: "🇪🇸", name: "Español" },
];

export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { aboutMe } = useSiteData();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  const closeMenus = useCallback(() => {
    setMobileOpen(false);
    setLangModalOpen(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (mobileRef.current && !mobileRef.current.contains(target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPageActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const avatarUrl =
    aboutMe?.profile_photo_url && sanitizeUrl(aboutMe.profile_photo_url)
      ? sanitizeUrl(aboutMe.profile_photo_url)
      : null;

  return (
    <>
      {/* Top glow line */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-transparent via-fuchsia-500/70 to-transparent" />

      <header className="sticky top-0 z-50">
        <div className="mx-auto w-full max-w-7xl px-4 pt-3 sm:px-6 sm:pt-4">
          <div className="flex items-center justify-between rounded-full border border-border bg-card px-4 py-2 shadow-lg shadow-black/40 sm:px-5">
            {/* Left: avatar + links */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                onClick={closeMenus}
                aria-label={t("nav.home")}
                className="block shrink-0"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt=""
                    width={36}
                    height={36}
                    priority
                    className="h-8 w-8 rounded-full object-cover grayscale transition-all hover:grayscale-0 sm:h-9 sm:w-9"
                  />
                ) : (
                  <Image
                    src="/media/yuvarlaklogobeyaz.png"
                    alt=""
                    width={36}
                    height={36}
                    priority
                    className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
                  />
                )}
              </Link>

              <nav
                aria-label="Main"
                className="hidden items-center gap-0.5 md:flex"
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = isPageActive(item.href);
                  return (
                    <Link
                      key={item.labelKey}
                      href={item.href}
                      onClick={closeMenus}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative px-2.5 py-1.5 text-sm font-medium transition-colors",
                        isActive
                          ? "text-brand"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t(item.labelKey)}
                      {isActive && (
                        <span className="absolute inset-x-2.5 -bottom-0.5 h-px bg-brand" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: language + theme + mobile menu */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setLangModalOpen(true);
                  setMobileOpen(false);
                }}
                aria-label={t("nav.language")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
              </button>

              <button
                onClick={toggleTheme}
                aria-label={t("nav.theme")}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:text-foreground"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <Sparkles className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 text-brand" />
              </button>

              {/* Mobile hamburger */}
              <div className="relative md:hidden" ref={mobileRef}>
                <button
                  onClick={() => {
                    setMobileOpen((prev) => !prev);
                    setLangModalOpen(false);
                  }}
                  aria-label="Menu"
                  aria-expanded={mobileOpen}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:text-foreground"
                >
                  {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>

                <AnimatePresence>
                  {mobileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 rounded-2xl border border-border bg-card p-2 shadow-xl"
                    >
                      <div className="flex flex-col gap-0.5">
                        {NAV_ITEMS.map((item) => (
                          <Link
                            key={item.labelKey}
                            href={item.href}
                            onClick={closeMenus}
                            aria-current={
                              isPageActive(item.href) ? "page" : undefined
                            }
                            className={cn(
                              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              isPageActive(item.href)
                                ? "text-brand"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {t(item.labelKey)}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {langModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => setLangModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {t("nav.language")}
                </h3>
                <button
                  onClick={() => setLangModalOpen(false)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {LOCALE_LIST.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLocale(item.code);
                      setLangModalOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all active:scale-[0.98]",
                      locale === item.code
                        ? "bg-brand text-black"
                        : "bg-muted text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="text-xl leading-none">{item.flag}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}