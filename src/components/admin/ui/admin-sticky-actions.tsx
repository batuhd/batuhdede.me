"use client";

import { cn } from "@/lib/utils";

interface AdminStickyActionsProps {
  children: React.ReactNode;
  className?: string;
  topBorder?: boolean;
}

export function AdminStickyActions({
  children,
  className,
  topBorder = true,
}: AdminStickyActionsProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-4 -mb-4 mt-6 bg-card/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:-mb-6 sm:px-6",
        topBorder && "border-t",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-end gap-2">{children}</div>
    </div>
  );
}
