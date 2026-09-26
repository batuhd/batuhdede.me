import { cn } from "@/lib/utils";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
}

export function Checkbox({ label, checked, onChange, disabled, error }: CheckboxProps) {
  return (
    <div className="space-y-1">
      <label
        className={cn(
          "inline-flex cursor-pointer items-center gap-2.5 text-sm text-zinc-300 select-none",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded border transition-colors",
            checked ? "border-violet-500 bg-violet-600" : "border-white/20 bg-zinc-950",
          )}
        >
          {checked && (
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
              <path d="M2 6.5 4.8 9 10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </label>
      {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
}