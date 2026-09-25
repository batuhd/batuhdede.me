"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { userConfig } from "@/config/user";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { sanitizeUrl } from "@/lib/utils";
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionBox } from "@/components/ui/section-box";
import type { Experience, RoleEntry } from "@/types";

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

function careerDuration(experiences: Experience[]): string | null {
  if (experiences.length === 0) return null;
  const starts = experiences.map((e) => parseDate(e.start_date)).filter((d): d is Date => Boolean(d));
  const ends = experiences
    .map((e) => (e.is_current ? new Date() : parseDate(e.end_date)))
    .filter((d): d is Date => Boolean(d));
  if (starts.length === 0) return null;
  const earliest = new Date(Math.min(...starts.map((d) => d.getTime())));
  const latest = ends.length > 0 ? new Date(Math.max(...ends.map((d) => d.getTime()))) : null;
  if (!latest) return null;
  return durationLabel(earliest.toISOString(), latest.toISOString(), false);
}

export function WorkCard() {
  const { t, getLocalized } = useLanguage();
  const { experiences } = useSiteData();
  const [selected, setSelected] = useState<Experience | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selected]);

  if (experiences.length === 0) return null;

  const total = careerDuration(experiences);
  const resumeHref = sanitizeUrl(userConfig.links.resume);

  return (
    <SectionBox
      title={t("home.work")}
      badge={
        total ? (
          <span className="text-[11px] font-medium text-muted-foreground">{total}</span>
        ) : undefined
      }
    >
      <div className="mt-1 space-y-3">
        {experiences.map((exp: Experience) => {
          const roleTitle = exp.roles?.[0]
            ? getLocalized(exp.roles[0] as RoleEntry, "title")
            : getLocalized(exp, "title");
          const description = exp.description
            ? getLocalized(exp, "description")
            : null;
          const duration = durationLabel(
            exp.start_date,
            exp.end_date,
            !!exp.is_current,
          );
          const endLabel =
            exp.is_current || !exp.end_date ? "Present" : formatDate(exp.end_date);
          const logo = exp.logo_url ? sanitizeUrl(exp.logo_url) : null;

          return (
            <button
              key={exp.id}
              onClick={() => setSelected(exp)}
              className="group flex w-full items-start justify-between gap-3 rounded-xl border border-transparent p-3 text-left transition-colors hover:border-border hover:bg-muted"
            >
              <div className="flex min-w-0 items-start gap-3">
                {logo ? (
                  <Image
                    src={logo}
                    alt={exp.company}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-foreground">
                    {exp.company?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">{exp.company}</p>
                  <p className="truncate text-sm text-muted-foreground">{roleTitle}</p>
                  {description && (
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-foreground">{duration}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(exp.start_date)} to {endLabel}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-brand">
                  {t("home.workDetails")}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {resumeHref && (
        <a
          href={resumeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-brand"
        >
          {t("home.downloadResume")}
          <ArrowDown className="h-4 w-4" />
        </a>
      )}

      {/* Experience Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 px-0 backdrop-blur-sm sm:items-center sm:px-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  {selected.logo_url ? (
                    <Image
                      src={sanitizeUrl(selected.logo_url) || ""}
                      alt={selected.company}
                      width={40}
                      height={40}
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-foreground">
                      {selected.company?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <h3 className="truncate text-lg font-bold text-foreground">
                    {selected.company}
                  </h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-5 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h4 className="text-xl font-bold tracking-tight text-foreground">
                    {selected.roles?.[0]
                      ? getLocalized(selected.roles[0] as RoleEntry, "title")
                      : getLocalized(selected, "title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selected.start_date)} to{" "}
                    {selected.is_current || !selected.end_date
                      ? "Present"
                      : formatDate(selected.end_date)}
                    {durationLabel(
                      selected.start_date,
                      selected.end_date,
                      !!selected.is_current,
                    )
                      ? ` · ${durationLabel(
                          selected.start_date,
                          selected.end_date,
                          !!selected.is_current,
                        )}`
                      : ""}
                  </p>
                </div>
                {selected.location && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {getLocalized(selected, "location")}
                  </p>
                )}

                <div className="mt-5 space-y-4">
                  {selected.description && (
                    <div className="space-y-3">
                      {getLocalized(selected, "description")
                        .split(/\n{2,}/)
                        .map((para, i) => (
                          <p
                            key={i}
                            className="text-sm leading-relaxed text-muted-foreground"
                          >
                            {para}
                          </p>
                        ))}
                    </div>
                  )}

                  {Array.isArray(selected.roles) && selected.roles.length > 0 && (
                    <div className="space-y-4 border-t border-border pt-4">
                      {selected.roles.map((role, idx) => {
                        const roleDuration = durationLabel(
                          role.start_date,
                          role.end_date,
                          !!role.is_current,
                        );
                        return (
                          <div key={idx}>
                            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
                              <h5 className="font-semibold text-foreground">
                                {getLocalized(role as RoleEntry, "title")}
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(role.start_date)} to{" "}
                                {role.is_current || !role.end_date
                                  ? "Present"
                                  : formatDate(role.end_date)}
                                {roleDuration ? ` · ${roleDuration}` : ""}
                              </p>
                            </div>
                            {role.description && (
                              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                {getLocalized(role as RoleEntry, "description")}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionBox>
  );
}