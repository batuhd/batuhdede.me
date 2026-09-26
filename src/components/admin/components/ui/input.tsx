import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { FieldShell, inputBaseClass, inputBorderClass, inputErrorClass } from "./field-shell";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, required, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <FieldShell label={label} error={error} hint={hint} required={required} htmlFor={inputId}>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          required={required}
          className={cn(
            inputBaseClass,
            error ? inputErrorClass : inputBorderClass,
            className,
          )}
          {...props}
        />
      </FieldShell>
    );
  },
);
Input.displayName = "Input";