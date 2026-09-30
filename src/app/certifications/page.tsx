import { fetchHomeData } from "@/lib/data";
import { Metadata } from "next";
import { LanguageProvider } from "@/context/language-context";
import { SiteDataProvider } from "@/context/site-data-context";
import { Certifications } from "@/components/home/profile-sections";
import { siteConfig } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import type { Project, Blog } from "@/types";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Certifications",
    description: "My certifications and credentials",
    alternates: {
      canonical: `${siteConfig.url}/certifications`,
    },
    openGraph: {
      title: "Certifications",
      description: "My certifications and credentials",
      url: "/certifications",
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Certifications — Batuhan Dede",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Certifications",
      description: "My certifications and credentials",
      images: ["/opengraph-image"],
    },
  };
}

export default async function CertificationsPage() {
  const data = await fetchHomeData();

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Sertifikalar", url: `${siteConfig.url}/certifications` },
  ]);

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
    loaded: true,
    isMaintenance: data.sectionOrder.some(
      (s) => s.section_id === "maintenance_mode",
    ),
  };

  return (
    <LanguageProvider>
      <SiteDataProvider initialData={siteData}>
        <JsonLd data={breadcrumbSchema} />
        <div className="mx-auto w-full max-w-2xl pb-24">
          <Certifications />
        </div>
      </SiteDataProvider>
    </LanguageProvider>
  );
}