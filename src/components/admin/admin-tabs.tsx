"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Pencil, X, Loader2, Globe, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

type LangTab = "default" | "tr" | "de" | "es";

const LANG_TABS: { key: LangTab; label: string }[] = [
  { key: "default", label: "EN (Default)" },
  { key: "tr", label: "TR" },
  { key: "de", label: "DE" },
  { key: "es", label: "ES" },
];

function LangTabBar({ active, onChange }: { active: LangTab; onChange: (t: LangTab) => void }) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1 mb-4 overflow-x-auto">
      {LANG_TABS.map((tab) => (
        <button key={tab.key} type="button" onClick={() => onChange(tab.key)}
          className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
            active === tab.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}>
          {tab.key !== "default" && <Globe className="h-3 w-3" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ──────── About Me Tab (name, role, tagline, bio, stats, quote) ────────

export function AdminAboutTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [langTab, setLangTab] = useState<LangTab>("default");
  const [form, setForm] = useState<Record<string, string>>({
    name: "", role: "", hero_tagline: "", bio: "", profile_photo_url: "",
    started_coding_year: "", projects_count: "", years_experience: "",
    quote_text: "", quote_author: "",
    hero_tagline_tr: "", hero_tagline_de: "", hero_tagline_es: "",
    bio_tr: "", bio_de: "", bio_es: "",
    role_tr: "", role_de: "", role_es: "",
    quote_text_tr: "", quote_text_de: "", quote_text_es: "",
  });

  const fetchData = async () => {
    if (!supabase) return;
    const { data: rows } = await supabase.from("about_me").select("*").limit(1);
    if (rows && rows.length > 0) {
      const row = rows[0];
      setData(row);
      const f: Record<string, string> = {};
      Object.keys(form).forEach(k => { f[k] = row[k]?.toString() || ""; });
      setForm(f);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const payload: Record<string, any> = {};
    const numFields = ["started_coding_year", "projects_count", "years_experience"];
    Object.keys(form).forEach(k => {
      if (numFields.includes(k)) payload[k] = form[k] ? parseInt(form[k]) : null;
      else payload[k] = form[k] || null;
    });
    if (data) await supabase.from("about_me").update(payload).eq("id", data.id);
    else await supabase.from("about_me").insert(payload);
    await fetchData();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold border-b pb-4">About Me & Profile</h2>
      <form onSubmit={handleSave} className="space-y-5 max-w-xl">
        <LangTabBar active={langTab} onChange={setLangTab} />

        {langTab === "default" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Batuhan Dede" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Role / Title</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass} placeholder="Frontend Developer" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Hero Tagline</label>
              <input value={form.hero_tagline} onChange={(e) => setForm({ ...form, hero_tagline: e.target.value })} className={inputClass} placeholder="Focusing on the intersection of code..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={`${inputClass} min-h-[100px]`} placeholder="Your bio text..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-baseline gap-1">Profile Photo URL <span className="text-[10px] text-muted-foreground/60 font-normal">(Use imgbb.com for free)</span></label>
              <input value={form.profile_photo_url} onChange={(e) => setForm({ ...form, profile_photo_url: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-3 items-end">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Started Coding Year</label>
                <input type="number" value={form.started_coding_year} onChange={(e) => setForm({ ...form, started_coding_year: e.target.value })} className={inputClass} placeholder="2021" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Projects Count</label>
                <input type="number" value={form.projects_count} onChange={(e) => setForm({ ...form, projects_count: e.target.value })} className={inputClass} placeholder="10" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Years Experience</label>
                <input type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} className={inputClass} placeholder="4" />
              </div>
            </div>
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Favorite Quote</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Quote Text</label>
                  <input value={form.quote_text} onChange={(e) => setForm({ ...form, quote_text: e.target.value })} className={inputClass} placeholder="Those who hate themselves..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Quote Author</label>
                  <input value={form.quote_author} onChange={(e) => setForm({ ...form, quote_author: e.target.value })} className={inputClass} placeholder="Hideaki Anno" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">Optional — leave empty to use default (EN).</p>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Role ({langTab.toUpperCase()})</label>
              <input value={form[`role_${langTab}`] || ""} onChange={(e) => setForm({ ...form, [`role_${langTab}`]: e.target.value })} className={inputClass} placeholder={form.role || "Translation..."} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tagline ({langTab.toUpperCase()})</label>
              <input value={form[`hero_tagline_${langTab}`] || ""} onChange={(e) => setForm({ ...form, [`hero_tagline_${langTab}`]: e.target.value })} className={inputClass} placeholder={form.hero_tagline || "Translation..."} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Bio ({langTab.toUpperCase()})</label>
              <textarea value={form[`bio_${langTab}`] || ""} onChange={(e) => setForm({ ...form, [`bio_${langTab}`]: e.target.value })} className={`${inputClass} min-h-[100px]`} placeholder={form.bio || "Translation..."} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Quote Text ({langTab.toUpperCase()})</label>
              <input value={form[`quote_text_${langTab}`] || ""} onChange={(e) => setForm({ ...form, [`quote_text_${langTab}`]: e.target.value })} className={inputClass} placeholder={form.quote_text || "Translation..."} />
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button type="submit" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90">{data ? "Update" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

// ──────── Skills Tab ────────

export function AdminSkillsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [langTab, setLangTab] = useState<LangTab>("default");
  const [form, setForm] = useState({ title: "", skills: "", title_tr: "", title_de: "", title_es: "" });

  const fetchItems = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("skill_categories").select("*").order("order_index", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const maxOrder = items.reduce((max, item) => Math.max(max, item.order_index ?? 0), -1);
    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    await supabase.from("skill_categories").insert({
      title: form.title, skills,
      title_tr: form.title_tr || null, title_de: form.title_de || null, title_es: form.title_es || null,
      order_index: maxOrder + 1,
    });
    setForm({ title: "", skills: "", title_tr: "", title_de: "", title_es: "" });
    setIsAdding(false);
    setLangTab("default");
    await fetchItems();
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      skills: Array.isArray(item.skills) ? item.skills.join(", ") : "",
      title_tr: item.title_tr || "", title_de: item.title_de || "", title_es: item.title_es || "",
    });
    setIsAdding(false);
    setLangTab("default");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingId) return;
    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    await supabase.from("skill_categories").update({
      title: form.title, skills,
      title_tr: form.title_tr || null, title_de: form.title_de || null, title_es: form.title_es || null,
    }).eq("id", editingId);
    setEditingId(null);
    await fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Delete this category?")) return;
    await supabase.from("skill_categories").delete().eq("id", id);
    if (editingId === id) setEditingId(null);
    await fetchItems();
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    if (!supabase) return;
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const current = items[idx];
    const swap = items[swapIdx];
    const currentOrder = current.order_index ?? idx;
    const swapOrder = swap.order_index ?? swapIdx;

    await Promise.all([
      supabase.from("skill_categories").update({ order_index: swapOrder }).eq("id", current.id),
      supabase.from("skill_categories").update({ order_index: currentOrder }).eq("id", swap.id),
    ]);
    await fetchItems();
  };

  const renderForm = (onSubmit: (e: React.FormEvent) => void, submitLabel: string, isEdit = false) => (
    <form onSubmit={onSubmit} className={cn("space-y-4 rounded-xl border p-4", isEdit ? "border-primary/30 bg-primary/5" : "bg-muted/30")}>
      {isEdit && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">Editing</h3>
          <button type="button" onClick={() => setEditingId(null)} className="rounded-md p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
      )}
      <LangTabBar active={langTab} onChange={setLangTab} />
      {langTab === "default" ? (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Category Title *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Frontend Excellence" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Skills (comma separated) *</label>
            <textarea required value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className={`${inputClass} min-h-[80px]`} placeholder="TypeScript, React, Next.js" />
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">Optional — leave empty to use default (EN).</p>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Category Title ({langTab.toUpperCase()})</label>
            <input value={form[`title_${langTab}` as keyof typeof form] || ""} onChange={(e) => setForm({ ...form, [`title_${langTab}`]: e.target.value })} className={inputClass} placeholder={form.title || "Translation..."} />
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2">
        {isEdit && <button type="button" onClick={() => setEditingId(null)} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>}
        <button type="submit" className={cn("rounded-md px-4 py-2 text-sm font-medium", isEdit ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-foreground text-background hover:bg-foreground/90")}>{submitLabel}</button>
      </div>
    </form>
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Skill Categories</h2>
        <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); setForm({ title: "", skills: "", title_tr: "", title_de: "", title_es: "" }); setLangTab("default"); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className={`h-4 w-4 transition-transform ${isAdding ? "rotate-45" : ""}`} />
          <span className="hidden sm:inline">{isAdding ? "Cancel" : "Add Category"}</span>
        </button>
      </div>
      {isAdding && renderForm(handleAdd, "Save")}
      {editingId && renderForm(handleSaveEdit, "Update", true)}
      <div className="space-y-2">
        {items.length === 0 && !isAdding ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground"><p className="text-sm">No categories yet.</p></div>
        ) : items.map((item, idx) => (
          <div key={item.id} className={cn("flex items-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-colors", editingId === item.id ? "border-primary/50 bg-primary/5" : "hover:bg-muted/30")}>
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button type="button" disabled={idx === 0} onClick={() => handleMove(item.id, "up")} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"><ChevronUp className="h-3.5 w-3.5" /></button>
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />
              <button type="button" disabled={idx === items.length - 1} onClick={() => handleMove(item.id, "down")} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"><ChevronDown className="h-3.5 w-3.5" /></button>
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="font-medium truncate">{item.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{Array.isArray(item.skills) ? item.skills.join(", ") : ""}</p>
            </div>
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <button onClick={() => handleEdit(item)} className="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────── Generic CRUD List with Language Support ────────

interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox";
  placeholder?: string;
  required?: boolean;
  translatable?: boolean;
}

interface CrudItem { id: string; [key: string]: any; }

export function AdminCrudTab({ title, tableName, fields, displayField, subtitleField }: {
  title: string; tableName: string; fields: FieldConfig[]; displayField: string; subtitleField?: string;
}) {
  const [items, setItems] = useState<CrudItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [langTab, setLangTab] = useState<LangTab>("default");

  const translatableFields = fields.filter(f => f.translatable);
  const hasTranslatable = translatableFields.length > 0;

  const emptyForm = () => {
    const f: Record<string, any> = {};
    fields.forEach(field => { f[field.key] = field.type === "checkbox" ? false : ""; });
    if (hasTranslatable) translatableFields.forEach(field => { ["tr", "de", "es"].forEach(lang => { f[`${field.key}_${lang}`] = ""; }); });
    return f;
  };

  const fetchItems = async () => {
    if (!supabase) return;
    const { data } = await supabase.from(tableName).select("*").order("order_index", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const buildPayload = () => {
    const payload: Record<string, any> = {};
    fields.forEach(field => {
      const val = form[field.key];
      if (field.type === "number" && val !== "") payload[field.key] = parseInt(val);
      else if (field.type === "checkbox") payload[field.key] = !!val;
      else if (typeof val === "string" && val.trim()) payload[field.key] = val;
      else payload[field.key] = null;
    });
    if (hasTranslatable) translatableFields.forEach(field => {
      ["tr", "de", "es"].forEach(lang => {
        const k = `${field.key}_${lang}`;
        const val = form[k];
        payload[k] = typeof val === "string" && val.trim() ? val : null;
      });
    });
    return payload;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const maxOrder = items.reduce((max, item) => Math.max(max, item.order_index ?? 0), -1);
    await supabase.from(tableName).insert({ ...buildPayload(), order_index: maxOrder + 1 });
    setForm(emptyForm()); setIsAdding(false); setLangTab("default");
    await fetchItems();
  };

  const handleEdit = (item: CrudItem) => {
    setEditingId(item.id);
    const f: Record<string, any> = {};
    fields.forEach(field => {
      f[field.key] = item[field.key] ?? (field.type === "checkbox" ? false : "");
      if (field.type === "number" && f[field.key] !== "" && f[field.key] !== false) f[field.key] = f[field.key]?.toString() || "";
    });
    if (hasTranslatable) translatableFields.forEach(field => { ["tr", "de", "es"].forEach(lang => { f[`${field.key}_${lang}`] = item[`${field.key}_${lang}`] || ""; }); });
    setForm(f); setIsAdding(false); setLangTab("default");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingId) return;
    await supabase.from(tableName).update(buildPayload()).eq("id", editingId);
    setEditingId(null); await fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Delete this item?")) return;
    await supabase.from(tableName).delete().eq("id", id);
    if (editingId === id) setEditingId(null);
    await fetchItems();
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    if (!supabase) return;
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const current = items[idx];
    const swap = items[swapIdx];
    const currentOrder = current.order_index ?? idx;
    const swapOrder = swap.order_index ?? swapIdx;

    await Promise.all([
      supabase.from(tableName).update({ order_index: swapOrder }).eq("id", current.id),
      supabase.from(tableName).update({ order_index: currentOrder }).eq("id", swap.id),
    ]);
    await fetchItems();
  };

  const renderFormFields = () => {
    if (hasTranslatable && langTab !== "default") {
      return (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">Optional — leave empty to use default (EN).</p>
          {translatableFields.map(field => (
            <div key={field.key} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{field.label} ({langTab.toUpperCase()})</label>
              {field.type === "textarea" ? (
                <textarea value={form[`${field.key}_${langTab}`] || ""} onChange={(e) => setForm({ ...form, [`${field.key}_${langTab}`]: e.target.value })} className={`${inputClass} min-h-[80px]`} placeholder={form[field.key] || "Translation..."} />
              ) : (
                <input value={form[`${field.key}_${langTab}`] || ""} onChange={(e) => setForm({ ...form, [`${field.key}_${langTab}`]: e.target.value })} className={inputClass} placeholder={form[field.key] || "Translation..."} />
              )}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(field => (
          <div key={field.key} className={cn("space-y-1", field.type === "textarea" && "sm:col-span-2")}>
            <label className="text-xs font-medium text-muted-foreground flex items-baseline gap-1">
              {field.label}{field.required && " *"}
              {(field.label.includes("Logo") || field.label.includes("Icon")) && <span className="text-[10px] text-muted-foreground/60 font-normal">(Use imgbb.com for free)</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea required={field.required} value={form[field.key] || ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className={`${inputClass} min-h-[80px]`} placeholder={field.placeholder} />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" checked={!!form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })} className="h-4 w-4 rounded border accent-primary" />
                <span className="text-sm text-muted-foreground">{field.placeholder || "Yes"}</span>
              </div>
            ) : (
              <input type={field.type === "number" ? "number" : "text"} required={field.required} value={form[field.key] || ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className={inputClass} placeholder={field.placeholder} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderForm = (onSubmit: (e: React.FormEvent) => void, submitLabel: string, isEdit = false) => (
    <form onSubmit={onSubmit} className={cn("space-y-4 rounded-xl border p-4", isEdit ? "border-primary/30 bg-primary/5" : "bg-muted/30")}>
      {isEdit && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">Editing</h3>
          <button type="button" onClick={() => setEditingId(null)} className="rounded-md p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
      )}
      {hasTranslatable && <LangTabBar active={langTab} onChange={setLangTab} />}
      {renderFormFields()}
      <div className="flex justify-end gap-2">
        {isEdit && <button type="button" onClick={() => setEditingId(null)} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>}
        <button type="submit" className={cn("rounded-md px-4 py-2 text-sm font-medium", isEdit ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-foreground text-background hover:bg-foreground/90")}>{submitLabel}</button>
      </div>
    </form>
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); setForm(emptyForm()); setLangTab("default"); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className={`h-4 w-4 transition-transform ${isAdding ? "rotate-45" : ""}`} />
          <span className="hidden sm:inline">{isAdding ? "Cancel" : "Add"}</span>
        </button>
      </div>
      {isAdding && renderForm(handleAdd, "Save")}
      {editingId && renderForm(handleSaveEdit, "Update", true)}
      <div className="space-y-2">
        {items.length === 0 && !isAdding ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground"><p className="text-sm">No items yet.</p></div>
        ) : items.map((item, idx) => (
          <div key={item.id} className={cn("flex items-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-colors", editingId === item.id ? "border-primary/50 bg-primary/5" : "hover:bg-muted/30")}>
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button type="button" disabled={idx === 0} onClick={() => handleMove(item.id, "up")} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"><ChevronUp className="h-3.5 w-3.5" /></button>
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />
              <button type="button" disabled={idx === items.length - 1} onClick={() => handleMove(item.id, "down")} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"><ChevronDown className="h-3.5 w-3.5" /></button>
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <h3 className="font-medium truncate">{item[displayField] || "—"}</h3>
              {subtitleField && <p className="text-xs text-muted-foreground truncate">{item[subtitleField] || ""}</p>}
              {hasTranslatable && (
                <div className="flex gap-1 mt-1">
                  {["tr", "de", "es"].map(lang => {
                    const has = translatableFields.some(f => item[`${f.key}_${lang}`]);
                    return has ? <span key={lang} className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium">{lang.toUpperCase()}</span> : null;
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <button onClick={() => handleEdit(item)} className="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────── Social Links Tab ────────

const PLATFORM_OPTIONS = ["LinkedIn", "GitHub", "Instagram", "Resume (CV)", "Twitter", "YouTube", "Dribbble", "Other"];

export function AdminSocialLinksTab() {
  const [items, setItems] = useState<CrudItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: "", url: "" });

  const fetchItems = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("social_links").select("*").order("order_index", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const maxOrder = items.reduce((max, item) => Math.max(max, item.order_index ?? 0), -1);
    await supabase.from("social_links").insert({ ...form, order_index: maxOrder + 1 });
    setForm({ platform: "", url: "" }); setIsAdding(false);
    await fetchItems();
  };

  const handleEdit = (item: CrudItem) => {
    setEditingId(item.id);
    setForm({ platform: item.platform || "", url: item.url || "" });
    setIsAdding(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingId) return;
    await supabase.from("social_links").update(form).eq("id", editingId);
    setEditingId(null); await fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Delete this link?")) return;
    await supabase.from("social_links").delete().eq("id", id);
    if (editingId === id) setEditingId(null);
    await fetchItems();
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    if (!supabase) return;
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const current = items[idx];
    const swap = items[swapIdx];
    const currentOrder = current.order_index ?? idx;
    const swapOrder = swap.order_index ?? swapIdx;

    await Promise.all([
      supabase.from("social_links").update({ order_index: swapOrder }).eq("id", current.id),
      supabase.from("social_links").update({ order_index: currentOrder }).eq("id", swap.id),
    ]);
    await fetchItems();
  };

  const renderForm = (onSubmit: (e: React.FormEvent) => void, submitLabel: string, isEdit = false) => (
    <form onSubmit={onSubmit} className={cn("space-y-4 rounded-xl border p-4", isEdit ? "border-primary/30 bg-primary/5" : "bg-muted/30")}>
      {isEdit && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">Editing</h3>
          <button type="button" onClick={() => setEditingId(null)} className="rounded-md p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Platform *</label>
          <select required value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputClass}>
            <option value="">Select platform...</option>
            {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">URL *</label>
          <input required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} placeholder="https://..." />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {isEdit && <button type="button" onClick={() => setEditingId(null)} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>}
        <button type="submit" className={cn("rounded-md px-4 py-2 text-sm font-medium", isEdit ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-foreground text-background hover:bg-foreground/90")}>{submitLabel}</button>
      </div>
    </form>
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Social Links</h2>
        <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); setForm({ platform: "", url: "" }); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className={`h-4 w-4 transition-transform ${isAdding ? "rotate-45" : ""}`} />
          <span className="hidden sm:inline">{isAdding ? "Cancel" : "Add Link"}</span>
        </button>
      </div>
      {isAdding && renderForm(handleAdd, "Save")}
      {editingId && renderForm(handleSaveEdit, "Update", true)}
      <div className="space-y-2">
        {items.length === 0 && !isAdding ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground"><p className="text-sm">No social links yet.</p></div>
        ) : items.map((item, idx) => (
          <div key={item.id} className={cn("flex items-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-colors", editingId === item.id ? "border-primary/50 bg-primary/5" : "hover:bg-muted/30")}>
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button type="button" disabled={idx === 0} onClick={() => handleMove(item.id, "up")} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"><ChevronUp className="h-3.5 w-3.5" /></button>
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />
              <button type="button" disabled={idx === items.length - 1} onClick={() => handleMove(item.id, "down")} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"><ChevronDown className="h-3.5 w-3.5" /></button>
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <h3 className="font-medium truncate">{item.platform}</h3>
              <p className="text-xs text-muted-foreground truncate">{item.url}</p>
            </div>
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <button onClick={() => handleEdit(item)} className="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────── Layout Config Tab (order sections) ────────

export function AdminLayoutTab() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const { Eye, EyeOff, Wrench } = require("lucide-react");

  const fetchSections = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("section_order").select("*").order("order_index", { ascending: true });
    
    if (data && data.length === 0) {
      const defaultOrder = [
        { section_id: "skills", order_index: 0 },
        { section_id: "experience", order_index: 1 },
        { section_id: "education", order_index: 2 },
        { section_id: "languages", order_index: 3 },
        { section_id: "activities", order_index: 4 },
        { section_id: "certifications", order_index: 5 },
      ];
      await supabase.from("section_order").insert(defaultOrder);
      setSections(defaultOrder);
    } else {
      setSections(data ? data.filter(d => d.section_id !== "maintenance_mode") : []);
      setMaintenanceMode(data?.some(d => d.section_id === "maintenance_mode") || false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleMove = async (id: string, direction: "up" | "down") => {
    if (!supabase) return;
    const idx = sections.findIndex((s) => s.section_id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;

    // Optimistic UI update
    const newSections = [...sections];
    const temp = newSections[idx];
    newSections[idx] = newSections[swapIdx];
    newSections[swapIdx] = temp;
    setSections(newSections);

    // Robust bulk update forces perfect 0-based indexing to correct any database errors
    await Promise.all(
      newSections.map((sec, i) =>
        supabase!.from("section_order").update({ order_index: i }).eq("section_id", sec.section_id)
      )
    );
    
    await fetchSections();
  };

  const handleToggleVisibility = async (sec: any) => {
    if (!supabase) return;

    const isHidden = sec.section_id.endsWith("_hidden");
    const baseId = sec.section_id.replace("_hidden", "");
    const newId = isHidden ? baseId : `${baseId}_hidden`;

    // Optimistic UI update
    const newSections = sections.map((s) =>
      s.section_id === sec.section_id ? { ...s, section_id: newId } : s
    );
    setSections(newSections);

    // Update DB
    const { error } = await supabase
      .from("section_order")
      .update({ section_id: newId })
      .eq("section_id", sec.section_id);

    if (error) {
      console.error("Error toggling visibility:", error);
      await fetchSections();
    }
  };

  const handleToggleMaintenanceMode = async () => {
    if (!supabase) return;
    const newState = !maintenanceMode;
    setMaintenanceMode(newState); // Optimistic UI

    if (newState) {
      const { error } = await supabase.from("section_order").insert({ section_id: "maintenance_mode", order_index: -1 });
      if (error) setMaintenanceMode(false);
    } else {
      const { error } = await supabase.from("section_order").delete().eq("section_id", "maintenance_mode");
      if (error) setMaintenanceMode(true);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold tracking-tight mb-2">Site Settings</h2>
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4 mb-6">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" /> Maintenance Mode
            </h3>
            <p className="text-sm text-muted-foreground">
              Temporarily block public access to the site while you apply updates. The admin panel remains accessible.
            </p>
          </div>
          <button
            onClick={handleToggleMaintenanceMode}
            className={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              maintenanceMode ? "bg-primary" : "bg-muted-foreground/30"
            )}
            role="switch"
            aria-checked={maintenanceMode}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                maintenanceMode ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>

        <h2 className="text-lg font-bold tracking-tight mb-2 pt-6 border-t mt-6">Portfolio Section Reordering</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Use the arrows to drag and reorder the sections exactly as you want them to appear natively on your public frontend logic.
        </p>
        <div className="space-y-3">
          {sections.map((sec, index) => (
            <div key={sec.section_id} className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className={cn("font-medium lowercase capitalize", sec.section_id.endsWith("_hidden") ? "text-muted-foreground line-through opacity-70" : "text-foreground")}>
                  {sec.section_id.replace("_hidden", "")}
                </span>
                {sec.section_id.endsWith("_hidden") && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold rounded bg-muted px-1.5 py-0.5 text-muted-foreground">Hidden</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(sec)}
                  className="mr-2 flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title={sec.section_id.endsWith("_hidden") ? "Show on public site" : "Hide from public site"}
                >
                  {sec.section_id.endsWith("_hidden") ? (
                    <><EyeOff className="h-3.5 w-3.5" /> Hidden</>
                  ) : (
                    <><Eye className="h-3.5 w-3.5" /> Visible</>
                  )}
                </button>
                <div className="flex items-center gap-1 border-l pl-2">
                  <button
                    type="button"
                    onClick={() => handleMove(sec.section_id, "up")}
                    disabled={index === 0}
                    className="rounded p-1.5 hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(sec.section_id, "down")}
                    disabled={index === sections.length - 1}
                    className="rounded p-1.5 hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
