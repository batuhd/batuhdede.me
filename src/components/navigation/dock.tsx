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
  ExternalLink,
  Twitter,
  Youtube,
  Dribbble,
  Link2,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { type Locale } from "@/config/translations";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";

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

const FALLBACK_SOCIAL: NavItem[] = [
  { href: userConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: userConfig.links.github, icon: Github, label: "GitHub" },
  { href: userConfig.links.instagram, icon: Instagram, label: "Instagram" },
  { href: userConfig.links.resume, icon: FileText, label: "Resume (CV)" },
];

interface LocaleInfo {
  code: Locale;
  flag: string;
  name: string;
}

const LOCALE_LIST: LocaleInfo[] = [
  { code: "tr", flag: "🇹🇷", name: "Türkçe" },
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "es", flag: "🇪🇸", name: "Español" },
];

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
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [socialItems, setSocialItems] = useState<NavItem[]>(FALLBACK_SOCIAL);
  const [emailItems, setEmailItems] = useState<{ label: string; email: string }[]>([]);

  // Social redirect warning state
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string>("");

  // Copy feedback state
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!supabase) return;
    const fetchLinks = async () => {
      if (!supabase) return;
      const { data } = await supabase.from("social_links").select("*").order("order_index", { ascending: true });
      if (data && data.length > 0) {
        setSocialItems(
          data.map((link: any) => ({
            href: link.url,
            icon: PLATFORM_ICONS[link.platform] || Link2,
            label: link.platform,
          }))
        );
      }
    };
    fetchLinks();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const fetchEmails = async () => {
      if (!supabase) return;
      const { data } = await supabase.from("contact_emails").select("*").order("order_index", { ascending: true });
      if (data) {
        setEmailItems(
          data.map((item: any) => ({
            label: item[`label_${locale}`] || item.label,
            email: item.email,
          }))
        );
      }
    };
    fetchEmails();
  }, [locale]);

  const closeMenus = useCallback(() => {
    setLangModalOpen(false);
    setContactModalOpen(false);
    setMoreMenuOpen(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
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

  const handleSocialClick = (href: string, label: string) => {
    setPendingLink(href);
    setPendingLabel(label);
    setMoreMenuOpen(false);
    setContactModalOpen(false);
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to copy email:", err);
      }
    }
  };

  const confirmRedirect = () => {
    if (pendingLink) {
      window.open(pendingLink, "_blank", "noopener,noreferrer");
    }
    setPendingLink(null);
    setPendingLabel("");
  };

  const cancelRedirect = () => {
    setPendingLink(null);
    setPendingLabel("");
  };

  return (
    <>
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
            {/* Contact - opens modal */}
            <button
              onClick={() => {
                setContactModalOpen(true);
                setMoreMenuOpen(false);
              }}
            >
              <DockIcon
                icon={Mail}
                label={t("nav.contact")}
                isActive={false}
                hoveredLabel={hoveredLabel}
                onHover={setHoveredLabel}
              />
            </button>
          </div>

          <div className="h-6 sm:h-8 w-px bg-border flex-shrink-0" />

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

          {/* Language Selector — opens modal */}
          <button
            onClick={() => {
              setLangModalOpen(true);
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

          {/* More menu - mobile only (socials + credits) */}
          <div className="relative sm:hidden" ref={moreRef}>
            <button
              onClick={() => {
                setMoreMenuOpen((prev) => !prev);
                setLangModalOpen(false);
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
                  className="absolute -top-[140px] right-0 w-48 rounded-xl border border-border/50 bg-background/95 p-2 shadow-xl backdrop-blur-xl"
                >
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

      {/* Language Selection Modal */}
      <AnimatePresence>
        {langModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/60 backdrop-blur-sm px-4"
            onClick={() => setLangModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {t("nav.language")}
                  </h3>
                </div>
                <button
                  onClick={() => setLangModalOpen(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
                        ? "bg-foreground text-background shadow-sm"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
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

      {/* Contact Modal */}
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/60 backdrop-blur-sm px-4"
            onClick={() => setContactModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {t("nav.contact")}
                  </h3>
                </div>
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto space-y-4">
                {/* Email Addresses Section */}
                {emailItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Addresses</h4>
                    <div className="space-y-2">
                      {emailItems.map((item) => (
                        <div
                          key={item.email}
                          className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm bg-muted/50"
                        >
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium text-foreground truncate">{item.label}</span>
                            <span className="text-xs text-muted-foreground truncate">{item.email}</span>
                          </div>
                          <button
                            onClick={() => handleCopyEmail(item.email)}
                            className="flex-shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            title="Copy email address"
                          >
                            {copiedEmail === item.email ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links Section */}
                {socialItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Social Links</h4>
                    <div className="space-y-2">
                      {socialItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleSocialClick(item.href, item.label)}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all active:scale-[0.98] bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/60 backdrop-blur-sm px-4"
            onClick={cancelRedirect}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <ExternalLink className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {t("social.redirect.title")}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {t("social.redirect.message", { platform: pendingLabel })}
              </p>

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={cancelRedirect}
                  className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {t("social.redirect.cancel")}
                </button>
                <button
                  onClick={confirmRedirect}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  {t("social.redirect.accept")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
