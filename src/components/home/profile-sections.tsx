"use client";

import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { ExternalLink } from "lucide-react";
import { ExpandableText } from "@/components/ui/expandable-text";

export function Experience() {
  const { getLocalized } = useLanguage();
  const { experiences } = useSiteData();

  if (experiences.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold tracking-widest text-primary uppercase ml-3">Experience</h2>
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
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    {exp.start_date}{exp.end_date ? ` - ${exp.end_date}` : (exp.is_current ? " - present" : "")}
                  </p>
                  {exp.description && (
                    <div className="pt-3 text-sm text-muted-foreground leading-relaxed">
                      <ExpandableText text={getLocalized(exp, "description")} />
                    </div>
                  )}
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
  const { educations } = useSiteData();

  if (educations.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold tracking-widest text-primary uppercase ml-3">Education</h2>
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
                  <h3 className="font-semibold text-base">{edu.university}</h3>
                  {(edu.degree || edu.major) && (
                    <p className="text-sm font-medium text-muted-foreground">
                      {edu.degree}{edu.degree && edu.major ? ` - ` : ""}{edu.major}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    {edu.start_date}{edu.end_date ? ` - ${edu.end_date}` : ""}
                    {edu.location ? ` · ${edu.location}` : ""}
                  </p>
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
  const { languages } = useSiteData();

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
      <h2 className="text-sm font-semibold tracking-widest text-primary uppercase ml-3">Languages</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3 ml-3">
        {languages.map((lang: any) => {
          const flag = getLanguageFlag(lang.name);
          return (
            <span
              key={lang.id}
              className="group flex items-center gap-2 rounded-xl border bg-card/40 px-3 py-1.5 sm:px-4 sm:py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {flag && <span className="text-base sm:text-lg leading-none">{flag}</span>}
              <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-accent-foreground">{lang.name}</span>
              {lang.level && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30 mx-0.5" />
                  <span className="text-xs sm:text-sm group-hover:text-accent-foreground/80 transition-colors">{lang.level}</span>
                </>
              )}
            </span>
          );
        })}
      </div>
    </section>
  );
}

export function Activities() {
  const { getLocalized } = useLanguage();
  const { activities } = useSiteData();

  if (activities.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-sm font-semibold tracking-widest text-primary uppercase ml-3">Leadership & Activities</h2>
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
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    {act.start_date}{act.end_date ? ` - ${act.end_date}` : ""}
                  </p>
                  {act.description && (
                    <div className="pt-3 text-sm text-muted-foreground leading-relaxed">
                      <ExpandableText text={getLocalized(act, "description")} />
                    </div>
                  )}
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
  const { getLocalized } = useLanguage();
  const { certifications } = useSiteData();

  if (certifications.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">Certifications</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {certifications.map((cert: any) => (
          <div key={cert.id} className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/30">
            {cert.icon_url && (
              <img src={cert.icon_url} alt={cert.name} className="h-8 w-8 rounded object-cover flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium min-w-0 break-words pr-2">{getLocalized(cert, "name")}</h3>
                {cert.link_url && (
                  <a href={cert.link_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-1">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{cert.issuer}{cert.issue_date ? ` · ${cert.issue_date}` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
