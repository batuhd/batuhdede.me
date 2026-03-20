"use client";

import { useSiteData } from "@/context/site-data-context";
import { usePathname } from "next/navigation";
import { Loader2, Wrench } from "lucide-react";
import { ReactNode } from "react";

export function MaintenanceGuard({ children }: { children: ReactNode }) {
  const { isMaintenance, loaded } = useSiteData();
  const pathname = usePathname();

  // Admin panel is always accessible
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Evaluate maintenance mode only after loaded
  if (loaded && isMaintenance) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center space-y-6 text-center px-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Wrench className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Site Under Maintenance</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're currently performing some updates to the site. Please check back later!
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
