"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminError } from "@/context/admin-error-context";
import { classifyError, isPermissionError } from "../lib/errors";
import { notify } from "../lib/notifications";
import { Switch } from "./ui/switch";
import { Skeleton } from "./ui/skeleton";

export function Settings() {
  const { handleOperationError } = useAdminError();
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  const report = useCallback(
    (error: unknown, operation: string) => {
      if (isPermissionError(error)) {
        handleOperationError(error, operation);
        return true;
      }
      notify.error(`${operation}: ${classifyError(error).message}`);
      return true;
    },
    [handleOperationError],
  );

  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    void (async () => {
      const result = (await sb
        .from("section_order")
        .select("*")
        .eq("section_id", "maintenance_mode")
        .maybeSingle()) as unknown as { data: unknown; error: unknown };
      if (result.error) report(result.error, "Ayarlar yüklenemedi");
      setMaintenance(!!result.data);
      setLoading(false);
    })();
  }, [report]);

  const toggleMaintenance = async () => {
    if (!supabase) return;
    const next = !maintenance;
    setLoading(true);
    if (next) {
      const result = (await supabase
        .from("section_order")
        .insert({ section_id: "maintenance_mode", order_index: -1 })) as unknown as {
        error: unknown;
      };
      if (result.error) {
        report(result.error, "Bakım modu açılamadı");
        setLoading(false);
        return;
      }
    } else {
      const result = (await supabase
        .from("section_order")
        .delete()
        .eq("section_id", "maintenance_mode")) as unknown as { error: unknown };
      if (result.error) {
        report(result.error, "Bakım modu kapatılamadı");
        setLoading(false);
        return;
      }
    }
    setMaintenance(next);
    setLoading(false);
    notify.success(next ? "Bakım modu açıldı" : "Bakım modu kapatıldı");
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-zinc-100">Ayarlar</h2>
        <p className="text-sm text-zinc-500">Site geneli yapılandırma.</p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
        {loading ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <Switch
              label="Bakım Modu"
              description="Açıldığında site ziyaretçilere bakım ekranı gösterir."
              checked={maintenance}
              onChange={() => void toggleMaintenance()}
            />
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-500">
        Bakım modu açıkken ziyaretçiler siteyi görüntüleyemez; siz admin olarak giriş yapmaya devam
        edebilirsiniz.
      </p>
    </div>
  );
}