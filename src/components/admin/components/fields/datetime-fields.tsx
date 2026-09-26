import { MonthYearSelects, composeMonthYear, parseMonthYear } from "./month-year";
import type { FieldProps } from "./types";

export function MonthYearField({
  value,
  onChange,
  error,
  disabled,
  isCurrentValue,
}: FieldProps) {
  const { month, year } = parseMonthYear(String(value ?? ""));
  const locked = disabled || isCurrentValue;

  return (
    <div className="space-y-1.5">
      <MonthYearSelects
        month={month}
        year={year}
        onMonth={(m) => onChange(composeMonthYear(m, year))}
        onYear={(y) => onChange(composeMonthYear(month, y))}
        disabled={locked}
      />
      {locked && (
        <p className="text-xs text-zinc-500">“Devam ediyor” işaretli — bitiş boş.</p>
      )}
      {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
}