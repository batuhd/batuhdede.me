"use client";

import { useState } from "react";
import { Languages, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminButton } from "./admin-button";

interface AdminTranslationsSectionProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  label?: string;
  hint?: string;
}

export function AdminTranslationsSection({
  children,
  className,
  defaultOpen = false,
  label = "Translations",
  hint = "Optional — leave empty to use English.",
}: AdminTranslationsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden transition-shadow",
        isOpen && "shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors",
          isOpen ? "bg-muted/30 border-b" : "hover:bg-muted/20",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
              isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            <Languages className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {isOpen ? "Hide" : "Edit"}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="space-y-4 p-4 sm:p-5">
          {children}
        </div>
      )}
    </div>
  );
}

interface AdminTranslationCardProps {
  language: string;
  label: string;
  children: React.ReactNode;
}

export function AdminTranslationCard({
  language,
  label,
  children,
}: AdminTranslationCardProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[10px] font-bold uppercase text-primary">
          {language}
        </span>
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
      {children}
    </div>
  );
}
