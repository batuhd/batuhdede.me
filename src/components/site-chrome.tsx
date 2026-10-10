"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "@/components/navigation/top-nav";
import { SkipLink } from "@/components/skip-link";

/**
 * Public site chrome'u (sidebar/mobil menü + içerik sarmalayıcı).
 * Admin rotalarında public chrome render edilmez; admin kendi Shell'ini
 * kullanır, aksi halde sabit sidebar admin içeriğinin üzerine biner.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <SkipLink />
      <TopNav />
      <main
        id="main-content"
        className="relative pt-[calc(4.5rem+env(safe-area-inset-top))] pb-16 lg:ml-[26rem] lg:pb-[3.0625rem] lg:pt-[2.875rem] lg:pr-[6.75rem]"
      >
        {children}
      </main>
    </>
  );
}
