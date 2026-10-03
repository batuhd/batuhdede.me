"use client";

import { useEffect } from "react";

interface UseModalHistoryOptions<T> {
  /** Temel liste yolu, örn. "/works" */
  basePath: string;
  items: T[];
  /** Derin link (örn. /works/portfolio) ile gelen slug — modali aç. */
  initialSlug?: string;
  getSlug: (item: T) => string | undefined;
  getId: (item: T) => string;
  setSelected: (item: T | null) => void;
}

/**
 * Modali sayfayı yeniden yüklemeden (history API ile) açar/kapatır.
 * - Açma: pushState("/base/slug") → URL temiz kalır, sayfa yenilenmez.
 * - Kapatma: önceki yola (backTo) replaceState eder.
 * - Geri/ileri tuşları popstate ile modal durumunu senkronize eder.
 * Derin linkler (doğrudan /base/slug) [slug] route'larıyla karşılanır;
 * bu hook yalnızca o sayfadaki liste/modal etkileşimini yönetir.
 */
export function useModalHistory<T>({
  basePath,
  items,
  initialSlug,
  getSlug,
  getId,
  setSelected,
}: UseModalHistoryOptions<T>) {
  // Derin linkten gelen öğeyi aç (örn: /works/portfolio)
  useEffect(() => {
    if (!initialSlug || items.length === 0) return;
    const target =
      items.find((i) => getSlug(i) === initialSlug) ||
      items.find((i) => getId(i) === initialSlug);
    if (target) setSelected(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug, items]);

  const open = (item: T) => {
    setSelected(item);
    window.history.pushState(
      { backTo: window.location.pathname },
      "",
      `${basePath}/${getSlug(item) || getId(item)}`,
    );
  };

  const close = () => {
    setSelected(null);
    const backTo =
      (window.history.state && (window.history.state.backTo as string)) ||
      basePath;
    window.history.replaceState({}, "", backTo);
  };

  // Geri/ileri tuşlarıyla modal durumunu senkronize et
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      if (path.startsWith(`${basePath}/`)) {
        // Bozuk yuzde kodlamasi (orn. `/certifications/%`) decodeURIComponent
        // icinde URIError firlatip tum popstate dinleyicisini olduruyordu.
        let slug = "";
        try {
          slug = decodeURIComponent(path.slice(basePath.length + 1));
        } catch {
          setSelected(null);
          return;
        }
        const target =
          items.find((i) => getSlug(i) === slug) ||
          items.find((i) => getId(i) === slug);
        setSelected(target || null);
      } else {
        setSelected(null);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, basePath]);

  return { open, close };
}