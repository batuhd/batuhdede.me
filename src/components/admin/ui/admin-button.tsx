"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function AdminButton({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: AdminButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px]";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary:
      "bg-foreground text-background hover:bg-foreground/90",
    outline:
      "border bg-background hover:bg-muted text-foreground",
    ghost:
      "hover:bg-muted text-foreground",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-11 px-5 py-2.5 text-sm",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon && <span className="h-4 w-4">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="h-4 w-4">{rightIcon}</span>
      )}
    </button>
  );
}
