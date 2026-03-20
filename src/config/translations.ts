import { tr } from "./locales/tr";
import { en } from "./locales/en";
import { de } from "./locales/de";
import { es } from "./locales/es";

export type Locale = "tr" | "en" | "de" | "es";

export const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  de: "DE",
  es: "ES",
};

export const translations: Record<Locale, Record<string, string>> = {
  tr,
  en,
  de,
  es,
};
