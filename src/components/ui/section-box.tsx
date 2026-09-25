import type { ReactNode } from "react";

export function SectionBox({
  title,
  badge,
  actions,
  children,
}: {
  title: string;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative rounded-2xl border border-border px-4 py-6 sm:px-6 sm:py-8">
      <div className="absolute left-4 top-0 flex -translate-y-1/2 items-center gap-2 bg-background pr-2 sm:left-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {badge}
      </div>
      {actions && (
        <div className="absolute right-4 top-0 -translate-y-1/2 bg-background pl-2 sm:right-6">
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}