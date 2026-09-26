import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { FieldProps } from "./types";

export function TextField({ field, value, onChange, error, disabled }: FieldProps) {
  return (
    <Input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      error={error}
      disabled={disabled}
      required={field.required}
    />
  );
}

export function TextAreaField({ field, value, onChange, error, disabled }: FieldProps) {
  return (
    <Textarea
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      rows={field.textareaRows ?? 4}
      error={error}
      disabled={disabled}
      required={field.required}
    />
  );
}

export function NumberField({ field, value, onChange, error, disabled }: FieldProps) {
  return (
    <Input
      type="number"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      error={error}
      disabled={disabled}
    />
  );
}

export function DateField({ field, value, onChange, error, disabled }: FieldProps) {
  return (
    <Input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder ?? "GG Aaa YYYY"}
      hint="Örnek: 15 Haz 2026"
      error={error}
      disabled={disabled}
    />
  );
}

export function JsonArrayField({ field, value, onChange, error, disabled }: FieldProps) {
  return (
    <Input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      hint="Virgülle ayırın: React, Next.js, Tailwind"
      error={error}
      disabled={disabled}
    />
  );
}