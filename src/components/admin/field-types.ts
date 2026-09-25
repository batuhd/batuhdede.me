export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "multi_select"
  | "json_array"
  | "month_year"
  | "image_url"
  | "role_list"
  | "date";

export interface SelectOption {
  label: string;
  value: string;
}

export interface RoleEntry {
  title: string;
  title_tr?: string;
  title_de?: string;
  title_es?: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  description_tr?: string;
  description_de?: string;
  description_es?: string;
}

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  translatable?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  textareaRows?: number;
  sourceTable?: string;
  sourceValueField?: string;
  sourceLabelField?: string;
  isCurrentField?: string;
}

export interface SectionConfig {
  id: string;
  label: string;
  icon: string;
  table: string;
  title: string;
  description: string;
  displayField: string;
  subtitleField?: string;
  imageField?: string;
  fields: Field[];
  publishedField?: string;
  publishedLabel?: string;
  singleRow?: boolean;
}