"use client";

import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecentImages } from "../recent-images";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import type { FieldProps } from "./types";

export function ImageUrlField({ field, value, onChange, error, disabled }: FieldProps) {
  const [open, setOpen] = useState(false);
  const { images, loading, ensureLoaded } = useRecentImages();
  const current = String(value ?? "");

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) ensureLoaded();
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          value={current}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? "https://..."}
          error={error}
          disabled={disabled}
          className="flex-1"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label="Son kullanılan görselleri aç"
          aria-expanded={open}
          className={cn(
            "flex h-9 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 transition-colors",
            open ? "bg-violet-500/20 text-violet-300" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
          )}
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Son kullanılan görseller</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Görsel seçiciyi kapat"
              className="rounded p-1 text-zinc-500 hover:text-zinc-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <p className="py-6 text-center text-xs text-zinc-500">Henüz görsel bulunamadı.</p>
          ) : (
            <div className="grid max-h-56 grid-cols-6 gap-2 overflow-y-auto">
              {images.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => {
                    onChange(img);
                    setOpen(false);
                  }}
                  title={img}
                  className={cn(
                    "aspect-square overflow-hidden rounded-md border transition-colors",
                    current === img ? "border-violet-500" : "border-white/10 hover:border-white/30",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {current && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt=""
            className="h-12 w-16 shrink-0 rounded-lg border border-white/10 bg-zinc-900 object-cover"
            onError={(e) => {
              e.currentTarget.style.opacity = "0.25";
            }}
          />
          <span className="truncate text-xs text-zinc-500">{current}</span>
        </div>
      )}
    </div>
  );
}