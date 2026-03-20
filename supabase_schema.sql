-- =============================================
-- SUPABASE SCHEMA — Portfolio Database
-- =============================================
-- Security Model:
--   ✅ Anyone can READ (public portfolio)
--   ✅ Only authenticated users can WRITE
--   ✅ SQL Injection impossible (Supabase PostgREST)
-- =============================================

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
    reading_level integer DEFAULT 0,
    listening_level integer DEFAULT 0,
    writing_level integer DEFAULT 0,
    speaking_level integer DEFAULT 0,
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

-- AUTHENTICATED WRITE
CREATE POLICY "Auth insert" ON public.about_me FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.about_me FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.about_me FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON public.skill_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.skill_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.skill_categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON public.experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.experiences FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON public.educations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.educations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.educations FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON public.languages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.languages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.languages FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON public.activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.activities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.activities FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON public.certifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.certifications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.certifications FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON public.blogs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.blogs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.blogs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert" ON public.social_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update" ON public.social_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete" ON public.social_links FOR DELETE USING (auth.role() = 'authenticated');
