import { sanitizeUrl, isValidEmail } from "@/lib/utils";

export type ErrorKind =
  | "permission"
  | "foreign_key"
  | "unique"
  | "limit"
  | "network"
  | "validation"
  | "unknown";

export interface ClassifiedError {
  kind: ErrorKind;
  code: string;
  /** Kullanıcıya gösterilecek, sebebi açık Türkçe mesaj. */
  message: string;
}

interface ErrorLike {
  code?: unknown;
  status?: unknown;
  message?: unknown;
  details?: unknown;
  name?: unknown;
}

function asErrorLike(error: unknown): ErrorLike {
  if (error && typeof error === "object") return error as ErrorLike;
  return {};
}

function codeOf(error: unknown): string {
  const err = asErrorLike(error);
  const code = String(err.code ?? err.status ?? "");
  return code.toUpperCase();
}

function messageOf(error: unknown): string {
  const err = asErrorLike(error);
  return String(err.message ?? err.details ?? "");
}

function matches(error: unknown, patterns: RegExp[]): boolean {
  const text = messageOf(error).toLowerCase();
  return patterns.some((re) => re.test(text));
}

/**
 * Oturum/RLS kaynaklı yetki hatası mı?
 * (admin-error-context ile aynı sinyaller; çağıranlar otomatik çıkış için kullanır.)
 */
export function isPermissionError(error: unknown): boolean {
  if (!error) return false;
  const code = codeOf(error);
  return (
    code === "42501" ||
    code === "PGRST301" ||
    code === "401" ||
    code === "403" ||
    matches(error, [
      /permission denied/,
      /policy/,
      /row-level security/,
      /new row violates row-level security/,
      /JWT/i,
    ])
  );
}

/**
 * Supabase/network hatasını sınıflandırıp kullanıcıya açık bir Türkçe mesaj üretir.
 */
export function classifyError(error: unknown): ClassifiedError {
  if (!error) return { kind: "unknown", code: "UNKNOWN", message: "Bilinmeyen bir hata oluştu." };

  if (isPermissionError(error)) {
    return {
      kind: "permission",
      code: codeOf(error) || "PERMISSION",
      message: "Bu işlem için yetkiniz yok (oturum süresi dolmuş olabilir)",
    };
  }

  const code = codeOf(error);

  if (code === "23503" || matches(error, [/foreign key/, /is still referenced/])) {
    return {
      kind: "foreign_key",
      code,
      message: "Bu kayıt başka bir içerik tarafından kullanılıyor (örn. bir proje bu kayda bağlı)",
    };
  }

  if (code === "23505" || matches(error, [/duplicate key/, /unique constraint/])) {
    return {
      kind: "unique",
      code,
      message: "Bu değer zaten kayıtlı (benzersiz olmalı)",
    };
  }

  if (code === "53400" || matches(error, [/limit reached/, /maximum .* limit/])) {
    return {
      kind: "limit",
      code,
      message: "Kayıt limitine ulaşıldı, yeni kayıt eklenemiyor",
    };
  }

  if (
    code === "" &&
    matches(error, [/failed to fetch/, /fetch failed/, /networkerror/, /load failed/, /network request/])
  ) {
    return {
      kind: "network",
      code: "NETWORK",
      message: "Sunucuya bağlanılamadı, internet bağlantınızı kontrol edin",
    };
  }

  const msg = messageOf(error).trim();
  return {
    kind: msg ? "unknown" : "unknown",
    code: code || "UNKNOWN",
    message: msg || "Bilinmeyen bir hata oluştu",
  };
}

/** Boş bırakılabilir mi? (url/email doğrulamalarında boş değer geçerlidir) */
export function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === "";
}

/** URL doğrulaması: geçersizse false döner; boş değer geçerlidir. */
export function isValidOptionalUrl(value: unknown): boolean {
  if (isEmptyValue(value)) return true;
  return sanitizeUrl(String(value).trim()) !== null;
}

/** Email doğrulaması: geçersizse false döner; boş değer geçerlidir. */
export function isValidOptionalEmail(value: unknown): boolean {
  if (isEmptyValue(value)) return true;
  return isValidEmail(String(value).trim());
}