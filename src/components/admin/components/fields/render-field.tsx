import type { FieldProps } from "./types";
import { TextField, TextAreaField, NumberField, DateField, JsonArrayField } from "./text-fields";
import { CheckboxField, SelectField, MultiSelectField } from "./choice-fields";
import { MonthYearField } from "./datetime-fields";
import { ImageUrlField } from "./image-field";
import { RoleListField } from "./role-list-field";
import { MarkdownField } from "./markdown-field";

/** Alan tipine göre doğru input'u render eder. */
export function RenderField(props: FieldProps) {
  switch (props.field.type) {
    case "text":
      return <TextField {...props} />;
    case "textarea":
      return <TextAreaField {...props} />;
    case "markdown":
      return <MarkdownField {...props} />;
    case "number":
      return <NumberField {...props} />;
    case "checkbox":
      return <CheckboxField {...props} />;
    case "select":
      return <SelectField {...props} />;
    case "multi_select":
      return <MultiSelectField {...props} />;
    case "json_array":
      return <JsonArrayField {...props} />;
    case "month_year":
      return <MonthYearField {...props} />;
    case "date":
      return <DateField {...props} />;
    case "image_url":
      return <ImageUrlField {...props} />;
    case "role_list":
      return <RoleListField {...props} />;
    default:
      return null;
  }
}