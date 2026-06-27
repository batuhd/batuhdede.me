"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface AdminTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const AdminTextarea = forwardRef<
  HTMLTextAreaElement,
  AdminTextareaProps
>(
  (
    { label, hint, error, className, wrapperClassName, id, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id || (label ? generatedId : undefined);

    return (
      <div className={cn("space-y-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-muted-foreground"
          >
            {label}
            {props.required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors resize-y",
            "focus:border-primary focus:ring-1 focus:ring-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive focus:border-destructive focus:ring-destructive",
            className,
          )}
          {...props}
        />
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

AdminTextarea.displayName = "AdminTextarea";
