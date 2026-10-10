import { redirect } from "next/navigation";

// Sertifika detayları artık ayrı sayfa değil; ana sayfadaki modalda açılır.
export default function CertificationDetailPage() {
  redirect("/");
}
