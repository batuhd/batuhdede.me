"use client";

import { cn } from "@/lib/utils";

interface AdminBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  size?: "sm" | "md";
}

export function AdminBadge({
  children,
  className,
  variant = "default",
  size = "sm",
}: AdminBadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };

  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium border",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
