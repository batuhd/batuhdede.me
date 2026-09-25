"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { ExternalLink, FolderKanban, PenTool, X, ArrowUpRight, Tag } from "lucide-react";
import Image from "next/image";
import { ExpandableText } from "@/components/ui/expandable-text";
import { SectionBox } from "@/components/ui/section-box";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type {
  Project,
  Blog,
  Experience,
  Education,
  Activity,
  RoleEntry,
  Certification,
  CertificationSkill,
  SkillCategory,
  Language,
} from "@/types";

function parseDate(dateStr: string | null, today?: Date | null): Date | null {
  if (
    !dateStr ||
    dateStr.toLowerCase().includes("present") ||
    dateStr.toLowerCase().includes("devam") ||
    dateStr.toLowerCase().includes("heute") ||
    dateStr.toLowerCase().includes("actual")
  ) {
    return today ?? new Date();
  }

  // Custom parsing for localized inputs to avoid Safari/Firefox Date.parse() bugs
  const monthsTr: Record<string, number> = {
    oca: 0,
    şub: 1,
    mar: 2,
    nis: 3,
    may: 4,
    haz: 5,
    tem: 6,
    ağu: 7,
    eyl: 8,
    eki: 9,
    kas: 10,
    ara: 11,
  };
  const monthsEn: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const parts = dateStr.trim().split(" ");
  if (parts.length === 2) {
    const m = parts[0].toLowerCase().substring(0, 3);
    const yr = parseInt(parts[1]);
    if (monthsTr[m] !== undefined && !isNaN(yr))
      return new Date(yr, monthsTr[m], 1);
    if (monthsEn[m] !== undefined && !isNaN(yr))
      return new Date(yr, monthsEn[m], 1);
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
  if (
    dateStr.toLowerCase().includes("present") ||
    dateStr.toLowerCase().includes("devam") ||
    dateStr.toLowerCase().includes("heute") ||
    dateStr.toLowerCase().includes("actual")
  ) {
    return locale === "tr"
      ? "Devam ediyor"
      : locale === "de"
        ? "Heute"
        : locale === "es"
          ? "Actual"
          : "Present";
  }
  const d = parseDate(dateStr);
  if (!d) return dateStr;

  const parts = dateStr.split(" ");
  if (parts.length === 1 && parts[0].length === 4) return parts[0]; // just year

  try {
    const formatted = new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "numeric",
    }).format(d);
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return dateStr;
  }
}

function calculateDuration(
  start: string | null,
  end: string | null,
  isCurrent: boolean,
  locale: string,
  today?: Date | null,
) {
  if (!start) return null;
  const startDate = parseDate(start);
  const endDateStr = end || (isCurrent ? "Present" : "");
  const endDate = endDateStr ? parseDate(endDateStr, today) : null;

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
    if (remainingMonths > 0)
      s +=
        (s ? " " : "") +
        `${remainingMonths} Monat${remainingMonths > 1 ? "e" : ""}`;
    return s || null;
  }
  if (locale === "es") {
    let s = "";
    if (years > 0) s += `${years} año${years > 1 ? "s" : ""}`;
    if (remainingMonths > 0)
      s +=
        (s ? " " : "") +
        `${remainingMonths} mes${remainingMonths > 1 ? "es" : ""}`;
    return s || null;
  }
  let s = "";
  if (years > 0) s += `${years} yr${years > 1 ? "s" : ""}`;
  if (remainingMonths > 0)
    s +=
      (s ? " " : "") + `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`;
  return s || null;
}

function sortRolesByDate(roles: RoleEntry[], today?: Date | null): RoleEntry[] {
  return [...roles].sort((a, b) => {
    const da = parseDate(a.start_date, today);
    const db = parseDate(b.start_date, today);
    if (!da || !db) return 0;
    return db.getTime() - da.getTime();
  });
}

function getCareerDuration(
  experiences: Experience[],
  locale: string,
  today?: Date | null,
): string | null {
  if (experiences.length === 0) return null;
  const starts = experiences
    .map((exp) => parseDate(exp.start_date, today))
    .filter((d): d is Date => Boolean(d));
  const ends = experiences
    .map((exp) =>
      exp.is_current
        ? (today ?? new Date())
        : parseDate(exp.end_date, today),
    )
    .filter((d): d is Date => Boolean(d));
  if (starts.length === 0) return null;
  const earliest = new Date(Math.min(...starts.map((d) => d.getTime())));
  const latest =
    ends.length > 0
      ? new Date(Math.max(...ends.map((d) => d.getTime())))
      : null;
  if (!latest) return null;
  return calculateDuration(
    earliest.toISOString(),
    latest.toISOString(),
    false,
    locale,
    today,
  );
}

function RelatedLinks({
  projects,
  blogs,
}: {
  projects: Project[];
  blogs: Blog[];
}) {
  const items: { href: string; label: string; icon: typeof PenTool }[] = [
    ...projects.map((p: Project) => ({
      href: `/works?project=${p.id}`,
      label: String(p.title),
      icon: FolderKanban,
    })),
    ...blogs.map((b: Blog) => ({
      href: `/blog?post=${b.id}`,
      label: String(b.title),
      icon: PenTool,
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
}

function RoleLine({
  title,
  description,
  start_date,
  end_date,
  is_current,
  locale,
}: {
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  locale: string;
}) {
  const roleEnd = is_current ? "Present" : end_date;
  const roleDuration = calculateDuration(
    start_date,
    end_date,
    is_current,
    locale,
  );
  return (
    <div className="space-y-0.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">
          {formatDate(start_date, locale)}
          {roleEnd ? ` - ${formatDate(roleEnd, locale)}` : ""}
          {roleDuration ? ` · ${roleDuration}` : ""}
        </p>
      </div>
      {description && (
        <div className="pt-1 text-sm leading-relaxed text-muted-foreground">
          <ExpandableText text={description} />
        </div>
      )}
    </div>
  );
}

export function Experience() {
  const { locale, getLocalized, t } = useLanguage();
  const { experiences, projects, blogs } = useSiteData();

  if (experiences.length === 0) return null;

  const careerDuration = getCareerDuration(experiences, locale);

  return (
    <section className="space-y-6" id="experience">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {t("home.experience")}
        </h2>
        {careerDuration && (
          <span className="text-sm text-muted-foreground">{careerDuration}</span>
        )}
      </div>
      <div className="divide-y divide-border border-t border-b">
        {experiences.map((exp: Experience) => {
          const relatedProjects = projects.filter(
            (p: Project) => p.linked_experience_id === exp.id,
          );
          const relatedBlogs = blogs.filter(
            (b: Blog) => b.linked_experience_id === exp.id,
          );
          const roles = sortRolesByDate(exp.roles || []);
          const hasRoles = roles.length > 0;

          return (
            <div key={exp.id} className="py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <div className="flex items-center gap-3 min-w-0">
                  {exp.logo_url ? (
                    <Image
                      src={exp.logo_url}
                      alt={exp.company}
                      width={32}
                      height={32}
                      className="h-7 w-7 rounded-md object-contain"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                      {exp.company?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {exp.company}
                    </h3>
                    {exp.location && (
                      <p className="text-sm text-muted-foreground">
                        {exp.location}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(exp.start_date, locale)}
                  {exp.end_date || exp.is_current
                    ? ` - ${formatDate(exp.end_date || "Present", locale)}`
                    : ""}
                  {calculateDuration(
                    exp.start_date,
                    exp.end_date,
                    exp.is_current,
                    locale,
                  )
                    ? ` · ${calculateDuration(
                        exp.start_date,
                        exp.end_date,
                        exp.is_current,
                        locale,
                      )}`
                    : ""}
                </p>
              </div>

              {hasRoles ? (
                <div className="mt-3 space-y-3 border-l border-border pl-4">
                  {sortRolesByDate([
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
                  ]).map((role, idx) => (
                    <RoleLine
                      key={idx}
                      title={getLocalized(role, "title")}
                      description={getLocalized(role, "description")}
                      start_date={role.start_date}
                      end_date={role.end_date}
                      is_current={role.is_current}
                      locale={locale}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {getLocalized(exp, "title")}
                  </p>
                  {exp.description && (
                    <div className="pt-2 text-sm leading-relaxed text-muted-foreground">
                      <ExpandableText text={getLocalized(exp, "description")} />
                    </div>
                  )}
                </>
              )}

              <RelatedLinks
                projects={relatedProjects}
                blogs={relatedBlogs}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Education() {
  const { locale, getLocalized, t } = useLanguage();
  const { educations, projects, blogs } = useSiteData();

  if (educations.length === 0) return null;

  return (
    <section id="education">
      <SectionBox title={t("home.education")}>
        <div className="space-y-6">
        {educations.map((edu: Education) => {
          const relatedProjects = projects.filter(
            (p: Project) => p.linked_education_id === edu.id,
          );
          const relatedBlogs = blogs.filter(
            (b: Blog) => b.linked_education_id === edu.id,
          );
          const duration = calculateDuration(
            edu.start_date,
            edu.end_date,
            !!edu.is_current,
            locale,
          );

          return (
            <div
              key={edu.id}
              className="rounded-2xl bg-card p-5"
            >
              <div className="flex items-start gap-4">
                {edu.logo_url ? (
                  <Image
                    src={edu.logo_url}
                    alt={getLocalized(edu, "university")}
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-base font-bold text-foreground">
                    {getLocalized(edu, "university")?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-foreground">
                    {getLocalized(edu, "university")}
                  </h3>
                  {(edu.degree || edu.major) && (
                    <p className="text-sm text-muted-foreground">
                      {getLocalized(edu, "degree")}
                      {getLocalized(edu, "degree") &&
                      getLocalized(edu, "major")
                        ? " - "
                        : ""}
                      {getLocalized(edu, "major")}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(edu.start_date, locale)}
                    {edu.end_date || edu.is_current
                      ? ` - ${formatDate(edu.end_date || "Present", locale)}`
                      : ""}
                    {duration ? ` · ${duration}` : ""}
                    {getLocalized(edu, "location")
                      ? ` · ${getLocalized(edu, "location")}`
                      : ""}
                    {edu.gpa ? ` · ${locale === "tr" ? "GANO" : "GPA"}: ${edu.gpa}` : ""}
                  </p>
                </div>
              </div>
              <RelatedLinks
                projects={relatedProjects}
                blogs={relatedBlogs}
              />
            </div>
          );
        })}
        </div>
      </SectionBox>
    </section>
  );
}

export function Languages() {
  const { getLocalized, t } = useLanguage();
  const { languages } = useSiteData();

  if (languages.length === 0) return null;

  const getLanguageFlag = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("turkish") || lower.includes("türkçe")) return "🇹🇷";
    if (
      lower.includes("english") ||
      lower.includes("ingilizce") ||
      lower.includes("i̇ngilizce")
    )
      return "🇬🇧";
    if (lower.includes("german") || lower.includes("almanca")) return "🇩🇪";
    if (
      lower.includes("spanish") ||
      lower.includes("ispanyolca") ||
      lower.includes("i̇spanyolca")
    )
      return "🇪🇸";
    if (lower.includes("french") || lower.includes("fransızca")) return "🇫🇷";
    if (
      lower.includes("italian") ||
      lower.includes("italyanca") ||
      lower.includes("i̇talyanca")
    )
      return "🇮🇹";
    if (lower.includes("russian") || lower.includes("rusça")) return "🇷🇺";
    if (lower.includes("arabic") || lower.includes("arapça")) return "🇸🇦";
    if (lower.includes("japanese") || lower.includes("japonca")) return "🇯🇵";
    if (lower.includes("chinese") || lower.includes("çince")) return "🇨🇳";
    if (lower.includes("korean") || lower.includes("korece")) return "🇰🇷";
    if (lower.includes("dutch") || lower.includes("felemenkçe")) return "🇳🇱";
    if (lower.includes("portuguese") || lower.includes("portekizce"))
      return "🇵🇹";
    return null;
  };

  const getLevelLabel = (level: string | null) => {
    if (!level) return "";
    const translated = t(`level.${level.toLowerCase()}`);
    return translated !== `level.${level.toLowerCase()}` ? translated : level;
  };

  return (
    <section id="languages">
      <SectionBox title={t("home.languages")}>
        <div className="divide-y divide-[#2a2a2a]">
          {languages.map((lang: Language) => {
            const flag = getLanguageFlag(lang.name);
            return (
              <div
                key={lang.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2.5">
                  {flag && (
                    <span className="text-base leading-none">{flag}</span>
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {getLocalized(lang, "name")}
                  </span>
                </div>
                {lang.level && (
                  <span className="text-xs text-muted-foreground">
                    {getLevelLabel(lang.level)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </SectionBox>
    </section>
  );
}

export function Activities() {
  const { locale, getLocalized, t } = useLanguage();
  const { activities, projects, blogs } = useSiteData();

  if (activities.length === 0) return null;

  return (
    <section id="activities">
      <SectionBox title={t("home.activities")}>
        <div className="space-y-6">
          {activities.map((act: Activity) => {
          const relatedProjects = projects.filter(
            (p: Project) => p.linked_activity_id === act.id,
          );
          const relatedBlogs = blogs.filter(
            (b: Blog) => b.linked_activity_id === act.id,
          );
          const roles = sortRolesByDate(act.roles || []);
          const hasRoles = roles.length > 0;
          const actDuration = calculateDuration(
            act.start_date,
            act.end_date,
            !!act.is_current,
            locale,
          );

          return (
            <div key={act.id} className="rounded-2xl bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  {act.logo_url ? (
                    <Image
                      src={act.logo_url}
                      alt={act.organization}
                      width={44}
                      height={44}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-base font-bold text-foreground">
                      {act.organization?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-foreground">
                      {getLocalized(act, "organization")}
                    </h3>
                    {getLocalized(act, "role") && (
                      <p className="text-sm text-muted-foreground">
                        {getLocalized(act, "role")}
                      </p>
                    )}
                    {actDuration && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {actDuration}
                      </p>
                    )}
                  </div>
                </div>
                {act.link_url && (
                  <a
                    href={act.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={getLocalized(act, "organization")}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-brand"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              {hasRoles && (
                <div className="mt-4 space-y-4 border-l border-[#333] pl-5">
                  {sortRolesByDate([
                    {
                      title: act.role,
                      start_date: act.start_date,
                      end_date: act.end_date,
                      is_current: act.is_current,
                      description: act.description,
                      title_tr: act.role_tr,
                      title_de: act.role_de,
                      title_es: act.role_es,
                      description_tr: act.description_tr,
                      description_de: act.description_de,
                      description_es: act.description_es,
                    } as RoleEntry,
                    ...roles,
                  ]).map((role, idx) => {
                    const roleDuration = calculateDuration(
                      role.start_date,
                      role.end_date,
                      !!role.is_current,
                      locale,
                    );
                    return (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[24px] top-1.5 h-2 w-2 rounded-full bg-white/40" />
                        <h4 className="text-sm font-semibold text-foreground">
                          {getLocalized(role, "title")}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(role.start_date, locale)}
                          {role.is_current || !role.end_date
                            ? " - " + formatDate("Present", locale)
                            : ` - ${formatDate(role.end_date, locale)}`}
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

              {!hasRoles && act.description && (
                <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <ExpandableText text={getLocalized(act, "description")} />
                </div>
              )}

              <RelatedLinks
                projects={relatedProjects}
                blogs={relatedBlogs}
              />
            </div>
          );
        })}
        </div>
      </SectionBox>
    </section>
  );
}

export function Certifications({ variant = "list" }: { variant?: "list" | "marquee" | "grid" }) {
  const { getLocalized, t } = useLanguage();
  const {
    certifications,
    certificationSkills,
    skillCategories,
    projects,
    blogs,
  } = useSiteData();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [showAllCerts, setShowAllCerts] = useState(false);

  // URL'den sertifika açma (örn: /certifications?cert=uuid)
  useEffect(() => {
    const cert = new URLSearchParams(window.location.search).get("cert");
    if (!cert || certifications.length === 0) return;
    const target = certifications.find((c: Certification) => c.id === cert);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (target) setSelectedCert(target);
  }, [certifications]);

  const openCert = (cert: Certification) => {
    setSelectedCert(cert);
    window.history.pushState(null, "", `/certifications?cert=${cert.id}`);
  };

  const closeCert = () => {
    setSelectedCert(null);
    window.history.replaceState(null, "", "/");
  };

  // ESC ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedCert) {
        closeCert();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);

  if (certifications.length === 0) return null;

  const visibleCerts = showAllCerts
    ? certifications
    : certifications.slice(0, 6);

  return (
    <section id="certifications">
      {variant === "marquee" ? (
        <SectionBox
          title={t("home.certifications")}
          badge={
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {certifications.length}
            </span>
          }
          actions={
            <button
              onClick={() => setShowAllCerts(true)}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
            >
              {t("cert.viewAll")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          <div className="space-y-4 overflow-hidden">
          <div className="flex w-max gap-2.5 animate-marquee-left py-1">
            {[...certifications, ...certifications].map(
              (cert, idx) => (
                <button
                  key={`${cert.id}-1-${idx}`}
                  onClick={() => openCert(cert)}
                  className="group flex shrink-0 cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 transition-all hover:border-brand/70 hover:bg-muted"
                >
                  {cert.icon_url && (
                    <Image
                      src={cert.icon_url}
                      alt={cert.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                    {getLocalized(cert, "name")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {cert.issuer}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ),
            )}
          </div>
          <div className="flex w-max gap-2.5 animate-marquee-right py-1">
            {[...certifications, ...certifications].map(
              (cert, idx) => (
                <button
                  key={`${cert.id}-2-${idx}`}
                  onClick={() => openCert(cert)}
                  className="group flex shrink-0 cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 transition-all hover:border-brand/70 hover:bg-muted"
                >
                  {cert.icon_url && (
                    <Image
                      src={cert.icon_url}
                      alt={cert.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                    {getLocalized(cert, "name")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {cert.issuer}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ),
            )}
          </div>
        </div>
        </SectionBox>
      ) : (
        <SectionBox
          title={t("home.certifications")}
          badge={
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {certifications.length}
            </span>
          }
          actions={
            variant === "grid"
              ? certifications.length > 6
                ? (
                  <button
                    onClick={() => setShowAllCerts(true)}
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
                  >
                    {t("cert.viewAll")}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                )
                : undefined
              : certifications.length > 6
                ? (
                  <button
                    onClick={() => setShowAllCerts((prev) => !prev)}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
                  >
                    {showAllCerts
                      ? t("common.showLess")
                      : t("cert.viewAll")}
                  </button>
                )
                : undefined
          }
        >
          <div className={variant === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "divide-y divide-border border-y border-border"}>
            {(variant === "grid"
              ? certifications.slice(0, 6)
              : visibleCerts
            ).map((cert: Certification) => (
              <button
                key={cert.id}
                onClick={() => openCert(cert)}
                className={
                  variant === "grid"
                    ? "group flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-transparent bg-card p-4 text-left transition-colors hover:border-brand/50"
                    : "group flex w-full items-center justify-between gap-4 py-3 text-left"
                }
              >
                <div className="flex min-w-0 items-center gap-3">
                  {cert.icon_url && (
                    <Image
                      src={cert.icon_url}
                      alt={cert.name}
                      width={variant === "grid" ? 44 : 40}
                      height={variant === "grid" ? 44 : 40}
                      className={variant === "grid" ? "h-11 w-11 shrink-0 rounded-lg object-cover" : "h-10 w-10 shrink-0 rounded-lg object-cover"}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-foreground transition-colors group-hover:text-brand">
                      {getLocalized(cert, "name")}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {cert.issuer}
                      {cert.issue_date ? ` · ${cert.issue_date}` : ""}
                    </div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
              </button>
            ))}
          </div>
        </SectionBox>
      )}

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-background/80 px-0 backdrop-blur-sm sm:items-center sm:px-6"
            onClick={() => closeCert()}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border bg-card shadow-2xl sm:max-h-[85vh] sm:rounded-2xl"
            >
              <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {t("cert.details")}
                </h2>
                <button
                  onClick={() => closeCert()}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto p-4 sm:p-8">
                <div className="flex items-start gap-4">
                  {selectedCert.icon_url && (
                    <Image
                      src={selectedCert.icon_url}
                      alt={selectedCert.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-xl border bg-muted/50 p-2 object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h1 className="text-lg font-bold tracking-tight break-words sm:text-2xl">
                      {getLocalized(selectedCert, "name")}
                    </h1>
                    <p className="mt-1 text-xs break-words text-muted-foreground sm:text-sm">
                      {selectedCert.issuer}{" "}
                      {selectedCert.issue_date &&
                        `· ${selectedCert.issue_date}`}
                    </p>
                    {selectedCert.link_url && (
                      <a
                        href={selectedCert.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        {t("cert.viewCredential")}{" "}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {(() => {
                  const relatedSkillIds =
                    certificationSkills
                      ?.filter(
                        (cs: CertificationSkill) =>
                          cs.certification_id === selectedCert.id,
                      )
                      .map(
                        (cs: CertificationSkill) => cs.skill_category_id,
                      ) || [];
                  const relatedSkills =
                    skillCategories?.filter((sc: SkillCategory) =>
                      relatedSkillIds.includes(sc.id),
                    ) || [];
                  if (relatedSkills.length > 0) {
                    return (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          {t("cert.skillsEvaluated")}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {relatedSkills.map((skill: SkillCategory) => (
                            <span
                              key={skill.id}
                              className="inline-flex rounded-md bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground shadow-sm"
                            >
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
                  const relatedProjects = projects.filter(
                    (p: Project) =>
                      p.linked_certification_id === selectedCert.id,
                  );
                  const relatedBlogs = blogs.filter(
                    (b: Blog) => b.linked_certification_id === selectedCert.id,
                  );
                  if (
                    relatedProjects.length === 0 &&
                    relatedBlogs.length === 0
                  )
                    return null;

                  return (
                    <div className="mt-6 flex flex-col gap-4 border-t pt-6">
                      {relatedProjects.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <FolderKanban className="h-4 w-4" />{" "}
                            {t("cert.relatedProjects")}
                          </h3>
                          <div className="flex flex-col gap-2">
                            {relatedProjects.map((p: Project) => (
                              <Link
                                key={p.id}
                                href={`/works?project=${p.id}`}
                                className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                              >
                                <span className="text-sm font-medium transition-colors group-hover:text-primary">
                                  {getLocalized(p, "title")}
                                </span>
                                <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {relatedBlogs.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <PenTool className="h-4 w-4" />{" "}
                            {t("cert.relatedArticles")}
                          </h3>
                          <div className="flex flex-col gap-2">
                            {relatedBlogs.map((b: Blog) => (
                              <Link
                                key={b.id}
                                href={`/blog?post=${b.id}`}
                                className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                              >
                                <span className="text-sm font-medium transition-colors group-hover:text-primary">
                                  {getLocalized(b, "title")}
                                </span>
                                <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
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

      {/* All Certifications Modal */}
      <AnimatePresence>
        {(variant === "marquee" || variant === "grid") && showAllCerts && certifications.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-background/80 px-0 backdrop-blur-sm sm:items-center sm:px-6"
            onClick={() => setShowAllCerts(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-t-2xl border bg-card shadow-2xl sm:max-h-[85vh] sm:max-w-2xl sm:rounded-2xl sm:mx-0 mx-2"
            >
              <div className="flex items-center justify-between border-b px-3 py-2.5 sm:px-6 sm:py-4">
                <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                  <h2 className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                    {t("cert.allCertifications")}
                  </h2>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary sm:px-2 sm:text-xs">
                    {certifications.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAllCerts(false)}
                  className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:p-2"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="w-full overflow-y-auto p-3 sm:p-6">
                <div className="grid w-full grid-cols-1 gap-2 sm:gap-3">
                  {certifications.map((cert: Certification) => (
                    <div
                      key={cert.id}
                      onClick={() => {
                        setShowAllCerts(false);
                        setTimeout(() => openCert(cert), 300);
                      }}
                      className="group flex w-full min-w-0 cursor-pointer items-start gap-2 overflow-hidden rounded-xl border bg-card/50 p-2.5 transition-all hover:bg-accent/50 sm:gap-3 sm:p-4"
                    >
                      {cert.icon_url && (
                        <Image
                          src={cert.icon_url}
                          alt={cert.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h3 className="truncate text-xs font-medium sm:text-sm">
                          {getLocalized(cert, "name")}
                        </h3>
                        <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
                          {cert.issuer}
                          {cert.issue_date && ` · ${cert.issue_date}`}
                        </p>
                      </div>
                      <ExternalLink className="mt-1 h-3 w-3 shrink-0 text-muted-foreground opacity-70 sm:h-4 sm:w-4" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}