import { MarkdownEditor } from "../../markdown-editor";
import type { FieldProps } from "./types";

export function MarkdownField({ field, value, onChange }: FieldProps) {
  return (
    <MarkdownEditor
      value={String(value ?? "")}
      onChange={onChange}
      placeholder={field.placeholder}
    />
  );
}