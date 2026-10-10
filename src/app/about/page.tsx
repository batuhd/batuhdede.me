import { redirect } from "next/navigation";

// Hakkımda içeriği artık ana sayfada (`/`) gösteriliyor.
export default function AboutPage() {
  redirect("/");
}
