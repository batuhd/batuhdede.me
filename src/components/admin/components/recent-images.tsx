"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";

const IMAGE_COLUMNS: ReadonlyArray<readonly [string, string]> = [
  ["about_me", "profile_photo_url"],
  ["experiences", "logo_url"],
  ["educations", "logo_url"],
  ["activities", "logo_url"],
  ["certifications", "icon_url"],
  ["projects", "image"],
  ["project_images", "image_url"],
  ["blogs", "image_url"],
  ["blog_images", "image_url"],
];

let recentCache: string[] | null = null;

async function loadRecentImages(): Promise<string[]> {
  if (!supabase) return [];
  if (recentCache) return recentCache;

  const sets: string[] = [];
  for (const [table, col] of IMAGE_COLUMNS) {
    const result = (await supabase.from(table).select(col).limit(50)) as unknown as {
      data: Array<Record<string, unknown>> | null;
      error: unknown;
    };
    (result.data ?? []).forEach((row) => {
      const value = String(row[col] ?? "").trim();
      if (value) sets.push(value);
    });
  }
  recentCache = Array.from(new Set(sets));
  return recentCache;
}

/** Son kullanılan görselleri bir kez yükler; manuel yenileme destekler. */
export function useRecentImages() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setImages(await loadRecentImages());
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const ensureLoaded = useCallback(() => {
    if (!loaded && !loading) void reload();
  }, [loaded, loading, reload]);

  return { images, loading, reload, ensureLoaded };
}