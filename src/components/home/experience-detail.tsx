"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { sanitizeUrl } from "@/lib/utils";
import { Tag, ArrowUpRight } from "lucide-react";
import { ExpandableText } from "@/components/ui/expandable-text";
import { SectionBox } from "@/components/ui/section-box";
import type { Experience, RoleEntry, Project, Blog } from "@/types";

function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  if (
    dateStr.toLowerCase().includes("present") ||
    dateStr.toLowerCase().includes("devam") ||
    dateStr.toLowerCase().includes("heute") ||
    dateStr.toLowerCase().includes("actual")
  ) {
    return new Date();
  }
  const parts = dateStr.trim().split(" ");
  if (parts.length === 2 && !isNaN(parseInt(parts[1]))) {
    const m = parts[0].toLowerCase().substring(0, 3);
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      oca: 0, şub: 1, nis: 3, haz: 5, tem: 6, ağu: 7,
      eyl: 8, eki: 9, kas: 10, ara: 11,
    };
    if (months[m] !== undefined) {
      return new Date(parseInt(parts[1]), months[m], 1);
    }
  }
  if (/^\d{4}$/.test(dateStr.trim())) {
    return new Date(parseInt(dateStr.trim()), 0, 1);
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  if (
    dateStr.toLowerCase().includes("present") ||
    dateStr.toLowerCase().includes("devam") ||
    dateStr.toLowerCase().includes("heute") ||
    dateStr.toLowerCase().includes("actual")
  ) {
    return "Present";
  }
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  if (/^\d{4}$/.test(dateStr.trim())) return dateStr.trim();
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function durationLabel(start: string | null, end: string | null, isCurrent: boolean): string | null {
  if (!start) return null;
  const startDate = parseDate(start);
  const endDate = isCurrent || !end ? new Date() : parseDate(end);
  if (!startDate || !endDate) return null;
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += endDate.getMonth();
  months += 1;
  if (months <= 0) return null;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  let s = "";
  if (years > 0) s += `${years} yr${years > 1 ? "s" : ""}`;
  if (rem > 0) s += (s ? " " : "") + `${rem} mo${rem > 1 ? "s" : ""}`;
  return s || null;
}

function sortRoles(roles: RoleEntry[]): RoleEntry[] {
  return [...roles].sort((a, b) => {
    const da = parseDate(a.start_date);
    const db = parseDate(b.start_date);
    if (!da || !db) return 0;
    return db.getTime() - da.getTime();
  });
}

export function ExperienceDetail() {
  const { getLocalized, t } = useLanguage();
  const { experiences, projects, blogs } = useSiteData();

  if (experiences.length === 0) return null;

  return (
    <section id="experience">
      <SectionBox title={t("home.experience")}>
        <div className="space-y-6">
          {experiences.map((exp: Experience) => {
          const roles = sortRoles(exp.roles || []);
          const allRoles: RoleEntry[] = roles.length > 0
            ? sortRoles([
                {
                  title: exp.title,
                  start_date: exp.start_date,
                  end_date: exp.end_date,
                  is_current: exp.is_current,
                  description: exp.description,
                  title_tr: exp.title_tr,
                  title_de: exp.title_de,
                  title_es: exp.title_es,
                  description_tr: exp.description_tr,
                  description_de: exp.description_de,
                  description_es: exp.description_es,
                } as RoleEntry,
                ...roles,
              ])
            : [];
          const duration = durationLabel(exp.start_date, exp.end_date, !!exp.is_current);
          const endLabel = exp.is_current || !exp.end_date ? "Present" : formatDate(exp.end_date);
          const logo = exp.logo_url ? sanitizeUrl(exp.logo_url) : null;

          const relatedProjects = projects.filter(
            (p: Project) => p.linked_experience_id === exp.id,
          );
          const relatedBlogs = blogs.filter(
            (b: Blog) => b.linked_experience_id === exp.id,
          );

          return (
            <div key={exp.id} className="rounded-2xl bg-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                {logo ? (
                  <Image
                    src={logo}
                    alt={exp.company}
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-base font-bold text-foreground">
                    {exp.company?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-[16px] font-bold text-foreground">{exp.company}</h3>
                  {exp.roles?.[0] ? (
                    <p className="text-sm text-muted-foreground">
                      {getLocalized(exp.roles[0] as RoleEntry, "title")}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">{getLocalized(exp, "title")}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(exp.start_date)} - {endLabel}
                    {duration ? ` · ${duration}` : ""}
                    {getLocalized(exp, "location") ? ` · ${getLocalized(exp, "location")}` : ""}
                  </p>
                </div>
              </div>

              {exp.description && (
                <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <ExpandableText text={getLocalized(exp, "description")} />
                </div>
              )}

              {allRoles.length > 0 && (
                <div className="mt-4 space-y-4 border-l border-[#333] pl-5">
                  {allRoles.map((role, idx) => {
                    const roleDuration = durationLabel(
                      role.start_date,
                      role.end_date,
                      !!role.is_current,
                    );
                    return (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[24px] top-1.5 h-2 w-2 rounded-full bg-white/40" />
                        <h4 className="text-sm font-semibold text-foreground">
                          {getLocalized(role, "title")}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(role.start_date)} -{" "}
                          {role.is_current || !role.end_date ? "Present" : formatDate(role.end_date)}
                          {roleDuration ? ` · ${roleDuration}` : ""}
                        </p>
                        {role.description && (
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {getLocalized(role, "description")}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {(() => {
                const items: { href: string; label: string }[] = [
                  ...relatedProjects.map((p) => ({
                    href: `/works?project=${p.id}`,
                    label: String(p.title),
                  })),
                  ...relatedBlogs.map((b) => ({
                    href: `/blog?post=${b.id}`,
                    label: String(b.title),
                  })),
                ];
                if (items.length === 0) return null;
                return (
                  <div className="mt-4 space-y-2.5 border-t border-[#2a2a2a] pt-4">
                    {items.map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        className="group flex items-center gap-2.5 text-xs"
                      >
                        <Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-brand transition-colors group-hover:underline">
                          {item.label}
                        </span>
                        <ArrowUpRight className="h-3 w-3 shrink-0 text-brand opacity-70" />
                      </Link>
                    ))}
                  </div>
                );
              })()}
            </div>
          );
        })}
        </div>
      </SectionBox>
    </section>
  );
}