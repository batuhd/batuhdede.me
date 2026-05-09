import { Suspense } from "react";
import { fetchWorksData } from "@/lib/data";
import { Metadata } from "next";
import { WorksContent } from "./works-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Works - Batuhan Akçan",
  description: "A showcase of my projects and work",
};

export default async function WorksPage() {
  const { projects, entityMap, relatedBlogs } = await fetchWorksData();

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <WorksContent
        initialProjects={projects}
        entityMap={entityMap}
        relatedBlogs={relatedBlogs}
      />
    </Suspense>
  );
}
