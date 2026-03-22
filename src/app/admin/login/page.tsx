"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { LogIn, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Generate a new 6 char captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
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

    if (captchaInput.toUpperCase() !== captchaCode) {
      setError("Security check failed. Please try again.");
      generateCaptcha();
      setLoading(false);
      return;
    }

    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Track failed attempts
        const currentAttempts = parseInt(sessionStorage.getItem("admin_failed_attempts") || "0") + 1;
        sessionStorage.setItem("admin_failed_attempts", currentAttempts.toString());
        
        if (currentAttempts >= 5) {
          router.push("/?unauthorized=true");
          return;
        }

        setError(`Invalid credentials (${currentAttempts}/5 attempts). Access will be locked after 5 failures.`);
        generateCaptcha();
        setPassword("");
      } else {
        // Reset on success
        sessionStorage.removeItem("admin_failed_attempts");
        router.push("/admin");
      }
    } catch {
      setError("An unexpected error occurred.");
      generateCaptcha();
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Redirecting to Dashboard...</p>
      </div>
    );
  }

  return (
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

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/50 p-3">
                <label className="text-sm font-medium text-foreground">
                  Security Code
                </label>
                <div className="select-none rounded bg-background px-3 py-1.5 font-mono text-base tracking-widest text-foreground shadow-inner">
                  {captchaCode}
                </div>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter the 6-character code"
                maxLength={6}
              />
            </div>

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
  );
}
