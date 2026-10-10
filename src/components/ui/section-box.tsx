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
    <section className="border border-border">
      <div className="flex items-center justify-between gap-4 bg-muted px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 bg-brand" aria-hidden="true" />
          <span className="text-[11px] font-normal uppercase tracking-[0.12em] text-foreground">
            {title}
          </span>
          {badge}
        </div>
        {actions}
      </div>
      <div className="px-4 py-5 sm:px-5">{children}</div>
    </section>
  );
}
