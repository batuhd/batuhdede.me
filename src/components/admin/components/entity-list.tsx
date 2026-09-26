"use client";

import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { columnKey, LANG_ORDER } from "../lib/languages";
import { isEmptyValue } from "../lib/errors";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { EmptyState } from "./ui/empty-state";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import type { Row, SectionConfig } from "../types";

interface EntityListProps {
  config: SectionConfig;
  items: Row[];
  loading: boolean;
  search: string;
  filter: string;
  onSearchChange: (v: string) => void;
  onFilterChange: (v: string) => void;
  onAdd: () => void;
  onEdit: (row: Row) => void;
  onDelete: (row: Row) => void;
  onMove: (id: string, dir: "up" | "down") => void;
  onTogglePublish: (row: Row) => void;
  reorderDisabled: boolean;
  busyId: string | null;
}

/** TR varsa TR başlığını, yoksa temel (EN) başlığı gösterir. */
function localized(item: Row, key: string): string {
  const tr = item[columnKey(key, "tr")];
  if (typeof tr === "string" && tr.trim()) return tr;
  return String(item[key] ?? "");
}

export function EntityList({
  config,
  items,
  loading,
  search,
  filter,
  onSearchChange,
  onFilterChange,
  onAdd,
  onEdit,
  onDelete,
  onMove,
  onTogglePublish,
  reorderDisabled,
  busyId,
}: EntityListProps) {
  const filterValues = config.filterField
    ? Array.from(
        new Set(
          items
            .map((it) => String(it[config.filterField as string] ?? "").trim())
            .filter(Boolean),
        ),
      )
    : [];

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ara..."
            aria-label="Kayıtlarda ara"
            className="pl-9"
          />
        </div>
        {config.filterField && (
          <Select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            aria-label="Kategoriye göre filtrele"
            className="w-44"
          >
            <option value="">Tümü</option>
            {filterValues.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        )}
        <Button onClick={onAdd} size="md">
          <Plus className="h-4 w-4" /> Yeni Ekle
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={config.icon}
          title="Henüz kayıt yok"
          description="İlk kaydı ekleyerek başlayın."
          action={
            <Button onClick={onAdd} size="sm">
              <Plus className="h-4 w-4" /> Yeni Ekle
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => {
            const id = String(item.id);
            const title = localized(item, config.displayField) || "İsimsiz";
            const subtitle = config.subtitleField ? localized(item, config.subtitleField) : "";
            const image = config.imageField ? String(item[config.imageField] ?? "") : "";
            const published = config.publishedField ? !!item[config.publishedField] : null;
            const busy = busyId === id;
            const translatableFields = config.fields.filter((f) => f.translatable);

            return (
              <div
                key={id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/60 p-3 transition-colors hover:border-white/20"
              >
                <div className="flex flex-col">
                  <button
                    type="button"
                    disabled={reorderDisabled || busy || idx === 0}
                    onClick={() => onMove(id, "up")}
                    aria-label="Yukarı taşı"
                    className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-20"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={reorderDisabled || busy || idx === items.length - 1}
                    onClick={() => onMove(id, "down")}
                    aria-label="Aşağı taşı"
                    className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-20"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {image && (
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.opacity = "0.25";
                      }}
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-100">{title}</p>
                  {subtitle && <p className="truncate text-xs text-zinc-500">{subtitle}</p>}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {LANG_ORDER.filter((lang) =>
                      translatableFields.some((f) => !isEmptyValue(item[columnKey(f.key, lang)])),
                    ).map((lang) => (
                      <Badge key={lang} variant="accent">
                        {lang.toUpperCase()}
                      </Badge>
                    ))}
                    {published !== null && (
                      <Badge variant={published ? "success" : "warning"}>
                        {published ? config.publishedLabel ?? "Yayında" : "Taslak"}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  {published !== null && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onTogglePublish(item)}
                      aria-label={published ? "Yayından kaldır" : "Yayınla"}
                      title={published ? "Gizle" : "Yayınla"}
                      className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-40"
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    aria-label="Düzenle"
                    title="Düzenle"
                    className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-violet-500/10 hover:text-violet-300"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    aria-label="Sil"
                    title="Sil"
                    className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && reorderDisabled && (
        <p className={cn("text-xs text-zinc-500")}>
          Sıralamayı değiştirmek için aramayı temizleyin.
        </p>
      )}
    </div>
  );
}