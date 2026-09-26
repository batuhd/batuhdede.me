import { fetchHomeData, getLocalized } from "@/lib/data";
import { userConfig } from "@/config/user";
import { siteConfig } from "@/config/site";
import { sanitizeUrl } from "@/lib/utils";
import { SiteDataProvider } from "@/context/site-data-context";
import type { Project, Blog } from "@/types";
import { JsonLd, personJsonLd, websiteJsonLd } from "@/components/json-ld";
import { Hero } from "@/components/home/hero";
import { Certifications } from "@/components/home/profile-sections";
import { RecentPosts } from "@/components/home/recent-posts";
import { SiteFooter } from "@/components/home/site-footer";

// ISR: 60 saniyede bir yenile
export const revalidate = 60;

// Metadata
export const metadata = {
  description: "Full Stack Developer & Software Engineer",
};

// Server Component
export default async function Home() {
  // Server'da veriyi çek - cache'li
  const data = await fetchHomeData();

  // SiteData formatına dönüştür (context beklediği formatta)
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
    contactEmails: data.contactEmails,
    loaded: true, // Server'da yüklendi
    isMaintenance: data.sectionOrder.some(
      (s) => s.section_id === "maintenance_mode",
    ),
  };

  // Varsayılan dil
  const defaultLang = "en";

  const profileImage = data.aboutMe?.profile_photo_url
    ? data.aboutMe.profile_photo_url.startsWith("/")
      ? `${siteConfig.url}${data.aboutMe.profile_photo_url}`
      : data.aboutMe.profile_photo_url
    : `${siteConfig.url}/media/yuvarlaklogobeyaz.png`;

  const sameAs = Array.from(
    new Set([
      ...data.socialLinks
        .map((link) => sanitizeUrl(link.url))
        .filter((url): url is string => Boolean(url)),
      userConfig.links.github,
      userConfig.links.linkedin,
      userConfig.links.instagram,
    ]),
  );

  const personSchema = personJsonLd({
    name: data.aboutMe?.name || userConfig.name,
    jobTitle: data.aboutMe?.role || userConfig.role,
    url: siteConfig.url,
    sameAs,
    image: profileImage,
    description:
      getLocalized(data.aboutMe, "bio", defaultLang) || userConfig.about,
  });

  const websiteSchema = websiteJsonLd({
    name: siteConfig.name,
    url: siteConfig.url,
    searchUrl: `${siteConfig.url}/blog?post={search_term_string}`,
  });

  return (
    <SiteDataProvider initialData={siteData}>
      <JsonLd data={[websiteSchema, personSchema]} />
      <Hero />

      <div className="mt-20">
        <Certifications variant="marquee" />
      </div>

      <div className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6">
        <RecentPosts />
      </div>

      <div className="mt-16">
        <SiteFooter />
      </div>
    </SiteDataProvider>
  );
}