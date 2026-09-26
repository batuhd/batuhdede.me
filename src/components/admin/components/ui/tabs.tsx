import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  value: T;
  label: string;
  /** Sekme üzerinde gösterilecek rozet sayısı (örn. eksik çeviri). */
  badge?: number;
  /** Rozet uyarı renginde olsun mu? */
  warning?: boolean;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  label?: string;
}

export function Tabs<T extends string>({ items, value, onChange, className, label }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-zinc-900 p-1",
        className,
      )}
    >
      {items.map((item) => {
        const active = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
            )}
          >
            {item.label}
            {item.badge !== undefined && item.badge > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                  item.warning
                    ? "bg-amber-500/20 text-amber-300"
                    : active
                      ? "bg-white/20 text-white"
                      : "bg-zinc-700 text-zinc-300",
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}