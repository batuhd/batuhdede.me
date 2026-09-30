import type { LucideIcon } from "lucide-react";
import { HttpCat } from "@/components/http-cat";

interface EmptyStateProps {
  icon?: LucideIcon;
  catStatus?: number;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  catStatus,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
      {catStatus ? (
        <HttpCat status={catStatus} className="max-w-[120px]" />
      ) : Icon ? (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
          <Icon className="h-5 w-5 text-violet-300" />
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-200">{title}</p>
        {description && <p className="text-sm text-zinc-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}