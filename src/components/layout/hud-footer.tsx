"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { useData } from "@/lib/use-data";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

interface SiteConfig {
  name: string;
  siteName: string;
  sysVersion: string;
}

export function HudFooter() {
  const { data: config } = useData<SiteConfig>("/api/config");

  const siteName = config?.siteName || "AETHER";
  const authorName = config?.name || "Bahrul Ulumul Haq";
  const sysVersion = config?.sysVersion || "v2.4.1";

  return (
    <footer aria-label="Portal Footer" className="relative border-t border-leather-caramel/25 dark:border-border-subtle bg-parchment-base/90 dark:bg-deep-space/90 transition-colors">
      {/* Accent bar */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-leather-caramel/40 dark:via-gold-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 relative">
              <Image
                src={GENSHIN_UI_ICONS.archive}
                alt="Archive Icon"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="font-display text-xs font-bold tracking-[0.2em] text-leather-dark dark:text-platinum-50 uppercase">
              {siteName} // TEYVAT CODEX
            </span>
            <span className="sys-label font-mono tabular-nums text-leather-muted dark:text-text-muted font-bold">{sysVersion}</span>
          </div>

          {/* Center links */}
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              aria-label="Staff Login"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-leather-dark/80 dark:text-text-muted hover:text-leather-caramel dark:hover:text-gold-400 focus-ring-gold rounded-full px-3 py-1 bg-leather-caramel/10 dark:bg-gold-400/10 transition-colors font-bold"
            >
              <div className="w-3.5 h-3.5 relative">
                <Image
                  src={GENSHIN_UI_ICONS.archive}
                  alt="Staff Portal"
                  width={14}
                  height={14}
                  className="object-contain"
                />
              </div>
              <span>STAFF_LOGIN</span>
            </Link>
            <a
              href="#hero"
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1 font-mono text-xs text-leather-dark/80 dark:text-text-muted hover:text-leather-caramel dark:hover:text-gold-400 focus-ring-gold rounded-full px-3 py-1 bg-leather-caramel/10 dark:bg-gold-400/10 transition-colors font-bold"
            >
              <ArrowUp className="h-3.5 w-3.5 text-leather-caramel dark:text-gold-400" aria-hidden="true" />
              <span>TOP</span>
            </a>
          </div>

          {/* Copyright */}
          <p className="font-mono text-[10px] tracking-wider text-leather-muted dark:text-text-muted/40 tabular-nums font-semibold">
            &copy; {new Date().getFullYear()} {authorName} — Teyvat Traveler Dossier
          </p>
        </div>
      </div>
    </footer>
  );
}
