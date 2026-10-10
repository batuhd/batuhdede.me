"use client";

import { useSyncExternalStore } from "react";

/**
 * Sidebar (layout ağacı) ile sayfa içeriği (galeri) farklı React dallarında
 * olduğundan, "önceki/sonraki" ve "küçük resimleri göster" kontrolleri küçük
 * bir external store üzerinden paylaşılır.
 *
 * - Sayfa detayları mount olurken `registerGallery()` çağırır.
 * - İndeks/komşu bilgisini `updateGallery({ hasPrev, hasNext, onPrev, onNext })`
 *   ile günceller (bu, thumbs tercihini sıfırlamaz).
 * - Sidebar/mobil kontrolleri `galleryPrev/galleryNext/toggleGalleryThumbs`
 *   ile tetikler, `useGallery()` ile durumu okur.
 */

interface GalleryHandlers {
  onPrev: () => void;
  onNext: () => void;
}

interface GallerySnapshot {
  active: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  thumbs: boolean;
}

const EMPTY: GallerySnapshot = {
  active: false,
  hasPrev: false,
  hasNext: false,
  thumbs: false,
};

let handlers: GalleryHandlers = { onPrev: () => {}, onNext: () => {} };
let snapshot: GallerySnapshot = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY;
}

export function registerGallery(): () => void {
  handlers = { onPrev: () => {}, onNext: () => {} };
  snapshot = { active: true, hasPrev: false, hasNext: false, thumbs: false };
  emit();
  return () => {
    handlers = { onPrev: () => {}, onNext: () => {} };
    snapshot = EMPTY;
    emit();
  };
}

export function updateGallery(next: {
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) {
  if (next.onPrev) handlers.onPrev = next.onPrev;
  if (next.onNext) handlers.onNext = next.onNext;

  const hasPrev = next.hasPrev ?? snapshot.hasPrev;
  const hasNext = next.hasNext ?? snapshot.hasNext;
  if (hasPrev !== snapshot.hasPrev || hasNext !== snapshot.hasNext) {
    snapshot = { ...snapshot, hasPrev, hasNext };
    emit();
  }
}

export function galleryPrev() {
  handlers.onPrev();
}

export function galleryNext() {
  handlers.onNext();
}

export function toggleGalleryThumbs() {
  snapshot = { ...snapshot, thumbs: !snapshot.thumbs };
  emit();
}

export function useGallery(): GallerySnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
