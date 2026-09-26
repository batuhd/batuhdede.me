import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { FieldShell, inputBaseClass, inputBorderClass, inputErrorClass } from "./field-shell";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, required, rows = 4, ...props }, ref) => {
    const autoId = useId();
    const textareaId = id ?? autoId;
    return (
      <FieldShell label={label} error={error} hint={hint} required={required} htmlFor={textareaId}>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            inputBaseClass,
            "resize-y leading-relaxed",
            error ? inputErrorClass : inputBorderClass,
            className,
          )}
          {...props}
        />
      </FieldShell>
    );
  },
);
Textarea.displayName = "Textarea";