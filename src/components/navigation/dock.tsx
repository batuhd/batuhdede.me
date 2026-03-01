"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Home,
  FolderKanban,
  Sun,
  Moon,
  FileText,
  PenTool,
  Star,
  Linkedin,
  Instagram,
  Github,
  Globe,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { localeLabels, type Locale } from "@/config/translations";
import { motion, AnimatePresence } from "motion/react";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  labelKey?: string;
}

const pageItems: (NavItem & { labelKey: string })[] = [
  { href: "/", icon: Home, labelKey: "nav.home", label: "" },
  { href: "/works", icon: FolderKanban, labelKey: "nav.works", label: "" },
  { href: "/blog", icon: PenTool, labelKey: "nav.blog", label: "" },
];

const socialItems: NavItem[] = [
  { href: userConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: userConfig.links.github, icon: Github, label: "GitHub" },
  { href: userConfig.links.instagram, icon: Instagram, label: "Instagram" },
  { href: userConfig.links.resume, icon: FileText, label: "Resume (CV)" },
];

const LOCALES: Locale[] = ["tr", "en", "de", "ja"];

function DockIcon({
  icon: Icon,
  label,
  isActive,
  hoveredLabel,
  onHover,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  hoveredLabel: string | null;
  onHover: (label: string | null) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
      className="relative flex flex-col items-center justify-center"
    >
      <motion.div
        whileHover={{ scale: 1.15, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl transition-colors duration-200",
          isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        {isActive && (
          <div className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-foreground" />
        )}
      </motion.div>

      <div
        className={cn(
          "absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background whitespace-nowrap transition-all duration-150 hidden sm:block",
          hoveredLabel === label
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        )}
      >
        {label}
      </div>
    </div>
  );
}

export function Dock() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const closeMenus = useCallback(() => {
    setLangMenuOpen(false);
    setMoreMenuOpen(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPageActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-4 sm:bottom-8 left-1/2 z-50 -translate-x-1/2 w-max"
    >
      <nav className="mx-auto flex w-max items-center gap-1 sm:gap-4 rounded-2xl border border-border/50 bg-background/80 px-3 sm:px-6 py-2 sm:py-3 shadow-2xl backdrop-blur-xl">
        {/* Pages */}
        <div className="flex items-center gap-0.5 sm:gap-2">
          {pageItems.map((item) => (
            <Link key={item.labelKey} href={item.href} onClick={closeMenus}>
              <DockIcon
                icon={item.icon}
                label={t(item.labelKey)}
                isActive={isPageActive(item.href)}
                hoveredLabel={hoveredLabel}
                onHover={setHoveredLabel}
              />
            </Link>
          ))}
        </div>

        <div className="h-6 sm:h-8 w-px bg-border flex-shrink-0" />

        {/* Socials - desktop only */}
        <div className="hidden sm:flex items-center gap-2">
          {socialItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DockIcon
                icon={item.icon}
                label={item.label}
                isActive={false}
                hoveredLabel={hoveredLabel}
                onHover={setHoveredLabel}
              />
            </a>
          ))}
        </div>

        <div className="hidden sm:block h-8 w-px bg-border flex-shrink-0" />

        {/* Credits - desktop only */}
        <div className="hidden sm:flex items-center gap-2">
          <Link href="/credits" onClick={closeMenus}>
            <DockIcon
              icon={Star}
              label={t("nav.credits")}
              isActive={isPageActive("/credits")}
              hoveredLabel={hoveredLabel}
              onHover={setHoveredLabel}
            />
          </Link>
        </div>

        {/* Theme */}
        <button onClick={toggleTheme}>
          <DockIcon
            icon={mounted ? (theme === "dark" ? Sun : Moon) : Sun}
            label={t("nav.theme")}
            isActive={false}
            hoveredLabel={hoveredLabel}
            onHover={setHoveredLabel}
          />
        </button>

        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => {
              setLangMenuOpen((prev) => !prev);
              setMoreMenuOpen(false);
            }}
          >
            <DockIcon
              icon={Globe}
              label={t("nav.language")}
              isActive={false}
              hoveredLabel={hoveredLabel}
              onHover={setHoveredLabel}
            />
          </button>

          <AnimatePresence>
            {langMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-[140px] left-1/2 -translate-x-1/2 rounded-xl border border-border/50 bg-background/95 p-1.5 shadow-xl backdrop-blur-xl"
              >
                {LOCALES.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLocale(l);
                      setLangMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-center rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors",
                      locale === l
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {localeLabels[l]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* More menu - mobile only (socials + credits) */}
        <div className="relative sm:hidden" ref={moreRef}>
          <button
            onClick={() => {
              setMoreMenuOpen((prev) => !prev);
              setLangMenuOpen(false);
            }}
          >
            <DockIcon
              icon={moreMenuOpen ? X : MoreHorizontal}
              label="Menu"
              isActive={false}
              hoveredLabel={hoveredLabel}
              onHover={setHoveredLabel}
            />
          </button>

          <AnimatePresence>
            {moreMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-[260px] right-0 w-48 rounded-xl border border-border/50 bg-background/95 p-2 shadow-xl backdrop-blur-xl"
              >
                {socialItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ))}
                <div className="my-1 h-px bg-border" />
                <Link
                  href="/credits"
                  onClick={() => setMoreMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isPageActive("/credits")
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Star className="h-4 w-4" />
                  {t("nav.credits")}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.div>
  );
}
