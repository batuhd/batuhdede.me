"use client";

import { useState } from "react";
import { ImageInputWithRecent } from "./admin-tabs";
import { MarkdownEditor } from "./markdown-editor";
import { AdminFormStepper } from "./ui/admin-form-stepper";
import {
  AdminTranslationsSection,
  AdminTranslationCard,
} from "./ui/admin-translations-section";

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time: string;
  image_url: string;
  is_published: boolean;
  additional_images: string;
  linked_project_id: string;
  linked_experience_id: string;
  linked_education_id: string;
  linked_skill_category_ids: string[];
  linked_language_id: string;
  linked_activity_id: string;
  linked_certification_id: string;
  title_tr: string;
  excerpt_tr: string;
  content_tr: string;
  title_de: string;
  excerpt_de: string;
  content_de: string;
  title_es: string;
  excerpt_es: string;
  content_es: string;
}

interface BlogFormProps {
  mode: "add" | "edit";
  form: BlogFormData;
  onChange: (updates: Partial<BlogFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  works: any[];
  experiences: any[];
  educations: any[];
  skillCategories: any[];
  languages: any[];
  activities: any[];
  certifications: any[];
}

export function BlogForm({
  mode,
  form,
  onChange,
  onSubmit,
  onCancel,
  works,
  experiences,
  educations,
  skillCategories,
  languages,
  activities,
  certifications,
}: BlogFormProps) {
  const [activeStep, setActiveStep] = useState("basic");

  const updateField = <K extends keyof BlogFormData>(
    field: K,
    value: BlogFormData[K],
  ) => {
    onChange({ [field]: value } as Partial<BlogFormData>);
  };

  const translationStep = (
    <AdminTranslationsSection>
      {[
        { lang: "tr", label: "Türkçe" },
        { lang: "de", label: "Deutsch" },
        { lang: "es", label: "Español" },
      ].map(({ lang, label }) => (
        <AdminTranslationCard key={lang} language={lang} label={label}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Title ({lang.toUpperCase()})
            </label>
            <input
              value={
                (form as unknown as Record<string, string>)[`title_${lang}`]
              }
              onChange={(e) =>
                updateField(
                  `title_${lang}` as keyof BlogFormData,
                  e.target.value,
                )
              }
              className={inputClass}
              placeholder={form.title || "Translation..."}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Excerpt ({lang.toUpperCase()})
            </label>
            <input
              value={
                (form as unknown as Record<string, string>)[`excerpt_${lang}`]
              }
              onChange={(e) =>
                updateField(
                  `excerpt_${lang}` as keyof BlogFormData,
                  e.target.value,
                )
              }
              className={inputClass}
              placeholder={form.excerpt || "Translation..."}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Content ({lang.toUpperCase()})
            </label>
            <MarkdownEditor
              value={
                (form as unknown as Record<string, string>)[
                  `content_${lang}`
                ] || ""
              }
              onChange={(value) =>
                updateField(`content_${lang}` as keyof BlogFormData, value)
              }
              placeholder={
                form.content || "Çeviriyi buraya yazın... Markdown kullanabilirsiniz."
              }
              minHeight="200px"
            />
          </div>
        </AdminTranslationCard>
      ))}
    </AdminTranslationsSection>
  );

  const steps = [
    {
      key: "basic",
      label: "Basic Info",
      description: "Title, excerpt, status",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={inputClass}
                placeholder="Post Title"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Read Time
              </label>
              <input
                value={form.read_time}
                onChange={(e) => updateField("read_time", e.target.value)}
                className={inputClass}
                placeholder="5 min read"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Excerpt *
            </label>
            <input
              required
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              className={inputClass}
              placeholder="Short summary"
            />
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <input
              type="checkbox"
              id={`is_published_${mode}`}
              checked={form.is_published}
              onChange={(e) =>
                updateField("is_published", e.target.checked)
              }
              className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
            />
            <label
              htmlFor={`is_published_${mode}`}
              className="text-sm font-medium cursor-pointer"
            >
              Publish immediately
            </label>
            <span className="text-xs text-muted-foreground">
              {form.is_published
                ? "This post will be visible to everyone"
                : "This post will be saved as draft"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      label: "Content",
      description: "Main article body",
      content: (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Content * (Markdown supported)
            </label>
            <MarkdownEditor
              value={form.content}
              onChange={(value) => updateField("content", value)}
              placeholder="Write your blog post in Markdown..."
              minHeight="300px"
            />
          </div>
        </div>
      ),
    },
    {
      key: "media",
      label: "Media",
      description: "Cover image & gallery",
      content: (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Image URL
            </label>
            <ImageInputWithRecent
              value={form.image_url}
              onChange={(val) => updateField("image_url", val)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Additional Images (comma separated URLs)
            </label>
            <textarea
              value={form.additional_images}
              onChange={(e) =>
                updateField("additional_images", e.target.value)
              }
              className={`${inputClass} min-h-[100px]`}
              placeholder="https://image1.com, https://image2.com"
            />
          </div>
        </div>
      ),
    },
    {
      key: "links",
      label: "Links",
      description: "Related items",
      optional: true,
      content: (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-4 space-y-4">
            <p className="text-sm font-medium">Link Related Items</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Link Project
                </label>
                <select
                  value={form.linked_project_id}
                  onChange={(e) =>
                    updateField("linked_project_id", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">(None)</option>
                  {works.map((w: any) => (
                    <option key={w.id} value={w.id}>
                      {w.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Link Experience
                </label>
                <select
                  value={form.linked_experience_id}
                  onChange={(e) =>
                    updateField("linked_experience_id", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">(None)</option>
                  {experiences.map((e: any) => (
                    <option key={e.id} value={e.id}>
                      {e.title} at {e.company}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Link Education
                </label>
                <select
                  value={form.linked_education_id}
                  onChange={(e) =>
                    updateField("linked_education_id", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">(None)</option>
                  {educations.map((e: any) => (
                    <option key={e.id} value={e.id}>
                      {e.university}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-medium text-muted-foreground">
                  Link Skill Categories
                </label>
                <div className="flex flex-wrap gap-2 p-2 rounded-md border bg-background/50 max-h-40 overflow-y-auto">
                  {skillCategories.map((s: any) => {
                    const isSelected =
                      form.linked_skill_category_ids?.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors border select-none ${
                          isSelected
                            ? "bg-primary/10 border-primary/50 text-primary"
                            : "bg-muted/50 hover:bg-muted border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isSelected || false}
                          onChange={(e) => {
                            const ids = form.linked_skill_category_ids || [];
                            updateField(
                              "linked_skill_category_ids",
                              e.target.checked
                                ? [...ids, s.id]
                                : ids.filter((id) => id !== s.id),
                            );
                          }}
                        />
                        {s.title}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Link Language
                </label>
                <select
                  value={form.linked_language_id}
                  onChange={(e) =>
                    updateField("linked_language_id", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">(None)</option>
                  {languages.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Link Activity
                </label>
                <select
                  value={form.linked_activity_id}
                  onChange={(e) =>
                    updateField("linked_activity_id", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">(None)</option>
                  {activities.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.organization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Link Certification
                </label>
                <select
                  value={form.linked_certification_id}
                  onChange={(e) =>
                    updateField("linked_certification_id", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">(None)</option>
                  {certifications.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "translations",
      label: "Translations",
      description: "TR/DE/ES content",
      optional: true,
      content: translationStep,
    },
  ];

  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <AdminFormStepper
        steps={steps}
        activeStep={activeStep}
        onStepChange={setActiveStep}
        onSubmit={onSubmit}
        submitLabel={mode === "edit" ? "Update Post" : "Save Post"}
        onCancel={onCancel}
      />
    </div>
  );
}
