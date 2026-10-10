"use client";

import type { LucideIcon } from "lucide-react";
import {
  Twitter,
  Instagram,
  Github,
  Linkedin,
  Youtube,
  Dribbble,
  Link2,
} from "lucide-react";
import { useSiteData } from "@/context/site-data-context";
import { userConfig } from "@/config/user";
import { cn, sanitizeUrl } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  X: Twitter,
  Twitter,
  LinkedIn: Linkedin,
  GitHub: Github,
  Instagram,
  YouTube: Youtube,
  Dribbble,
  Other: Link2,
};

export interface SocialItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

function fallbackItems(): SocialItem[] {
  return [
    { href: userConfig.links.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: userConfig.links.github, label: "GitHub", icon: Github },
    { href: userConfig.links.instagram, label: "Instagram", icon: Instagram },
  ]
    .map((item) => ({ ...item, href: sanitizeUrl(item.href) || "" }))
    .filter((item) => item.href !== "");
}

export function useSocialItems(): SocialItem[] {
  const { socialLinks } = useSiteData();
  const fallback = fallbackItems();

  if (!socialLinks || socialLinks.length === 0) return fallback;

  const mapped = socialLinks
    .map<SocialItem>((link) => ({
      href: sanitizeUrl(link.url) || "",
      label: link.platform,
      icon: ICONS[link.platform] ?? Link2,
    }))
    .filter((item) => item.href !== "" && !/cv|resume/i.test(item.label));

  return mapped.length > 0 ? mapped : fallback;
}

export function SocialLinks({
  onSelect,
  className,
  iconClassName,
  direction = "row",
}: {
  onSelect: (href: string, label: string) => void;
  className?: string;
  iconClassName?: string;
  direction?: "row" | "column";
}) {
  const items = useSocialItems();

  return (
    <div
      className={cn(
        "flex",
        direction === "column" ? "flex-col items-end" : "flex-row items-center",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onSelect(item.href, item.label)}
          aria-label={item.label}
          className="text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <item.icon strokeWidth={1.5} className={cn("h-[18px] w-[18px]", iconClassName)} />
        </button>
      ))}
    </div>
  );
}
