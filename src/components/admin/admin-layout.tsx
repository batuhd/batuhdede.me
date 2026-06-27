"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  FolderKanban,
  PenTool,
  UserCircle,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Trophy,
  Award,
  Mail,
  Globe,
  Heart,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { AdminButton } from "./ui/admin-button";

export type AdminTab =
  | "works"
  | "blog"
  | "about"
  | "skills"
  | "experience"
  | "education"
  | "languages"
  | "activities"
  | "certifications"
  | "social"
  | "contact_emails"
  | "settings"
  | "section_layout"
  | "easter_eggs";

interface AdminLayoutProps {
  userEmail?: string | null;
  activeTab: AdminTab | "dashboard";
  onTabChange: (tab: AdminTab) => void;
  onSignOut: () => void;
  children: React.ReactNode;
}

interface SidebarContentProps {
  activeTab: AdminTab | "dashboard";
  sidebarCollapsed: boolean;
  onTabChange: (tab: AdminTab) => void;
  onSignOut: () => void;
  onCollapseToggle: () => void;
  onMobileClose?: () => void;
}

const SIDEBAR_CATEGORIES = [
  {
    title: "Profile & Identity",
    tabs: [
      { key: "about", icon: UserCircle, label: "About Me" },
      { key: "social", icon: Globe, label: "Social Links" },
      { key: "contact_emails", icon: Mail, label: "Contact Emails" },
    ],
  },
  {
    title: "Portfolio Content",
    tabs: [
      { key: "works", icon: FolderKanban, label: "Works" },
      { key: "blog", icon: PenTool, label: "Blog" },
    ],
  },
  {
    title: "Resume Data",
    tabs: [
      { key: "skills", icon: Award, label: "Skills" },
      { key: "experience", icon: Briefcase, label: "Experience" },
      { key: "education", icon: GraduationCap, label: "Education" },
      { key: "languages", icon: MessageSquare, label: "Languages" },
      { key: "activities", icon: Trophy, label: "Activities" },
      { key: "certifications", icon: Award, label: "Certifications" },
    ],
  },
  {
    title: "Configuration",
    tabs: [
      { key: "section_layout", icon: LayoutDashboard, label: "Page Layout" },
      { key: "easter_eggs", icon: Heart, label: "Easter Eggs" },
      { key: "settings", icon: Settings, label: "Settings" },
    ],
  },
];

function SidebarContent({
  activeTab,
  sidebarCollapsed,
  onTabChange,
  onSignOut,
  onCollapseToggle,
  onMobileClose,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold tracking-tight truncate">
              Admin
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onCollapseToggle}
          className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground md:block"
          title={sidebarCollapsed ? "Genişlet" : "Daralt"}
        >
          {sidebarCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {SIDEBAR_CATEGORIES.map((category) => (
          <div key={category.title} className="mb-5">
            {!sidebarCollapsed && (
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {category.title}
              </p>
            )}
            <div className="space-y-0.5">
              {category.tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      onTabChange(tab.key as AdminTab);
                      onMobileClose?.();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      sidebarCollapsed && "justify-center",
                    )}
                    title={sidebarCollapsed ? tab.label : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="truncate">{tab.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <button
          type="button"
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10",
            sidebarCollapsed && "justify-center",
          )}
          title={sidebarCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!sidebarCollapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

export function AdminLayout({
  userEmail,
  activeTab,
  onTabChange,
  onSignOut,
  children,
}: AdminLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeTabLabel =
    activeTab === "dashboard"
      ? "Dashboard"
      : SIDEBAR_CATEGORIES.flatMap((c) => c.tabs).find(
          (t) => t.key === activeTab,
        )?.label;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed bottom-0 left-0 top-14 z-50 w-[260px] border-r bg-card shadow-xl md:hidden">
            <SidebarContent
              activeTab={activeTab}
              sidebarCollapsed={false}
              onTabChange={onTabChange}
              onSignOut={onSignOut}
              onCollapseToggle={() => {}}
              onMobileClose={() => setMobileMenuOpen(false)}
            />
          </aside>
        </>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-30 hidden h-screen flex-col border-r bg-card transition-all duration-300 md:flex",
            sidebarCollapsed ? "w-[72px]" : "w-[240px]",
          )}
        >
          <SidebarContent
            activeTab={activeTab}
            sidebarCollapsed={sidebarCollapsed}
            onTabChange={onTabChange}
            onSignOut={onSignOut}
            onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[240px]",
          )}
        >
          {/* Desktop Header */}
          <header className="sticky top-0 z-20 hidden items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur md:flex">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                {activeTabLabel || "Dashboard"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {activeTab === "dashboard"
                  ? "Overview of your portfolio"
                  : activeTab === "works" || activeTab === "blog"
                    ? "Manage your portfolio content"
                    : "Manage your site settings"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {userEmail && (
                <span className="text-sm text-muted-foreground">
                  {userEmail}
                </span>
              )}
              <AdminButton
                variant="outline"
                size="sm"
                leftIcon={<ExternalLink className="h-4 w-4" />}
                onClick={() => router.push("/")}
              >
                View Site
              </AdminButton>
            </div>
          </header>

          {/* Mobile page title */}
          <div className="border-b px-4 py-3 md:hidden">
            <h1 className="text-base font-semibold tracking-tight">
              {activeTabLabel || "Dashboard"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeTab === "dashboard"
                ? "Overview of your portfolio"
                : activeTab === "works" || activeTab === "blog"
                  ? "Manage your portfolio content"
                  : "Manage your site settings"}
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
