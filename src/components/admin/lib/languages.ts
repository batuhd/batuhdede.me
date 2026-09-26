/**
 * Dil düzeni — site ana dili Türkçe'dir.
 * Sekme sırası: TR (zorunlu/ana) → EN → DE → ES
 * Veritabanında temel sütun EN'dir (örn. `title`), çeviriler `title_tr/_de/_es`.
 */

export type Lang = "tr" | "en" | "de" | "es";

export const LANG_ORDER: Lang[] = ["tr", "en", "de", "es"];

export const LANG_LABELS: Record<Lang, string> = {
  tr: "TR",
  en: "EN",
  de: "DE",
  es: "ES",
};

/** Çevirisi ayrı sütunda saklanan diller (EN temel sütundur). */
export const TRANSLATED_SUFFIXES: Lang[] = ["tr", "de", "es"];

/**
 * Bir alanın dil sütununu döndürür.
 * EN → temel sütun (ör. `title`), TR/DE/ES → `title_tr` vb.
 */
export function columnKey(base: string, lang: Lang): string {
  return lang === "en" ? base : `${base}_${lang}`;
}

/** Boş kabul edilen değerler. */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Bir alanın hangi dillerde boş (çevirisi eksik) olduğunu döndürür.
 * `values` form state'idir: EN temel sütun, diğerleri `key_tr/de/es`.
 */
export function missingTranslations(
  fieldKey: string,
  values: Record<string, unknown>,
): Lang[] {
  return LANG_ORDER.filter((lang) => isEmpty(values[columnKey(fieldKey, lang)]));
}