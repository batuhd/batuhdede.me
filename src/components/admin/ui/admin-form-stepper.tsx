"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminStepTabs } from "./admin-step-tabs";
import { AdminButton } from "./admin-button";
import { AdminStickyActions } from "./admin-sticky-actions";

export interface FormStep {
  key: string;
  label: string;
  description?: string;
  optional?: boolean;
  content: React.ReactNode;
}

interface AdminFormStepperProps {
  steps: FormStep[];
  activeStep: string;
  onStepChange: (step: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  isSubmitting?: boolean;
  className?: string;
}

export function AdminFormStepper({
  steps,
  activeStep,
  onStepChange,
  onSubmit,
  submitLabel = "Save",
  onCancel,
  cancelLabel = "Cancel",
  isSubmitting = false,
  className,
}: AdminFormStepperProps) {
  const activeIndex = steps.findIndex((s) => s.key === activeStep);
  const isFirstStep = activeIndex <= 0;
  const isLastStep = activeIndex >= steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      onStepChange(steps[activeIndex + 1].key);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      onStepChange(steps[activeIndex - 1].key);
    }
  };

  const activeStepContent = steps.find((s) => s.key === activeStep)?.content;

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="space-y-6">
        <AdminStepTabs
          steps={steps}
          activeStep={activeStep}
          onChange={onStepChange}
        />

        <div className="min-h-[200px]">{activeStepContent}</div>

        <AdminStickyActions>
          {onCancel && (
            <AdminButton
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </AdminButton>
          )}
          <div className="flex-1" />
          {!isFirstStep && (
            <AdminButton
              type="button"
              variant="outline"
              leftIcon={<ChevronLeft className="h-4 w-4" />}
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              Previous
            </AdminButton>
          )}
          {!isLastStep ? (
            <AdminButton
              type="button"
              rightIcon={<ChevronRight className="h-4 w-4" />}
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </AdminButton>
          ) : (
            <AdminButton type="submit" loading={isSubmitting}>
              {submitLabel}
            </AdminButton>
          )}
        </AdminStickyActions>
      </div>
    </form>
  );
}
