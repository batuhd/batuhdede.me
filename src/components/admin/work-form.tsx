"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageInputWithRecent } from "./admin-tabs";
import { AdminFormStepper } from "./ui/admin-form-stepper";
import {
  AdminTranslationsSection,
  AdminTranslationCard,
} from "./ui/admin-translations-section";

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export interface WorkFormData {
  title: string;
  description: string;
  link: string;
  github: string;
  image: string;
  tags: string;
  additional_images: string;
  linked_experience_id: string;
  linked_education_id: string;
  linked_skill_category_ids: string[];
  linked_language_id: string;
  linked_activity_id: string;
  linked_certification_id: string;
  title_tr: string;
  description_tr: string;
  title_de: string;
  description_de: string;
  title_es: string;
  description_es: string;
}

interface WorkFormProps {
  mode: "add" | "edit";
  form: WorkFormData;
  onChange: (updates: Partial<WorkFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  experiences: any[];
  educations: any[];
  skillCategories: any[];
  languages: any[];
  activities: any[];
  certifications: any[];
}

export function WorkForm({
  mode,
  form,
  onChange,
  onSubmit,
  onCancel,
  experiences,
  educations,
  skillCategories,
  languages,
  activities,
  certifications,
}: WorkFormProps) {
  const [activeStep, setActiveStep] = useState("basic");

  const updateField = <K extends keyof WorkFormData>(
    field: K,
    value: WorkFormData[K],
  ) => {
    onChange({ [field]: value } as Partial<WorkFormData>);
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
              value={(form as unknown as Record<string, string>)[`title_${lang}`]}
              onChange={(e) =>
                updateField(
                  `title_${lang}` as keyof WorkFormData,
                  e.target.value,
                )
              }
              className={inputClass}
              placeholder={form.title || "Translation..."}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Description ({lang.toUpperCase()})
            </label>
            <textarea
              value={
                (form as unknown as Record<string, string>)[
                  `description_${lang}`
                ]
              }
              onChange={(e) =>
                updateField(
                  `description_${lang}` as keyof WorkFormData,
                  e.target.value,
                )
              }
              className={`${inputClass} min-h-[80px]`}
              placeholder={form.description || "Translation..."}
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
      description: "Title, description, tags",
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
                placeholder="Project Title"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Tags (comma separated)
              </label>
              <input
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                className={inputClass}
                placeholder="React, Tailwind"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Description *
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={`${inputClass} min-h-[120px]`}
              placeholder="Brief description"
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
            <label className="text-xs font-medium text-muted-foreground flex items-baseline gap-1">
              Image URL{" "}
              <span className="text-[10px] text-muted-foreground/60 font-normal">
                (Use imgbb.com)
              </span>
            </label>
            <ImageInputWithRecent
              value={form.image}
              onChange={(val) => updateField("image", val)}
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
              onChange={(e) => updateField("additional_images", e.target.value)}
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
      description: "URLs & related items",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Live Link
              </label>
              <input
                value={form.link}
                onChange={(e) => updateField("link", e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                GitHub Link
              </label>
              <input
                value={form.github}
                onChange={(e) => updateField("github", e.target.value)}
                className={inputClass}
                placeholder="https://github.com/..."
              />
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 space-y-4">
            <p className="text-sm font-medium">Link Related Items</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors border select-none",
                          isSelected
                            ? "bg-primary/10 border-primary/50 text-primary"
                            : "bg-muted/50 hover:bg-muted border-transparent",
                        )}
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
        submitLabel={mode === "edit" ? "Update Project" : "Save Project"}
        onCancel={onCancel}
      />
    </div>
  );
}
