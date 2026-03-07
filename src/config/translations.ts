import { tr } from "./locales/tr";
import { en } from "./locales/en";
import { de } from "./locales/de";
import { ja } from "./locales/ja";
import { es } from "./locales/es";
import { zh } from "./locales/zh";
import { fr } from "./locales/fr";
import { ar } from "./locales/ar";
import { pt } from "./locales/pt";
import { ru } from "./locales/ru";

export type Locale =
  | "tr"
  | "en"
  | "de"
  | "ja"
  | "es"
  | "zh"
  | "fr"
  | "ar"
  | "pt"
  | "ru";

export const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  de: "DE",
  ja: "JA",
  es: "ES",
  zh: "中文",
  fr: "FR",
  ar: "AR",
  pt: "PT",
  ru: "RU",
};

export const translations: Record<Locale, Record<string, string>> = {
  tr,
  en,
  de,
  ja,
  es,
  zh,
  fr,
  ar,
  pt,
  ru,
};
