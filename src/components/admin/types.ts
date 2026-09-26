import type { LucideIcon } from "lucide-react";
import type { RoleEntry } from "@/types";

/** Form state'inde taşınan değer tipleri. */
export type FormValue = string | number | boolean | string[] | RoleEntry[] | null;

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "checkbox"
  | "select"
  | "multi_select"
  | "json_array"
  | "month_year"
  | "date"
  | "image_url"
  | "role_list";

export interface SelectOption {
  label: string;
  value: string;
}

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  /** Zorunlu alan. Translatable alanlarda TR değeri kontrol edilir. */
  required?: boolean;
  /** TR/EN/DE/ES sütunlarına yazılır; formda dil sekmeleriyle düzenlenir. */
  translatable?: boolean;
  /** Sadece select tipi için sabit seçenekler. */
  options?: SelectOption[];
  /** select/multi_select için başka tablodan seçenek çeker. */
  sourceTable?: string;
  sourceValueField?: string;
  sourceLabelField?: string;
  placeholder?: string;
  textareaRows?: number;
  /** month_year end alanının devre dışı kalacağı checkbox alanının key'i. */
  isCurrentField?: string;
  /** url → sanitizeUrl, email → isValidEmail doğrulaması. */
  validate?: "url" | "email";
  /** Form grid'inde tam satır kaplasın (textarea/markdown/role_list/gallery). */
  fullWidth?: boolean;
  help?: string;
}

export interface JunctionConfig {
  /** junction tablosu: certification_skills */
  table: string;
  /** üst kaydın FK sütunu: certification_id */
  parentColumn: string;
  /** seçilen kayıtların FK sütunu: skill_category_id */
  childColumn: string;
  /** seçeneklerin çekileceği kaynak tablo: skill_categories */
  sourceTable: string;
  /** seçenek etiket sütunu: title */
  sourceLabelField: string;
}

export interface GalleryConfig {
  /** galeri tablosu: project_images / blog_images */
  table: string;
  /** üst kaydın FK sütunu: project_id / blog_id */
  parentColumn: string;
}

export interface SectionConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  table: string;
  title: string;
  description: string;
  displayField: string;
  subtitleField?: string;
  imageField?: string;
  fields: Field[];
  /** blogs.is_published gibi yayın durumu sütunu. */
  publishedField?: string;
  publishedLabel?: string;
  /** about_me gibi tek satır form. */
  singleRow?: boolean;
  /** liste filtresi (ör. projects.category). */
  filterField?: string;
  /** certification_skills gibi çoktan-çoğa bağlantı. */
  junction?: JunctionConfig;
  /** project_images / blog_images galerisi. */
  gallery?: GalleryConfig;
}

/** Supabase'ten gelen satır (bileşenler arasında genel taşıyıcı). */
export type Row = Record<string, unknown>;