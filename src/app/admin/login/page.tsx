"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  LogIn,
  Loader2,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Lock,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const removeTurnstile = useCallback(() => {
    const turnstile = window.turnstile;
    if (widgetIdRef.current && turnstile) {
      try {
        turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore cleanup errors
      }
      widgetIdRef.current = null;
    }
  }, []);

  const resetTurnstile = useCallback(() => {
    const turnstile = window.turnstile;
    if (widgetIdRef.current && turnstile) {
      try {
        turnstile.reset(widgetIdRef.current);
      } catch {
        // ignore reset errors
      }
    }
    setCaptchaToken("");
  }, []);

  const renderTurnstile = useCallback(() => {
    const turnstile = window.turnstile;
    const container = turnstileRef.current;
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!turnstile || !container || !siteKey) return;

    removeTurnstile();
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    try {
      widgetIdRef.current = turnstile.render(container, {
        sitekey: siteKey,
        callback: (token: string) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
        theme: "dark",
      });
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("Turnstile render error", e);
      }
    }
  }, [removeTurnstile]);

  useEffect(() => {
    renderTurnstile();
    return () => {
      removeTurnstile();
    };
  }, [renderTurnstile, removeTurnstile]);

  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    const checkSession = async () => {
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        router.push("/admin");
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!captchaToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setError("Lütfen robot olmadığınızı doğrulayın.");
      setLoading(false);
      return;
    }

    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          router.push("/?unauthorized=true");
          return;
        }
        setError(data.error || "Invalid credentials.");
        setPassword("");
        resetTurnstile();
      } else {
        removeTurnstile();
        setIsLoggedIn(true);
        router.push("/admin");
      }
    } catch {
      setError("An unexpected error occurred.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40";

  if (isLoggedIn) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center space-y-4 bg-background px-4">
        <button
          onClick={async () => {
            if (supabase) {
              await supabase.auth.signOut();
              await fetch("/api/auth/logout", { method: "POST" });
            }
            setIsLoggedIn(false);
            router.push("/admin/login");
          }}
          className="absolute top-4 right-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" /> Çıkış Yap
        </button>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Panele yönlendiriliyor...</p>
      </div>
    );
  }

  return (
    <>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
          onLoad={renderTurnstile}
        />
      )}
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Admin</h1>
          </div>

          <div className="space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Hoş geldin</h2>
              <p className="text-sm text-muted-foreground">Devam etmek için giriş yap.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`${inputClass} pl-10`}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`${inputClass} pl-10`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div ref={turnstileRef} className="flex w-full justify-center py-2" />
              )}

              {error && (
                <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-center text-sm font-medium text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Giriş Yap
                  </>
                )}
              </button>
            </form>

            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Siteye dön
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}