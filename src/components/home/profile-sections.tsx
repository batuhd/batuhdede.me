"use client";

import { useLanguage } from "@/context/language-context";
import { useSiteData } from "@/context/site-data-context";
import { ExternalLink } from "lucide-react";

export function Experience() {
  const { getLocalized } = useLanguage();
  const { experiences } = useSiteData();

  if (experiences.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp: any) => (
          <div key={exp.id} className="flex gap-4">
            {exp.logo_url && (
              <img src={exp.logo_url} alt={exp.company} className="h-10 w-10 rounded-lg object-cover flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 min-w-0">
              <h3 className="font-medium">{getLocalized(exp, "title")}</h3>
              <p className="text-sm text-muted-foreground">{exp.company}</p>
              <p className="text-xs text-muted-foreground">
                {exp.start_date}{exp.end_date ? ` — ${exp.end_date}` : ""}{exp.is_current ? " · Present" : ""}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.description && (
                <p className="text-sm text-muted-foreground leading-relaxed pt-1">{getLocalized(exp, "description")}</p>
              )}
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
      <h2 className="text-lg font-semibold tracking-tight">Education</h2>
      <div className="space-y-6">
        {educations.map((edu: any) => (
          <div key={edu.id} className="flex gap-4">
            {edu.logo_url && (
              <img src={edu.logo_url} alt={edu.university} className="h-10 w-10 rounded-lg object-cover flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 min-w-0">
              <h3 className="font-medium">{edu.university}</h3>
              {edu.degree && <p className="text-sm text-muted-foreground">{edu.degree}{edu.major ? ` — ${edu.major}` : ""}</p>}
              <p className="text-xs text-muted-foreground">
                {edu.start_date}{edu.end_date ? ` — ${edu.end_date}` : ""}
                {edu.location ? ` · ${edu.location}` : ""}
              </p>
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

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">Languages</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {languages.map((lang: any) => {
          const avg = Math.round(
            ((lang.reading_level || 0) + (lang.listening_level || 0) + (lang.writing_level || 0) + (lang.speaking_level || 0)) / 4
          );
          return (
            <div key={lang.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{lang.name}</h3>
                <span className="text-xs text-muted-foreground">{avg}%</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Reading", value: lang.reading_level },
                  { label: "Listening", value: lang.listening_level },
                  { label: "Writing", value: lang.writing_level },
                  { label: "Speaking", value: lang.speaking_level },
                ].map((s) => (
                  <div key={s.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{s.label}</span>
                      <span>{s.value || 0}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary/70 transition-all duration-500" style={{ width: `${s.value || 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
      <h2 className="text-lg font-semibold tracking-tight">Leadership & Activities</h2>
      <div className="space-y-6">
        {activities.map((act: any) => (
          <div key={act.id} className="flex gap-4">
            {act.logo_url && (
              <img src={act.logo_url} alt={act.organization} className="h-10 w-10 rounded-lg object-cover flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{getLocalized(act, "organization")}</h3>
                {act.link_url && (
                  <a href={act.link_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{getLocalized(act, "role")}</p>
              <p className="text-xs text-muted-foreground">
                {act.start_date}{act.end_date ? ` — ${act.end_date}` : ""}
              </p>
              {act.description && (
                <p className="text-sm text-muted-foreground leading-relaxed pt-1">{getLocalized(act, "description")}</p>
              )}
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
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium truncate">{getLocalized(cert, "name")}</h3>
                {cert.link_url && (
                  <a href={cert.link_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
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
