"use client";

import { cn } from "@/lib/utils";

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export function AdminCard({
  children,
  className,
  title,
  description,
  action,
  footer,
  noPadding = false,
}: AdminCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card shadow-sm overflow-hidden",
        className,
      )}
    >
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b px-4 py-4 sm:px-6 sm:py-5">
          <div className="space-y-1">
            {title && (
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn(!noPadding && "p-4 sm:p-6")}>{children}</div>
      {footer && (
        <div className="border-t bg-muted/30 px-4 py-3 sm:px-6">{footer}</div>
      )}
    </div>
  );
}
