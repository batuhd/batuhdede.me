import type { Metadata } from "next";
import { fetchHomeData } from "@/lib/data";
import { SiteDataProvider } from "@/context/site-data-context";
import { ContactContent } from "@/components/contact/contact-content";
import { siteConfig } from "@/config/site";
import type { Project, Blog } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Batuhan Dede.",
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: `Contact — ${siteConfig.name}`,
    description: "Get in touch with Batuhan Dede.",
    url: "/contact",
    siteName: siteConfig.name,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `Contact — ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description: "Get in touch with Batuhan Dede.",
    images: ["/opengraph-image"],
  },
};

export default async function ContactPage() {
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
    <SiteDataProvider initialData={siteData}>
      <ContactContent />
    </SiteDataProvider>
  );
}
