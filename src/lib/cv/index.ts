import { getLocalized, type SiteData } from "@/lib/data";
import { translations, type Locale } from "@/config/translations";
import { siteConfig } from "@/config/site";

export interface CvEntry {
  title: string;
  subtitle?: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface CvSkillGroup {
  title: string;
  items: string[];
}

export interface CvData {
  name: string;
  role: string;
  contactLine: string[];
  education: CvEntry[];
  experience: CvEntry[];
  leadership: CvEntry[];
  skills: CvSkillGroup[];
  languages: { name: string; level: string }[];
  referencesNote: string;
}

const PRESENT_WORDS = ["present", "devam", "heute", "actual", "current"];

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  oca: 0, şub: 1, nis: 3, haz: 5, tem: 6,
  ağu: 7, eyl: 8, eki: 9, kas: 10, ara: 11,
};

function t(lang: Locale, key: string): string {
  return translations[lang][key] || translations.en[key] || key;
}

export function formatCvDate(dateStr: string | null, lang: Locale): string {
  if (!dateStr) return "";
  const s = dateStr.trim();
  if (PRESENT_WORDS.some((w) => s.toLowerCase().includes(w))) {
    return t(lang, "cv.present");
  }

  const m = s.match(/^([a-zA-ZğüşöçıİĞÜŞÖÇ]{3,9})\s+(\d{4})$/);
  if (m) {
    const month = MONTHS[m[1].toLowerCase().substring(0, 3)];
    if (month !== undefined) {
      try {
        const date = new Date(Number(m[2]), month, 1);
        return new Intl.DateTimeFormat(lang, {
          month: "long",
          year: "numeric",
        }).format(date);
      } catch {
        return s;
      }
    }
  }

  if (/^\d{4}$/.test(s)) return s;
  return s;
}

function splitBullets(description: string | null): string[] {
  if (!description) return [];
  const bullets: string[] = [];
  for (const raw of description.split(/\n+/)) {
    const line = raw.trim();
    if (!line) continue;
    const text = line.replace(/^[-•*]\s*/, "").trim();
    if (!text) continue;
    if (/^translated with/i.test(text)) continue;
    if (/deepl\.com/i.test(text)) continue;
    bullets.push(text);
  }
  return bullets;
}

function localizedSkills(category: unknown, lang: Locale): string[] {
  const c = category as {
    skills?: string[];
    skills_tr?: string[];
    skills_de?: string[];
    skills_es?: string[];
  };
  if (lang !== "en") {
    const key = `skills_${lang}` as
      | "skills_tr"
      | "skills_de"
      | "skills_es";
    const localized = c[key];
    if (Array.isArray(localized) && localized.length > 0) return localized;
  }
  return Array.isArray(c.skills) ? c.skills : [];
}

function levelLabel(level: string | null, lang: Locale): string {
  if (!level) return "";
  const key = `level.${level.toLowerCase()}`;
  return translations[lang][key] || translations.en[key] || level;
}

function bareHandle(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}

export function buildCvData(data: SiteData, lang: Locale): CvData {
  const about = data.aboutMe;
  const name = about?.name?.trim() || "Batuhan Dede";
  const role = about ? getLocalized(about, "role", lang) : "";

  const emails = (data.contactEmails || [])
    .map((e) => e.email)
    .filter((e): e is string => Boolean(e));
  const socials = (data.socialLinks || [])
    .map((l) => l.url)
    .filter((u): u is string => Boolean(u));

  const linkedin =
    socials
      .find((u) => u.toLowerCase().includes("linkedin"))
      ?.replace(/^https?:\/\/(www\.)?/i, "") || "";
  const github =
    socials
      .find((u) => u.toLowerCase().includes("github"))
      ?.replace(/^https?:\/\/(www\.)?/i, "") || "";
  const site = bareHandle(siteConfig.url);

  const contactLine = [...emails, linkedin, github, site].filter(Boolean);

  const education: CvEntry[] = (data.educations || []).map((e) => ({
    title: getLocalized(e, "university", lang),
    subtitle: [
      getLocalized(e, "degree", lang),
      getLocalized(e, "major", lang),
    ]
      .filter(Boolean)
      .join(" - "),
    location: getLocalized(e, "location", lang) || undefined,
    startDate: formatCvDate(e.start_date, lang),
    endDate: formatCvDate(e.is_current ? "Present" : e.end_date, lang),
    bullets: [],
  }));

  const experience: CvEntry[] = (data.experiences || []).map((e) => ({
    title: getLocalized(e, "title", lang),
    subtitle: getLocalized(e, "company", lang),
    location: getLocalized(e, "location", lang) || undefined,
    startDate: formatCvDate(e.start_date, lang),
    endDate: formatCvDate(e.is_current ? "Present" : e.end_date, lang),
    bullets: splitBullets(getLocalized(e, "description", lang)),
  }));

  const leadership: CvEntry[] = (data.activities || []).map((a) => ({
    title: getLocalized(a, "organization", lang),
    subtitle: getLocalized(a, "role", lang) || undefined,
    startDate: formatCvDate(a.start_date, lang),
    endDate: formatCvDate(a.is_current ? "Present" : a.end_date, lang),
    bullets: splitBullets(getLocalized(a, "description", lang)),
  }));

  const skills: CvSkillGroup[] = (data.skillCategories || []).map((c) => ({
    title: getLocalized(c, "title", lang),
    items: localizedSkills(c, lang),
  }));

  const languages = (data.languages || []).map((l) => ({
    name: getLocalized(l, "name", lang),
    level: levelLabel(l.level, lang),
  }));

  return {
    name,
    role,
    contactLine,
    education,
    experience,
    leadership,
    skills,
    languages,
    referencesNote: t(lang, "cv.referencesNote"),
  };
}