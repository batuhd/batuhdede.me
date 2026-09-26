import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Select } from "../ui/select";
import { EmptyState } from "../ui/empty-state";
import type { FieldProps } from "./types";

export function CheckboxField({ field, value, onChange, error, disabled }: FieldProps) {
  return (
    <Checkbox
      label={field.placeholder || field.label}
      checked={!!value}
      onChange={onChange}
      disabled={disabled}
      error={error}
    />
  );
}

export function SelectField({ value, onChange, error, disabled, options = [] }: FieldProps) {
  return (
    <Select
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      disabled={disabled}
    >
      <option value="">(Yok)</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}

export function MultiSelectField({ field, value, onChange, options = [] }: FieldProps) {
  const selected = Array.isArray(value) ? (value as string[]) : [];
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt],
    );
  };

  if (options.length === 0) {
    return (
      <EmptyState
        title="Kaynak yok"
        description="Önce kaynak bölümden kayıt ekleyin."
      />
    );
  }

  return (
    <div className="grid gap-1.5 sm:grid-cols-2" role="group" aria-label={field.label}>
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors",
              active
                ? "border-violet-500/40 bg-violet-500/10 text-zinc-100"
                : "border-white/10 bg-zinc-950 text-zinc-400 hover:border-white/20",
            )}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={active}
              onChange={() => toggle(opt.value)}
            />
            <span
              aria-hidden="true"
              className={cn(
                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border",
                active ? "border-violet-500 bg-violet-600" : "border-white/20",
              )}
            >
              {active && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none">
                  <path d="M2 6.5 4.8 9 10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="truncate">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}