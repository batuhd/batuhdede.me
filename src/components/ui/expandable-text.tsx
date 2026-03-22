"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  buttonClassName?: string;
}

export function ExpandableText({ 
  text, 
  maxLength = 80, 
  className,
  buttonClassName
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  if (!text) return null;

  const shouldTruncate = text.length > maxLength;

  return (
    <div className={cn("space-y-1", className)}>
      <p className={cn(
        "text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap",
        !isExpanded && shouldTruncate && "line-clamp-1"
      )}>
        {text}
      </p>
      {shouldTruncate && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={cn(
            "flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors py-0.5",
            buttonClassName
          )}
        >
          {isExpanded ? (
            <>{t("common.showLess")} <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>{t("common.showMore")} <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}
    </div>
  );
}
