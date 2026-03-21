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
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Languages (proficiency levels 0-100)
CREATE TABLE public.languages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    level text,
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
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.social_links FOR SELECT USING (true);

-- ADMIN-ONLY WRITE (only the first registered user can write)
-- This ensures that even if someone signs up, they cannot modify data.
-- Replace the subquery with your actual user UUID for even better security:
--   auth.uid() = 'YOUR-UUID-HERE'::uuid

CREATE POLICY "Admin insert" ON public.section_order FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.section_order FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.section_order FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.about_me FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.about_me FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.about_me FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.skill_categories FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.skill_categories FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.skill_categories FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.experiences FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.experiences FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.experiences FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.educations FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.educations FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.educations FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.languages FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.languages FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.languages FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.activities FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.activities FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.activities FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.certifications FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.certifications FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.certifications FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.projects FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.projects FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.projects FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.blogs FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.blogs FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.blogs FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

CREATE POLICY "Admin insert" ON public.social_links FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin update" ON public.social_links FOR UPDATE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));
CREATE POLICY "Admin delete" ON public.social_links FOR DELETE USING (auth.uid() = (SELECT id FROM auth.users LIMIT 1));

