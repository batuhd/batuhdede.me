"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Overlay açıkken klavye odağını kapsayıcı içinde tutar, kapanınca geri verir. */
export function useFocusTrap<T extends HTMLElement>(
  ref: RefObject<T | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null,
      );

    const previouslyFocused = document.activeElement as HTMLElement | null;
    getFocusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const nodes = getFocusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active, ref]);
}
