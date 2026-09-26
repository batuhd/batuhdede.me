"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type {
  AboutMe,
  SkillCategory,
  Experience,
  Education,
  Language,
  Activity,
  Certification,
  CertificationSkill,
  SectionOrder,
  Project,
  Blog,
  SocialLink,
  ContactEmail,
} from "@/types";

interface SiteData {
  aboutMe: AboutMe | null;
  skillCategories: SkillCategory[];
  experiences: Experience[];
  educations: Education[];
  languages: Language[];
  activities: Activity[];
  certifications: Certification[];
  certificationSkills: CertificationSkill[];
  sectionOrder: SectionOrder[];
  projects: Project[];
  blogs: Blog[];
  socialLinks: SocialLink[];
  contactEmails: ContactEmail[];
  loaded: boolean;
  isMaintenance: boolean;
}

const defaultData: SiteData = {
  aboutMe: null,
  skillCategories: [],
  experiences: [],
  educations: [],
  languages: [],
  activities: [],
  certifications: [],
  certificationSkills: [],
  sectionOrder: [],
  projects: [],
  blogs: [],
  socialLinks: [],
  contactEmails: [],
  loaded: false,
  isMaintenance: false,
};

const SiteDataContext = createContext<SiteData>(defaultData);

interface SiteDataProviderProps {
  children: ReactNode;
  initialData?: Partial<SiteData>;
}

export function SiteDataProvider({
  children,
  initialData,
}: SiteDataProviderProps) {
  const [data, setData] = useState<SiteData>(
    initialData ? { ...defaultData, ...initialData } : defaultData,
  );

  useEffect(() => {
    // Eğer initialData varsa, client-side fetch yapma
    if (initialData?.loaded) {
      return;
    }

    let cancelled = false;
    (async () => {
      if (!supabase) {
        if (!cancelled) setData((d) => ({ ...d, loaded: true }));
        return;
      }

      const sb = supabase!;
      const [
        aboutRes,
        skillsRes,
        expRes,
        eduRes,
        langRes,
        actRes,
        certRes,
        certSkillsRes,
        sectionRes,
        projectsRes,
        blogsRes,
      ] = await Promise.all([
        sb.from("about_me").select("*").limit(1),
        sb
          .from("skill_categories")
          .select("*")
          .order("order_index", { ascending: true }),
        sb
          .from("experiences")
          .select("*")
          .order("order_index", { ascending: true }),
        sb
          .from("educations")
          .select("*")
          .order("order_index", { ascending: true }),
        sb
          .from("languages")
          .select("*")
          .order("order_index", { ascending: true }),
        sb
          .from("activities")
          .select("*")
          .order("order_index", { ascending: true }),
        sb
          .from("certifications")
          .select("*")
          .order("order_index", { ascending: true }),
        sb.from("certification_skills").select("*"),
        sb
          .from("section_order")
          .select("*")
          .order("order_index", { ascending: true }),
        sb
          .from("projects")
          .select(
            "id, title, title_tr, title_de, title_es, linked_experience_id, linked_education_id, linked_skill_category_ids, linked_language_id, linked_activity_id, linked_certification_id",
          )
          .order("order_index", { ascending: true }),
        sb
          .from("blogs")
          .select(
            "id, title, title_tr, title_de, title_es, linked_experience_id, linked_education_id, linked_skill_category_ids, linked_language_id, linked_activity_id, linked_certification_id",
          )
          .order("order_index", { ascending: true }),
      ]);

      if (cancelled) return;

      setData({
        aboutMe: aboutRes.data?.[0] || null,
        skillCategories: skillsRes.data || [],
        experiences: expRes.data || [],
        educations: eduRes.data || [],
        languages: langRes.data || [],
        activities: actRes.data || [],
        certifications: certRes.data || [],
        certificationSkills: certSkillsRes.data || [],
        sectionOrder: sectionRes?.data || [],
        projects: (projectsRes?.data || []) as unknown as Project[],
        blogs: (blogsRes?.data || []) as unknown as Blog[],
        socialLinks: [],
        contactEmails: [],
        loaded: true,
        isMaintenance:
          sectionRes?.data?.some(
            (s: SectionOrder) => s.section_id === "maintenance_mode",
          ) || false,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [initialData]);

  return (
    <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
