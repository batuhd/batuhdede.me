"use client";

import { useEffect, useState } from "react";
import { Loader2, User, Image as ImageIcon, BarChart3, Quote } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminError } from "@/context/admin-error-context";
import { toast } from "sonner";
import { ImageInputWithRecent } from "./admin-tabs";
import { AdminCard } from "./ui/admin-card";
import { AdminButton } from "./ui/admin-button";
import { AdminStickyActions } from "./ui/admin-sticky-actions";
import {
  AdminTranslationsSection,
  AdminTranslationCard,
} from "./ui/admin-translations-section";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary";

const LANGUAGES = [
  { key: "tr", label: "Türkçe" },
  { key: "de", label: "Deutsch" },
  { key: "es", label: "Español" },
];

interface AboutMeFormData {
  name: string;
  role: string;
  hero_tagline: string;
  bio: string;
  profile_photo_url: string;
  started_coding_year: string;
  projects_count: string;
  years_experience: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  quote_text: string;
  quote_author: string;
  hero_tagline_tr: string;
  hero_tagline_de: string;
  hero_tagline_es: string;
  bio_tr: string;
  bio_de: string;
  bio_es: string;
  role_tr: string;
  role_de: string;
  role_es: string;
  quote_text_tr: string;
  quote_text_de: string;
  quote_text_es: string;
  stat_1_label_tr: string;
  stat_1_label_de: string;
  stat_1_label_es: string;
  stat_2_label_tr: string;
  stat_2_label_de: string;
  stat_2_label_es: string;
  stat_3_label_tr: string;
  stat_3_label_de: string;
  stat_3_label_es: string;
  show_quote: boolean;
  show_stats: boolean;
  show_profile_photo: boolean;
}

const DEFAULT_FORM: AboutMeFormData = {
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
};

interface SectionToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function SectionToggle({ checked, onChange, label }: SectionToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted/30">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border accent-primary"
      />
      <span className="text-muted-foreground">{label}</span>
    </label>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AboutMeForm() {
  const { handleOperationError } = useAdminError();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AboutMeFormData>(DEFAULT_FORM);

  const fetchData = async () => {
    if (!supabase) return;
    const { data: rows } = await supabase
      .from("about_me")
      .select("*")
      .limit(1);
    if (rows && rows.length > 0) {
      const row = rows[0];
      setData(row);
      const f = { ...DEFAULT_FORM } as Record<string, any>;
      Object.keys(DEFAULT_FORM).forEach((k) => {
        if (
          k === "show_quote" ||
          k === "show_stats" ||
          k === "show_profile_photo"
        ) {
          f[k] = row[k] !== false;
        } else {
          f[k] = row[k]?.toString() || "";
        }
      });
      setForm(f as AboutMeFormData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateField = <K extends keyof AboutMeFormData>(
    field: K,
    value: AboutMeFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

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
      ) {
        payload[k] = !!form[k as keyof AboutMeFormData];
      } else if (numFields.includes(k)) {
        payload[k] = form[k as keyof AboutMeFormData]
          ? parseInt(form[k as keyof AboutMeFormData] as string)
          : null;
      } else {
        payload[k] = form[k as keyof AboutMeFormData] || null;
      }
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
      ) {
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("about_me").insert(payload);
      if (handleOperationError(error, "Profil Ekleme")) {
        setSaving(false);
        return;
      }
    }

    await fetchData();
    setSaving(false);
    toast.success("Profil bilgileri başarıyla kaydedildi");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Profile Card */}
      <AdminCard
        title={
          <span className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Profile
          </span>
        }
        description="Name, role, tagline, bio and profile photo."
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name">
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass}
                placeholder="Batuhan Dede"
              />
            </Field>
            <Field label="Role / Title">
              <input
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
                className={inputClass}
                placeholder="Frontend Developer"
              />
            </Field>
          </div>

          <Field label="Hero Tagline">
            <input
              value={form.hero_tagline}
              onChange={(e) => updateField("hero_tagline", e.target.value)}
              className={inputClass}
              placeholder="Focusing on the intersection of code and design..."
            />
          </Field>

          <Field label="Bio">
            <textarea
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              className={cn(inputClass, "min-h-[120px]")}
              placeholder="Write a short bio..."
            />
          </Field>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Field label="Profile Photo URL" hint="Use imgbb.com for free image hosting.">
                <ImageInputWithRecent
                  value={form.profile_photo_url || ""}
                  onChange={(val) => updateField("profile_photo_url", val)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </Field>
            </div>
            <SectionToggle
              checked={form.show_profile_photo}
              onChange={(checked) => updateField("show_profile_photo", checked)}
              label="Show profile photo on homepage"
            />
          </div>
        </div>
      </AdminCard>

      {/* Stats Card */}
      <AdminCard
        title={
          <span className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Stats
          </span>
        }
        description="Three custom stats shown in the hero section."
        action={
          <SectionToggle
            checked={form.show_stats}
            onChange={(checked) => updateField("show_stats", checked)}
            label="Show stats section"
          />
        }
      >
        <div className="space-y-4">
          {[
            { num: 1, valuePlaceholder: "2018", labelPlaceholder: "STARTED CODING" },
            { num: 2, valuePlaceholder: "3+", labelPlaceholder: "PROJECTS" },
            { num: 3, valuePlaceholder: "2+", labelPlaceholder: "YEARS EXPERIENCE" },
          ].map(({ num, valuePlaceholder, labelPlaceholder }) => (
            <div
              key={num}
              className="grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2"
            >
                <Field label={`Stat ${num} Value`}>
                <input
                  value={form[`stat_${num}_value` as keyof AboutMeFormData] as string}
                  onChange={(e) =>
                    updateField(
                      `stat_${num}_value` as keyof AboutMeFormData,
                      e.target.value,
                    )
                  }
                  className={inputClass}
                  placeholder={valuePlaceholder}
                />
              </Field>
              <Field label={`Stat ${num} Label`}>
                <input
                  value={form[`stat_${num}_label` as keyof AboutMeFormData] as string}
                  onChange={(e) =>
                    updateField(
                      `stat_${num}_label` as keyof AboutMeFormData,
                      e.target.value,
                    )
                  }
                  className={inputClass}
                  placeholder={labelPlaceholder}
                />
              </Field>
            </div>
          ))}

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Started Coding Year" hint="Optional number field.">
              <input
                value={form.started_coding_year}
                onChange={(e) =>
                  updateField("started_coding_year", e.target.value)
                }
                className={inputClass}
                placeholder="2018"
              />
            </Field>
            <Field label="Projects Count" hint="Optional number field.">
              <input
                value={form.projects_count}
                onChange={(e) => updateField("projects_count", e.target.value)}
                className={inputClass}
                placeholder="10"
              />
            </Field>
            <Field label="Years Experience" hint="Optional number field.">
              <input
                value={form.years_experience}
                onChange={(e) =>
                  updateField("years_experience", e.target.value)
                }
                className={inputClass}
                placeholder="3"
              />
            </Field>
          </div>
        </div>
      </AdminCard>

      {/* Quote Card */}
      <AdminCard
        title={
          <span className="flex items-center gap-2">
            <Quote className="h-4 w-4 text-primary" />
            Favorite Quote
          </span>
        }
        description="A quote displayed on the homepage."
        action={
          <SectionToggle
            checked={form.show_quote}
            onChange={(checked) => updateField("show_quote", checked)}
            label="Show quote section"
          />
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Quote Text">
            <input
              value={form.quote_text}
              onChange={(e) => updateField("quote_text", e.target.value)}
              className={inputClass}
              placeholder="Those who hate themselves cannot love or trust others."
            />
          </Field>
          <Field label="Quote Author">
            <input
              value={form.quote_author}
              onChange={(e) => updateField("quote_author", e.target.value)}
              className={inputClass}
              placeholder="Hideaki Anno"
            />
          </Field>
        </div>
      </AdminCard>

      {/* Translations */}
      <AdminTranslationsSection>
        {LANGUAGES.map(({ key, label }) => (
          <AdminTranslationCard key={key} language={key} label={label}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Role (${key.toUpperCase()})`}>
                <input
                  value={form[`role_${key}` as keyof AboutMeFormData] as string}
                  onChange={(e) =>
                    updateField(
                      `role_${key}` as keyof AboutMeFormData,
                      e.target.value,
                    )
                  }
                  className={inputClass}
                  placeholder={form.role || "Translation..."}
                />
              </Field>
              <Field label={`Tagline (${key.toUpperCase()})`}>
                <input
                  value={
                    form[`hero_tagline_${key}` as keyof AboutMeFormData] as string
                  }
                  onChange={(e) =>
                    updateField(
                      `hero_tagline_${key}` as keyof AboutMeFormData,
                      e.target.value,
                    )
                  }
                  className={inputClass}
                  placeholder={form.hero_tagline || "Translation..."}
                />
              </Field>
            </div>
            <Field label={`Bio (${key.toUpperCase()})`}>
              <textarea
                value={form[`bio_${key}` as keyof AboutMeFormData] as string}
                onChange={(e) =>
                  updateField(
                    `bio_${key}` as keyof AboutMeFormData,
                    e.target.value,
                  )
                }
                className={cn(inputClass, "min-h-[100px]")}
                placeholder={form.bio || "Translation..."}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Quote (${key.toUpperCase()})`}>
                <input
                  value={form[`quote_text_${key}` as keyof AboutMeFormData] as string}
                  onChange={(e) =>
                    updateField(
                      `quote_text_${key}` as keyof AboutMeFormData,
                      e.target.value,
                    )
                  }
                  className={inputClass}
                  placeholder={form.quote_text || "Translation..."}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((num) => (
                <Field key={num} label={`Stat ${num} Label (${key.toUpperCase()})`}>
                  <input
                    value={
                      form[
                        `stat_${num}_label_${key}` as keyof AboutMeFormData
                      ] as string
                    }
                    onChange={(e) =>
                      updateField(
                        `stat_${num}_label_${key}` as keyof AboutMeFormData,
                        e.target.value,
                      )
                    }
                    className={inputClass}
                    placeholder={
                      (form[`stat_${num}_label` as keyof AboutMeFormData] as string) ||
                      "Label..."
                    }
                  />
                </Field>
              ))}
            </div>
          </AdminTranslationCard>
        ))}
      </AdminTranslationsSection>

      <AdminStickyActions>
        <div className="flex-1" />
        <AdminButton type="submit" loading={saving}>
          {data ? "Update Profile" : "Save Profile"}
        </AdminButton>
      </AdminStickyActions>
    </form>
  );
}
