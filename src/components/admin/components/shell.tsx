"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTION_CONFIGS, type AdminView } from "../sections";

interface ShellProps {
  active: AdminView;
  onNavigate: (view: AdminView) => void;
  userEmail?: string | null;
  onSignOut: () => void;
  children: React.ReactNode;
}

function currentTitle(view: AdminView): string {
  if (view === "dashboard") return "Panel";
  if (view === "settings") return "Ayarlar";
  return SECTION_CONFIGS.find((s) => s.id === view)?.title ?? "Panel";
}

/**
 * Admin çerçevesi: her zaman koyu tema, sol sabit sidebar + üst topbar.
 * Mobilde sidebar hamburger ile açılan çekmeceye dönüşür.
 */
export function Shell({ active, onNavigate, userEmail, onSignOut, children }: ShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { key: "dashboard" as AdminView, label: "Panel", icon: LayoutDashboard },
    ...SECTION_CONFIGS.map((section) => ({
      key: section.id as AdminView,
      label: section.label,
      icon: section.icon,
    })),
    { key: "settings" as AdminView, label: "Ayarlar", icon: Settings },
  ];

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-4 pt-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-900/40">
          <LayoutDashboard className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-zinc-100">batuhdede.me</p>
          <p className="text-[11px] text-zinc-500">Yönetim Paneli</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4" aria-label="Bölümler">
        {navItems.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onNavigate(item.key);
                setMobileOpen(false);
              }}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-violet-500/30 bg-violet-600/15 text-violet-200"
                  : "border-transparent text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-white/5 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800/70 hover:text-zinc-100"
        >
          <ExternalLink className="h-4 w-4" /> Siteyi Gör
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4" /> Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="dark flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/5 bg-zinc-900/60 lg:block">
        {sidebar}
      </aside>

      <div className="flex w-full flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/5 bg-zinc-950/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menüyü aç/kapat"
              aria-expanded={mobileOpen}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-sm font-semibold text-zinc-100">{currentTitle(active)}</h1>
              <p className="hidden text-[11px] text-zinc-500 sm:block">Yönetim Paneli</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="max-w-[180px] truncate">{userEmail || "Admin"}</span>
            </span>
            <button
              type="button"
              onClick={onSignOut}
              aria-label="Çıkış yap"
              className="rounded-lg border border-white/10 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed bottom-0 left-0 top-14 z-40 w-64 border-r border-white/5 bg-zinc-900 lg:hidden">
            {sidebar}
          </aside>
        </>
      )}
    </div>
  );
}