"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  key: string;
  label: string;
  description?: string;
  optional?: boolean;
}

interface AdminStepTabsProps {
  steps: Step[];
  activeStep: string;
  onChange: (step: string) => void;
  completedSteps?: string[];
  orientation?: "horizontal" | "vertical";
}

export function AdminStepTabs({
  steps,
  activeStep,
  onChange,
  completedSteps = [],
  orientation = "horizontal",
}: AdminStepTabsProps) {
  const isVertical = orientation === "vertical";

  return (
    <nav
      className={cn(
        "flex",
        isVertical
          ? "flex-col gap-1"
          : "flex-col gap-1 sm:flex-row sm:gap-2 sm:overflow-x-auto sm:pb-1",
      )}
      aria-label="Progress"
    >
      {steps.map((step, index) => {
        const isActive = step.key === activeStep;
        const isCompleted = completedSteps.includes(step.key);
        const stepNumber = index + 1;

        return (
          <button
            key={step.key}
            type="button"
            onClick={() => onChange(step.key)}
            className={cn(
              "group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
              isVertical ? "w-full" : "w-full sm:min-w-[140px] sm:flex-1",
              isActive
                ? "border-primary bg-primary/5"
                : "border-transparent bg-muted/40 hover:bg-muted",
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-muted-foreground/20 text-muted-foreground",
              )}
            >
              {isCompleted && !isActive ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                stepNumber
              )}
            </div>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-medium truncate",
                  isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {step.label}
                {step.optional && (
                  <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                    (opsiyonel)
                  </span>
                )}
              </p>
              {step.description && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {step.description}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
