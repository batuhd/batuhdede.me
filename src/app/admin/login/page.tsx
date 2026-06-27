"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { LogIn, Loader2, ShieldCheck, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
    const turnstile = (window as any).turnstile;
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
    const turnstile = (window as any).turnstile;
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
    const turnstile = (window as any).turnstile;
    const container = turnstileRef.current;
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!turnstile || !container || !siteKey) return;

    // Remove any previously rendered widget before re-rendering
    removeTurnstile();

    // Clear previous content safely (XSS prevention)
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    try {
      widgetIdRef.current = turnstile.render(container, {
        sitekey: siteKey,
        callback: (token: string) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
        theme: "light",
      });
    } catch (e) {
      // Silent fail for production, log only in development
      if (process.env.NODE_ENV === "development") {
        console.error("Turnstile render error", e);
      }
    }
  }, [removeTurnstile]);

  useEffect(() => {
    // Attempt render in case the script is already loaded
    renderTurnstile();

    // Cleanup widget on unmount to prevent "Cannot find Widget" warnings
    return () => {
      removeTurnstile();
    };
  }, [renderTurnstile, removeTurnstile]);

  useEffect(() => {
    if (!supabase) return;

    const checkSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
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
          // Locked out — redirect
          router.push("/?unauthorized=true");
          return;
        }

        setError(data.error || "Invalid credentials.");
        setPassword("");
        resetTurnstile();
      } else {
        // Set the session from server response
        if (data.session?.access_token && data.session?.refresh_token) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        }
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

  if (isLoggedIn) {
    return (
      <div className="relative flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <button
          onClick={async () => {
            if (supabase) {
              await supabase.auth.signOut();
              await fetch("/api/auth/logout", { method: "POST" });
            }
            setIsLoggedIn(false);
            router.push("/admin/login");
          }}
          className="absolute top-4 right-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Redirecting to Dashboard...</p>
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
      <div className="flex min-h-[60vh] py-12 flex-col items-center justify-center space-y-8">
        <FadeIn>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="w-full max-w-sm px-4 sm:px-0">
          <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-xl">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-sm text-muted-foreground">
                Secure area for content management.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>

              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div 
                  ref={turnstileRef}
                  className="w-full flex justify-center py-2" 
                />
              )}

              {error && (
                <p className="text-sm rounded hover:bg-destructive/20 transition-colors bg-destructive/10 text-destructive font-medium p-2 text-center border border-destructive/20">{error}</p>
              )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Authenticate
                </>
              )}
            </button>
          </form>
        </div>
      </FadeIn>
    </div>
    </>
  );
}
