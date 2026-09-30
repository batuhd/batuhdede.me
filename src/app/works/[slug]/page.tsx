import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchWorksData, getLocalized } from "@/lib/data";
import { Metadata } from "next";
import { WorksContent } from "../works-content";
import { siteConfig } from "@/config/site";
import { JsonLd, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/components/json-ld";

export const revalidate = 60;

export async function generateStaticParams() {
  const { projects } = await fetchWorksData();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await fetchWorksData();
  const selectedProject = projects.find((p) => p.slug === slug);

  if (!selectedProject) {
    return { title: "Works" };
  }

  const title = getLocalized(selectedProject, "title", "en");
  const description = getLocalized(selectedProject, "description", "en");
  const ogImage = `/api/og/works?slug=${encodeURIComponent(selectedProject.slug)}`;
  const canonical = `${siteConfig.url}/works/${selectedProject.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: `/works/${selectedProject.slug}`,
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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { projects, entityMap, relatedBlogs, projectCategories } = await fetchWorksData();
  const selectedProject = projects.find((p) => p.slug === slug);
  if (!selectedProject) notFound();

  const softwareSchema = softwareApplicationJsonLd({
    name: getLocalized(selectedProject, "title", "en"),
    description: getLocalized(selectedProject, "description", "en"),
    url: selectedProject.link
      ? selectedProject.link.startsWith("/")
        ? `${siteConfig.url}${selectedProject.link}`
        : selectedProject.link
      : `${siteConfig.url}/works/${selectedProject.slug}`,
    author: siteConfig.name,
    image: selectedProject.image
      ? selectedProject.image.startsWith("/")
        ? `${siteConfig.url}${selectedProject.image}`
        : selectedProject.image
      : undefined,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Works", url: `${siteConfig.url}/works` },
    {
      name: getLocalized(selectedProject, "title", "en"),
      url: `${siteConfig.url}/works/${selectedProject.slug}`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={softwareSchema} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <WorksContent
          initialProjects={projects}
          entityMap={entityMap}
          relatedBlogs={relatedBlogs}
          projectCategories={projectCategories}
          initialSelectedSlug={selectedProject.slug}
        />
      </Suspense>
    </>
  );
}