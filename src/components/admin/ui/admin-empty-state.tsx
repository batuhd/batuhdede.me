"use client";

import { cn } from "@/lib/utils";

interface AdminEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function AdminEmptyState({
  title = "Henüz öğe yok",
  description = "İlk öğeyi eklemek için yukarıdaki butonu kullanabilirsin.",
  icon,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center",
        className,
      )}
    >
      {icon && (
        <div className="text-muted-foreground/60">{icon}</div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
