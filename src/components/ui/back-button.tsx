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
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}