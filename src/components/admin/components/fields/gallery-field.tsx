"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ImageIcon, Plus, Trash2 } from "lucide-react";
import { useAdminError } from "@/context/admin-error-context";
import { createRow, deleteRow, fetchGallery, reorderRows } from "../../lib/crud";
import { classifyError, isPermissionError } from "../../lib/errors";
import { notify } from "../../lib/notifications";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty-state";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import type { Row } from "../../types";

interface GalleryFieldProps {
  table: string;
  parentColumn: string;
  parentId: string;
  label?: string;
}

/**
 * Proje/blog galerisi (project_images / blog_images).
 * Satırları anında kaydeder; ana form kaydından bağımsız çalışır.
 */
export function GalleryField({ table, parentColumn, parentId, label = "Görseller" }: GalleryFieldProps) {
  const { handleOperationError } = useAdminError();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  const report = useCallback(
    (error: unknown, operation: string): boolean => {
      if (!error) return false;
      if (isPermissionError(error)) {
        handleOperationError(error, operation);
        return true;
      }
      notify.error(`${operation}: ${classifyError(error).message}`);
      return true;
    },
    [handleOperationError],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchGallery(table, parentColumn, parentId);
    if (error) report(error, "Galeri yüklenemedi");
    if (data) setItems(data);
    setLoading(false);
  }, [table, parentColumn, parentId, report]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const add = async () => {
    if (!url.trim()) {
      notify.error("Görsel eklenemedi: Görsel URL boş");
      return;
    }
    setBusy(true);
    const { error } = await createRow(table, {
      [parentColumn]: parentId,
      image_url: url.trim(),
      caption: caption.trim() || null,
      order_index: items.length,
    });
    if (error) {
      report(error, "Görsel eklenemedi");
      setBusy(false);
      return;
    }
    notify.success("Görsel eklendi");
    setUrl("");
    setCaption("");
    setBusy(false);
    void load();
  };

  const remove = async (id: string) => {
    setBusy(true);
    const { error } = await deleteRow(table, id);
    if (error) {
      report(error, "Görsel silinemedi");
      setBusy(false);
      return;
    }
    notify.success("Görsel silindi");
    setBusy(false);
    void load();
  };

  const move = async (id: string, dir: "up" | "down") => {
    const idx = items.findIndex((it) => it.id === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swap < 0 || swap >= items.length) return;
    const next = [...items];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setItems(next);
    const { error } = await reorderRows(table, next.map((it) => String(it.id)));
    if (error) {
      void load();
      report(error, "Sıralama güncellenemedi");
      return;
    }
    notify.success("Sıralama güncellendi");
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-zinc-400">{label}</p>

      {loading ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Galeri boş"
          description="Aşağıdan görsel URL'si ekleyin."
        />
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={String(item.id)}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-950 p-2.5"
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  disabled={idx === 0 || busy}
                  onClick={() => void move(String(item.id), "up")}
                  aria-label="Görseli yukarı taşı"
                  className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-20"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === items.length - 1 || busy}
                  onClick={() => void move(String(item.id), "down")}
                  aria-label="Görseli aşağı taşı"
                  className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-20"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={String(item.image_url ?? "")}
                alt=""
                className="h-12 w-16 shrink-0 rounded-lg border border-white/10 bg-zinc-900 object-cover"
                onError={(e) => {
                  e.currentTarget.style.opacity = "0.25";
                }}
              />
              <span className="min-w-0 flex-1 truncate text-xs text-zinc-500">
                {String(item.caption ?? "") || String(item.image_url ?? "")}
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => void remove(String(item.id))}
                aria-label="Görseli sil"
                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-white/10 p-3 sm:flex-row sm:items-end">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Görsel URL (https://...)"
          aria-label="Yeni görsel URL"
          className="flex-1"
        />
        <Input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Altyazı (opsiyonel)"
          aria-label="Görsel altyazısı"
          className="flex-1"
        />
        <Button type="button" size="sm" onClick={add} loading={busy} className={cn("sm:shrink-0")}>
          <Plus className="h-4 w-4" /> Ekle
        </Button>
      </div>
    </div>
  );
}