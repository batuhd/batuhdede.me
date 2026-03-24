"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShieldX } from "lucide-react";
import { toast } from "sonner";

interface AdminErrorContextType {
  /** Call this after any Supabase operation to check for errors. If unauthorized, shows the 401 screen. */
  handleOperationError: (error: any, operationName: string) => boolean;
}

const AdminErrorContext = createContext<AdminErrorContextType | null>(null);

export function useAdminError() {
  const ctx = useContext(AdminErrorContext);
  if (!ctx) throw new Error("useAdminError must be used within AdminErrorProvider");
  return ctx;
}

export function AdminErrorProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [errorInfo, setErrorInfo] = useState<{ operation: string; message: string; code: string } | null>(null);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleOperationError = useCallback((error: any, operationName: string): boolean => {
    if (!error) return false;

    const code = error.code || error.status || "UNKNOWN";
    const message = error.message || error.details || "An unknown error occurred.";

    // RLS violation, permission denied, or auth errors
    const isUnauthorized =
      code === "42501" || // RLS violation
      code === "PGRST301" || // PostgREST auth error
      code === "401" ||
      code === "403" ||
      message.toLowerCase().includes("permission denied") ||
      message.toLowerCase().includes("policy") ||
      message.toLowerCase().includes("row-level security") ||
      message.toLowerCase().includes("new row violates row-level security");

    if (isUnauthorized) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      setCountdown(5);
      setErrorInfo({ operation: operationName, message, code: String(code) });

      // Start countdown and auto-logout
      let count = 5;
      intervalRef.current = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (supabase) {
            supabase.auth.signOut().then(() => {
              fetch("/api/auth/logout", { method: "POST" }).then(() => {
                router.push("/?unauthorized=true");
              });
            });
          } else {
            router.push("/?unauthorized=true");
          }
        }
      }, 1000);

      return true;
    }

    // Show error toast for non-auth errors
    toast.error(`${operationName} başarısız: ${message}`);
    return true;
  }, [router]);

  return (
    <AdminErrorContext.Provider value={{ handleOperationError }}>
      {children}

      {/* 401 Unauthorized Full-Screen Modal */}
      {errorInfo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 max-w-lg w-full mx-4 p-8 rounded-2xl border bg-card shadow-2xl text-center animate-in fade-in zoom-in-95 duration-300">
            {/* HTTP Cat 401 Image */}
            <div className="w-full max-w-sm rounded-xl overflow-hidden border shadow-lg">
              <img
                src="/media/401.jpg"
                alt="401 Unauthorized"
                className="w-full h-auto"
              />
            </div>

            {/* Error Icon & Title */}
            <div className="flex items-center gap-3">
              <ShieldX className="h-8 w-8 text-destructive" />
              <h1 className="text-2xl font-bold text-destructive">401 — Unauthorized</h1>
            </div>

            {/* Error Details */}
            <div className="space-y-2 w-full">
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-left">
                <p className="text-sm font-semibold text-destructive mb-1">
                  İşlem başarısız: {errorInfo.operation}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Bu işlemi gerçekleştirme yetkiniz yok.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Bu işlemi gerçekleştirme yetkiniz yok. Oturum kapatılıyor...
              </p>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-8 w-8 rounded-full border-2 border-destructive flex items-center justify-center font-bold text-destructive animate-pulse">
                {countdown}
              </div>
              <span>saniye sonra ana sayfaya yönlendirileceksiniz</span>
            </div>
          </div>
        </div>
      )}
    </AdminErrorContext.Provider>
  );
}
