"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SECTION_CONFIGS, type AdminView } from "../sections";
import { Skeleton } from "./ui/skeleton";

interface DashboardProps {
  onNavigate: (view: AdminView) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    void (async () => {
      const entries: Record<string, number> = {};
      await Promise.all(
        SECTION_CONFIGS.map(async (config) => {
          const result = (await sb
            .from(config.table)
            .select("*", { count: "exact", head: true })) as unknown as {
            count: number | null;
            error: unknown;
          };
          entries[config.id] = result.count ?? 0;
        }),
      );
      setCounts(entries);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-zinc-100">Panel</h2>
        <p className="text-sm text-zinc-500">Sitenin tüm içeriğini buradan yönetin.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTION_CONFIGS.map((config) => (
          <button
            key={config.id}
            type="button"
            onClick={() => onNavigate(config.id as AdminView)}
            className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-4 text-left transition-colors hover:border-violet-500/40 hover:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <config.icon className="h-4 w-4" />
              </div>
              {loading ? (
                <Skeleton className="h-6 w-10" />
              ) : (
                <span className="text-2xl font-bold tabular-nums text-zinc-100">
                  {counts[config.id] ?? 0}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-200">{config.label}</p>
            <p className="text-xs text-zinc-500">
              {config.singleRow ? "Tek satır form" : `${counts[config.id] ?? 0} kayıt`}
            </p>
          </button>
        ))}

        <button
          type="button"
          onClick={() => onNavigate("settings")}
          className="group rounded-2xl border border-dashed border-white/15 p-4 text-left transition-colors hover:border-violet-500/40 hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
              <Settings className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-300" />
          </div>
          <p className="mt-3 text-sm font-medium text-zinc-200">Ayarlar</p>
          <p className="text-xs text-zinc-500">Bakım modu</p>
        </button>
      </div>
    </div>
  );
}