import type { Field, FormValue, SelectOption } from "../../types";
import type { Lang } from "../../lib/languages";

export interface FieldProps {
  field: Field;
  value: FormValue;
  onChange: (value: FormValue) => void;
  error?: string;
  disabled?: boolean;
  /** Aktif dil sekmesi. */
  lang: Lang;
  /** isCurrentField bağlı checkbox değeri (month_year disable için). */
  isCurrentValue?: boolean;
  /** select/multi_select seçenekleri (sourceTable çözülmüş). */
  options?: SelectOption[];
}