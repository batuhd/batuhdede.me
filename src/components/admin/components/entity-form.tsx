"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { sanitizeUrl, cn } from "@/lib/utils";
import { useAdminError } from "@/context/admin-error-context";
import {
  columnKey,
  LANG_ORDER,
  type Lang,
} from "../lib/languages";
import {
  classifyError,
  isEmptyValue,
  isPermissionError,
  isValidOptionalEmail,
  isValidOptionalUrl,
} from "../lib/errors";
import { createRow, fetchJunctionChildren, syncJunction, updateRow } from "../lib/crud";
import { notify } from "../lib/notifications";
import { LanguageTabs } from "./language-tabs";
import { RenderField } from "./fields/render-field";
import { MultiSelectField } from "./fields/choice-fields";
import { GalleryField } from "./fields/gallery-field";
import { Button } from "./ui/button";
import type { RoleEntry } from "@/types";
import type { Field, FormValue, Row, SectionConfig, SelectOption } from "../types";

interface EntityFormProps {
  config: SectionConfig;
  /** null = yeni kayıt, Row = düzenleme. */
  initial: Row | null;
  nextOrderIndex: number;
  sourceOptions: Record<string, SelectOption[]>;
  onSaved: () => void;
  onCancel: () => void;
}

const JUNCTION_KEY = "__junction";

/** Translatable alanlar için dil sütunu anahtarı, değilse temel anahtar. */
function valueKey(field: Field, lang: Lang): string {
  return field.translatable ? columnKey(field.key, lang) : field.key;
}

function emptyValues(config: SectionConfig): Record<string, FormValue> {
  const values: Record<string, FormValue> = {};
  for (const field of config.fields) {
    if (field.type === "role_list") {
      values[field.key] = [];
      continue;
    }
    const keys = field.translatable ? LANG_ORDER.map((l) => columnKey(field.key, l)) : [field.key];
    for (const key of keys) {
      if (field.type === "checkbox") values[key] = false;
      else if (field.type === "multi_select") values[key] = [];
      else if (field.type === "json_array") values[key] = "";
      else values[key] = "";
    }
  }
  if (config.junction) values[JUNCTION_KEY] = [];
  return values;
}

function fromRow(config: SectionConfig, row: Row | null): Record<string, FormValue> {
  const values = emptyValues(config);
  if (!row) return values;
  for (const field of config.fields) {
    if (field.type === "role_list") {
      values[field.key] = Array.isArray(row[field.key]) ? (row[field.key] as RoleEntry[]) : [];
      continue;
    }
    const keys = field.translatable ? LANG_ORDER.map((l) => columnKey(field.key, l)) : [field.key];
    for (const key of keys) {
      const raw = row[key];
      if (field.type === "checkbox") values[key] = !!raw;
      else if (field.type === "multi_select") values[key] = Array.isArray(raw) ? (raw as string[]) : [];
      else if (field.type === "json_array") values[key] = Array.isArray(raw) ? (raw as string[]).join(", ") : String(raw ?? "");
      else if (field.type === "number") values[key] = raw == null ? "" : String(raw);
      else values[key] = String(raw ?? "");
    }
  }
  return values;
}

function normalizeValue(field: Field, value: FormValue): unknown {
  switch (field.type) {
    case "checkbox":
      return !!value;
    case "number": {
      const n = parseInt(String(value ?? ""), 10);
      return Number.isNaN(n) ? null : n;
    }
    case "multi_select":
      return Array.isArray(value) ? value : [];
    case "role_list":
      return Array.isArray(value) ? value : [];
    case "json_array":
      return String(value ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    default: {
      const text = String(value ?? "").trim();
      if (field.validate === "url") return text ? sanitizeUrl(text) : null;
      return text === "" ? null : text;
    }
  }
}

function buildPayload(config: SectionConfig, values: Record<string, FormValue>): Row {
  const payload: Row = {};
  for (const field of config.fields) {
    if (field.type === "role_list") {
      payload[field.key] = Array.isArray(values[field.key]) ? values[field.key] : [];
      continue;
    }
    if (field.translatable) {
      for (const lang of LANG_ORDER) {
        payload[columnKey(field.key, lang)] = normalizeValue(
          field,
          values[columnKey(field.key, lang)],
        );
      }
      // EN (temel) sütunlar bazı tablolarda NOT NULL. TR-first akışta EN boşsa
      // TR değerini temel sütuna yaz (kullanıcı EN'i doldurana kadar fallback).
      if (isEmptyValue(values[field.key])) {
        payload[field.key] = normalizeValue(field, values[columnKey(field.key, "tr")]);
      }
    } else {
      payload[field.key] = normalizeValue(field, values[field.key]);
    }
  }
  if (values.is_current === true && config.fields.some((f) => f.key === "end_date")) {
    payload.end_date = null;
  }
  return payload;
}

function validateValues(
  config: SectionConfig,
  values: Record<string, FormValue>,
  lang: Lang,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of config.fields) {
    if (field.type === "role_list" || field.type === "multi_select") continue;
    if (field.required) {
      const checkKey = field.translatable ? columnKey(field.key, "tr") : field.key;
      if (isEmptyValue(values[checkKey])) {
        errors[field.key] = `Zorunlu alan eksik (${field.label}${field.translatable ? " - TR" : ""})`;
      }
    }
    if (field.validate === "url" && !isValidOptionalUrl(values[columnKey(field.key, lang)])) {
      errors[field.key] = "Geçersiz URL";
    }
    if (field.validate === "email" && !isValidOptionalEmail(values[columnKey(field.key, lang)])) {
      errors[field.key] = "Geçersiz e-posta adresi";
    }
  }
  return errors;
}

export function EntityForm({
  config,
  initial,
  nextOrderIndex,
  sourceOptions,
  onSaved,
  onCancel,
}: EntityFormProps) {
  const { handleOperationError } = useAdminError();
  const editing = initial !== null;

  const [values, setValues] = useState<Record<string, FormValue>>(() => fromRow(config, initial));
  const [lang, setLang] = useState<Lang>("tr");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const junction = config.junction;
    if (!junction || !initial) return;
    void (async () => {
      const { data, error } = await fetchJunctionChildren(
        junction.table,
        junction.parentColumn,
        junction.childColumn,
        String(initial.id),
      );
      if (!error && data) {
        setValues((prev) => ({ ...prev, [JUNCTION_KEY]: data }));
      }
    })();
  }, [config, initial]);

  const missingCounts = useMemo(() => {
    const counts: Partial<Record<Lang, number>> = {};
    const translatable = config.fields.filter((f) => f.translatable);
    for (const l of LANG_ORDER) {
      counts[l] = translatable.filter((f) => isEmptyValue(values[columnKey(f.key, l)])).length;
    }
    return counts;
  }, [config, values]);

  const setField = (valueKey: string, fieldKey: string, value: FormValue) => {
    setValues((prev) => ({ ...prev, [valueKey]: value }));
    setErrors((prev) => {
      if (!prev[fieldKey]) return prev;
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const handleSave = async () => {
    const validationErrors = validateValues(config, values, lang);
    setErrors(validationErrors);
    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      notify.error(`Kaydedilemedi: ${firstError}`);
      return;
    }

    setSaving(true);
    const toastId = notify.loading(editing ? "Kaydediliyor..." : "Ekleniyor...");
    const payload = buildPayload(config, values);

    const result = editing
      ? await updateRow(config.table, String(initial.id), payload)
      : await createRow(config.table, {
          ...payload,
          ...(config.singleRow ? {} : { order_index: nextOrderIndex }),
        });

    if (result.error) {
      notify.resolve(toastId, `Kaydedilemedi: ${classifyError(result.error).message}`, false);
      if (isPermissionError(result.error)) handleOperationError(result.error, "Kaydetme");
      setSaving(false);
      return;
    }

    const savedId = result.data?.id ? String(result.data.id) : editing ? String(initial.id) : null;

    if (config.junction && savedId) {
      const selected = Array.isArray(values[JUNCTION_KEY]) ? (values[JUNCTION_KEY] as string[]) : [];
      const jr = await syncJunction(
        config.junction.table,
        config.junction.parentColumn,
        config.junction.childColumn,
        savedId,
        selected,
      );
      if (jr.error) {
        notify.warning(`Bağlantılar güncellenemedi: ${classifyError(jr.error).message}`);
      }
    }

    notify.resolve(toastId, editing ? "Değişiklikler kaydedildi" : "Kayıt başarıyla eklendi", true);
    setSaving(false);
    onSaved();
  };

  const translatableFields = config.fields.filter((f) => f.translatable);
  const junctionOptions = sourceOptions["__junction"] ?? [];

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            {editing ? "Kaydı Düzenle" : "Yeni Kayıt"}
          </h2>
          <p className="text-sm text-zinc-500">{config.title}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4" /> Kapat
        </Button>
      </div>

      {translatableFields.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <LanguageTabs value={lang} onChange={setLang} missingCounts={missingCounts} />
          <span className="text-xs text-zinc-500">Ana dil TR; diğer diller isteğe bağlı.</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {config.fields.map((field) => {
          const fullWidth =
            field.type === "textarea" ||
            field.type === "markdown" ||
            field.type === "role_list" ||
            field.fullWidth;
          const valueKeyForField = field.type === "role_list" ? field.key : valueKey(field, lang);
          const fieldOptions = field.sourceTable
            ? sourceOptions[field.key] ?? []
            : (field.options ?? []);

          const labelMark = field.translatable && lang !== "en" ? ` (${lang.toUpperCase()})` : "";

          return (
            <div key={field.key} className={cn("space-y-1", fullWidth && "sm:col-span-2")}>
              {field.type !== "checkbox" && (
                <span className="block text-xs font-medium text-zinc-400">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-rose-400">*</span>}
                  {labelMark}
                </span>
              )}
              <RenderField
                field={field}
                lang={lang}
                value={values[valueKeyForField]}
                onChange={(v) => setField(valueKeyForField, field.key, v)}
                error={errors[field.key]}
                options={fieldOptions}
                isCurrentValue={
                  field.isCurrentField ? values[field.isCurrentField] === true : undefined
                }
              />
            </div>
          );
        })}
      </div>

      {config.junction && (
        <div className="mt-6 rounded-xl border border-white/10 bg-zinc-950 p-4">
          <p className="mb-2 text-xs font-medium text-zinc-400">Bağlı Yetenekler</p>
          <MultiSelectField
            field={{ key: JUNCTION_KEY, label: "Bağlı Yetenekler", type: "multi_select" }}
            lang={lang}
            value={Array.isArray(values[JUNCTION_KEY]) ? (values[JUNCTION_KEY] as string[]) : []}
            onChange={(v) => setField(JUNCTION_KEY, JUNCTION_KEY, v)}
            options={junctionOptions}
          />
        </div>
      )}

      {config.gallery &&
        (editing ? (
          <div className="mt-6">
            <GalleryField
              table={config.gallery.table}
              parentColumn={config.gallery.parentColumn}
              parentId={String(initial.id)}
              label={config.gallery.table === "project_images" ? "Proje Görselleri" : "Yazı Görselleri"}
            />
          </div>
        ) : (
          <p className="mt-5 text-xs text-zinc-500">
            Kaydı oluşturduktan sonra galeri görsellerini ekleyebilirsiniz.
          </p>
        ))}

      <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/10 pt-5">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          İptal
        </Button>
        <Button onClick={handleSave} loading={saving}>
          {editing ? "Değişiklikleri Kaydet" : "Kaydet"}
        </Button>
      </div>
    </div>
  );
}