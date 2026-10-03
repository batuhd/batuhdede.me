"use client";

import { useCallback, useState } from "react";
import { fetchRecentImages } from "../lib/crud";

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
  if (recentCache) return recentCache;

  const sets: string[] = [];
  for (const [table, col] of IMAGE_COLUMNS) {
    const urls = await fetchRecentImages(table, col, 50);
    urls.forEach((value) => {
      const trimmed = String(value).trim();
      if (trimmed) sets.push(trimmed);
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