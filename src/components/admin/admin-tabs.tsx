"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Loader2,
  Globe,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminError } from "@/context/admin-error-context";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

type LangTab = "default" | "tr" | "de" | "es";

const LANG_TABS: { key: LangTab; label: string }[] = [
  { key: "default", label: "EN (Default)" },
  { key: "tr", label: "TR" },
  { key: "de", label: "DE" },
  { key: "es", label: "ES" },
];

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
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.key !== "default" && <Globe className="h-3 w-3" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function ImageInputWithRecent({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadImages = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    setLoading(true);
    if (!supabase) return;

    const [edu, exp, proj, cert, about, projImages, blogs, blogImages] =
      await Promise.all([
        supabase
          .from("educations")
          .select("logo_url")
          .not("logo_url", "is", null),
        supabase
          .from("experiences")
          .select("logo_url")
          .not("logo_url", "is", null),
        supabase.from("projects").select("image").not("image", "is", null),
        supabase
          .from("certifications")
          .select("icon_url")
          .not("icon_url", "is", null),
        supabase
          .from("about_me")
          .select("profile_photo_url")
          .not("profile_photo_url", "is", null),
        supabase
          .from("project_images")
          .select("image_url")
          .not("image_url", "is", null),
        supabase.from("blogs").select("image_url").not("image_url", "is", null),
        supabase
          .from("blog_images")
          .select("image_url")
          .not("image_url", "is", null),
      ]);

    const urls = new Set<string>();
    edu.data?.forEach((d: any) => {
      if (d.logo_url?.trim()) urls.add(d.logo_url);
    });
    exp.data?.forEach((d: any) => {
      if (d.logo_url?.trim()) urls.add(d.logo_url);
    });
    proj.data?.forEach((d: any) => {
      if (d.image?.trim()) urls.add(d.image);
    });
    cert.data?.forEach((d: any) => {
      if (d.icon_url?.trim()) urls.add(d.icon_url);
    });
    about.data?.forEach((d: any) => {
      if (d.profile_photo_url?.trim()) urls.add(d.profile_photo_url);
    });
    projImages.data?.forEach((d: any) => {
      if (d.image_url?.trim()) urls.add(d.image_url);
    });
    blogs.data?.forEach((d: any) => {
      if (d.image_url?.trim()) urls.add(d.image_url);
    });
    blogImages.data?.forEach((d: any) => {
      if (d.image_url?.trim()) urls.add(d.image_url);
    });

    // Sort by most recent (assuming URLs contain timestamps or using Set order)
    setImages(Array.from(urls));
    setLoading(false);
  };

  return (
    <div className="relative flex gap-2 w-full">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={loadImages}
        className="flex flex-shrink-0 items-center justify-center rounded-md border bg-muted/50 px-3 hover:bg-muted transition-colors"
        title="Recent Images"
      >
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-[280px] sm:w-[320px] bg-card border rounded-lg shadow-xl z-50 p-3 max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <span className="text-xs font-semibold text-muted-foreground">
                Previously Used Images
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : images.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground py-6">
                No recent images found.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img) => (
                  <div
                    key={img}
                    onClick={() => {
                      onChange(img);
                      setIsOpen(false);
                    }}
                    className="aspect-square relative cursor-pointer group rounded-md overflow-hidden border hover:border-primary transition-all"
                  >
                    <img
                      src={img}
                      alt="recent"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ──────── About Me Tab (name, role, tagline, bio, stats, quote) ────────

export function AdminAboutTab() {
  const { handleOperationError } = useAdminError();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [langTab, setLangTab] = useState<LangTab>("default");
  const [form, setForm] = useState<Record<string, any>>({
    name: "",
    role: "",
    hero_tagline: "",
    bio: "",
    profile_photo_url: "",
    started_coding_year: "",
    projects_count: "",
    years_experience: "",
    stat_1_value: "",
    stat_1_label: "",
    stat_2_value: "",
    stat_2_label: "",
    stat_3_value: "",
    stat_3_label: "",
    quote_text: "",
    quote_author: "",
    hero_tagline_tr: "",
    hero_tagline_de: "",
    hero_tagline_es: "",
    bio_tr: "",
    bio_de: "",
    bio_es: "",
    role_tr: "",
    role_de: "",
    role_es: "",
    quote_text_tr: "",
    quote_text_de: "",
    quote_text_es: "",
    stat_1_label_tr: "",
    stat_1_label_de: "",
    stat_1_label_es: "",
    stat_2_label_tr: "",
    stat_2_label_de: "",
    stat_2_label_es: "",
    stat_3_label_tr: "",
    stat_3_label_de: "",
    stat_3_label_es: "",
    show_quote: true,
    show_stats: true,
    show_profile_photo: true,
  });

  const fetchData = async () => {
    if (!supabase) return;
    const { data: rows } = await supabase.from("about_me").select("*").limit(1);
    if (rows && rows.length > 0) {
      const row = rows[0];
      setData(row);
      const f: Record<string, any> = {};
      Object.keys(form).forEach((k) => {
        if (
          k === "show_quote" ||
          k === "show_stats" ||
          k === "show_profile_photo"
        )
          f[k] = row[k] !== false;
        else f[k] = row[k]?.toString() || "";
      });
      setForm(f);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const payload: Record<string, any> = {};
    const numFields = [
      "started_coding_year",
      "projects_count",
      "years_experience",
    ];
    Object.keys(form).forEach((k) => {
      if (
        k === "show_quote" ||
        k === "show_stats" ||
        k === "show_profile_photo"
      )
        payload[k] = !!form[k];
      else if (numFields.includes(k))
        payload[k] = form[k] ? parseInt(form[k]) : null;
      else payload[k] = form[k] || null;
    });
    if (data) {
      const { error, data: updateData } = await supabase
        .from("about_me")
        .update(payload)
        .eq("id", data.id)
        .select();
      if (
        handleOperationError(
          error ||
            (!updateData || updateData.length === 0
              ? { code: "42501", message: "Yetkisiz işlem" }
              : null),
          "Profil Güncelleme",
        )
      )
        return;
    } else {
      const { error } = await supabase.from("about_me").insert(payload);
      if (handleOperationError(error, "Profil Ekleme")) return;
    }
    await fetchData();
    toast.success("Profil bilgileri başarıyla kaydedildi");
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold border-b pb-4">
        About Me & Profile
      </h2>
      <form onSubmit={handleSave} className="space-y-5 max-w-xl">
        <LangTabBar active={langTab} onChange={setLangTab} />

        {langTab === "default" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="Batuhan Dede"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Role / Title
                </label>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputClass}
                  placeholder="Frontend Developer"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Hero Tagline
              </label>
              <input
                value={form.hero_tagline}
                onChange={(e) =>
                  setForm({ ...form, hero_tagline: e.target.value })
                }
                className={inputClass}
                placeholder="Focusing on the intersection of code..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className={`${inputClass} min-h-[100px]`}
                placeholder="Your bio text..."
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground flex items-baseline gap-1">
                  Profile Photo URL{" "}
                  <span className="text-[10px] text-muted-foreground/60 font-normal">
                    (Use imgbb.com for free)
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.show_profile_photo !== false}
                    onChange={(e) =>
                      setForm({ ...form, show_profile_photo: e.target.checked })
                    }
                    className="h-4 w-4 rounded border accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">
                    Show Photo
                  </span>
                </div>
              </div>
              <ImageInputWithRecent
                value={form.profile_photo_url || ""}
                onChange={(val) => setForm({ ...form, profile_photo_url: val })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Customizable Stats
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.show_stats !== false}
                    onChange={(e) =>
                      setForm({ ...form, show_stats: e.target.checked })
                    }
                    className="h-4 w-4 rounded border accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">
                    Show Section
                  </span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 bg-muted/20 p-3 rounded-lg border">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Stat 1 Value (e.g. 2018)
                  </label>
                  <input
                    value={form.stat_1_value}
                    onChange={(e) =>
                      setForm({ ...form, stat_1_value: e.target.value })
                    }
                    className={inputClass}
                    placeholder="2018"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Stat 1 Label
                  </label>
                  <input
                    value={form.stat_1_label}
                    onChange={(e) =>
                      setForm({ ...form, stat_1_label: e.target.value })
                    }
                    className={inputClass}
                    placeholder="STARTED CODING"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 bg-muted/20 p-3 rounded-lg border">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Stat 2 Value (e.g. 3+)
                  </label>
                  <input
                    value={form.stat_2_value}
                    onChange={(e) =>
                      setForm({ ...form, stat_2_value: e.target.value })
                    }
                    className={inputClass}
                    placeholder="3+"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Stat 2 Label
                  </label>
                  <input
                    value={form.stat_2_label}
                    onChange={(e) =>
                      setForm({ ...form, stat_2_label: e.target.value })
                    }
                    className={inputClass}
                    placeholder="PROJECTS"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 bg-muted/20 p-3 rounded-lg border">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Stat 3 Value (e.g. 2+)
                  </label>
                  <input
                    value={form.stat_3_value}
                    onChange={(e) =>
                      setForm({ ...form, stat_3_value: e.target.value })
                    }
                    className={inputClass}
                    placeholder="2+"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Stat 3 Label
                  </label>
                  <input
                    value={form.stat_3_label}
                    onChange={(e) =>
                      setForm({ ...form, stat_3_label: e.target.value })
                    }
                    className={inputClass}
                    placeholder="YEARS EXPERIENCE"
                  />
                </div>
              </div>
            </div>
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Favorite Quote
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.show_quote !== false}
                    onChange={(e) =>
                      setForm({ ...form, show_quote: e.target.checked })
                    }
                    className="h-4 w-4 rounded border accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">
                    Show Section
                  </span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Quote Text
                  </label>
                  <input
                    value={form.quote_text}
                    onChange={(e) =>
                      setForm({ ...form, quote_text: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Those who hate themselves..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Quote Author
                  </label>
                  <input
                    value={form.quote_author}
                    onChange={(e) =>
                      setForm({ ...form, quote_author: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Hideaki Anno"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Optional — leave empty to use default (EN).
            </p>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Role ({langTab.toUpperCase()})
              </label>
              <input
                value={form[`role_${langTab}`] || ""}
                onChange={(e) =>
                  setForm({ ...form, [`role_${langTab}`]: e.target.value })
                }
                className={inputClass}
                placeholder={form.role || "Translation..."}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Tagline ({langTab.toUpperCase()})
              </label>
              <input
                value={form[`hero_tagline_${langTab}`] || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [`hero_tagline_${langTab}`]: e.target.value,
                  })
                }
                className={inputClass}
                placeholder={form.hero_tagline || "Translation..."}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Bio ({langTab.toUpperCase()})
              </label>
              <textarea
                value={form[`bio_${langTab}`] || ""}
                onChange={(e) =>
                  setForm({ ...form, [`bio_${langTab}`]: e.target.value })
                }
                className={`${inputClass} min-h-[100px]`}
                placeholder={form.bio || "Translation..."}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Quote Text ({langTab.toUpperCase()})
              </label>
              <input
                value={form[`quote_text_${langTab}`] || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [`quote_text_${langTab}`]: e.target.value,
                  })
                }
                className={inputClass}
                placeholder={form.quote_text || "Translation..."}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Stat 1 ({langTab.toUpperCase()})
                </label>
                <input
                  value={form[`stat_1_label_${langTab}`] || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [`stat_1_label_${langTab}`]: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder={form.stat_1_label || "Label..."}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Stat 2 ({langTab.toUpperCase()})
                </label>
                <input
                  value={form[`stat_2_label_${langTab}`] || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [`stat_2_label_${langTab}`]: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder={form.stat_2_label || "Label..."}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Stat 3 ({langTab.toUpperCase()})
                </label>
                <input
                  value={form[`stat_3_label_${langTab}`] || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [`stat_3_label_${langTab}`]: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder={form.stat_3_label || "Label..."}
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
          >
            {data ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ──────── Skills Tab ────────

export function AdminSkillsTab() {
  const { handleOperationError } = useAdminError();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [langTab, setLangTab] = useState<LangTab>("default");
  const [form, setForm] = useState({
    title: "",
    skills: "",
    title_tr: "",
    title_de: "",
    title_es: "",
  });

  const fetchItems = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("skill_categories")
      .select("*")
      .order("order_index", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const maxOrder = items.reduce(
      (max, item) => Math.max(max, item.order_index ?? 0),
      -1,
    );
    const skills = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const { error } = await supabase.from("skill_categories").insert({
      title: form.title,
      skills,
      title_tr: form.title_tr || null,
      title_de: form.title_de || null,
      title_es: form.title_es || null,
      order_index: maxOrder + 1,
    });
    if (handleOperationError(error, "Yetenek Kategorisi Ekleme")) return;
    setForm({
      title: "",
      skills: "",
      title_tr: "",
      title_de: "",
      title_es: "",
    });
    setIsAdding(false);
    setLangTab("default");
    await fetchItems();
    toast.success("Yetenek kategorisi başarıyla eklendi");
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      skills: Array.isArray(item.skills) ? item.skills.join(", ") : "",
      title_tr: item.title_tr || "",
      title_de: item.title_de || "",
      title_es: item.title_es || "",
    });
    setIsAdding(false);
    setLangTab("default");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingId) return;
    const skills = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const { error, data } = await supabase
      .from("skill_categories")
      .update({
        title: form.title,
        skills,
        title_tr: form.title_tr || null,
        title_de: form.title_de || null,
        title_es: form.title_es || null,
      })
      .eq("id", editingId)
      .select();
    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "Yetenek Kategorisi Güncelleme",
      )
    )
      return;
    setEditingId(null);
    await fetchItems();
    toast.success("Yetenek kategorisi başarıyla güncellendi");
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Delete this category?")) return;
    const { error, data } = await supabase
      .from("skill_categories")
      .delete()
      .eq("id", id)
      .select();
    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "Yetenek Kategorisi Silme",
      )
    )
      return;
    if (editingId === id) setEditingId(null);
    await fetchItems();
    toast.success("Yetenek kategorisi başarıyla silindi");
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

    const { error: err1 } = await supabase
      .from("skill_categories")
      .update({ order_index: swapOrder })
      .eq("id", current.id);
    const { error: err2 } = await supabase
      .from("skill_categories")
      .update({ order_index: currentOrder })
      .eq("id", swap.id);

    if (handleOperationError(err1 || err2, "Yetenek Sıralama Değiştirme"))
      return;
    await fetchItems();
  };

  const renderForm = (
    onSubmit: (e: React.FormEvent) => void,
    submitLabel: string,
    isEdit = false,
  ) => (
    <form
      onSubmit={onSubmit}
      className={cn(
        "space-y-4 rounded-xl border p-4",
        isEdit ? "border-primary/30 bg-primary/5" : "bg-muted/30",
      )}
    >
      {isEdit && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">Editing</h3>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-md p-1 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <LangTabBar active={langTab} onChange={setLangTab} />
      {langTab === "default" ? (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Category Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="Frontend Excellence"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Skills (comma separated) *
            </label>
            <textarea
              required
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className={`${inputClass} min-h-[80px]`}
              placeholder="TypeScript, React, Next.js"
            />
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Optional — leave empty to use default (EN).
          </p>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Category Title ({langTab.toUpperCase()})
            </label>
            <input
              value={form[`title_${langTab}` as keyof typeof form] || ""}
              onChange={(e) =>
                setForm({ ...form, [`title_${langTab}`]: e.target.value })
              }
              className={inputClass}
              placeholder={form.title || "Translation..."}
            />
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2">
        {isEdit && (
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium",
            isEdit
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-foreground text-background hover:bg-foreground/90",
          )}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Skill Categories</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setForm({
              title: "",
              skills: "",
              title_tr: "",
              title_de: "",
              title_es: "",
            });
            setLangTab("default");
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus
            className={`h-4 w-4 transition-transform ${isAdding ? "rotate-45" : ""}`}
          />
          <span className="hidden sm:inline">
            {isAdding ? "Cancel" : "Add Category"}
          </span>
        </button>
      </div>
      {isAdding && renderForm(handleAdd, "Save")}
      {editingId && renderForm(handleSaveEdit, "Update", true)}
      <div className="space-y-2">
        {items.length === 0 && !isAdding ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
            <p className="text-sm">No categories yet.</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-colors",
                editingId === item.id
                  ? "border-primary/50 bg-primary/5"
                  : "hover:bg-muted/30",
              )}
            >
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(item.id, "up")}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(item.id, "down")}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="font-medium truncate">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {Array.isArray(item.skills) ? item.skills.join(", ") : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ──────── Generic CRUD List with Language Support ────────

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const YEARS = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() - i,
);

export function MonthYearInput({
  value,
  onChange,
  className,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  disabled?: boolean;
}) {
  let month = "";
  let year = "";
  if (
    value &&
    value.toLowerCase() !== "present" &&
    value.toLowerCase() !== "devam"
  ) {
    const parts = value.split(" ");
    if (parts.length === 2) {
      month = parts[0];
      year = parts[1];
    } else if (parts.length === 1 && parts[0].length === 4) {
      year = parts[0];
    }
  }

  const handleMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = e.target.value;
    if (m && year) onChange(`${m} ${year}`);
    else if (!m && year) onChange(year);
    else onChange("");
  };

  const handleYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const y = e.target.value;
    if (month && y) onChange(`${month} ${y}`);
    else if (!month && y) onChange(y);
    else onChange("");
  };

  return (
    <div className="flex gap-2 w-full">
      <select
        value={month}
        onChange={handleMonth}
        disabled={disabled}
        className={cn(className, "w-1/2 flex-1 disabled:opacity-50")}
      >
        <option value="">Month</option>
        {MONTHS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={year}
        onChange={handleYear}
        disabled={disabled}
        className={cn(className, "w-1/2 flex-1 disabled:opacity-50")}
      >
        <option value="">Year</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FieldConfig {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "number"
    | "checkbox"
    | "month_year"
    | "select"
    | "multi_select";
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  translatable?: boolean;
  junctionTable?: string;
  junctionForeignKey?: string;
  junctionOtherKey?: string;
}

interface CrudItem {
  id: string;
  [key: string]: any;
}

export function AdminCrudTab({
  title,
  tableName,
  fields,
  displayField,
  subtitleField,
}: {
  title: string;
  tableName: string;
  fields: FieldConfig[];
  displayField: string;
  subtitleField?: string;
}) {
  const { handleOperationError } = useAdminError();
  const [items, setItems] = useState<CrudItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [langTab, setLangTab] = useState<LangTab>("default");

  const translatableFields = fields.filter((f) => f.translatable);
  const hasTranslatable = translatableFields.length > 0;

  const emptyForm = () => {
    const f: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === "checkbox") f[field.key] = false;
      else if (field.type === "multi_select") f[field.key] = [];
      else f[field.key] = "";
    });
    if (hasTranslatable)
      translatableFields.forEach((field) => {
        ["tr", "de", "es"].forEach((lang) => {
          f[`${field.key}_${lang}`] = "";
        });
      });
    return f;
  };

  const fetchItems = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from(tableName)
      .select("*")
      .order("order_index", { ascending: true });

    // If there are multi_select fields, we need to fetch their relationships
    const multiSelectFields = fields.filter(
      (f) => f.type === "multi_select" && f.junctionTable,
    );

    if (data && multiSelectFields.length > 0) {
      for (const field of multiSelectFields) {
        if (
          !field.junctionTable ||
          !field.junctionForeignKey ||
          !field.junctionOtherKey
        )
          continue;
        const { data: relData } = await supabase
          .from(field.junctionTable)
          .select("*");
        if (relData) {
          data.forEach((item) => {
            const rels = relData.filter(
              (r) => r[field.junctionForeignKey!] === item.id,
            );
            item[field.key] = rels.map((r) => r[field.junctionOtherKey!]);
          });
        }
      }
    }

    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const buildPayload = () => {
    const payload: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === "multi_select") return; // Handled separately

      const val = form[field.key];
      if (field.type === "number" && val !== "")
        payload[field.key] = parseInt(val);
      else if (field.type === "checkbox") payload[field.key] = !!val;
      else if (typeof val === "string" && val.trim()) payload[field.key] = val;
      else payload[field.key] = null;
    });
    if (hasTranslatable)
      translatableFields.forEach((field) => {
        ["tr", "de", "es"].forEach((lang) => {
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
    const maxOrder = items.reduce(
      (max, item) => Math.max(max, item.order_index ?? 0),
      -1,
    );
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert({ ...buildPayload(), order_index: maxOrder + 1 })
      .select();
    if (handleOperationError(error, `${title} Ekleme`)) return;

    if (insertedData && insertedData[0]) {
      const newId = insertedData[0].id;
      const multiSelectFields = fields.filter(
        (f) => f.type === "multi_select" && f.junctionTable,
      );
      for (const field of multiSelectFields) {
        if (
          !field.junctionTable ||
          !field.junctionForeignKey ||
          !field.junctionOtherKey
        )
          continue;
        const selectedIds = form[field.key] || [];
        if (selectedIds.length > 0) {
          const inserts = selectedIds.map((valId: string) => ({
            [field.junctionForeignKey!]: newId,
            [field.junctionOtherKey!]: valId,
          }));
          const { error: junctionError } = await supabase
            .from(field.junctionTable)
            .insert(inserts);
          if (handleOperationError(junctionError, `${title} İlişki Ekleme`))
            return;
        }
      }
    }

    setForm(emptyForm());
    setIsAdding(false);
    setLangTab("default");
    await fetchItems();
    toast.success(`${title} başarıyla eklendi`);
  };

  const handleEdit = (item: CrudItem) => {
    setEditingId(item.id);
    const f: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === "multi_select") f[field.key] = item[field.key] || [];
      else
        f[field.key] =
          item[field.key] ?? (field.type === "checkbox" ? false : "");

      if (
        field.type === "number" &&
        f[field.key] !== "" &&
        f[field.key] !== false
      )
        f[field.key] = f[field.key]?.toString() || "";
    });
    if (hasTranslatable)
      translatableFields.forEach((field) => {
        ["tr", "de", "es"].forEach((lang) => {
          f[`${field.key}_${lang}`] = item[`${field.key}_${lang}`] || "";
        });
      });
    setForm(f);
    setIsAdding(false);
    setLangTab("default");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingId) return;
    const { error: updateError, data: updateData } = await supabase
      .from(tableName)
      .update(buildPayload())
      .eq("id", editingId)
      .select();
    if (
      handleOperationError(
        updateError ||
          (!updateData || updateData.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        `${title} Güncelleme`,
      )
    )
      return;

    const multiSelectFields = fields.filter(
      (f) => f.type === "multi_select" && f.junctionTable,
    );
    for (const field of multiSelectFields) {
      if (
        !field.junctionTable ||
        !field.junctionForeignKey ||
        !field.junctionOtherKey
      )
        continue;
      // Delete existing relationships
      const { error: junctionDelError } = await supabase
        .from(field.junctionTable)
        .delete()
        .eq(field.junctionForeignKey, editingId);
      if (handleOperationError(junctionDelError, `${title} İlişki Temizleme`))
        return;

      const selectedIds = form[field.key] || [];
      if (selectedIds.length > 0) {
        const inserts = selectedIds.map((valId: string) => ({
          [field.junctionForeignKey!]: editingId,
          [field.junctionOtherKey!]: valId,
        }));
        const { error: junctionInsError } = await supabase
          .from(field.junctionTable)
          .insert(inserts);
        if (
          handleOperationError(junctionInsError, `${title} İlişki Güncelleme`)
        )
          return;
      }
    }

    setEditingId(null);
    await fetchItems();
    toast.success(`${title} başarıyla güncellendi`);
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Delete this item?")) return;
    const { error, data } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .select();
    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        `${title} Silme`,
      )
    )
      return;
    if (editingId === id) setEditingId(null);
    await fetchItems();
    toast.success(`${title} başarıyla silindi`);
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

    const { error: err1 } = await supabase
      .from(tableName)
      .update({ order_index: swapOrder })
      .eq("id", current.id);
    const { error: err2 } = await supabase
      .from(tableName)
      .update({ order_index: currentOrder })
      .eq("id", swap.id);

    if (handleOperationError(err1 || err2, `${title} Sıralama Değiştirme`))
      return;
    await fetchItems();
  };

  const renderFormFields = () => {
    if (hasTranslatable && langTab !== "default") {
      return (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Optional — leave empty to use default (EN).
          </p>
          {translatableFields.map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {field.label} ({langTab.toUpperCase()})
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={form[`${field.key}_${langTab}`] || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [`${field.key}_${langTab}`]: e.target.value,
                    })
                  }
                  className={`${inputClass} min-h-[80px]`}
                  placeholder={form[field.key] || "Translation..."}
                />
              ) : (
                <input
                  value={form[`${field.key}_${langTab}`] || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [`${field.key}_${langTab}`]: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder={form[field.key] || "Translation..."}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className={cn(
              "space-y-1",
              field.type === "textarea" && "sm:col-span-2",
            )}
          >
            <label className="text-xs font-medium text-muted-foreground flex items-baseline gap-1">
              {field.label}
              {field.required && " *"}
              {(field.label.includes("Logo") ||
                field.label.includes("Icon")) && (
                <span className="text-[10px] text-muted-foreground/60 font-normal">
                  (Use imgbb.com for free)
                </span>
              )}
            </label>
            {field.type === "textarea" ? (
              <textarea
                required={field.required}
                value={form[field.key] || ""}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className={`${inputClass} min-h-[80px]`}
                placeholder={field.placeholder}
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={!!form[field.key]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.checked })
                  }
                  className="h-4 w-4 rounded border accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  {field.placeholder || "Yes"}
                </span>
              </div>
            ) : field.type === "month_year" ? (
              <MonthYearInput
                value={form[field.key] || ""}
                onChange={(val) => setForm({ ...form, [field.key]: val })}
                disabled={field.key === "end_date" && !!form["is_current"]}
                className={inputClass}
              />
            ) : field.type === "select" ? (
              <select
                required={field.required}
                value={form[field.key] || ""}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className={inputClass}
              >
                <option value="" disabled>
                  {field.placeholder || "Select an option"}
                </option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "multi_select" ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {field.options?.map((opt) => {
                  const isChecked = (form[field.key] || []).includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted/50 border bg-background"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border accent-primary"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentValues = form[field.key] || [];
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              [field.key]: [...currentValues, opt.value],
                            });
                          } else {
                            setForm({
                              ...form,
                              [field.key]: currentValues.filter(
                                (v: string) => v !== opt.value,
                              ),
                            });
                          }
                        }}
                      />
                      <span className="text-xs">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            ) : field.key.includes("logo") ||
              field.key.includes("icon") ||
              field.key.includes("image") ? (
              <ImageInputWithRecent
                value={form[field.key] || ""}
                onChange={(val) => setForm({ ...form, [field.key]: val })}
                className={inputClass}
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type={field.type === "number" ? "number" : "text"}
                required={field.required}
                value={form[field.key] || ""}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className={inputClass}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderForm = (
    onSubmit: (e: React.FormEvent) => void,
    submitLabel: string,
    isEdit = false,
  ) => (
    <form
      onSubmit={onSubmit}
      className={cn(
        "space-y-4 rounded-xl border p-4",
        isEdit ? "border-primary/30 bg-primary/5" : "bg-muted/30",
      )}
    >
      {isEdit && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">Editing</h3>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-md p-1 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {hasTranslatable && <LangTabBar active={langTab} onChange={setLangTab} />}
      {renderFormFields()}
      <div className="flex justify-end gap-2">
        {isEdit && (
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium",
            isEdit
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-foreground text-background hover:bg-foreground/90",
          )}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setForm(emptyForm());
            setLangTab("default");
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus
            className={`h-4 w-4 transition-transform ${isAdding ? "rotate-45" : ""}`}
          />
          <span className="hidden sm:inline">
            {isAdding ? "Cancel" : "Add"}
          </span>
        </button>
      </div>
      {isAdding && renderForm(handleAdd, "Save")}
      {editingId && renderForm(handleSaveEdit, "Update", true)}
      <div className="space-y-2">
        {items.length === 0 && !isAdding ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
            <p className="text-sm">No items yet.</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-colors",
                editingId === item.id
                  ? "border-primary/50 bg-primary/5"
                  : "hover:bg-muted/30",
              )}
            >
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(item.id, "up")}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(item.id, "down")}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="font-medium truncate">
                  {item[displayField] || "—"}
                </h3>
                {subtitleField && (
                  <p className="text-xs text-muted-foreground truncate">
                    {item[subtitleField] || ""}
                  </p>
                )}
                {hasTranslatable && (
                  <div className="flex gap-1 mt-1">
                    {["tr", "de", "es"].map((lang) => {
                      const has = translatableFields.some(
                        (f) => item[`${f.key}_${lang}`],
                      );
                      return has ? (
                        <span
                          key={lang}
                          className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium"
                        >
                          {lang.toUpperCase()}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ──────── Social Links Tab ────────

const PLATFORM_OPTIONS = [
  "LinkedIn",
  "GitHub",
  "Instagram",
  "Resume (CV)",
  "Twitter",
  "YouTube",
  "Dribbble",
  "Other",
];

export function AdminSocialLinksTab() {
  const { handleOperationError } = useAdminError();
  const [items, setItems] = useState<CrudItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: "", url: "" });

  const fetchItems = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .order("order_index", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const maxOrder = items.reduce(
      (max, item) => Math.max(max, item.order_index ?? 0),
      -1,
    );
    const { error } = await supabase
      .from("social_links")
      .insert({ ...form, order_index: maxOrder + 1 });
    if (handleOperationError(error, "Sosyal Link Ekleme")) return;
    setForm({ platform: "", url: "" });
    setIsAdding(false);
    await fetchItems();
    toast.success("Sosyal link başarıyla eklendi");
  };

  const handleEdit = (item: CrudItem) => {
    setEditingId(item.id);
    setForm({ platform: item.platform || "", url: item.url || "" });
    setIsAdding(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingId) return;
    const { error, data } = await supabase
      .from("social_links")
      .update(form)
      .eq("id", editingId)
      .select();
    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "Sosyal Link Güncelleme",
      )
    )
      return;
    setEditingId(null);
    await fetchItems();
    toast.success("Sosyal link başarıyla güncellendi");
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Delete this link?")) return;
    const { error, data } = await supabase
      .from("social_links")
      .delete()
      .eq("id", id)
      .select();
    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "Sosyal Link Silme",
      )
    )
      return;
    if (editingId === id) setEditingId(null);
    await fetchItems();
    toast.success("Sosyal link başarıyla silindi");
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

    const { error: err1 } = await supabase
      .from("social_links")
      .update({ order_index: swapOrder })
      .eq("id", current.id);
    const { error: err2 } = await supabase
      .from("social_links")
      .update({ order_index: currentOrder })
      .eq("id", swap.id);

    if (handleOperationError(err1 || err2, "Sosyal Link Sıralama Değiştirme"))
      return;
    await fetchItems();
  };

  const renderForm = (
    onSubmit: (e: React.FormEvent) => void,
    submitLabel: string,
    isEdit = false,
  ) => (
    <form
      onSubmit={onSubmit}
      className={cn(
        "space-y-4 rounded-xl border p-4",
        isEdit ? "border-primary/30 bg-primary/5" : "bg-muted/30",
      )}
    >
      {isEdit && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">Editing</h3>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-md p-1 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Platform *
          </label>
          <select
            required
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className={inputClass}
          >
            <option value="">Select platform...</option>
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            URL *
          </label>
          <input
            required
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {isEdit && (
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium",
            isEdit
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-foreground text-background hover:bg-foreground/90",
          )}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Social Links</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setForm({ platform: "", url: "" });
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus
            className={`h-4 w-4 transition-transform ${isAdding ? "rotate-45" : ""}`}
          />
          <span className="hidden sm:inline">
            {isAdding ? "Cancel" : "Add Link"}
          </span>
        </button>
      </div>
      {isAdding && renderForm(handleAdd, "Save")}
      {editingId && renderForm(handleSaveEdit, "Update", true)}
      <div className="space-y-2">
        {items.length === 0 && !isAdding ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
            <p className="text-sm">No social links yet.</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-colors",
                editingId === item.id
                  ? "border-primary/50 bg-primary/5"
                  : "hover:bg-muted/30",
              )}
            >
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(item.id, "up")}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(item.id, "down")}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="font-medium truncate">{item.platform}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {item.url}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ──────── Layout Config Tab (order sections) ────────

export function AdminLayoutTab() {
  const { handleOperationError } = useAdminError();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const fetchSections = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("section_order")
      .select("*")
      .order("order_index", { ascending: true });

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
      setSections(
        data ? data.filter((d) => d.section_id !== "maintenance_mode") : [],
      );
      setMaintenanceMode(
        data?.some((d) => d.section_id === "maintenance_mode") || false,
      );
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
    const results = await Promise.all(
      newSections.map((sec, i) =>
        supabase!
          .from("section_order")
          .update({ order_index: i })
          .eq("section_id", sec.section_id),
      ),
    );

    const firstError = results.find((r) => r.error)?.error;
    if (handleOperationError(firstError, "Bölüm Sıralama Değiştirme")) return;

    await fetchSections();
    toast.success("Bölüm sıralaması güncellendi");
  };

  const handleToggleVisibility = async (sec: any) => {
    if (!supabase) return;

    const isHidden = sec.section_id.endsWith("_hidden");
    const baseId = sec.section_id.replace("_hidden", "");
    const newId = isHidden ? baseId : `${baseId}_hidden`;

    // Optimistic UI update
    const newSections = sections.map((s) =>
      s.section_id === sec.section_id ? { ...s, section_id: newId } : s,
    );
    setSections(newSections);

    // Update DB
    const { error, data } = await supabase
      .from("section_order")
      .update({ section_id: newId })
      .eq("section_id", sec.section_id)
      .select();

    if (error || !data || data.length === 0) {
      if (
        handleOperationError(
          error || { code: "42501", message: "Yetkisiz işlem" },
          "Bölüm Görünürlüğü Değiştirme",
        )
      )
        return;
      if (process.env.NODE_ENV === "development") {
        console.error("Error toggling visibility:", error);
      }
      await fetchSections();
    } else {
      const isHidden = newId.endsWith("_hidden");
      toast.success(isHidden ? "Bölüm gizlendi" : "Bölüm görünür yapıldı");
    }
  };

  const handleToggleMaintenanceMode = async () => {
    if (!supabase) return;
    const newState = !maintenanceMode;
    setMaintenanceMode(newState); // Optimistic UI

    if (newState) {
      const { error } = await supabase
        .from("section_order")
        .insert({ section_id: "maintenance_mode", order_index: -1 });
      if (handleOperationError(error, "Bakım Modu Etkinleştirme")) {
        setMaintenanceMode(false);
        return;
      }
      toast.success("Bakım modu etkinleştirildi");
    } else {
      const { error, data } = await supabase
        .from("section_order")
        .delete()
        .eq("section_id", "maintenance_mode")
        .select();
      if (
        handleOperationError(
          error ||
            (!data || data.length === 0
              ? { code: "42501", message: "Yetkisiz işlem" }
              : null),
          "Bakım Modu Devre Dışı Bırakma",
        )
      ) {
        setMaintenanceMode(true);
        return;
      }
      toast.success("Bakım modu devre dışı bırakıldı");
    }
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

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
              Temporarily block public access to the site while you apply
              updates. The admin panel remains accessible.
            </p>
          </div>
          <button
            onClick={handleToggleMaintenanceMode}
            className={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              maintenanceMode ? "bg-primary" : "bg-muted-foreground/30",
            )}
            role="switch"
            aria-checked={maintenanceMode}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                maintenanceMode ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>

        <h2 className="text-lg font-bold tracking-tight mb-2 pt-6 border-t mt-6">
          Portfolio Section Reordering
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Use the arrows to drag and reorder the sections exactly as you want
          them to appear natively on your public frontend logic.
        </p>
        <div className="space-y-3">
          {sections.map((sec, index) => (
            <div
              key={sec.section_id}
              className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 sm:p-4"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span
                  className={cn(
                    "font-medium lowercase capitalize",
                    sec.section_id.endsWith("_hidden")
                      ? "text-muted-foreground line-through opacity-70"
                      : "text-foreground",
                  )}
                >
                  {sec.section_id.replace("_hidden", "")}
                </span>
                {sec.section_id.endsWith("_hidden") && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                    Hidden
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(sec)}
                  className="mr-2 flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title={
                    sec.section_id.endsWith("_hidden")
                      ? "Show on public site"
                      : "Hide from public site"
                  }
                >
                  {sec.section_id.endsWith("_hidden") ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Hidden
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Visible
                    </>
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

// ──────── Contact Emails Tab ────────

export function AdminContactEmailsTab() {
  const { handleOperationError } = useAdminError();
  const [items, setItems] = useState<CrudItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [langTab, setLangTab] = useState<LangTab>("default");
  const [form, setForm] = useState({
    label: "",
    label_tr: "",
    label_de: "",
    label_es: "",
    email: "",
  });

  const fetchItems = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("contact_emails")
      .select("*")
      .order("order_index", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const maxOrder = items.reduce(
      (max, item) => Math.max(max, item.order_index ?? 0),
      -1,
    );
    const { error } = await supabase
      .from("contact_emails")
      .insert({ ...form, order_index: maxOrder + 1 });
    if (handleOperationError(error, "E-posta Ekleme")) return;
    setForm({ label: "", label_tr: "", label_de: "", label_es: "", email: "" });
    setIsAdding(false);
    setLangTab("default");
    await fetchItems();
    toast.success("E-posta adresi başarıyla eklendi");
  };

  const handleEdit = (item: CrudItem) => {
    setEditingId(item.id);
    setForm({
      label: item.label || "",
      label_tr: item.label_tr || "",
      label_de: item.label_de || "",
      label_es: item.label_es || "",
      email: item.email || "",
    });
    setIsAdding(false);
    setLangTab("default");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingId) return;
    const { error, data } = await supabase
      .from("contact_emails")
      .update(form)
      .eq("id", editingId)
      .select();
    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "E-posta Güncelleme",
      )
    )
      return;
    setEditingId(null);
    await fetchItems();
    toast.success("E-posta adresi başarıyla güncellendi");
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Delete this email?")) return;
    const { error, data } = await supabase
      .from("contact_emails")
      .delete()
      .eq("id", id)
      .select();
    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "E-posta Silme",
      )
    )
      return;
    if (editingId === id) setEditingId(null);
    await fetchItems();
    toast.success("E-posta adresi başarıyla silindi");
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

    const { error: err1 } = await supabase
      .from("contact_emails")
      .update({ order_index: swapOrder })
      .eq("id", current.id);
    const { error: err2 } = await supabase
      .from("contact_emails")
      .update({ order_index: currentOrder })
      .eq("id", swap.id);

    if (handleOperationError(err1 || err2, "E-posta Sıralama Değiştirme"))
      return;
    await fetchItems();
  };

  const renderForm = (
    onSubmit: (e: React.FormEvent) => void,
    submitLabel: string,
    isEdit = false,
  ) => (
    <form
      onSubmit={onSubmit}
      className={cn(
        "space-y-4 rounded-xl border p-4",
        isEdit ? "border-primary/30 bg-primary/5" : "bg-muted/30",
      )}
    >
      {isEdit && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">Editing</h3>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-md p-1 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <LangTabBar active={langTab} onChange={setLangTab} />

      {langTab === "default" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Label *
            </label>
            <input
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={inputClass}
              placeholder="e.g., Personal Email, School Email"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Email *
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="email@example.com"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Label ({langTab.toUpperCase()})
            </label>
            <input
              value={form[`label_${langTab}` as keyof typeof form] || ""}
              onChange={(e) =>
                setForm({ ...form, [`label_${langTab}`]: e.target.value })
              }
              className={inputClass}
              placeholder={form.label || "Translation..."}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Email address is the same across all languages.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        {isEdit && (
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium",
            isEdit
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-foreground text-background hover:bg-foreground/90",
          )}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Contact Emails</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setForm({
              label: "",
              label_tr: "",
              label_de: "",
              label_es: "",
              email: "",
            });
            setLangTab("default");
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus
            className={`h-4 w-4 transition-transform ${isAdding ? "rotate-45" : ""}`}
          />
          <span className="hidden sm:inline">
            {isAdding ? "Cancel" : "Add Email"}
          </span>
        </button>
      </div>
      {isAdding && renderForm(handleAdd, "Save")}
      {editingId && renderForm(handleSaveEdit, "Update", true)}
      <div className="space-y-2">
        {items.length === 0 && !isAdding ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
            <p className="text-sm">No contact emails yet.</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-colors",
                editingId === item.id
                  ? "border-primary/50 bg-primary/5"
                  : "hover:bg-muted/30",
              )}
            >
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(item.id, "up")}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(item.id, "down")}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="font-medium truncate">{item.label}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {item.email}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
