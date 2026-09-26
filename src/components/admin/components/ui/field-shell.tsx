import { FieldError } from "./field-error";

interface FieldShellProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

/** Etiket + input + yardım metni + hata mesajını tek blokta toplar. */
export function FieldShell({ label, error, hint, required, htmlFor, children }: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-medium text-zinc-400"
        >
          {label}
          {required && <span className="ml-1 text-rose-400">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export const inputBaseClass =
  "w-full rounded-lg border bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-violet-500/60";

export const inputBorderClass =
  "border-white/10 focus:border-violet-500/60";

export const inputErrorClass = "border-rose-500/60";