"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { ExternalLink, FolderKanban, PenTool, X } from "lucide-react";
import { ExpandableText } from "@/components/ui/expandable-text";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

function parseDate(dateStr: string | null): Date | null {
  if (!dateStr || dateStr.toLowerCase().includes("present") || dateStr.toLowerCase().includes("devam") || dateStr.toLowerCase().includes("heute") || dateStr.toLowerCase().includes("actual")) {
    return new Date();
  }
  
  // Custom parsing for localized inputs to avoid Safari/Firefox Date.parse() bugs
  const monthsTr: Record<string, number> = { "oca":0, "şub":1, "mar":2, "nis":3, "may":4, "haz":5, "tem":6, "ağu":7, "eyl":8, "eki":9, "kas":10, "ara":11 };
  const monthsEn: Record<string, number> = { "jan":0, "feb":1, "mar":2, "apr":3, "may":4, "jun":5, "jul":6, "aug":7, "sep":8, "oct":9, "nov":10, "dec":11 };
  
  const parts = dateStr.trim().split(" ");
  if (parts.length === 2) {
    const m = parts[0].toLowerCase().substring(0,3);
    const yr = parseInt(parts[1]);
    if (monthsTr[m] !== undefined && !isNaN(yr)) return new Date(yr, monthsTr[m], 1);
    if (monthsEn[m] !== undefined && !isNaN(yr)) return new Date(yr, monthsEn[m], 1);
  }

  const yearMatch = dateStr.match(/^\d{4}$/);
  if (yearMatch) {
    return new Date(parseInt(dateStr.trim()), 0, 1);
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;
  return null;
}

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return "";
  if (dateStr.toLowerCase().includes("present") || dateStr.toLowerCase().includes("devam") || dateStr.toLowerCase().includes("heute") || dateStr.toLowerCase().includes("actual")) {
    return locale === "tr" ? "Devam ediyor" : locale === "de" ? "Heute" : locale === "es" ? "Actual" : "Present";
  }
  const d = parseDate(dateStr);
  if (!d) return dateStr;

  const parts = dateStr.split(" ");
  if (parts.length === 1 && parts[0].length === 4) return parts[0]; // just year

  try {
    const formatted = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(d);
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch (e) {
    return dateStr;
  }
}

function calculateDuration(start: string | null, end: string | null, isCurrent: boolean, locale: string) {
  if (!start) return null;
  const startDate = parseDate(start);
  const endDateStr = end || (isCurrent ? "Present" : "");
  const endDate = endDateStr ? parseDate(endDateStr) : null;

  if (!startDate || !endDate) return null;

  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += endDate.getMonth();
  months += 1;

  if (months <= 0) return null;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (locale === "tr") {
    let s = "";
    if (years > 0) s += `${years} yıl`;
    if (remainingMonths > 0) s += (s ? " " : "") + `${remainingMonths} ay`;
    return s || null;
  }
  if (locale === "de") {
    let s = "";
    if (years > 0) s += `${years} Jahr${years > 1 ? "e" : ""}`;
    if (remainingMonths > 0) s += (s ? " " : "") + `${remainingMonths} Monat${remainingMonths > 1 ? "e" : ""}`;
    return s || null;
  }
  if (locale === "es") {
    let s = "";
    if (years > 0) s += `${years} año${years > 1 ? "s" : ""}`;
    if (remainingMonths > 0) s += (s ? " " : "") + `${remainingMonths} mes${remainingMonths > 1 ? "es" : ""}`;
    return s || null;
  }
  let s = "";
  if (years > 0) s += `${years} yr${years > 1 ? "s" : ""}`;
  if (remainingMonths > 0) s += (s ? " " : "") + `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`;
  return s || null;
}

export function Experience() {
  const { locale, getLocalized, t } = useLanguage();
  const { experiences, projects, blogs } = useSiteData();

  if (experiences.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold tracking-widest text-primary uppercase ml-3">{t("home.experience")}</h2>
      <div className="relative border-l border-primary/20 ml-3 sm:ml-4 space-y-8 py-2">
        {experiences.map((exp: any) => (
          <div key={exp.id} className="relative pl-6 sm:pl-8 group">
            <span className="absolute -left-[5.5px] top-[36px] sm:top-[44px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-4 ring-background transition-colors group-hover:bg-primary/20" />
            <div className="rounded-2xl border bg-card/40 p-4 sm:p-5 transition-colors hover:bg-accent/40">
              <div className="flex gap-4">
                {exp.logo_url ? (
                  <img src={exp.logo_url} alt={exp.company} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain flex-shrink-0" />
                ) : (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border bg-background/50 flex flex-shrink-0 items-center justify-center">
                    <span className="text-sm font-semibold text-muted-foreground">{exp.company?.[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-semibold text-base">{getLocalized(exp, "title")}</h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>{formatDate(exp.start_date, locale)}{exp.end_date || exp.is_current ? ` - ${formatDate(exp.end_date || "Present", locale)}` : ""}</span>
                    {calculateDuration(exp.start_date, exp.end_date, exp.is_current, locale) && (
                      <>
                        <span>·</span>
                        <span>{calculateDuration(exp.start_date, exp.end_date, exp.is_current, locale)}</span>
                      </>
                    )}
                  </p>
                  {exp.description && (
                    <div className="pt-3 text-sm text-muted-foreground leading-relaxed">
                      <ExpandableText text={getLocalized(exp, "description")} />
                    </div>
                  )}
                  
                  {(() => {
                    const relatedProjects = projects.filter(p => p.linked_experience_id === exp.id);
                    const relatedBlogs = blogs.filter(b => b.linked_experience_id === exp.id);
                    if (relatedProjects.length === 0 && relatedBlogs.length === 0) return null;
                    
                    return (
                      <div className="pt-4 mt-4 border-t border-border/50 flex flex-wrap gap-2">
                        {relatedProjects.map(p => (
                          <Link key={p.id} href={`/works?project=${p.id}`} className="inline-flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70 transition-colors">
                            <FolderKanban className="h-3 w-3 opacity-70" />
                            <span>{getLocalized(p, "title")}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </Link>
                        ))}
                        {relatedBlogs.map(b => (
                          <Link key={b.id} href={`/blog?post=${b.id}`} className="inline-flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70 transition-colors">
                            <PenTool className="h-3 w-3 opacity-70" />
                            <span>{getLocalized(b, "title")}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </Link>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  const { locale, getLocalized, t } = useLanguage();
  const { educations, projects, blogs } = useSiteData();

  if (educations.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold tracking-widest text-primary uppercase ml-3">{t("home.education")}</h2>
      <div className="relative border-l border-primary/20 ml-3 sm:ml-4 space-y-8 py-2">
        {educations.map((edu: any) => (
          <div key={edu.id} className="relative pl-6 sm:pl-8 group">
            <span className="absolute -left-[5.5px] top-[36px] sm:top-[44px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-4 ring-background transition-colors group-hover:bg-primary/20" />
            <div className="rounded-2xl border bg-card/40 p-4 sm:p-5 transition-colors hover:bg-accent/40">
              <div className="flex gap-4">
                {edu.logo_url ? (
                  <img src={edu.logo_url} alt={edu.university} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain flex-shrink-0" />
                ) : (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border bg-background/50 flex flex-shrink-0 items-center justify-center">
                    <span className="text-sm font-semibold text-muted-foreground">{edu.university?.[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-semibold text-base">{getLocalized(edu, "university")}</h3>
                  {(edu.degree || edu.major || edu.gpa) && (
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <p className="text-sm font-medium text-muted-foreground">
                        {getLocalized(edu, "degree")}{getLocalized(edu, "degree") && getLocalized(edu, "major") ? ` - ` : ""}{getLocalized(edu, "major")}
                      </p>
                      {edu.gpa && (
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary ring-1 ring-inset ring-primary/20 uppercase">
                          {locale === "tr" ? "GANO" : "GPA"}: {edu.gpa}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground/80 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>
                      {formatDate(edu.start_date, locale)}{edu.end_date || edu.is_current ? ` - ${formatDate(edu.end_date || "Present", locale)}` : ""}
                      {getLocalized(edu, "location") ? ` · ${getLocalized(edu, "location")}` : ""}
                    </span>
                    {calculateDuration(edu.start_date, edu.end_date, !!edu.is_current, locale) && (
                      <>
                        <span>·</span>
                        <span>{calculateDuration(edu.start_date, edu.end_date, !!edu.is_current, locale)}</span>
                      </>
                    )}
                  </p>
                  
                  {(() => {
                    const relatedProjects = projects.filter(p => p.linked_education_id === edu.id);
                    const relatedBlogs = blogs.filter(b => b.linked_education_id === edu.id);
                    if (relatedProjects.length === 0 && relatedBlogs.length === 0) return null;
                    
                    return (
                      <div className="pt-4 mt-4 border-t border-border/50 flex flex-wrap gap-2">
                        {relatedProjects.map(p => (
                          <Link key={p.id} href={`/works?project=${p.id}`} className="inline-flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70 transition-colors">
                            <FolderKanban className="h-3 w-3 opacity-70" />
                            <span>{getLocalized(p, "title")}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </Link>
                        ))}
                        {relatedBlogs.map(b => (
                          <Link key={b.id} href={`/blog?post=${b.id}`} className="inline-flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70 transition-colors">
                            <PenTool className="h-3 w-3 opacity-70" />
                            <span>{getLocalized(b, "title")}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </Link>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Languages() {
  const { locale, getLocalized, t } = useLanguage();
  const { languages, projects, blogs } = useSiteData();

  if (languages.length === 0) return null;

  const getLanguageFlag = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("turkish") || lower.includes("türkçe")) return "🇹🇷";
    if (lower.includes("english") || lower.includes("ingilizce") || lower.includes("i̇ngilizce")) return "🇬🇧";
    if (lower.includes("german") || lower.includes("almanca")) return "🇩🇪";
    if (lower.includes("spanish") || lower.includes("ispanyolca") || lower.includes("i̇spanyolca")) return "🇪🇸";
    if (lower.includes("french") || lower.includes("fransızca")) return "🇫🇷";
    if (lower.includes("italian") || lower.includes("italyanca") || lower.includes("i̇talyanca")) return "🇮🇹";
    if (lower.includes("russian") || lower.includes("rusça")) return "🇷🇺";
    if (lower.includes("arabic") || lower.includes("arapça")) return "🇸🇦";
    if (lower.includes("japanese") || lower.includes("japonca")) return "🇯🇵";
    if (lower.includes("chinese") || lower.includes("çince")) return "🇨🇳";
    if (lower.includes("korean") || lower.includes("korece")) return "🇰🇷";
    if (lower.includes("dutch") || lower.includes("felemenkçe")) return "🇳🇱";
    if (lower.includes("portuguese") || lower.includes("portekizce")) return "🇵🇹";
    return null;
  };

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold tracking-widest text-primary uppercase ml-3">{t("home.languages")}</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3 ml-3">
        {languages.map((lang: any) => {
          const flag = getLanguageFlag(lang.name);
          return (
            <span
              key={lang.id}
              className="group flex items-center gap-2 rounded-xl border bg-card/40 px-3 py-1.5 sm:px-4 sm:py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {flag && <span className="text-base sm:text-lg leading-none">{flag}</span>}
              <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-accent-foreground">{getLocalized(lang, "name")}</span>
              {lang.level && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30 mx-0.5" />
                  <span className="text-xs sm:text-sm group-hover:text-accent-foreground/80 transition-colors">
                    {t(`level.${lang.level.toLowerCase()}`) !== `level.${lang.level.toLowerCase()}` ? t(`level.${lang.level.toLowerCase()}`) : lang.level}
                  </span>
                </>
              )}
              {(() => {
                const relatedProjects = projects.filter((p: any) => p.linked_language_id === lang.id);
                const relatedBlogs = blogs.filter((b: any) => b.linked_language_id === lang.id);
                if (relatedProjects.length === 0 && relatedBlogs.length === 0) return null;
                
                return (
                  <div className="w-full mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-2">
                    {relatedProjects.map((p: any) => (
                      <Link key={p.id} href={`/works?project=${p.id}`} className="inline-flex items-center gap-1.5 rounded-[4px] bg-background/50 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground hover:bg-background/80 hover:text-foreground transition-colors group/link border shadow-sm">
                        <FolderKanban className="h-3 w-3 opacity-70" />
                        <span>{getLocalized(p, "title")}</span>
                        <ExternalLink className="h-2 w-2 opacity-0 group-hover/link:opacity-50 -ml-0.5" />
                      </Link>
                    ))}
                    {relatedBlogs.map((b: any) => (
                      <Link key={b.id} href={`/blog?post=${b.id}`} className="inline-flex items-center gap-1.5 rounded-[4px] bg-background/50 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground hover:bg-background/80 hover:text-foreground transition-colors group/link border shadow-sm">
                        <PenTool className="h-3 w-3 opacity-70" />
                        <span>{getLocalized(b, "title")}</span>
                        <ExternalLink className="h-2 w-2 opacity-0 group-hover/link:opacity-50 -ml-0.5" />
                      </Link>
                    ))}
                  </div>
                );
              })()}
            </span>
          );
        })}
      </div>
    </section>
  );
}

export function Activities() {
  const { locale, getLocalized, t } = useLanguage();
  const { activities, projects, blogs } = useSiteData();

  if (activities.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold tracking-widest text-primary uppercase ml-3">{t("home.activities")}</h2>
      <div className="relative border-l border-primary/20 ml-3 sm:ml-4 space-y-8 py-2">
        {activities.map((act: any) => (
          <div key={act.id} className="relative pl-6 sm:pl-8 group">
            <span className="absolute -left-[5.5px] top-[36px] sm:top-[44px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-4 ring-background transition-colors group-hover:bg-primary/20" />
            <div className="rounded-2xl border bg-card/40 p-4 sm:p-5 transition-colors hover:bg-accent/40">
              <div className="flex gap-4">
                {act.logo_url ? (
                  <img src={act.logo_url} alt={act.organization} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain flex-shrink-0" />
                ) : (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border bg-background/50 flex flex-shrink-0 items-center justify-center">
                    <span className="text-sm font-semibold text-muted-foreground">{act.organization?.[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div className="space-y-1 min-w-0 flex-1 break-words">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base min-w-0 break-words pr-2">{getLocalized(act, "organization")}</h3>
                    {act.link_url && (
                      <a href={act.link_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{getLocalized(act, "role")}</p>
                  <p className="text-xs text-muted-foreground/80 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>{formatDate(act.start_date, locale)}{act.end_date ? ` - ${formatDate(act.end_date, locale)}` : ""}</span>
                    {calculateDuration(act.start_date, act.end_date, false, locale) && (
                      <>
                        <span>·</span>
                        <span>{calculateDuration(act.start_date, act.end_date, false, locale)}</span>
                      </>
                    )}
                  </p>
                  {act.description && (
                    <div className="pt-3 text-sm text-muted-foreground leading-relaxed">
                      <ExpandableText text={getLocalized(act, "description")} />
                    </div>
                  )}
                  {(() => {
                    const relatedProjects = projects.filter((p: any) => p.linked_activity_id === act.id);
                    const relatedBlogs = blogs.filter((b: any) => b.linked_activity_id === act.id);
                    if (relatedProjects.length === 0 && relatedBlogs.length === 0) return null;
                    
                    return (
                      <div className="pt-4 mt-4 border-t border-border/50 flex flex-wrap gap-2">
                        {relatedProjects.map((p: any) => (
                          <Link key={p.id} href={`/works?project=${p.id}`} className="inline-flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70 transition-colors">
                            <FolderKanban className="h-3 w-3 opacity-70" />
                            <span>{getLocalized(p, "title")}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </Link>
                        ))}
                        {relatedBlogs.map((b: any) => (
                          <Link key={b.id} href={`/blog?post=${b.id}`} className="inline-flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70 transition-colors">
                            <PenTool className="h-3 w-3 opacity-70" />
                            <span>{getLocalized(b, "title")}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                          </Link>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Certifications() {
  const { getLocalized, t } = useLanguage();
  const { certifications, certificationSkills, skillCategories, projects, blogs } = useSiteData();
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  if (certifications.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">{t("home.certifications")}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {certifications.map((cert: any) => {
          // Find skills for this cert
          const relatedSkillIds = certificationSkills?.filter(cs => cs.certification_id === cert.id).map(cs => cs.skill_category_id) || [];
          const relatedSkills = skillCategories?.filter(sc => relatedSkillIds.includes(sc.id)) || [];

          return (
            <div 
              key={cert.id} 
              onClick={() => setSelectedCert(cert)}
              className="flex flex-col justify-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/30 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {cert.icon_url && (
                  <img src={cert.icon_url} alt={cert.name} className="h-8 w-8 rounded object-cover flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium min-w-0 break-words pr-2">{getLocalized(cert, "name")}</h3>
                    {cert.link_url && (
                      <a href={cert.link_url} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-1">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{cert.issuer}{cert.issue_date ? ` · ${cert.issue_date}` : ""}</p>
                </div>
              </div>
              
              {relatedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 pl-11">
                  {relatedSkills.map(skill => (
                    <span key={skill.id} className="inline-flex rounded-md bg-secondary/50 px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                      {getLocalized(skill, "title")}
                    </span>
                  ))}
                </div>
              )}

              {(() => {
                const relatedProjects = projects.filter((p: any) => p.linked_certification_id === cert.id);
                const relatedBlogs = blogs.filter((b: any) => b.linked_certification_id === cert.id);
                if (relatedProjects.length === 0 && relatedBlogs.length === 0) return null;
                
                return (
                  <div className="mt-3 border-t border-border/50 pt-3 flex flex-wrap gap-2 pl-11">
                    {relatedProjects.map((p: any) => (
                      <Link key={p.id} href={`/works?project=${p.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-md bg-background/50 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground hover:bg-background/80 hover:text-foreground transition-colors group/link border">
                        <FolderKanban className="h-2.5 w-2.5 opacity-70" />
                        <span>{getLocalized(p, "title")}</span>
                      </Link>
                    ))}
                    {relatedBlogs.map((b: any) => (
                      <Link key={b.id} href={`/blog?post=${b.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-md bg-background/50 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground hover:bg-background/80 hover:text-foreground transition-colors group/link border">
                        <PenTool className="h-2.5 w-2.5 opacity-70" />
                        <span>{getLocalized(b, "title")}</span>
                      </Link>
                    ))}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-background/80 px-0 sm:px-6 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] sm:max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-sm font-medium text-muted-foreground">{t("cert.details")}</h2>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
                <div className="flex items-center gap-4">
                  {selectedCert.icon_url && (
                    <img src={selectedCert.icon_url} alt={selectedCert.name} className="h-16 w-16 rounded-xl object-cover bg-muted/50 p-2 border" />
                  )}
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{getLocalized(selectedCert, "name")}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCert.issuer} {selectedCert.issue_date && `· ${selectedCert.issue_date}`}</p>
                    {selectedCert.link_url && (
                      <a href={selectedCert.link_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2">
                        {t("cert.viewCredential")} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {(() => {
                  const relatedSkillIds = certificationSkills?.filter((cs: any) => cs.certification_id === selectedCert.id).map((cs: any) => cs.skill_category_id) || [];
                  const relatedSkills = skillCategories?.filter((sc: any) => relatedSkillIds.includes(sc.id)) || [];
                  if (relatedSkills.length > 0) {
                    return (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">{t("cert.skillsEvaluated")}</h3>
                        <div className="flex flex-wrap gap-2">
                          {relatedSkills.map((skill: any) => (
                            <span key={skill.id} className="inline-flex rounded-md bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground shadow-sm">
                              {getLocalized(skill, "title")}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {(() => {
                  const relatedProjects = projects.filter((p: any) => p.linked_certification_id === selectedCert.id);
                  const relatedBlogs = blogs.filter((b: any) => b.linked_certification_id === selectedCert.id);
                  if (relatedProjects.length === 0 && relatedBlogs.length === 0) return null;
                  
                  return (
                    <div className="pt-6 mt-6 border-t flex flex-col gap-4">
                      {relatedProjects.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><FolderKanban className="h-4 w-4" /> {t("cert.relatedProjects")}</h3>
                          <div className="flex flex-col gap-2">
                            {relatedProjects.map((p: any) => (
                              <Link key={p.id} href={`/works?project=${p.id}`} className="group flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                <span className="text-sm font-medium group-hover:text-primary transition-colors">{getLocalized(p, "title")}</span>
                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {relatedBlogs.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><PenTool className="h-4 w-4" /> {t("cert.relatedArticles")}</h3>
                          <div className="flex flex-col gap-2">
                            {relatedBlogs.map((b: any) => (
                              <Link key={b.id} href={`/blog?post=${b.id}`} className="group flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                <span className="text-sm font-medium group-hover:text-primary transition-colors">{getLocalized(b, "title")}</span>
                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
