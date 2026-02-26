"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { localeLabels, type Locale } from "@/config/translations";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const pageItems = [
  { href: "/", icon: Home, labelKey: "nav.home" },
  { href: "/works", icon: FolderKanban, labelKey: "nav.works" },
  { href: "/blog", icon: PenTool, labelKey: "nav.blog" },
];

const socialItems = [
  { href: userConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: userConfig.links.github, icon: Github, label: "GitHub" },
  { href: userConfig.links.instagram, icon: Instagram, label: "Instagram" },
  { href: userConfig.links.resume, icon: FileText, label: "Resume (CV)" },
];

const endItems = [{ href: "/credits", icon: Star, labelKey: "nav.credits" }];

function DockIcon({
  item,
  isActive,
  hoveredLabel,
  setHoveredLabel,
}: {
  item: { icon: any; label: string };
  isActive: boolean;
  hoveredLabel: string | null;
  setHoveredLabel: (v: string | null) => void;
}) {
  const Icon = item.icon;
  return (
    <div
      onMouseEnter={() => setHoveredLabel(item.label)}
      onMouseLeave={() => setHoveredLabel(null)}
      className="relative flex flex-col items-center justify-center"
    >
      <motion.div
        whileHover={{ scale: 1.15, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl transition-colors duration-200",
          isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        {isActive && (
          <div className="absolute -bottom-2 h-1 w-1 rounded-full bg-foreground" />
        )}
      </motion.div>

      <div
        className={cn(
          "absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background whitespace-nowrap transition-all duration-150 hidden sm:block",
          hoveredLabel === item.label
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        )}
      >
        {item.label}
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

  useEffect(() => setMounted(true), []);

  const isPageActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const locales: Locale[] = ["tr", "en", "de", "ja"];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-4 sm:bottom-8 left-1/2 z-50 -translate-x-1/2 w-max"
    >
      <nav className="mx-auto flex w-max items-center gap-2 sm:gap-4 rounded-2xl border border-border/50 bg-background/80 px-4 sm:px-6 py-2 sm:py-3 shadow-2xl backdrop-blur-xl">
        {/* Pages */}
        <div className="flex items-center gap-1 sm:gap-2">
          {pageItems.map((item) => (
            <Link key={item.labelKey} href={item.href}>
              <DockIcon
                item={{ ...item, label: t(item.labelKey) }}
                isActive={isPageActive(item.href)}
                hoveredLabel={hoveredLabel}
                setHoveredLabel={setHoveredLabel}
              />
            </Link>
          ))}
        </div>

        <div className="h-8 w-px bg-border flex-shrink-0" />

        {/* Socials & Resume */}
        <div className="flex items-center gap-1 sm:gap-2">
          {socialItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DockIcon
                item={item}
                isActive={false}
                hoveredLabel={hoveredLabel}
                setHoveredLabel={setHoveredLabel}
              />
            </a>
          ))}
        </div>

        <div className="h-8 w-px bg-border flex-shrink-0" />

        {/* Credits, Theme & Language */}
        <div className="flex items-center gap-1 sm:gap-2">
          {endItems.map((item) => (
            <Link key={item.labelKey} href={item.href}>
              <DockIcon
                item={{ ...item, label: t(item.labelKey) }}
                isActive={isPageActive(item.href)}
                hoveredLabel={hoveredLabel}
                setHoveredLabel={setHoveredLabel}
              />
            </Link>
          ))}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <DockIcon
              item={{
                icon: mounted ? (theme === "dark" ? Sun : Moon) : Sun,
                label: t("nav.theme"),
              }}
              isActive={false}
              hoveredLabel={hoveredLabel}
              setHoveredLabel={setHoveredLabel}
            />
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button onClick={() => setLangMenuOpen(!langMenuOpen)}>
              <DockIcon
                item={{ icon: Globe, label: t("nav.language") }}
                isActive={false}
                hoveredLabel={hoveredLabel}
                setHoveredLabel={setHoveredLabel}
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
                  {locales.map((l) => (
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
        </div>
      </nav>
    </motion.div>
  );
}
