import { notFound } from "next/navigation";
import { fetchHomeData, getLocalized } from "@/lib/data";
import { sanitizeUrl } from "@/lib/utils";
import { Metadata } from "next";
import { LanguageProvider } from "@/context/language-context";
import { SiteDataProvider } from "@/context/site-data-context";
import { Certifications } from "@/components/home/profile-sections";
import { siteConfig } from "@/config/site";
import { JsonLd, educationalCredentialJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import type { Project, Blog } from "@/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const data = await fetchHomeData();
  return data.certifications.map((cert) => ({ slug: cert.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchHomeData();
  const selectedCert = data.certifications.find((c) => c.slug === slug);

  if (!selectedCert) {
    return { title: "Certifications" };
  }

  const title = getLocalized(selectedCert, "name", "en");
  const description = `Certification issued by ${getLocalized(selectedCert, "issuer", "en")}`;
  const ogImage = `/api/og/certifications?slug=${encodeURIComponent(selectedCert.slug)}`;
  const canonical = `${siteConfig.url}/certifications/${selectedCert.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: `/certifications/${selectedCert.slug}`,
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CertificationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchHomeData();
  const selectedCert = data.certifications.find((c) => c.slug === slug);
  if (!selectedCert) notFound();

  const safeCertLinkUrl = selectedCert.link_url
    ? sanitizeUrl(selectedCert.link_url)
    : null;
  const safeCertIconUrl = selectedCert.icon_url
    ? sanitizeUrl(selectedCert.icon_url)
    : null;

  const credentialSchema = educationalCredentialJsonLd({
    name: getLocalized(selectedCert, "name", "en"),
    description: `Certification issued by ${getLocalized(selectedCert, "issuer", "en")}`,
    url: safeCertLinkUrl
      ? safeCertLinkUrl.startsWith("/")
        ? `${siteConfig.url}${safeCertLinkUrl}`
        : safeCertLinkUrl
      : `${siteConfig.url}/certifications/${selectedCert.slug}`,
    image: safeCertIconUrl
      ? safeCertIconUrl.startsWith("/")
        ? `${siteConfig.url}${safeCertIconUrl}`
        : safeCertIconUrl
      : undefined,
    organization: getLocalized(selectedCert, "issuer", "en"),
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Sertifikalar", url: `${siteConfig.url}/certifications` },
    {
      name: getLocalized(selectedCert, "name", "en"),
      url: `${siteConfig.url}/certifications/${selectedCert.slug}`,
    },
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
        <JsonLd data={credentialSchema} />
        <div className="mx-auto w-full max-w-2xl pb-24">
          <Certifications initialSelectedSlug={selectedCert.slug} />
        </div>
      </SiteDataProvider>
    </LanguageProvider>
  );
}