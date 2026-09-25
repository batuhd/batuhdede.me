import type { Metadata } from "next";
import { fetchHomeData } from "@/lib/data";
import { SiteDataProvider } from "@/context/site-data-context";
import { LanguageProvider } from "@/context/language-context";
import { AboutContent } from "@/components/home/about-content";
import type { Project, Blog, GalleryItem } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description: "About Batuhan Dede",
};

export default async function AboutPage() {
  const data = await fetchHomeData();

  const siteData = {
    aboutMe: data.aboutMe,
    skillCategories: data.skillCategories,
    experiences: data.experiences,
    educations: data.educations,
    languages: data.languages,
    activities: data.activities,
    certifications: data.certifications,
    certificationSkills: data.certificationSkills,
    sectionOrder: data.sectionOrder,
    projects: (data.projects || []) as Project[],
    blogs: (data.blogs || []) as Blog[],
    galleryItems: (data.galleryItems || []) as GalleryItem[],
    socialLinks: data.socialLinks,
    contactEmails: data.contactEmails,
    loaded: true,
    isMaintenance: data.sectionOrder.some(
      (s) => s.section_id === "maintenance_mode",
    ),
  };

  return (
    <LanguageProvider>
      <SiteDataProvider initialData={siteData}>
        <AboutContent />
      </SiteDataProvider>
    </LanguageProvider>
  );
}