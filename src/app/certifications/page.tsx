import { redirect } from "next/navigation";

// Sertifikalar artık yalnızca ana sayfada (/ ve #certifications) gösteriliyor.
export default function CertificationsPage() {
  redirect("/");
}
