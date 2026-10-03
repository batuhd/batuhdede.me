import type { Row } from "../types";

/**
 * Admin CRUD — ince istemci.
 *
 * Tüm Supabase çağrıları `/api/admin` Route Handler'ında yapılır; böylece
 * session çerezi `httpOnly` kalabilir ve sayfadaki JS token'ı okuyamaz.
 * Dışa açık imzalar değişmemiştir; çağıran dosyalar güncellenmedi.
 */

export interface QueryOptions {
  orderColumn?: string;
  ascending?: boolean;
  limit?: number;
}

export interface CrudResult<T> {
  data: T | null;
  error: unknown;
}

interface WireResult {
  data?: unknown;
  error?: { code?: string; message?: string; details?: string | null; hint?: string | null } | string;
}

/** /api/admin'e istek atar; hata durumunda Supabase benzeri hata nesnesi döner. */
async function call<T>(body: Record<string, unknown>): Promise<CrudResult<T>> {
  let res: Response;
  try {
    res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return {
      data: null,
      error: { code: "NETWORK", message: "Sunucuya ulaşılamadı. Bağlantını kontrol et." },
    };
  }

  let json: WireResult | null = null;
  try {
    json = (await res.json()) as WireResult;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const raw = json?.error;
    const error =
      typeof raw === "string"
        ? { code: String(res.status), message: raw }
        : {
            code: raw?.code ?? String(res.status),
            message: raw?.message ?? `İstek başarısız (${res.status})`,
            details: raw?.details ?? null,
            hint: raw?.hint ?? null,
          };
    return { data: null, error };
  }

  return { data: (json?.data as T) ?? null, error: null };
}

/** Tabloyu order_index'e göre listeler. */
export function listRows(
  table: string,
  opts: QueryOptions = {},
): Promise<CrudResult<Row[]>> {
  return call<Row[]>({
    op: "list",
    table,
    orderColumn: opts.orderColumn,
    ascending: opts.ascending,
    limit: opts.limit,
  });
}

/** Tek satır (singleRow bölümler için ilk kayıt). */
export function fetchSingle(table: string): Promise<CrudResult<Row | null>> {
  return call<Row | null>({ op: "fetchSingle", table });
}

/** Kayıt ekler ve eklenen satırı döndürür (id için). */
export function createRow(table: string, payload: Row): Promise<CrudResult<Row>> {
  return call<Row>({ op: "create", table, payload });
}

export function updateRow(
  table: string,
  id: string,
  payload: Row,
): Promise<CrudResult<Row>> {
  return call<Row>({ op: "update", table, id, payload });
}

export function deleteRow(table: string, id: string): Promise<CrudResult<Row>> {
  return call<Row>({ op: "delete", table, id });
}

/**
 * Verilen sıradaki id listesine order_index = 0..n-1 yazar.
 * Whitelist tablolarında atomik RPC kullanılır, diğerlerinde sıralı update.
 */
export function reorderRows(table: string, ids: string[]): Promise<CrudResult<null>> {
  return call<null>({ op: "reorder", table, ids });
}

/** Yayınla/gizle toggle'ı. */
export function setPublished(
  table: string,
  id: string,
  field: string,
  next: boolean,
): Promise<CrudResult<Row>> {
  return call<Row>({ op: "setPublished", table, id, field, next });
}

/** Galeri satırlarını listeler. */
export function fetchGallery(
  table: string,
  parentColumn: string,
  parentId: string,
): Promise<CrudResult<Row[]>> {
  return call<Row[]>({ op: "fetchGallery", table, parentId });
}

/** Junction tablosunu seçilen çocuk id'lerine göre senkronlar (ekle + sil). */
export function syncJunction(
  table: string,
  parentColumn: string,
  childColumn: string,
  parentId: string,
  selectedChildIds: string[],
): Promise<CrudResult<null>> {
  return call<null>({
    op: "syncJunction",
    table,
    parentId,
    selectedChildIds,
  });
}

/** Junction tablosunda seçili çocuk id'lerini döndürür. */
export function fetchJunctionChildren(
  table: string,
  parentColumn: string,
  childColumn: string,
  parentId: string,
): Promise<CrudResult<string[]>> {
  return call<string[]>({ op: "fetchJunctionChildren", table, parentId });
}

/** Seçim kaynağı tablosundan (id → label) seçenek listesi üretir. */
export async function fetchSourceOptions(
  sourceTable: string,
  sourceValueField: string,
  sourceLabelField: string,
): Promise<Array<{ value: string; label: string }>> {
  const { data } = await call<Array<{ value: string; label: string }>>({
    op: "fetchSourceOptions",
    table: sourceTable,
    valueField: sourceValueField,
    labelField: sourceLabelField,
  });
  return data ?? [];
}

/** Galeri/medya alanları için son kullanılan görseller. */
export async function fetchRecentImages(
  table: string,
  column: string,
  limit = 50,
): Promise<string[]> {
  const { data } = await call<string[]>({
    op: "recentImages",
    table,
    column,
    limit,
  });
  return data ?? [];
}

/** Bakım modu durumu (true = açık). */
export function fetchMaintenance(): Promise<CrudResult<boolean>> {
  return call<boolean>({ op: "getMaintenance" });
}

/** Bakım modunu açar (satır ekler) / kapatır (satır siler). */
export function setMaintenance(next: boolean): Promise<CrudResult<null>> {
  return call<null>({ op: "setMaintenance", next });
}