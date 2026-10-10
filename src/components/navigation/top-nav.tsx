"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileMenu } from "./mobile-menu";
import { SocialRedirectModal } from "./social-redirect-modal";

export function TopNav() {
  const [socialRedirect, setSocialRedirect] = useState<{
    href: string;
    label: string;
  } | null>(null);

  const handleSocial = (href: string, label: string) =>
    setSocialRedirect({ href, label });

  return (
    <>
      <Sidebar onSocial={handleSocial} />
      <MobileMenu onSocial={handleSocial} />
      <SocialRedirectModal
        data={socialRedirect}
        onClose={() => setSocialRedirect(null)}
      />
    </>
  );
}
