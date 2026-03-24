/**
 * Site-wide TypeScript type definitions
 * Centralized types for database entities and API responses
 */

// ============================================
// Profile & About
// ============================================

export interface AboutMe {
  id: string;
  name: string;
  role: string;
  hero_tagline: string;
  bio: string;
  profile_photo_url: string;
  started_coding_year: number;
  projects_count: number;
  years_experience: number;
  quote_text: string;
  quote_author: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
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
  created_at: string;
}

// ============================================
// Portfolio (Works)
// ============================================

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  github: string;
  image: string;
  tags: string[];
  order_index: number;
  // Translations
  title_tr?: string;
  description_tr?: string;
  title_de?: string;
  description_de?: string;
  title_es?: string;
  description_es?: string;
  // Linked items
  linked_experience_id?: string;
  linked_education_id?: string;
  linked_skill_category_ids?: string[];
  linked_language_id?: string;
  linked_activity_id?: string;
  linked_certification_id?: string;
  // Additional data
  additional_images?: string;
  project_images?: ProjectImage[];
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string;
  order_index: number;
  created_at: string;
}

// ============================================
// Blog
// ============================================

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time: string;
  image_url?: string;
  order_index: number;
  // Translations
  title_tr?: string;
  excerpt_tr?: string;
  content_tr?: string;
  title_de?: string;
  excerpt_de?: string;
  content_de?: string;
  title_es?: string;
  excerpt_es?: string;
  content_es?: string;
  // Linked items
  linked_project_id?: string;
  linked_experience_id?: string;
  linked_education_id?: string;
  linked_skill_category_ids?: string[];
  linked_language_id?: string;
  linked_activity_id?: string;
  linked_certification_id?: string;
  created_at: string;
}

// ============================================
// Resume Data
// ============================================

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  logo_url: string;
  description: string;
  order_index: number;
  // Translations
  title_tr?: string;
  title_de?: string;
  title_es?: string;
  description_tr?: string;
  description_de?: string;
  description_es?: string;
  created_at: string;
}

export interface Education {
  id: string;
  university: string;
  degree: string;
  major: string;
  location: string;
  start_date: string;
  end_date: string;
  logo_url: string;
  is_current: boolean;
  gpa: string;
  order_index: number;
  // Translations
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
  created_at: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  order_index: number;
  // Translations
  name_tr?: string;
  name_de?: string;
  name_es?: string;
  created_at: string;
}

export interface Activity {
  id: string;
  organization: string;
  role: string;
  start_date: string;
  end_date: string;
  logo_url: string;
  description: string;
  link_url: string;
  order_index: number;
  // Translations
  organization_tr?: string;
  organization_de?: string;
  organization_es?: string;
  role_tr?: string;
  role_de?: string;
  role_es?: string;
  description_tr?: string;
  description_de?: string;
  description_es?: string;
  created_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  icon_url: string;
  link_url: string;
  order_index: number;
  // Translations
  name_tr?: string;
  name_de?: string;
  name_es?: string;
  created_at: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
  order_index: number;
  // Translations
  title_tr?: string;
  title_de?: string;
  title_es?: string;
  created_at: string;
}

// ============================================
// Contact & Social
// ============================================

export interface ContactEmail {
  id: string;
  label: string;
  label_tr?: string;
  label_de?: string;
  label_es?: string;
  email: string;
  order_index: number;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  order_index: number;
  created_at: string;
}

// ============================================
// Layout & Settings
// ============================================

export interface SectionOrder {
  section_id: string;
  order_index: number;
}

// ============================================
// API Response Types
// ============================================

export interface LinkedEntity {
  id: string;
  title?: string;
  name?: string;
  type: 'project' | 'experience' | 'education' | 'certification';
}

// ============================================
// Form Types
// ============================================

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time: string;
  image_url: string;
  linked_project_id: string;
  linked_experience_id: string;
  linked_education_id: string;
  linked_skill_category_ids: string[];
  linked_language_id: string;
  linked_activity_id: string;
  linked_certification_id: string;
  title_tr: string;
  excerpt_tr: string;
  content_tr: string;
  title_de: string;
  excerpt_de: string;
  content_de: string;
  title_es: string;
  excerpt_es: string;
  content_es: string;
}

export interface WorkFormData {
  title: string;
  description: string;
  link: string;
  github: string;
  image: string;
  tags: string;
  additional_images: string;
  linked_experience_id: string;
  linked_education_id: string;
  linked_skill_category_ids: string[];
  linked_language_id: string;
  linked_activity_id: string;
  linked_certification_id: string;
  title_tr: string;
  description_tr: string;
  title_de: string;
  description_de: string;
  title_es: string;
  description_es: string;
}
