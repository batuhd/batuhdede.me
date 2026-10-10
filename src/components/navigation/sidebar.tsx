"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { SocialLinks } from "./social-links";
import { GalleryControls } from "./gallery-controls";
import { LanguageThemeControls } from "./prefs-controls";
import { NAV_GROUPS } from "./nav-items";

export function Sidebar({
  onSocial,
}: {
  onSocial: (href: string, label: string) => void;
}) {
  const pathname = usePathname();
  const { t, locale } = useLanguage();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-[100dvh] w-[19.375rem] bg-background pl-[3.875rem] lg:block">
      <div className="mt-[3.875rem]">
        <Brand />
      </div>

      <nav aria-label="Main" className="mt-[3.125rem] flex flex-col items-end">
        {NAV_GROUPS.map((group, groupIndex) => (
          <ul
            key={groupIndex}
            className={cn(
              "flex flex-col items-end",
              groupIndex > 0 && "mt-[1.25rem]",
            )}
          >
            {group.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block text-right text-[17px] font-light leading-[2rem] transition-colors duration-150",
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

      <SocialLinks
        onSelect={onSocial}
        direction="column"
        className="mt-[2.5rem] ml-auto w-fit gap-3"
      />

      <a
        href={`/api/cv?lang=${locale}&download=1`}
        className="mt-3 ml-auto block w-fit text-right text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        {t("nav.cv")}
      </a>

      <div className="absolute bottom-[3rem] left-[3.875rem] flex flex-col gap-2">
        <GalleryControls variant="sidebar" />
        <LanguageThemeControls />
      </div>
    </aside>
  );
}
