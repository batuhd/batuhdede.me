import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import type { LinkedEntity } from "@/types";

// Server-side Supabase client (for Server Components)
const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials not configured");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
};

// Types
export interface AboutMe {
  id: string;
  name: string;
  role: string;
  hero_tagline: string;
  bio: string;
  profile_photo_url: string | null;
  started_coding_year: number | null;
  projects_count: number | null;
  years_experience: number | null;
  quote_text: string | null;
  quote_author: string | null;
  stat_1_value: string | null;
  stat_1_label: string | null;
  stat_2_value: string | null;
  stat_2_label: string | null;
  stat_3_value: string | null;
  stat_3_label: string | null;
  show_quote: boolean;
  show_stats: boolean;
  show_profile_photo: boolean;
  // Translations
  hero_tagline_tr?: string;
  hero_tagline_de?: string;
  hero_tagline_es?: string;
  bio_tr?: string;
  bio_de?: string;
  bio_es?: string;
  role_tr?: string;
  role_de?: string;
  role_es?: string;
  quote_text_tr?: string;
  quote_text_de?: string;
  quote_text_es?: string;
  stat_1_label_tr?: string;
  stat_1_label_de?: string;
  stat_1_label_es?: string;
  stat_2_label_tr?: string;
  stat_2_label_de?: string;
  stat_2_label_es?: string;
  stat_3_label_tr?: string;
  stat_3_label_de?: string;
  stat_3_label_es?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle?: string;
  skills: string[];
  skills_tr?: string[];
  skills_de?: string[];
  skills_es?: string[];
  order_index: number;
  title_tr?: string;
  title_de?: string;
  title_es?: string;
  subtitle_tr?: string;
  subtitle_de?: string;
  subtitle_es?: string;
}

export interface RoleEntry {
  title: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  title_tr?: string;
  title_de?: string;
  title_es?: string;
  description_tr?: string;
  description_de?: string;
  description_es?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  logo_url: string | null;
  description: string | null;
  roles: RoleEntry[];
  order_index: number;
  title_tr?: string;
  title_de?: string;
  title_es?: string;
  description_tr?: string;
  description_de?: string;
  description_es?: string;
  company_tr?: string;
  company_de?: string;
  company_es?: string;
  location_tr?: string;
  location_de?: string;
  location_es?: string;
}

export interface Education {
  id: string;
  university: string;
  degree: string | null;
  major: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  logo_url: string | null;
  is_current: boolean;
  gpa: string | null;
  order_index: number;
  university_tr?: string;
  university_de?: string;
  university_es?: string;
  degree_tr?: string;
  degree_de?: string;
  degree_es?: string;
  major_tr?: string;
  major_de?: string;
  major_es?: string;
  location_tr?: string;
  location_de?: string;
  location_es?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string | null;
  order_index: number;
  name_tr?: string;
  name_de?: string;
  name_es?: string;
}

export interface Activity {
  id: string;
  organization: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  logo_url: string | null;
  description: string | null;
  link_url: string | null;
  roles: RoleEntry[];
  order_index: number;
  organization_tr?: string;
  organization_de?: string;
  organization_es?: string;
  role_tr?: string;
  role_de?: string;
  role_es?: string;
  description_tr?: string;
  description_de?: string;
  description_es?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  icon_url: string | null;
  link_url: string | null;
  order_index: number;
  name_tr?: string;
  name_de?: string;
  name_es?: string;
  issuer_tr?: string;
  issuer_de?: string;
  issuer_es?: string;
}

export interface CertificationSkill {
  certification_id: string;
  skill_category_id: string;
}

export interface SectionOrder {
  section_id: string;
  order_index: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  github: string | null;
  image: string | null;
  tags: string[];
  category?: string | null;
  order_index: number;
  title_tr?: string;
  title_de?: string;
  title_es?: string;
  description_tr?: string;
  description_de?: string;
  description_es?: string;
  linked_experience_id?: string | null;
  linked_education_id?: string | null;
  linked_skill_category_ids?: string[] | null;
  linked_language_id?: string | null;
  linked_activity_id?: string | null;
  linked_certification_id?: string | null;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  order_index: number;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  date: string;
  read_time: string | null;
  image_url: string | null;
  is_published: boolean;
  order_index: number;
  title_tr?: string;
  excerpt_tr?: string;
  content_tr?: string;
  title_de?: string;
  excerpt_de?: string;
  content_de?: string;
  title_es?: string;
  excerpt_es?: string;
  content_es?: string;
  linked_project_id?: string | null;
  linked_experience_id?: string | null;
  linked_education_id?: string | null;
  linked_skill_category_ids?: string[] | null;
  linked_language_id?: string | null;
  linked_activity_id?: string | null;
  linked_certification_id?: string | null;
}

export interface BlogImage {
  id: string;
  blog_id: string;
  image_url: string;
  caption: string | null;
  order_index: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  account_type?: string;
  order_index: number;
}

export interface ContactEmail {
  id: string;
  label: string;
  label_tr?: string;
  label_de?: string;
  label_es?: string;
  email: string;
  order_index: number;
}



export interface SiteData {
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
}

export interface BlogWithImages extends Blog {
  images: BlogImage[];
}

export interface ProjectWithImages extends Project {
  images: ProjectImage[];
}

// CACHED DATA FETCHING - Server Components için
// React cache() fonksiyonu ile aynı request'te tekrar kullanılabilir
export const fetchAllData = cache(async (): Promise<SiteData> => {
  const supabase = createServerClient();

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
    socialLinksRes,
    contactEmailsRes,
  ] = await Promise.all([
    supabase.from("about_me").select("*").limit(1).single(),
    supabase
      .from("skill_categories")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("experiences")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("educations")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("languages")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("activities")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("certifications")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase.from("certification_skills").select("*"),
    supabase
      .from("section_order")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("blogs")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("social_links")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("contact_emails")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);

  return {
    aboutMe: aboutRes.data || null,
    skillCategories: skillsRes.data || [],
    experiences: expRes.data || [],
    educations: eduRes.data || [],
    languages: langRes.data || [],
    activities: actRes.data || [],
    certifications: certRes.data || [],
    certificationSkills: certSkillsRes.data || [],
    sectionOrder: sectionRes.data || [],
    projects: (projectsRes.data || []) as unknown as Project[],
    blogs: (blogsRes.data || []) as unknown as Blog[],
    socialLinks: socialLinksRes.data || [],
    contactEmails: contactEmailsRes.data || [],
  };
});

// Type helper for partial Supabase selections
// Supabase select("*") returns full rows, but partial selects need explicit casts
// to match our TypeScript interfaces. We use `as unknown as T` only at the
// boundary where we trust the database schema.

// Optimized Home Page Data - Sadece gerekli alanlar
export const fetchHomeData = cache(async () => {
  const supabase = createServerClient();

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
    socialLinksRes,
    contactEmailsRes,
    projectsRes,
    blogsRes,
  ] = await Promise.all([
    supabase.from("about_me").select("*").limit(1).single(),
    supabase
      .from("skill_categories")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("experiences")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("educations")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("languages")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("activities")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("certifications")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase.from("certification_skills").select("*"),
    supabase
      .from("section_order")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("social_links")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("contact_emails")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("projects")
      .select(
        "id, title, title_tr, title_de, title_es, linked_experience_id, linked_education_id, linked_activity_id, linked_certification_id",
      )
      .order("order_index", { ascending: true }),
    supabase
      .from("blogs")
      .select(
        "id, title, title_tr, title_de, title_es, excerpt, excerpt_tr, excerpt_de, excerpt_es, date, read_time, linked_experience_id, linked_education_id, linked_activity_id, linked_certification_id",
      )
      .eq("is_published", true)
      .order("order_index", { ascending: true }),
  ]);

  return {
    aboutMe: aboutRes.data || null,
    skillCategories: skillsRes.data || [],
    experiences: expRes.data || [],
    educations: eduRes.data || [],
    languages: langRes.data || [],
    activities: actRes.data || [],
    certifications: certRes.data || [],
    certificationSkills: certSkillsRes.data || [],
    sectionOrder: sectionRes.data || [],
    socialLinks: socialLinksRes.data || [],
    contactEmails: contactEmailsRes.data || [],
    projects: (projectsRes.data || []) as unknown as Project[],
    blogs: (blogsRes.data || []) as unknown as Blog[],
  };
});

// Blog Page Data - İlişkili verilerle birlikte
export const fetchBlogData = cache(async () => {
  const supabase = createServerClient();

  const [
    blogsRes,
    blogImagesRes,
    projectsRes,
    expRes,
    eduRes,
    skillsRes,
    langsRes,
    actsRes,
    certsRes,
  ] = await Promise.all([
    supabase
      .from("blogs")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("blog_images")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("projects")
      .select("id, title, title_tr, title_de, title_es, link"),
    supabase
      .from("experiences")
      .select("id, title, title_tr, title_de, title_es, company"),
    supabase
      .from("educations")
      .select("id, university, university_tr, university_de, university_es"),
    supabase
      .from("skill_categories")
      .select("id, title, title_tr, title_de, title_es"),
    supabase.from("languages").select("id, name, name_tr, name_de, name_es"),
    supabase
      .from("activities")
      .select(
        "id, organization, organization_tr, organization_de, organization_es",
      ),
    supabase
      .from("certifications")
      .select("id, name, name_tr, name_de, name_es"),
  ]);

  // Blog images map
  const imagesMap: Record<string, BlogImage[]> = {};
  (blogImagesRes.data || []).forEach((img: BlogImage) => {
    if (!imagesMap[img.blog_id]) imagesMap[img.blog_id] = [];
    imagesMap[img.blog_id].push(img);
  });

  const entityMap: Record<string, LinkedEntity> = {};
  ((projectsRes.data || []) as unknown as Project[]).forEach((p) => {
    entityMap[p.id] = {
      id: p.id,
      title: p.title,
      type: "project",
      originalObj: p as unknown as Record<string, string | undefined>,
    };
  });
  ((expRes.data || []) as unknown as Experience[]).forEach((e) => {
    entityMap[e.id] = {
      id: e.id,
      title: `${e.title} at ${e.company}`,
      type: "experience",
      originalObj: e as unknown as Record<string, string | undefined>,
    };
  });
  ((eduRes.data || []) as unknown as Education[]).forEach((e) => {
    entityMap[e.id] = {
      id: e.id,
      title: e.university,
      type: "education",
      originalObj: e as unknown as Record<string, string | undefined>,
    };
  });
  ((skillsRes.data || []) as unknown as SkillCategory[]).forEach((s) => {
    entityMap[s.id] = {
      id: s.id,
      title: s.title,
      type: "skill",
      originalObj: s as unknown as Record<string, string | undefined>,
    };
  });
  ((langsRes.data || []) as unknown as Language[]).forEach((l) => {
    entityMap[l.id] = {
      id: l.id,
      title: l.name,
      type: "language",
      originalObj: l as unknown as Record<string, string | undefined>,
    };
  });
  ((actsRes.data || []) as unknown as Activity[]).forEach((a) => {
    entityMap[a.id] = {
      id: a.id,
      title: a.organization,
      type: "activity",
      originalObj: a as unknown as Record<string, string | undefined>,
    };
  });
  ((certsRes.data || []) as unknown as Certification[]).forEach((c) => {
    entityMap[c.id] = {
      id: c.id,
      title: c.name,
      type: "certification",
      originalObj: c as unknown as Record<string, string | undefined>,
    };
  });

  const blogs: BlogWithImages[] = ((blogsRes.data || []) as unknown as Blog[]).map(
    (blog) => ({
      ...blog,
      images: imagesMap[blog.id] || [],
    }),
  );

  return { blogs, entityMap };
});

// Works Page Data - İlişkili verilerle birlikte
export const fetchWorksData = cache(async () => {
  const supabase = createServerClient();

  const [
    projectsRes,
    projectImagesRes,
    blogsRes,
    expRes,
    eduRes,
    skillsRes,
    langsRes,
    actsRes,
    certsRes,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("project_images")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("blogs")
      .select("id, title, excerpt, date, read_time, linked_project_id")
      .not("linked_project_id", "is", null),
    supabase
      .from("experiences")
      .select("id, title, title_tr, title_de, title_es, company"),
    supabase
      .from("educations")
      .select("id, university, university_tr, university_de, university_es"),
    supabase
      .from("skill_categories")
      .select("id, title, title_tr, title_de, title_es"),
    supabase.from("languages").select("id, name, name_tr, name_de, name_es"),
    supabase
      .from("activities")
      .select(
        "id, organization, organization_tr, organization_de, organization_es",
      ),
    supabase
      .from("certifications")
      .select("id, name, name_tr, name_de, name_es"),
  ]);

  // Project images map
  const imagesMap: Record<string, ProjectImage[]> = {};
  (projectImagesRes.data || []).forEach((img: ProjectImage) => {
    if (!imagesMap[img.project_id]) imagesMap[img.project_id] = [];
    imagesMap[img.project_id].push(img);
  });

  const entityMap: Record<string, LinkedEntity> = {};
  ((expRes.data || []) as unknown as Experience[]).forEach((e) => {
    entityMap[e.id] = {
      id: e.id,
      title: `${e.title} at ${e.company}`,
      type: "experience",
      originalObj: e as unknown as Record<string, string | undefined>,
    };
  });
  ((eduRes.data || []) as unknown as Education[]).forEach((e) => {
    entityMap[e.id] = {
      id: e.id,
      title: e.university,
      type: "education",
      originalObj: e as unknown as Record<string, string | undefined>,
    };
  });
  ((skillsRes.data || []) as unknown as SkillCategory[]).forEach((s) => {
    entityMap[s.id] = {
      id: s.id,
      title: s.title,
      type: "skill",
      originalObj: s as unknown as Record<string, string | undefined>,
    };
  });
  ((langsRes.data || []) as unknown as Language[]).forEach((l) => {
    entityMap[l.id] = {
      id: l.id,
      title: l.name,
      type: "language",
      originalObj: l as unknown as Record<string, string | undefined>,
    };
  });
  ((actsRes.data || []) as unknown as Activity[]).forEach((a) => {
    entityMap[a.id] = {
      id: a.id,
      title: a.organization,
      type: "activity",
      originalObj: a as unknown as Record<string, string | undefined>,
    };
  });
  ((certsRes.data || []) as unknown as Certification[]).forEach((c) => {
    entityMap[c.id] = {
      id: c.id,
      title: c.name,
      type: "certification",
      originalObj: c as unknown as Record<string, string | undefined>,
    };
  });

  const projects: ProjectWithImages[] = ((projectsRes.data || []) as unknown as Project[]).map(
    (project) => ({
      ...project,
      images: imagesMap[project.id] || [],
    }),
  );

  const relatedBlogs = (blogsRes.data || []) as unknown as Blog[];

  return { projects, entityMap, relatedBlogs };
});

// Helper: Localized field getter
export function getLocalized(
  obj: unknown,
  field: string,
  lang: string = "en",
  fallback?: string,
): string {
  if (!obj || typeof obj !== "object") return fallback || "";

  const record = obj as Record<string, unknown>;
  const langField = `${field}_${lang}`;
  const localizedValue = record[langField];
  const value = localizedValue !== undefined && localizedValue !== null
    ? localizedValue
    : record[field];

  if (value === undefined || value === null) return fallback || "";
  return String(value) || fallback || "";
}
