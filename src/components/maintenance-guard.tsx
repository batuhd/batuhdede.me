"use client";

import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import { ReactNode } from "react";
import { HttpCat } from "@/components/http-cat";

export function MaintenanceGuard({
  children,
  isMaintenance,
}: {
  children: ReactNode;
  /** Sunucuda hesaplanir (bkz. `fetchMaintenanceMode`). */
  isMaintenance: boolean;
}) {
  const pathname = usePathname();

  // Admin panel is always accessible
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Karar sunucuda verildigi icin `loaded` beklemiyoruz: SSG/pre-render
  // HTML'inde de bakim ekrani render edilir, icerik sizmaz.
  if (isMaintenance) {
    return (
      <div className="flex flex-col min-h-[80vh] items-center justify-center space-y-8 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center bg-muted">
          <Wrench className="h-10 w-10 text-muted-foreground animate-pulse" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight">Site Under Maintenance</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            We&apos;re currently performing some updates to the site. Please check back later!
          </p>
        </div>

        <div className="mt-8 w-full max-w-sm">
          <HttpCat status={503} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}