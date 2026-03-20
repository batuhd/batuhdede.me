"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface SiteData {
  aboutMe: any | null;
  skillCategories: any[];
  experiences: any[];
  educations: any[];
  languages: any[];
  activities: any[];
  certifications: any[];
  loaded: boolean;
}

const defaultData: SiteData = {
  aboutMe: null,
  skillCategories: [],
  experiences: [],
  educations: [],
  languages: [],
  activities: [],
  certifications: [],
  loaded: false,
};

const SiteDataContext = createContext<SiteData>(defaultData);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);

  useEffect(() => {
    if (!supabase) {
      setData((d) => ({ ...d, loaded: true }));
      return;
    }

    const fetchAll = async () => {
      const sb = supabase!;
      const [aboutRes, skillsRes, expRes, eduRes, langRes, actRes, certRes] = await Promise.all([
        sb.from("about_me").select("*").limit(1),
        sb.from("skill_categories").select("*").order("order_index", { ascending: true }),
        sb.from("experiences").select("*").order("order_index", { ascending: true }),
        sb.from("educations").select("*").order("order_index", { ascending: true }),
        sb.from("languages").select("*").order("order_index", { ascending: true }),
        sb.from("activities").select("*").order("order_index", { ascending: true }),
        sb.from("certifications").select("*").order("order_index", { ascending: true }),
      ]);

      setData({
        aboutMe: aboutRes.data?.[0] || null,
        skillCategories: skillsRes.data || [],
        experiences: expRes.data || [],
        educations: eduRes.data || [],
        languages: langRes.data || [],
        activities: actRes.data || [],
        certifications: certRes.data || [],
        loaded: true,
      });
    };

    fetchAll();
  }, []);

  return (
    <SiteDataContext.Provider value={data}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
