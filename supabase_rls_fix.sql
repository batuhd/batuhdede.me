-- =============================================
-- RLS PERFORMANCE OPTIMIZATION MIGRATION
-- Fix auth_rls_initplan warnings
-- Replace auth.uid() with (select auth.uid()) for initplan optimization
-- =============================================

-- Drop existing policies first
DO $$
DECLARE
    tbl text;
    pol record;
BEGIN
    FOR tbl IN 
        SELECT unnest(ARRAY[
            'section_order', 'about_me', 'skill_categories', 'experiences', 
            'educations', 'languages', 'activities', 'certifications', 
            'certification_skills', 'projects', 'project_images', 'blogs', 
            'blog_images', 'social_links', 'contact_emails'
        ])
    LOOP
        FOR pol IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE schemaname = 'public' AND tablename = tbl
            AND policyname LIKE '%Admin%'
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
        END LOOP;
    END LOOP;
END $$;

-- =============================================
-- OPTIMIZED RLS POLICIES (Using Initplan)
-- auth.uid() -> (select auth.uid()) 
-- This prevents re-evaluation per row
-- =============================================

-- section_order
CREATE POLICY "Admin insert" ON public.section_order FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.section_order FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.section_order FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- about_me
CREATE POLICY "Admin insert" ON public.about_me FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.about_me FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.about_me FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- skill_categories
CREATE POLICY "Admin insert" ON public.skill_categories FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.skill_categories FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.skill_categories FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- experiences
CREATE POLICY "Admin insert" ON public.experiences FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.experiences FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.experiences FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- educations
CREATE POLICY "Admin insert" ON public.educations FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.educations FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.educations FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- languages
CREATE POLICY "Admin insert" ON public.languages FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.languages FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.languages FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- activities
CREATE POLICY "Admin insert" ON public.activities FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.activities FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.activities FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- certifications
CREATE POLICY "Admin insert" ON public.certifications FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.certifications FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.certifications FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- certification_skills
CREATE POLICY "Admin insert" ON public.certification_skills FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.certification_skills FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.certification_skills FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- projects
CREATE POLICY "Admin insert" ON public.projects FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.projects FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.projects FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- project_images
CREATE POLICY "Admin insert" ON public.project_images FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.project_images FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.project_images FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- blogs
CREATE POLICY "Admin insert" ON public.blogs FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.blogs FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.blogs FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- blog_images
CREATE POLICY "Admin insert" ON public.blog_images FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.blog_images FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.blog_images FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- social_links
CREATE POLICY "Admin insert" ON public.social_links FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.social_links FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.social_links FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- contact_emails
CREATE POLICY "Admin insert" ON public.contact_emails FOR INSERT WITH CHECK ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin update" ON public.contact_emails FOR UPDATE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);
CREATE POLICY "Admin delete" ON public.contact_emails FOR DELETE USING ((select auth.uid()) = 'YOUR-USER-UUID-HERE'::uuid);

-- Drop old authenticated user policies for contact_emails and blog_images
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.contact_emails;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.contact_emails;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON public.contact_emails;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.blog_images;

-- =============================================
-- INDEX OPTIMIZATIONS FOR FASTER QUERIES
-- =============================================

-- Order index columns (most frequently used in ORDER BY)
CREATE INDEX IF NOT EXISTS idx_skill_categories_order ON skill_categories(order_index);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(order_index);
CREATE INDEX IF NOT EXISTS idx_educations_order ON educations(order_index);
CREATE INDEX IF NOT EXISTS idx_languages_order ON languages(order_index);
CREATE INDEX IF NOT EXISTS idx_activities_order ON activities(order_index);
CREATE INDEX IF NOT EXISTS idx_certifications_order ON certifications(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_blogs_order ON blogs(order_index);
CREATE INDEX IF NOT EXISTS idx_section_order_idx ON section_order(order_index);

-- Foreign key / relation indexes
CREATE INDEX IF NOT EXISTS idx_blog_images_blog_id ON blog_images(blog_id);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_certification_skills_cert_id ON certification_skills(certification_id);
CREATE INDEX IF NOT EXISTS idx_certification_skills_skill_id ON certification_skills(skill_category_id);

-- Linked entity indexes for faster joins
CREATE INDEX IF NOT EXISTS idx_blogs_project_id ON blogs(linked_project_id) WHERE linked_project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_exp_id ON projects(linked_experience_id) WHERE linked_experience_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_edu_id ON projects(linked_education_id) WHERE linked_education_id IS NOT NULL;
