"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  FolderKanban,
  PenTool,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  X,
  Globe,
  ChevronUp,
  ChevronDown,
  GripVertical,
  UserCircle,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Award,
  Trophy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { AdminAboutTab, AdminCrudTab, AdminSocialLinksTab, AdminSkillsTab, AdminLayoutTab } from "@/components/admin/admin-tabs";

type Tab = "works" | "blog" | "about" | "skills" | "experience" | "education" | "languages" | "activities" | "certifications" | "social" | "settings" | "section_layout";
type LangTab = "default" | "tr" | "de" | "es";

const LANG_TABS: { key: LangTab; label: string }[] = [
  { key: "default", label: "EN (Default)" },
  { key: "tr", label: "TR" },
  { key: "de", label: "DE" },
  { key: "es", label: "ES" },
];

const SIDEBAR_CATEGORIES = [
  {
    title: "Profile & Identity",
    tabs: [
      { key: "about", icon: UserCircle, label: "About Me" },
      { key: "social", icon: Globe, label: "Social Links" },
    ]
  },
  {
    title: "Portfolio Content",
    tabs: [
      { key: "works", icon: FolderKanban, label: "Works" },
      { key: "blog", icon: PenTool, label: "Blog" },
    ]
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
    ]
  },
  {
    title: "Configuration",
    tabs: [
      { key: "section_layout", icon: LayoutDashboard, label: "Page Layout" },
      { key: "settings", icon: Settings, label: "Settings" },
    ]
  }
];

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

function cleanObj(obj: Record<string, unknown>) {
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && v.trim() === "") continue;
    cleaned[k] = v;
  }
  return cleaned;
}

function LangTabBar({
  active,
  onChange,
}: {
  active: LangTab;
  onChange: (t: LangTab) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1 mb-4 overflow-x-auto">
      {LANG_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
            active === tab.key
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.key !== "default" && <Globe className="h-3 w-3" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("works");

  const [works, setWorks] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  const [isAddingWork, setIsAddingWork] = useState(false);
  const [workLangTab, setWorkLangTab] = useState<LangTab>("default");
  const [workForm, setWorkForm] = useState({
    title: "", description: "", link: "", github: "", image: "", tags: "",
    title_tr: "", description_tr: "",
    title_de: "", description_de: "",
    title_es: "", description_es: "",
  });

  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [editWorkLangTab, setEditWorkLangTab] = useState<LangTab>("default");
  const [editWorkForm, setEditWorkForm] = useState({
    title: "", description: "", link: "", github: "", image: "", tags: "",
    title_tr: "", description_tr: "",
    title_de: "", description_de: "",
    title_es: "", description_es: "",
  });

  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [blogLangTab, setBlogLangTab] = useState<LangTab>("default");
  const [blogForm, setBlogForm] = useState({
    title: "", excerpt: "", content: "", date: "", read_time: "",
    title_tr: "", excerpt_tr: "", content_tr: "",
    title_de: "", excerpt_de: "", content_de: "",
    title_es: "", excerpt_es: "", content_es: "",
  });

  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editBlogLangTab, setEditBlogLangTab] = useState<LangTab>("default");
  const [editBlogForm, setEditBlogForm] = useState({
    title: "", excerpt: "", content: "", date: "", read_time: "",
    title_tr: "", excerpt_tr: "", content_tr: "",
    title_de: "", excerpt_de: "", content_de: "",
    title_es: "", excerpt_es: "", content_es: "",
  });

  useEffect(() => {
    if (!supabase) { router.push("/admin/login"); return; }
    const sb = supabase;
    const checkAuth = async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { router.push("/admin/login"); return; }
      setUser(session.user);
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/admin/login");
      else setUser(session.user);
    });

    return () => { subscription.unsubscribe(); };
  }, [router]);

  // Fetch works and blogs
  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    const fetchData = async () => {
      const [worksRes, blogsRes] = await Promise.all([
        sb.from("projects").select("*").order("order_index", { ascending: true }),
        sb.from("blogs").select("*").order("created_at", { ascending: false }),
      ]);
      if (worksRes.data) setWorks(worksRes.data);
      if (blogsRes.data) setBlogs(blogsRes.data);
    };
    fetchData();
  }, []);

  const refreshWorks = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("projects").select("*").order("order_index", { ascending: true });
    if (data) setWorks(data);
  };

  const refreshBlogs = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (data) setBlogs(data);
  };

  const handleSignOut = async () => {
    if (supabase) { await supabase.auth.signOut(); router.push("/admin/login"); }
  };

  // ── Works CRUD ──
  const handleAddWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const { link, github, image, tags, ...rest } = workForm;
    const maxOrder = works.reduce((max, w) => Math.max(max, w.order_index ?? 0), -1);
    const data = cleanObj({
      ...rest,
      link, github, image,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      order_index: maxOrder + 1,
    });
    await supabase.from("projects").insert(data);
    setWorkForm({ title: "", description: "", link: "", github: "", image: "", tags: "", title_tr: "", description_tr: "", title_de: "", description_de: "", title_es: "", description_es: "" });
    setIsAddingWork(false);
    setWorkLangTab("default");
    await refreshWorks();
  };

  const handleEditWork = (work: any) => {
    setEditingWorkId(work.id);
    setEditWorkForm({
      title: work.title || "", description: work.description || "",
      link: work.link || "", github: work.github || "",
      image: work.image || "",
      tags: Array.isArray(work.tags) ? work.tags.join(", ") : work.tags || "",
      title_tr: work.title_tr || "", description_tr: work.description_tr || "",
      title_de: work.title_de || "", description_de: work.description_de || "",
      title_es: work.title_es || "", description_es: work.description_es || "",
    });
    setEditWorkLangTab("default");
    setIsAddingWork(false);
  };

  const handleSaveEditWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingWorkId) return;
    const { link, github, image, tags, ...rest } = editWorkForm;
    const data = cleanObj({
      ...rest,
      link, github, image,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    await supabase.from("projects").update(data).eq("id", editingWorkId);
    setEditingWorkId(null);
    await refreshWorks();
  };

  const handleDeleteWork = async (id: string) => {
    if (!supabase || !confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    if (editingWorkId === id) setEditingWorkId(null);
    await refreshWorks();
  };

  const handleMoveWork = async (id: string, direction: "up" | "down") => {
    if (!supabase) return;
    const idx = works.findIndex((w) => w.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= works.length) return;

    const current = works[idx];
    const swap = works[swapIdx];
    const currentOrder = current.order_index ?? idx;
    const swapOrder = swap.order_index ?? swapIdx;

    await Promise.all([
      supabase.from("projects").update({ order_index: swapOrder }).eq("id", current.id),
      supabase.from("projects").update({ order_index: currentOrder }).eq("id", swap.id),
    ]);
    await refreshWorks();
  };

  // ── Blog CRUD ──
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const date = blogForm.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    const data = cleanObj({ ...blogForm, date });
    await supabase.from("blogs").insert(data);
    setBlogForm({ title: "", excerpt: "", content: "", date: "", read_time: "", title_tr: "", excerpt_tr: "", content_tr: "", title_de: "", excerpt_de: "", content_de: "", title_es: "", excerpt_es: "", content_es: "" });
    setIsAddingBlog(false);
    setBlogLangTab("default");
    await refreshBlogs();
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlogId(blog.id);
    setEditBlogForm({
      title: blog.title || "", excerpt: blog.excerpt || "",
      content: blog.content || "", date: blog.date || "",
      read_time: blog.read_time || "",
      title_tr: blog.title_tr || "", excerpt_tr: blog.excerpt_tr || "", content_tr: blog.content_tr || "",
      title_de: blog.title_de || "", excerpt_de: blog.excerpt_de || "", content_de: blog.content_de || "",
      title_es: blog.title_es || "", excerpt_es: blog.excerpt_es || "", content_es: blog.content_es || "",
    });
    setEditBlogLangTab("default");
    setIsAddingBlog(false);
  };

  const handleSaveEditBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingBlogId) return;
    const data = cleanObj(editBlogForm);
    await supabase.from("blogs").update(data).eq("id", editingBlogId);
    setEditingBlogId(null);
    await refreshBlogs();
  };

  const handleDeleteBlog = async (id: string) => {
    if (!supabase || !confirm("Delete this post?")) return;
    await supabase.from("blogs").delete().eq("id", id);
    if (editingBlogId === id) setEditingBlogId(null);
    await refreshBlogs();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 max-w-6xl mx-auto w-full">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="flex items-center gap-3 text-2xl sm:text-4xl font-bold tracking-tight">
              <LayoutDashboard className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              Dashboard
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-fit items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="flex md:flex-col gap-2 md:w-56 flex-shrink-0 md:border-r md:border-border md:pr-6 overflow-x-auto md:overflow-x-visible md:overflow-y-auto max-h-none md:max-h-[75vh] md:sticky md:top-4 pb-4 md:pb-0 hide-scrollbar items-center md:items-stretch">
            {SIDEBAR_CATEGORIES.map((category) => (
              <div key={category.title} className="flex md:block gap-2 md:gap-0 md:mb-6 flex-shrink-0">
                <p className="hidden md:block px-3 text-[10px] uppercase font-bold text-muted-foreground mb-3">
                  {category.title}
                </p>
                <div className="flex md:flex-col gap-1.5 flex-shrink-0">
                  {category.tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as Tab)}
                        className={cn(
                          "flex items-center gap-2 sm:gap-3 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-colors md:w-full whitespace-nowrap",
                          activeTab === tab.key
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" /> {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm min-h-[400px]">

              {/* ───── WORKS TAB ───── */}
              {activeTab === "works" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Works Overview</h2>
                    <button
                      onClick={() => { setIsAddingWork(!isAddingWork); setEditingWorkId(null); }}
                      className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Plus className={`h-4 w-4 transition-transform ${isAddingWork ? "rotate-45" : ""}`} />
                      <span className="hidden sm:inline">{isAddingWork ? "Cancel" : "Add Project"}</span>
                    </button>
                  </div>

                  {/* Add Work Form */}
                  {isAddingWork && (
                    <form onSubmit={handleAddWork} className="space-y-4 rounded-xl border bg-muted/30 p-4">
                      <LangTabBar active={workLangTab} onChange={setWorkLangTab} />

                      {workLangTab === "default" ? (
                        <>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">Title *</label>
                              <input required value={workForm.title} onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })} className={inputClass} placeholder="Project Title" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground flex items-baseline gap-1">Image URL <span className="text-[10px] text-muted-foreground/60 font-normal">(Use imgbb.com)</span></label>
                              <input value={workForm.image} onChange={(e) => setWorkForm({ ...workForm, image: e.target.value })} className={inputClass} placeholder="https://..." />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">Live Link</label>
                              <input value={workForm.link} onChange={(e) => setWorkForm({ ...workForm, link: e.target.value })} className={inputClass} placeholder="https://..." />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">GitHub Link</label>
                              <input value={workForm.github} onChange={(e) => setWorkForm({ ...workForm, github: e.target.value })} className={inputClass} placeholder="https://github.com/..." />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Tags (comma separated)</label>
                            <input value={workForm.tags} onChange={(e) => setWorkForm({ ...workForm, tags: e.target.value })} className={inputClass} placeholder="React, Tailwind" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Description *</label>
                            <textarea required value={workForm.description} onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })} className={`${inputClass} min-h-[80px]`} placeholder="Brief description" />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-xs text-muted-foreground">Optional — leave empty to use default (EN).</p>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Title ({workLangTab.toUpperCase()})</label>
                            <input value={(workForm as any)[`title_${workLangTab}`]} onChange={(e) => setWorkForm({ ...workForm, [`title_${workLangTab}`]: e.target.value })} className={inputClass} placeholder={workForm.title || "Translation..."} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Description ({workLangTab.toUpperCase()})</label>
                            <textarea value={(workForm as any)[`description_${workLangTab}`]} onChange={(e) => setWorkForm({ ...workForm, [`description_${workLangTab}`]: e.target.value })} className={`${inputClass} min-h-[80px]`} placeholder={workForm.description || "Translation..."} />
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button type="submit" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90">Save Project</button>
                      </div>
                    </form>
                  )}

                  {/* Edit Work Form */}
                  {editingWorkId && (
                    <form onSubmit={handleSaveEditWork} className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-primary">Editing Project</h3>
                        <button type="button" onClick={() => setEditingWorkId(null)} className="rounded-md p-1 hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
                      </div>
                      <LangTabBar active={editWorkLangTab} onChange={setEditWorkLangTab} />

                      {editWorkLangTab === "default" ? (
                        <>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">Title *</label>
                              <input required value={editWorkForm.title} onChange={(e) => setEditWorkForm({ ...editWorkForm, title: e.target.value })} className={inputClass} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground flex items-baseline gap-1">Image URL <span className="text-[10px] text-muted-foreground/60 font-normal">(Use imgbb.com)</span></label>
                              <input value={editWorkForm.image} onChange={(e) => setEditWorkForm({ ...editWorkForm, image: e.target.value })} className={inputClass} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">Live Link</label>
                              <input value={editWorkForm.link} onChange={(e) => setEditWorkForm({ ...editWorkForm, link: e.target.value })} className={inputClass} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">GitHub Link</label>
                              <input value={editWorkForm.github} onChange={(e) => setEditWorkForm({ ...editWorkForm, github: e.target.value })} className={inputClass} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Tags</label>
                            <input value={editWorkForm.tags} onChange={(e) => setEditWorkForm({ ...editWorkForm, tags: e.target.value })} className={inputClass} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Description *</label>
                            <textarea required value={editWorkForm.description} onChange={(e) => setEditWorkForm({ ...editWorkForm, description: e.target.value })} className={`${inputClass} min-h-[80px]`} />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-xs text-muted-foreground">Optional — leave empty to use default (EN).</p>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Title ({editWorkLangTab.toUpperCase()})</label>
                            <input value={(editWorkForm as any)[`title_${editWorkLangTab}`]} onChange={(e) => setEditWorkForm({ ...editWorkForm, [`title_${editWorkLangTab}`]: e.target.value })} className={inputClass} placeholder={editWorkForm.title || "Translation..."} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Description ({editWorkLangTab.toUpperCase()})</label>
                            <textarea value={(editWorkForm as any)[`description_${editWorkLangTab}`]} onChange={(e) => setEditWorkForm({ ...editWorkForm, [`description_${editWorkLangTab}`]: e.target.value })} className={`${inputClass} min-h-[80px]`} placeholder={editWorkForm.description || "Translation..."} />
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEditingWorkId(null)} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Update Project</button>
                      </div>
                    </form>
                  )}

                  {/* Work Items */}
                  <div className="space-y-2">
                    {works.length === 0 && !isAddingWork ? (
                      <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
                        <FolderKanban className="h-8 w-8 opacity-50" />
                        <p className="text-sm">No projects found.</p>
                      </div>
                    ) : works.map((work, idx) => (
                      <div
                        key={work.id}
                        className={cn(
                          "flex items-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-colors",
                          editingWorkId === work.id
                            ? "border-primary/50 bg-primary/5"
                            : "hover:bg-muted/30"
                        )}
                      >
                        {/* Order controls */}
                        <div className="flex flex-col gap-0.5 flex-shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveWork(work.id, "up")}
                            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move up"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />
                          <button
                            type="button"
                            disabled={idx === works.length - 1}
                            onClick={() => handleMoveWork(work.id, "down")}
                            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move down"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-mono">#{idx + 1}</span>
                            <h3 className="font-medium truncate">{work.title}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{work.description}</p>
                          {(work.title_tr || work.title_de || work.title_es) && (
                            <div className="flex gap-1 mt-1">
                              {work.title_tr && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium">TR</span>}
                              {work.title_de && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium">DE</span>}
                              {work.title_es && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium">ES</span>}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => handleEditWork(work)} className="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" title="Edit"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteWork(work.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ───── BLOG TAB ───── */}
              {activeTab === "blog" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Blog Posts</h2>
                    <button
                      onClick={() => { setIsAddingBlog(!isAddingBlog); setEditingBlogId(null); }}
                      className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Plus className={`h-4 w-4 transition-transform ${isAddingBlog ? "rotate-45" : ""}`} />
                      <span className="hidden sm:inline">{isAddingBlog ? "Cancel" : "New Post"}</span>
                    </button>
                  </div>

                  {/* Add Blog Form */}
                  {isAddingBlog && (
                    <form onSubmit={handleAddBlog} className="space-y-4 rounded-xl border bg-muted/30 p-4">
                      <LangTabBar active={blogLangTab} onChange={setBlogLangTab} />

                      {blogLangTab === "default" ? (
                        <>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">Title *</label>
                              <input required value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className={inputClass} placeholder="Post Title" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">Read Time</label>
                              <input value={blogForm.read_time} onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })} className={inputClass} placeholder="5 min read" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Excerpt *</label>
                            <input required value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} className={inputClass} placeholder="Short summary" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Content *</label>
                            <textarea required value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} className={`${inputClass} min-h-[150px]`} placeholder="Full blog post content..." />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-xs text-muted-foreground">Optional — leave empty to use default (EN).</p>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Title ({blogLangTab.toUpperCase()})</label>
                            <input value={(blogForm as any)[`title_${blogLangTab}`]} onChange={(e) => setBlogForm({ ...blogForm, [`title_${blogLangTab}`]: e.target.value })} className={inputClass} placeholder={blogForm.title || "Translation..."} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Excerpt ({blogLangTab.toUpperCase()})</label>
                            <input value={(blogForm as any)[`excerpt_${blogLangTab}`]} onChange={(e) => setBlogForm({ ...blogForm, [`excerpt_${blogLangTab}`]: e.target.value })} className={inputClass} placeholder={blogForm.excerpt || "Translation..."} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Content ({blogLangTab.toUpperCase()})</label>
                            <textarea value={(blogForm as any)[`content_${blogLangTab}`]} onChange={(e) => setBlogForm({ ...blogForm, [`content_${blogLangTab}`]: e.target.value })} className={`${inputClass} min-h-[150px]`} placeholder={blogForm.content || "Translation..."} />
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button type="submit" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90">Save Post</button>
                      </div>
                    </form>
                  )}

                  {/* Edit Blog Form */}
                  {editingBlogId && (
                    <form onSubmit={handleSaveEditBlog} className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-primary">Editing Post</h3>
                        <button type="button" onClick={() => setEditingBlogId(null)} className="rounded-md p-1 hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
                      </div>
                      <LangTabBar active={editBlogLangTab} onChange={setEditBlogLangTab} />

                      {editBlogLangTab === "default" ? (
                        <>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">Title *</label>
                              <input required value={editBlogForm.title} onChange={(e) => setEditBlogForm({ ...editBlogForm, title: e.target.value })} className={inputClass} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">Read Time</label>
                              <input value={editBlogForm.read_time} onChange={(e) => setEditBlogForm({ ...editBlogForm, read_time: e.target.value })} className={inputClass} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Date</label>
                            <input value={editBlogForm.date} onChange={(e) => setEditBlogForm({ ...editBlogForm, date: e.target.value })} className={inputClass} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Excerpt *</label>
                            <input required value={editBlogForm.excerpt} onChange={(e) => setEditBlogForm({ ...editBlogForm, excerpt: e.target.value })} className={inputClass} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Content *</label>
                            <textarea required value={editBlogForm.content} onChange={(e) => setEditBlogForm({ ...editBlogForm, content: e.target.value })} className={`${inputClass} min-h-[150px]`} />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-xs text-muted-foreground">Optional — leave empty to use default (EN).</p>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Title ({editBlogLangTab.toUpperCase()})</label>
                            <input value={(editBlogForm as any)[`title_${editBlogLangTab}`]} onChange={(e) => setEditBlogForm({ ...editBlogForm, [`title_${editBlogLangTab}`]: e.target.value })} className={inputClass} placeholder={editBlogForm.title || "Translation..."} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Excerpt ({editBlogLangTab.toUpperCase()})</label>
                            <input value={(editBlogForm as any)[`excerpt_${editBlogLangTab}`]} onChange={(e) => setEditBlogForm({ ...editBlogForm, [`excerpt_${editBlogLangTab}`]: e.target.value })} className={inputClass} placeholder={editBlogForm.excerpt || "Translation..."} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Content ({editBlogLangTab.toUpperCase()})</label>
                            <textarea value={(editBlogForm as any)[`content_${editBlogLangTab}`]} onChange={(e) => setEditBlogForm({ ...editBlogForm, [`content_${editBlogLangTab}`]: e.target.value })} className={`${inputClass} min-h-[150px]`} placeholder={editBlogForm.content || "Translation..."} />
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEditingBlogId(null)} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Update Post</button>
                      </div>
                    </form>
                  )}

                  {/* Blog Items */}
                  <div className="space-y-3">
                    {blogs.length === 0 && !isAddingBlog ? (
                      <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
                        <PenTool className="h-8 w-8 opacity-50" />
                        <p className="text-sm">No blog posts found.</p>
                      </div>
                    ) : blogs.map((blog) => (
                      <div
                        key={blog.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-3 sm:p-4 transition-colors",
                          editingBlogId === blog.id
                            ? "border-primary/50 bg-primary/5"
                            : "hover:bg-muted/30"
                        )}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="font-medium truncate">{blog.title}</h3>
                          <p className="text-xs text-muted-foreground">{blog.date} · {blog.read_time || "—"}</p>
                          {(blog.title_tr || blog.title_de || blog.title_es) && (
                            <div className="flex gap-1 mt-1">
                              {blog.title_tr && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium">TR</span>}
                              {blog.title_de && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium">DE</span>}
                              {blog.title_es && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium">ES</span>}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <button onClick={() => handleEditBlog(blog)} className="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" title="Edit"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteBlog(blog.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ───── ABOUT ME TAB ───── */}
              {activeTab === "about" && <AdminAboutTab />}

              {/* ───── SKILLS TAB ───── */}
              {activeTab === "skills" && <AdminSkillsTab />}

              {/* ───── EXPERIENCE TAB ───── */}
              {activeTab === "experience" && (
                <AdminCrudTab
                  title="Experience"
                  tableName="experiences"
                  displayField="title"
                  subtitleField="company"
                  fields={[
                    { key: "title", label: "Job Title", required: true, placeholder: "Software Engineer", translatable: true },
                    { key: "company", label: "Company", required: true, placeholder: "Google" },
                    { key: "location", label: "Location", placeholder: "Istanbul, Turkey" },
                    { key: "start_date", label: "Start Date", placeholder: "Sep 2023" },
                    { key: "end_date", label: "End Date", placeholder: "Present" },
                    { key: "is_current", label: "Current Job", type: "checkbox", placeholder: "Currently working here" },
                    { key: "logo_url", label: "Logo URL", placeholder: "https://..." },
                    { key: "description", label: "Description", type: "textarea", placeholder: "What you did...", translatable: true },
                  ]}
                />
              )}

              {/* ───── EDUCATION TAB ───── */}
              {activeTab === "education" && (
                <AdminCrudTab
                  title="Education"
                  tableName="educations"
                  displayField="university"
                  subtitleField="degree"
                  fields={[
                    { key: "university", label: "University", required: true, placeholder: "MIT" },
                    { key: "degree", label: "Degree", placeholder: "Bachelor of Science" },
                    { key: "major", label: "Major", placeholder: "Computer Science" },
                    { key: "location", label: "Location", placeholder: "Cambridge, MA" },
                    { key: "start_date", label: "Start Date", placeholder: "2020" },
                    { key: "end_date", label: "End Date", placeholder: "2024" },
                    { key: "logo_url", label: "Logo URL", placeholder: "https://..." },
                  ]}
                />
              )}
              {/* ───── LAYOUT CFG TAB ───── */}
              {activeTab === "section_layout" && <AdminLayoutTab />}

              {/* ───── LANGUAGES TAB ───── */}
              {activeTab === "languages" && (
                <AdminCrudTab
                  title="Languages"
                  tableName="languages"
                  displayField="name"
                  subtitleField="level"
                  fields={[
                    { key: "name", label: "Language", required: true, placeholder: "English" },
                    { key: "level", label: "Level", placeholder: "C1" },
                  ]}
                />
              )}

              {/* ───── ACTIVITIES TAB ───── */}
              {activeTab === "activities" && (
                <AdminCrudTab
                  title="Leadership & Activities"
                  tableName="activities"
                  displayField="organization"
                  subtitleField="role"
                  fields={[
                    { key: "organization", label: "Organization", required: true, placeholder: "Google Developer Student Club", translatable: true },
                    { key: "role", label: "Role", required: true, placeholder: "Lead", translatable: true },
                    { key: "start_date", label: "Start Date", placeholder: "2023" },
                    { key: "end_date", label: "End Date", placeholder: "Present" },
                    { key: "logo_url", label: "Logo URL", placeholder: "https://..." },
                    { key: "link_url", label: "Link", placeholder: "https://..." },
                    { key: "description", label: "Description", type: "textarea", placeholder: "What you did...", translatable: true },
                  ]}
                />
              )}

              {/* ───── CERTIFICATIONS TAB ───── */}
              {activeTab === "certifications" && (
                <AdminCrudTab
                  title="Certifications"
                  tableName="certifications"
                  displayField="name"
                  subtitleField="issuer"
                  fields={[
                    { key: "name", label: "Certificate Name", required: true, placeholder: "AWS Solutions Architect", translatable: true },
                    { key: "issuer", label: "Issuer", required: true, placeholder: "Amazon Web Services" },
                    { key: "issue_date", label: "Issue Date", placeholder: "Jan 2024" },
                    { key: "icon_url", label: "Icon URL", placeholder: "https://..." },
                    { key: "link_url", label: "Certificate Link", placeholder: "https://..." },
                  ]}
                />
              )}

              {/* ───── SOCIAL LINKS TAB ───── */}
              {activeTab === "social" && <AdminSocialLinksTab />}

              {/* ───── SETTINGS TAB ───── */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold border-b pb-4">Profile Settings</h2>
                  <div className="space-y-4 max-w-sm">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Admin Email</label>
                      <div className="rounded-lg bg-muted px-3 py-2 text-sm">{user?.email || "Unknown"}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">User ID</label>
                      <div className="rounded-lg bg-muted px-3 py-2 text-xs font-mono break-all">{user?.id || "Unknown"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
