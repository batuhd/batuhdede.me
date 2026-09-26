import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { FieldShell, inputBaseClass, inputBorderClass, inputErrorClass } from "./field-shell";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id, required, children, ...props }, ref) => {
    const autoId = useId();
    const selectId = id ?? autoId;
    return (
      <FieldShell label={label} error={error} hint={hint} required={required} htmlFor={selectId}>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            inputBaseClass,
            "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.6rem_center] bg-no-repeat pr-9",
            error ? inputErrorClass : inputBorderClass,
            className,
          )}
          {...props}
        >
          {children}
        </select>
      </FieldShell>
    );
  },
);
Select.displayName = "Select";