import type { Metadata } from "next";
import { fetchPrototypesData } from "@/lib/data";
import { PrototypesContent } from "@/components/prototypes/prototypes-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Prototypes",
  description: "Interactive experiments and working concepts",
};

export default async function PrototypesPage() {
  const { prototypes } = await fetchPrototypesData();
  return <PrototypesContent prototypes={prototypes} />;
}