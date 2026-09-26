"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminErrorProvider } from "@/context/admin-error-context";
import type { User } from "@supabase/supabase-js";
import { AdminToaster } from "@/components/admin/lib/notifications";
import { Shell } from "@/components/admin/components/shell";
import { Dashboard } from "@/components/admin/components/dashboard";
import { Settings } from "@/components/admin/components/settings";
import { EntityManager } from "@/components/admin/components/entity-manager";
import { SECTION_MAP, type AdminView } from "@/components/admin/sections";

const VALID_VIEWS: readonly string[] = [
  "dashboard",
  "settings",
  ...Object.keys(SECTION_MAP),
];

function readHashView(): AdminView {
  if (typeof window === "undefined") return "dashboard";
  const raw = window.location.hash.replace(/^#\/?/, "");
  return VALID_VIEWS.includes(raw) ? (raw as AdminView) : "dashboard";
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<AdminView>(() => readHashView());

  useEffect(() => {
    if (!supabase) {
      router.push("/admin/login");
      return;
    }
    const sb = supabase;
    const check = async () => {
      const { data } = await sb.auth.getSession();
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setUser(data.session.user);
      setLoading(false);
    };
    void check();

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/admin/login");
      else setUser(session.user);
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  // Hash tabanlı görünüm routing'i (geri/ileri tuşları çalışır).
  useEffect(() => {
    const onHashChange = () => setView(readHashView());
    window.addEventListener("hashchange", onHashChange);
    // İlk yüklemede hash'ten görünümü zorunlu oku (SSR/hidrasyon güvencesi).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(readHashView());
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((next: AdminView) => {
    window.location.hash = `/${next}`;
    setView(next);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await supabase?.auth.signOut();
    } catch {
      // çıkış her koşulda tamamlanır
    }
    router.push("/admin/login");
  }, [router]);

  if (loading) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
          <p className="text-sm text-zinc-400">Oturum doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  const section =
    view === "dashboard" || view === "settings" ? null : SECTION_MAP[view as keyof typeof SECTION_MAP];

  return (
    <AdminErrorProvider>
      <Shell active={view} onNavigate={navigate} userEmail={user?.email} onSignOut={handleSignOut}>
        {view === "dashboard" && <Dashboard onNavigate={navigate} />}
        {view === "settings" && <Settings />}
        {section && <EntityManager key={view} config={section} />}
      </Shell>
      <AdminToaster />
    </AdminErrorProvider>
  );
}