import { Suspense } from "react";
import { fetchWorksData } from "@/lib/data";
import { Metadata } from "next";
import { WorksContent } from "./works-content";
import { siteConfig } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Works",
    description: "A collection of my projects and works",
    alternates: {
      canonical: `${siteConfig.url}/works`,
    },
    openGraph: {
      title: "Works",
      description: "A collection of my projects and works",
      url: "/works",
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Works — Batuhan Dede",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Works",
      description: "A collection of my projects and works",
      images: ["/opengraph-image"],
    },
  };
}

export default async function WorksPage() {
  const { projects, entityMap, relatedBlogs, projectCategories } = await fetchWorksData();

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Works", url: `${siteConfig.url}/works` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <WorksContent
          initialProjects={projects}
          entityMap={entityMap}
          relatedBlogs={relatedBlogs}
          projectCategories={projectCategories}
        />
      </Suspense>
    </>
  );
}