import type { Metadata } from "next";
import { fetchHomeData } from "@/lib/data";
import { SiteDataProvider } from "@/context/site-data-context";
import { LanguageProvider } from "@/context/language-context";
import { AboutContent } from "@/components/home/about-content";
import { siteConfig } from "@/config/site";
import type { Project, Blog } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description: "About Batuhan Dede",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: "About — Batuhan Dede",
    description: "About Batuhan Dede",
    url: "/about",
    siteName: siteConfig.name,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "About — Batuhan Dede",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description: "About Batuhan Dede",
    images: ["/opengraph-image"],
  },
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
    socialLinks: data.socialLinks,
    contactEmails: data.contactEmails,
    projectCategories: data.projectCategories,
    blogCategories: data.blogCategories,
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