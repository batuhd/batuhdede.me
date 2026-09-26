"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useAdminError } from "@/context/admin-error-context";
import {
  classifyError,
  isPermissionError,
} from "../lib/errors";
import { columnKey } from "../lib/languages";
import { notify } from "../lib/notifications";
import {
  deleteRow,
  fetchSingle,
  fetchSourceOptions,
  listRows,
  reorderRows,
  setPublished,
} from "../lib/crud";
import { EntityForm } from "./entity-form";
import { EntityList } from "./entity-list";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import type { Row, SectionConfig, SelectOption } from "../types";

interface EntityManagerProps {
  config: SectionConfig;
}

type FormMode = "list" | "create" | "edit";

export function EntityManager({ config }: EntityManagerProps) {
  const { handleOperationError } = useAdminError();
  const [items, setItems] = useState<Row[]>([]);
  const [single, setSingle] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sourceOptions, setSourceOptions] = useState<Record<string, SelectOption[]>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [mode, setMode] = useState<FormMode>("list");
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [singleVersion, setSingleVersion] = useState(0);

  const isSingleRow = !!config.singleRow;

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

  const loadOptions = useCallback(async () => {
    const sources: Array<{ key: string; table: string; value: string; label: string }> = [];
    for (const field of config.fields) {
      if (field.sourceTable && field.sourceValueField && field.sourceLabelField) {
        sources.push({
          key: field.key,
          table: field.sourceTable,
          value: field.sourceValueField,
          label: field.sourceLabelField,
        });
      }
    }
    if (config.junction) {
      sources.push({
        key: "__junction",
        table: config.junction.sourceTable,
        value: "id",
        label: config.junction.sourceLabelField,
      });
    }
    const next: Record<string, SelectOption[]> = {};
    await Promise.all(
      sources.map(async (source) => {
        next[source.key] = await fetchSourceOptions(source.table, source.value, source.label);
      }),
    );
    setSourceOptions(next);
  }, [config]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await listRows(config.table);
    if (error) {
      if (!report(error, "Liste yüklenemedi")) {
        setLoadError(`Liste yüklenemedi: ${classifyError(error).message}`);
      }
    }
    if (data) setItems(data);
    setLoading(false);
  }, [config.table, report]);

  const loadSingle = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await fetchSingle(config.table);
    if (error) {
      if (!report(error, "Profil yüklenemedi")) {
        setLoadError(`Profil yüklenemedi: ${classifyError(error).message}`);
      }
    }
    setSingle(data);
    setLoading(false);
  }, [config.table, report]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isSingleRow) void loadSingle();
    else void load();
    void loadOptions();
  }, [isSingleRow, load, loadSingle, loadOptions]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = items;
    if (filter) {
      list = list.filter(
        (item) => String(item[config.filterField ?? ""] ?? "") === filter,
      );
    }
    if (query) {
      const fields = [config.displayField, config.subtitleField].filter(
        Boolean,
      ) as string[];
      list = list.filter((item) =>
        fields.some((f) => String(item[f] ?? "").toLowerCase().includes(query)),
      );
    }
    return list;
  }, [items, search, filter, config]);

  const handleMove = async (id: string, dir: "up" | "down") => {
    const idx = filteredItems.findIndex((it) => String(it.id) === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swap < 0 || swap >= filteredItems.length) return;
    const next = [...filteredItems];
    [next[idx], next[swap]] = [next[swap], next[idx]];

    setBusyId(id);
    setItems(next);
    const { error } = await reorderRows(config.table, next.map((it) => String(it.id)));
    setBusyId(null);
    if (error) {
      void load();
      report(error, "Sıralama güncellenemedi");
      return;
    }
    notify.success("Sıralama güncellendi");
  };

  const handleTogglePublish = async (row: Row) => {
    if (!config.publishedField) return;
    const id = String(row.id);
    const next = !row[config.publishedField];
    setBusyId(id);
    const { error } = await setPublished(config.table, id, config.publishedField, next);
    setBusyId(null);
    if (error) {
      void load();
      report(error, "Yayın durumu güncellenemedi");
      return;
    }
    notify.success(next ? "Yayına alındı" : "Yayından kaldırıldı");
    void load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = String(deleteTarget.id);
    setDeleting(true);
    const { error } = await deleteRow(config.table, id);
    setDeleting(false);
    if (error) {
      report(error, "Silinemedi");
      return;
    }
    setDeleteTarget(null);
    notify.success("Kayıt silindi");
    void load();
  };

  const startAdd = () => {
    setEditingRow(null);
    setMode("create");
  };

  const startEdit = (row: Row) => {
    setEditingRow(row);
    setMode("edit");
  };

  const closeForm = () => {
    setEditingRow(null);
    setMode("list");
  };

  const deleteTitle = deleteTarget
    ? String(deleteTarget[columnKey(config.displayField, "tr")] ?? deleteTarget[config.displayField] ?? "Bu kayıt")
    : "Bu kayıt";

  if (isSingleRow) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-xl font-semibold text-zinc-100">{config.title}</h1>
          <p className="text-sm text-zinc-500">{config.description}</p>
        </header>
        {loadError && <ErrorBanner message={loadError} onRetry={loadSingle} />}
        {loading && !single ? (
          <Skeleton className="h-64 rounded-2xl" />
        ) : (
          <EntityForm
            key={`${config.id}-single-${singleVersion}-${single?.id ?? "new"}`}
            config={config}
            initial={single}
            nextOrderIndex={0}
            sourceOptions={sourceOptions}
            onSaved={() => {
              setSingleVersion((v) => v + 1);
              void loadSingle();
            }}
            onCancel={() => undefined}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-100">{config.title}</h1>
        <p className="text-sm text-zinc-500">{config.description}</p>
      </header>

      {loadError && <ErrorBanner message={loadError} onRetry={load} />}

      {mode === "create" || mode === "edit" ? (
        <EntityForm
          key={`${config.id}-${mode}-${editingRow?.id ?? "new"}`}
          config={config}
          initial={mode === "edit" ? editingRow : null}
          nextOrderIndex={items.length}
          sourceOptions={sourceOptions}
          onSaved={() => {
            closeForm();
            void load();
          }}
          onCancel={closeForm}
        />
      ) : (
        <EntityList
          config={config}
          items={filteredItems}
          loading={loading}
          search={search}
          filter={filter}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onAdd={startAdd}
          onEdit={startEdit}
          onDelete={setDeleteTarget}
          onMove={handleMove}
          onTogglePublish={handleTogglePublish}
          reorderDisabled={filteredItems.length !== items.length}
          busyId={busyId}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Kaydı Sil"
        message={`“${deleteTitle}” kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-rose-300">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RotateCcw className="h-3.5 w-3.5" /> Yeniden Dene
      </Button>
    </div>
  );
}