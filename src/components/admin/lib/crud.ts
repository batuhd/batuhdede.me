import { supabase } from "@/lib/supabase";
import type { Row } from "../types";

export interface QueryOptions {
  orderColumn?: string;
  ascending?: boolean;
  limit?: number;
}

export interface CrudResult<T> {
  data: T | null;
  error: unknown;
}

function client() {
  if (!supabase) throw new Error("Supabase client is not configured");
  return supabase;
}

/** Tabloyu order_index'e göre listeler. */
export async function listRows(table: string, opts: QueryOptions = {}): Promise<CrudResult<Row[]>> {
  const sb = client();
  const orderColumn = opts.orderColumn ?? "order_index";
  let query = sb.from(table).select("*").order(orderColumn, { ascending: opts.ascending ?? true });
  if (opts.limit) query = query.limit(opts.limit);
  const { data, error } = await query;
  return { data: (data as Row[] | null) ?? null, error };
}

/** Tek satır (singleRow bölümler için ilk kayıt). */
export async function fetchSingle(table: string): Promise<CrudResult<Row | null>> {
  const sb = client();
  const { data, error } = await sb.from(table).select("*").limit(1);
  return { data: (data?.[0] as Row | undefined) ?? null, error };
}

/** Kayıt ekler ve eklenen satırı döndürür (id için). */
export async function createRow(table: string, payload: Row): Promise<CrudResult<Row>> {
  const sb = client();
  const { data, error } = await sb.from(table).insert(payload).select().single();
  return { data: (data as Row | null) ?? null, error };
}

export async function updateRow(table: string, id: string, payload: Row): Promise<CrudResult<Row>> {
  const sb = client();
  const { data, error } = await sb.from(table).update(payload).eq("id", id).select().single();
  return { data: (data as Row | null) ?? null, error };
}

export async function deleteRow(table: string, id: string): Promise<CrudResult<Row>> {
  const sb = client();
  const { data, error } = await sb.from(table).delete().eq("id", id).select().single();
  return { data: (data as Row | null) ?? null, error };
}

/** reorder_items RPC'ini destekleyen tablolar (DB whitelist). */
const REORDER_RPC_TABLES = [
  "projects",
  "blogs",
  "experiences",
  "educations",
  "skill_categories",
  "languages",
  "activities",
  "certifications",
  "project_images",
  "blog_images",
];

/**
 * Verilen sıradaki id listesine order_index = 0..n-1 yazar.
 * Whitelist tablolarında atomik RPC kullanır, diğerlerinde sıralı update yapar.
 */
export async function reorderRows(table: string, ids: string[]): Promise<CrudResult<null>> {
  const sb = client();
  if (REORDER_RPC_TABLES.includes(table)) {
    const p_indices = ids.map((_, i) => i);
    const { error } = await sb.rpc("reorder_items", {
      p_table: table,
      p_ids: ids,
      p_indices,
    });
    return { data: null, error };
  }
  for (let i = 0; i < ids.length; i++) {
    const { error } = await sb.from(table).update({ order_index: i }).eq("id", ids[i]);
    if (error) return { data: null, error };
  }
  return { data: null, error: null };
}

/** Yayınla/gizle toggle'ı. */
export async function setPublished(
  table: string,
  id: string,
  field: string,
  next: boolean,
): Promise<CrudResult<Row>> {
  const sb = client();
  const { data, error } = await sb.from(table).update({ [field]: next }).eq("id", id).select().single();
  return { data: (data as Row | null) ?? null, error };
}

/** Galeri satırlarını listeler. */
export async function fetchGallery(
  table: string,
  parentColumn: string,
  parentId: string,
): Promise<CrudResult<Row[]>> {
  const sb = client();
  const { data, error } = await sb
    .from(table)
    .select("*")
    .eq(parentColumn, parentId)
    .order("order_index", { ascending: true });
  return { data: (data as Row[] | null) ?? null, error };
}

/** Junction tablosunu seçilen çocuk id'lerine göre senkronlar (ekle + sil). */
export async function syncJunction(
  table: string,
  parentColumn: string,
  childColumn: string,
  parentId: string,
  selectedChildIds: string[],
): Promise<CrudResult<null>> {
  const sb = client();
  const { data: existing, error: fetchError } = await sb
    .from(table)
    .select(childColumn)
    .eq(parentColumn, parentId);
  if (fetchError) return { data: null, error: fetchError };

  const rows = (existing ?? []) as unknown as Row[];
  const current = new Set(rows.map((r) => String(r[childColumn])));
  const wanted = new Set(selectedChildIds);

  const toAdd = selectedChildIds.filter((id) => !current.has(id));
  const toRemove = rows
    .filter((r) => !wanted.has(String(r[childColumn])))
    .map((r) => String(r[childColumn]));

  if (toAdd.length > 0) {
    const payload: Row[] = toAdd.map((id) => ({
      [parentColumn]: parentId,
      [childColumn]: id,
    }));
    const { error } = await sb.from(table).insert(payload);
    if (error) return { data: null, error };
  }
  if (toRemove.length > 0) {
    const { error } = await sb
      .from(table)
      .delete()
      .eq(parentColumn, parentId)
      .in(childColumn, toRemove);
    if (error) return { data: null, error };
  }
  return { data: null, error: null };
}

/** Junction tablosunda seçili çocuk id'lerini döndürür. */
export async function fetchJunctionChildren(
  table: string,
  parentColumn: string,
  childColumn: string,
  parentId: string,
): Promise<CrudResult<string[]>> {
  const sb = client();
  const { data, error } = await sb
    .from(table)
    .select(childColumn)
    .eq(parentColumn, parentId);
  if (error) return { data: null, error };
  const rows = (data ?? []) as unknown as Row[];
  return { data: rows.map((r) => String(r[childColumn])), error: null };
}

/** Seçim kaynağı tablosundan (id → label) seçenek listesi üretir. */
export async function fetchSourceOptions(
  sourceTable: string,
  sourceValueField: string,
  sourceLabelField: string,
): Promise<Array<{ value: string; label: string }>> {
  const sb = client();
  const { data } = await sb
    .from(sourceTable)
    .select("*")
    .order("order_index", { ascending: true });
  return (data ?? []).map((row: Row) => ({
    value: String(row[sourceValueField] ?? ""),
    label: String(row[sourceLabelField] ?? ""),
  }));
}