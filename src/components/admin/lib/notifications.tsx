"use client";

import { toast, Toaster as SonnerToaster } from "sonner";

/** Admin panelinin ortak toast kurulumu (koyu tema, küçük stack, 3.5sn). */
export function AdminToaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      duration={3500}
      gap={8}
      offset={16}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border !bg-zinc-900 !text-zinc-100 !shadow-2xl",
          description: "!text-zinc-400",
          success: "!border-emerald-500/30",
          error: "!border-rose-500/40",
          warning: "!border-amber-500/30",
          info: "!border-white/10",
          title: "!text-zinc-100",
          icon: "!text-emerald-400",
        },
      }}
    />
  );
}

export type ToastId = string | number;

/** Bildirim yardımcıları: başarı / hata / uyarı / yükleniyor (→ sonucu değiştir). */
export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) => toast.warning(message),
  info: (message: string) => toast.info(message),
  loading: (message: string): ToastId => toast.loading(message),
  dismiss: (id: ToastId) => toast.dismiss(id),
  /** Yükleniyor toast'ını başarı/hata sonucuna çevirir. */
  resolve: (id: ToastId, message: string, success: boolean) => {
    if (success) toast.success(message, { id });
    else toast.error(message, { id });
  },
};