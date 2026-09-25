import type { Metadata } from "next";
import { fetchUsesData } from "@/lib/data";
import { UsesContent } from "@/components/uses/uses-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Uses",
  description: "Tools I use to design, build and ship",
};

export default async function UsesPage() {
  const { usesCategories } = await fetchUsesData();
  return <UsesContent categories={usesCategories} />;
}