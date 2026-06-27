"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  wrapperClassName?: string;
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Ara...",
  className,
  wrapperClassName,
  ...props
}: AdminSearchInputProps) {
  return (
    <div
      className={cn(
        "relative flex items-center",
        wrapperClassName,
      )}
    >
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-md border bg-background py-2 pl-9 pr-8 text-sm outline-none transition-colors",
          "focus:border-primary focus:ring-1 focus:ring-primary",
          className,
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
