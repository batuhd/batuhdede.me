"use client";

import { useSiteData } from "@/context/site-data-context";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export function MaintenanceGuard({ children }: { children: ReactNode }) {
  const { isMaintenance, loaded } = useSiteData();
  const pathname = usePathname();
  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    const images = ["/media/530.jpg", "/media/503.jpg", "/media/102.jpg"];
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
  }, []);

  // Admin panel is always accessible
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Evaluate maintenance mode only after loaded
  if (loaded && isMaintenance) {
    return (
      <div className="flex flex-col min-h-[80vh] items-center justify-center space-y-8 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Wrench className="h-10 w-10 text-primary animate-pulse" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Site Under Maintenance</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            We're currently performing some updates to the site. Please check back later!
          </p>
        </div>
        
        {randomImage && (
          <div className="mt-8 overflow-hidden rounded-2xl border-2 border-primary/10 shadow-2xl max-w-sm w-full">
            <img 
              src={randomImage} 
              alt="Maintenance Mode" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
