"use client";

import { Plus, Trash2 } from "lucide-react";
import type { RoleEntry } from "@/types";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MonthYearSelects, composeMonthYear, parseMonthYear } from "./month-year";
import type { FieldProps } from "./types";

function RoleDateFields({
  start,
  end,
  isCurrent,
  onStart,
  onEnd,
}: {
  start: string;
  end: string | null;
  isCurrent: boolean;
  onStart: (v: string) => void;
  onEnd: (v: string) => void;
}) {
  const s = parseMonthYear(start);
  const e = parseMonthYear(end ?? "");
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="space-y-1">
        <span className="text-xs text-zinc-500">Başlangıç</span>
        <MonthYearSelects
          month={s.month}
          year={s.year}
          onMonth={(m) => onStart(composeMonthYear(m, s.year))}
          onYear={(y) => onStart(composeMonthYear(s.month, y))}
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-zinc-500">Bitiş</span>
        <MonthYearSelects
          month={e.month}
          year={e.year}
          onMonth={(m) => onEnd(composeMonthYear(m, e.year))}
          onYear={(y) => onEnd(composeMonthYear(e.month, y))}
          disabled={isCurrent}
        />
      </div>
    </div>
  );
}

/**
 * Alt pozisyon listesi (jsonb). Başlık/açıklama aktif dil sütunlarına,
 * tarihler tüm diller için ortak yazılır.
 */
export function RoleListField({ value, onChange, lang, error }: FieldProps) {
  const roles = Array.isArray(value) ? (value as RoleEntry[]) : [];
  const titleKey = (lang === "en" ? "title" : `title_${lang}`) as keyof RoleEntry;
  const descKey = (lang === "en" ? "description" : `description_${lang}`) as keyof RoleEntry;

  const update = (index: number, patch: Partial<RoleEntry>) => {
    onChange(roles.map((role, i) => (i === index ? { ...role, ...patch } : role)));
  };
  const remove = (index: number) => {
    onChange(roles.filter((_, i) => i !== index));
  };
  const add = () => {
    onChange([
      ...roles,
      { title: "", start_date: "", end_date: null, is_current: false, description: null },
    ]);
  };

  return (
    <div className="space-y-3">
      {roles.length === 0 && (
        <p className="text-xs text-zinc-500">Henüz pozisyon eklenmemiş.</p>
      )}
      {roles.map((role, i) => (
        <div
          key={i}
          className="space-y-2.5 rounded-xl border border-white/10 bg-zinc-950 p-3.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Pozisyon {i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Pozisyonu kaldır"
              className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <Input
            value={String(role[titleKey] ?? "")}
            onChange={(e) => update(i, { [titleKey]: e.target.value } as Partial<RoleEntry>)}
            placeholder="Pozisyon adı"
            label="Başlık"
          />

          <RoleDateFields
            start={role.start_date ?? ""}
            end={role.end_date}
            isCurrent={!!role.is_current}
            onStart={(v) => update(i, { start_date: v })}
            onEnd={(v) => update(i, { end_date: v || null })}
          />

          <Checkbox
            label="Devam ediyor"
            checked={!!role.is_current}
            onChange={(c) => update(i, { is_current: c, end_date: c ? null : role.end_date })}
          />

          <Textarea
            value={String(role[descKey] ?? "")}
            onChange={(e) =>
              update(i, { [descKey]: e.target.value || null } as Partial<RoleEntry>)
            }
            placeholder="Açıklama"
            rows={2}
            label="Açıklama"
          />
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full border-dashed">
        <Plus className="h-3.5 w-3.5" /> Pozisyon ekle
      </Button>

      {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
}