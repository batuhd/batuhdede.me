import { Suspense } from "react";
import { fetchWorksData, getLocalized } from "@/lib/data";
import { Metadata } from "next";
import { WorksContent } from "./works-content";
import { siteConfig } from "@/config/site";
import { JsonLd, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/components/json-ld";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}): Promise<Metadata> {
  const { project } = await searchParams;
  const { projects } = await fetchWorksData();
  const selectedProject = project
    ? projects.find((p) => p.id === project)
    : null;

  const title = selectedProject
    ? getLocalized(selectedProject, "title", "en")
    : "Works";
  const description = selectedProject
    ? getLocalized(selectedProject, "description", "en")
    : "A collection of my projects and works";
  const ogImage = project
    ? `/api/og/works?project=${encodeURIComponent(project)}`
    : "/opengraph-image";

  const canonical = selectedProject
    ? `${siteConfig.url}/works?project=${selectedProject.id}`
    : `${siteConfig.url}/works`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: selectedProject ? `/works?project=${selectedProject.id}` : "/works",
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: selectedProject ? title : "Works — Batuhan Dede",
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

export default async function WorksPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project } = await searchParams;
  const { projects, entityMap, relatedBlogs, projectCategories } = await fetchWorksData();

  const selectedProject = project ? projects.find((p) => p.id === project) : null;
  const softwareSchema = selectedProject
    ? softwareApplicationJsonLd({
        name: getLocalized(selectedProject, "title", "en"),
        description: getLocalized(selectedProject, "description", "en"),
        url: selectedProject.link
          ? selectedProject.link.startsWith("/")
            ? `${siteConfig.url}${selectedProject.link}`
            : selectedProject.link
          : `${siteConfig.url}/works?project=${selectedProject.id}`,
        author: siteConfig.name,
        image: selectedProject.image
          ? selectedProject.image.startsWith("/")
            ? `${siteConfig.url}${selectedProject.image}`
            : selectedProject.image
          : undefined,
      })
    : null;

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Works", url: `${siteConfig.url}/works` },
    ...(selectedProject
      ? [
          {
            name: getLocalized(selectedProject, "title", "en"),
            url: `${siteConfig.url}/works?project=${selectedProject.id}`,
          },
        ]
      : []),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {softwareSchema && <JsonLd data={softwareSchema} />}
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
