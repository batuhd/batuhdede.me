"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface AdminSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  (
    {
      label,
      hint,
      error,
      options,
      placeholder,
      className,
      wrapperClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || (label ? generatedId : undefined);

    return (
      <div className={cn("space-y-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-muted-foreground"
          >
            {label}
            {props.required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors",
            "focus:border-primary focus:ring-1 focus:ring-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive focus:border-destructive focus:ring-destructive",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hint && !error && (
          <p className="text-[11px] text-muted-foreground">{hint}</p>
        )}
        {error && (
          <p className="text-[11px] text-destructive">{error}</p>
        )}
      </div>
    );
  },
);

AdminSelect.displayName = "AdminSelect";
