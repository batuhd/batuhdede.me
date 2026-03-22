-- =============================================
-- SUPABASE SCHEMA — Portfolio Database
-- =============================================
-- Security Model:
--   ✅ Anyone can READ (public portfolio)
--   ✅ Only the site owner (first registered user) can WRITE
--   ✅ SQL Injection impossible (Supabase PostgREST)
--   ✅ Sign-up disabled in Supabase Auth settings
-- =============================================

-- Homepage Section Ordering
CREATE TABLE public.section_order (
    section_id text PRIMARY KEY,
    order_index integer DEFAULT 0
);

-- About Me (profile info, bio, stats, quote)
CREATE TABLE public.about_me (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text,
    role text,
    hero_tagline text,
    bio text,
    profile_photo_url text,
    started_coding_year integer,
    projects_count integer,
    years_experience integer,
    quote_text text,
    quote_author text,
    stat_1_value text,
    stat_1_label text,
    stat_2_value text,
    stat_2_label text,
    stat_3_value text,
    stat_3_label text,
    show_quote boolean DEFAULT true,
    show_stats boolean DEFAULT true,
    show_profile_photo boolean DEFAULT true,
    -- Translations
    hero_tagline_tr text,
    hero_tagline_de text,
    hero_tagline_es text,
    bio_tr text,
    bio_de text,
    bio_es text,
    role_tr text,
    role_de text,
    role_es text,
    quote_text_tr text,
    quote_text_de text,
    quote_text_es text,
    stat_1_label_tr text,
    stat_1_label_de text,
    stat_1_label_es text,
    stat_2_label_tr text,
    stat_2_label_de text,
    stat_2_label_es text,
    stat_3_label_tr text,
    stat_3_label_de text,
    stat_3_label_es text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Skill Categories
CREATE TABLE public.skill_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    skills jsonb DEFAULT '[]'::jsonb,
    title_tr text,
    title_de text,
    title_es text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Experiences (work history)
CREATE TABLE public.experiences (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    company text NOT NULL,
    location text,
    start_date text,
    end_date text,
    is_current boolean DEFAULT false,
    logo_url text,
    description text,
    -- Translations
    title_tr text,
    title_de text,
    title_es text,
    description_tr text,
    description_de text,
    description_es text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Educations
CREATE TABLE public.educations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    university text NOT NULL,
    degree text,
    major text,
    location text,
    start_date text,
    end_date text,
    logo_url text,
    is_current boolean DEFAULT false,
    gpa text,
    -- Translations
    university_tr text,
    university_de text,
    university_es text,
    degree_tr text,
    degree_de text,
    degree_es text,
    major_tr text,
    major_de text,
    major_es text,
    location_tr text,
    location_de text,
    location_es text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Languages (proficiency levels 0-100)
CREATE TABLE public.languages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    level text,
    name_tr text,
    name_de text,
    name_es text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activities / Leadership
CREATE TABLE public.activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization text NOT NULL,
    role text NOT NULL,
    start_date text,
    end_date text,
    logo_url text,
    description text,
    link_url text,
    -- Translations
    organization_tr text,
    organization_de text,
    organization_es text,
    role_tr text,
    role_de text,
    role_es text,
    description_tr text,
    description_de text,
    description_es text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Certifications
CREATE TABLE public.certifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    issuer text NOT NULL,
    issue_date text,
    icon_url text,
    link_url text,
    -- Translations
    name_tr text,
    name_de text,
    name_es text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Certification Skills (Junction Table)
CREATE TABLE public.certification_skills (
    certification_id uuid NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
    skill_category_id uuid NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
    CONSTRAINT certification_skills_pkey PRIMARY KEY (certification_id, skill_category_id)
);

-- Projects (Works)
CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    link text,
    github text,
    image text,
    tags jsonb DEFAULT '[]'::jsonb,
    title_tr text,
    description_tr text,
    title_de text,
    description_de text,
    title_es text,
    description_es text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Project Images
CREATE TABLE public.project_images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    caption text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blogs
CREATE TABLE public.blogs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    excerpt text,
    content text,
    date text,
    read_time text,
    title_tr text,
    excerpt_tr text,
    content_tr text,
    title_de text,
    excerpt_de text,
    content_de text,
    title_es text,
    excerpt_es text,
    content_es text,
    linked_project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
    linked_experience_id uuid REFERENCES public.experiences(id) ON DELETE SET NULL,
    linked_education_id uuid REFERENCES public.educations(id) ON DELETE SET NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Social Links (for dock navigation)
CREATE TABLE public.social_links (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    platform text NOT NULL,
    url text NOT NULL,
    icon text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- DATA VALIDATION CONSTRAINTS (Security Hardening)
-- =============================================

-- URL Validations to prevent stored XSS or bad links
ALTER TABLE public.about_me ADD CONSTRAINT check_about_photo_url CHECK (profile_photo_url IS NULL OR profile_photo_url ~ '^https?://|^\/');
ALTER TABLE public.experiences ADD CONSTRAINT check_exp_logo_url CHECK (logo_url IS NULL OR logo_url ~ '^https?://|^\/');
ALTER TABLE public.educations ADD CONSTRAINT check_edu_logo_url CHECK (logo_url IS NULL OR logo_url ~ '^https?://|^\/');
ALTER TABLE public.activities ADD CONSTRAINT check_act_logo_url CHECK (logo_url IS NULL OR logo_url ~ '^https?://|^\/');
ALTER TABLE public.activities ADD CONSTRAINT check_act_link_url CHECK (link_url IS NULL OR link_url ~ '^https?://|^\/');
ALTER TABLE public.certifications ADD CONSTRAINT check_cert_icon_url CHECK (icon_url IS NULL OR icon_url ~ '^https?://|^\/');
ALTER TABLE public.certifications ADD CONSTRAINT check_cert_link_url CHECK (link_url IS NULL OR link_url ~ '^https?://|^\/');
ALTER TABLE public.projects ADD CONSTRAINT check_project_link CHECK (link IS NULL OR link ~ '^https?://|^\/');
ALTER TABLE public.projects ADD CONSTRAINT check_project_github CHECK (github IS NULL OR github ~ '^https?://|^\/');
ALTER TABLE public.projects ADD CONSTRAINT check_project_image CHECK (image IS NULL OR image ~ '^https?://|^\/');
ALTER TABLE public.project_images ADD CONSTRAINT check_project_images_url CHECK (image_url ~ '^https?://|^\/');
ALTER TABLE public.social_links ADD CONSTRAINT check_social_url CHECK (url IS NULL OR url ~ '^https?://|^mailto:');

-- Content Length Limits to prevent DoS (payload size)
ALTER TABLE public.about_me ADD CONSTRAINT check_bio_length CHECK (char_length(bio) <= 5000);
ALTER TABLE public.about_me ADD CONSTRAINT check_bio_tr_length CHECK (bio_tr IS NULL OR char_length(bio_tr) <= 5000);
ALTER TABLE public.about_me ADD CONSTRAINT check_bio_de_length CHECK (bio_de IS NULL OR char_length(bio_de) <= 5000);
ALTER TABLE public.about_me ADD CONSTRAINT check_bio_es_length CHECK (bio_es IS NULL OR char_length(bio_es) <= 5000);

ALTER TABLE public.experiences ADD CONSTRAINT check_exp_desc_length CHECK (char_length(description) <= 5000);
ALTER TABLE public.experiences ADD CONSTRAINT check_exp_desc_tr_length CHECK (description_tr IS NULL OR char_length(description_tr) <= 5000);
ALTER TABLE public.experiences ADD CONSTRAINT check_exp_desc_de_length CHECK (description_de IS NULL OR char_length(description_de) <= 5000);
ALTER TABLE public.experiences ADD CONSTRAINT check_exp_desc_es_length CHECK (description_es IS NULL OR char_length(description_es) <= 5000);

ALTER TABLE public.activities ADD CONSTRAINT check_act_desc_length CHECK (char_length(description) <= 5000);
ALTER TABLE public.activities ADD CONSTRAINT check_act_desc_tr_length CHECK (description_tr IS NULL OR char_length(description_tr) <= 5000);
ALTER TABLE public.activities ADD CONSTRAINT check_act_desc_de_length CHECK (description_de IS NULL OR char_length(description_de) <= 5000);
ALTER TABLE public.activities ADD CONSTRAINT check_act_desc_es_length CHECK (description_es IS NULL OR char_length(description_es) <= 5000);

ALTER TABLE public.projects ADD CONSTRAINT check_project_desc_length CHECK (char_length(description) <= 5000);
ALTER TABLE public.projects ADD CONSTRAINT check_project_desc_tr_length CHECK (description_tr IS NULL OR char_length(description_tr) <= 5000);
ALTER TABLE public.projects ADD CONSTRAINT check_project_desc_de_length CHECK (description_de IS NULL OR char_length(description_de) <= 5000);
ALTER TABLE public.projects ADD CONSTRAINT check_project_desc_es_length CHECK (description_es IS NULL OR char_length(description_es) <= 5000);

ALTER TABLE public.blogs ADD CONSTRAINT check_blog_excerpt_length CHECK (char_length(excerpt) <= 2000);
ALTER TABLE public.blogs ADD CONSTRAINT check_blog_content_length CHECK (char_length(content) <= 100000);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE public.about_me ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certification_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ
CREATE POLICY "Public read" ON public.section_order FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.about_me FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.educations FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.certification_skills FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.social_links FOR SELECT USING (true);

-- ADMIN-ONLY WRITE (locked to site owner)
-- ⚠️ SETUP REQUIRED: Replace YOUR-USER-UUID-HERE with your Supabase Auth user ID.

CREATE POLICY "Admin insert" ON public.section_order FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.section_order FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.section_order FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.about_me FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.about_me FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.about_me FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.skill_categories FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.skill_categories FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.skill_categories FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.experiences FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.experiences FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.experiences FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.educations FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.educations FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.educations FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.languages FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.languages FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.languages FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.activities FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.activities FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.activities FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.certifications FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.certifications FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.certifications FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.certification_skills FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.certification_skills FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.certification_skills FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.projects FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.projects FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.projects FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.project_images FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.project_images FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.project_images FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.blogs FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.blogs FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.blogs FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);

CREATE POLICY "Admin insert" ON public.social_links FOR INSERT WITH CHECK (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.social_links FOR UPDATE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.social_links FOR DELETE USING (auth.uid() = 'YOUR-USER-UUID-HERE'::uuid);
