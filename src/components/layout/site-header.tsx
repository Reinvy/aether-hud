"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { PUBLIC_NAV } from "@/lib/navigation";
import { EASE_CODEX } from "@/lib/motion-variants";
import { AssetIcon } from "@/components/ui/asset-icon";
import { CodexGlyph } from "@/components/ui/codex-glyph";
import { useActiveSection } from "@/lib/use-active-section";
import { useMotionPrefs } from "@/components/motion-provider";

interface SiteHeaderProps {
  /** Site name from the codex config; falls back to the build-time identity. */
  siteName?: string;
}

/**
 * SiteHeader — the persistent public shell header.
 *
 * Renders from `PUBLIC_NAV` (the single navigation registry) and reports the
 * section currently on screen via `aria-current="location"`. The previous
 * `HudHeader` was never imported by any route, so the public site had no
 * header at all.
 */
export function SiteHeader({ siteName = APP_NAME }: SiteHeaderProps) {
  const activeSection = useActiveSection(PUBLIC_NAV.map((item) => item.sectionId));
  const { animationsEnabled, setAnimationsEnabled } = useMotionPrefs();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-40 border-b border-leather-caramel/25 bg-parchment-base/92 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand crest */}
        <a
          href="/#hero"
          className="flex min-w-0 items-center gap-3 codex-radius-sm codex-focus"
          aria-label={`${siteName} — back to the traveler dossier`}
        >
          <AssetIcon icon="characterAether" size="lg" className="shrink-0" />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-bold tracking-[0.12em] text-leather-dark">
              {siteName}
            </span>
            <span className="codex-label block text-[9px]">Traveler Dossier</span>
          </span>
        </a>

        {/* Desktop navigation */}
        <nav aria-label="Codex sections" className="ml-auto hidden items-center gap-1 lg:flex">
          {PUBLIC_NAV.map((item) => {
            const isActive = activeSection === item.sectionId;
            return (
              <a
                key={item.sectionId}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "codex-radius-sm px-3 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-colors codex-focus",
                  isActive
                    ? "bg-leather-caramel/15 text-leather-dark"
                    : "text-leather-muted hover:bg-leather-caramel/10 hover:text-leather-dark"
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <button
            type="button"
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            aria-pressed={animationsEnabled}
            aria-label={animationsEnabled ? "Disable motion effects" : "Enable motion effects"}
            className="press-scale flex h-9 w-9 items-center justify-center codex-radius-sm border border-leather-caramel/25 text-leather-muted transition-colors hover:text-leather-dark codex-focus"
          >
            <AssetIcon
              icon="wish"
              size="sm"
              className={cn(animationsEnabled ? "opacity-100" : "opacity-45")}
            />
          </button>

          <Link
            href="/login"
            className="codex-sheen hidden codex-radius-sm border border-leather-caramel/35 px-3.5 py-2 text-xs font-semibold tracking-[0.12em] uppercase text-leather-dark transition-colors hover:bg-leather-caramel/10 codex-focus sm:block"
          >
            Codex Console
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="codex-mobile-menu"
            aria-label={menuOpen ? "Close section menu" : "Open section menu"}
            className="press-scale flex h-9 w-9 items-center justify-center codex-radius-sm border border-leather-caramel/25 text-leather-muted transition-colors hover:text-leather-dark codex-focus lg:hidden"
          >
            {menuOpen ? <CodexGlyph name="close" /> : <AssetIcon icon="paimonMenu" size="sm" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="codex-mobile-menu"
            aria-label="Codex sections"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_CODEX }}
            className="overflow-hidden border-t border-leather-caramel/20 px-4 pb-3 pt-2 sm:px-6 lg:hidden"
          >
          <ul className="grid gap-1">
            {PUBLIC_NAV.map((item) => (
              <li key={item.sectionId}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={activeSection === item.sectionId ? "location" : undefined}
                  className="block codex-radius-sm px-3 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-leather-muted transition-colors hover:bg-leather-caramel/10 hover:text-leather-dark codex-focus"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={closeMenu}
                className="block codex-radius-sm px-3 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-leather-dark transition-colors hover:bg-leather-caramel/10 codex-focus"
              >
                Codex Console
              </Link>
            </li>
          </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
