"use client";

import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminButton } from "./admin-button";

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "destructive" | "primary";
  loading?: boolean;
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Emin misin?",
  description = "Bu işlem geri alınamaz.",
  confirmText = "Sil",
  cancelText = "İptal",
  confirmVariant = "destructive",
  loading = false,
}: AdminConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <AdminButton variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </AdminButton>
          <AdminButton
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
