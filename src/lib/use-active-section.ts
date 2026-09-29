"use client";

import { useEffect, useState } from "react";

/**
 * useActiveSection — one scroll-spy for every navigational surface.
 *
 * Replaces the two duplicated scroll loops in the desktop rail and the mobile
 * dock. An IntersectionObserver band across the middle of the viewport decides
 * which section owns the screen, `hashchange` covers in-page jumps, and the
 * registry order breaks ties so the flag never flickers between neighbours.
 */
export function useActiveSection(sectionIds: readonly string[]): string {
  const key = sectionIds.join("|");
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const ids = key.split("|").filter(Boolean);
    if (ids.length === 0) return;

    const visible = new Set<string>();
    let observer: IntersectionObserver | null = null;

    const sync = () => {
      const first = ids.find((id) => visible.has(id));
      if (first) setActive(first);
    };

    const attach = () => {
      observer?.disconnect();
      visible.clear();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target.id);
            else visible.delete(entry.target.id);
          }
          sync();
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    };

    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (ids.includes(hash)) setActive(hash);
    };

    // Sections may mount after this runs (they are code-split), so re-scan on
    // the next frame as well as immediately.
    attach();
    const frame = requestAnimationFrame(attach);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [key]);

  return active;
}
