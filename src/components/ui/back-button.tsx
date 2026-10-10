"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label: string;
}

export function BackButton({ href, label }: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    e.preventDefault();
    const canGoBack =
      document.referrer.startsWith(window.location.origin) ||
      window.history.length > 1;
    if (canGoBack) router.back();
    else router.push(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="inline-flex min-h-[44px] items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-150 hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
      <span>{label}</span>
    </Link>
  );
}
