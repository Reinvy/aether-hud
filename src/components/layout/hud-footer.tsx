"use client";

import Link from "next/link";
import { Sparkles, ArrowUp, Shield } from "lucide-react";
import { useData } from "@/lib/use-data";

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
    <footer aria-label="Portal Footer" className="relative border-t border-leather-caramel/20 dark:border-border-subtle bg-parchment-subtle/80 dark:bg-deep-space/90 transition-colors">
      {/* Accent bar */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-leather-caramel/30 dark:via-gold-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-leather-caramel/60 dark:text-gold-500/50" aria-hidden="true" />
            <span className="font-display text-xs font-bold tracking-[0.2em] text-leather-dark/60 dark:text-text-muted/60 uppercase">
              {siteName} // TEYVAT CODEX
            </span>
            <span className="sys-label font-mono tabular-nums">{sysVersion}</span>
          </div>

          {/* Center links */}
          <div className="flex items-center gap-5">
            <span className="sys-label hidden md:inline text-leather-muted/60 dark:text-text-muted/40">
              [TEYVAT//00]
            </span>
            <Link
              href="/login"
              aria-label="Staff Login"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-leather-muted dark:text-text-muted hover:text-leather-dark dark:hover:text-gold-400 focus-ring-gold chamfered-xs px-2 py-1 transition-colors"
            >
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span>STAFF_LOGIN</span>
            </Link>
            <a
              href="#hero"
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1 font-mono text-xs text-leather-muted dark:text-text-muted hover:text-leather-dark dark:hover:text-gold-400 focus-ring-gold chamfered-xs px-2 py-1 transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              <span>TOP</span>
            </a>
          </div>

          {/* Copyright */}
          <p className="font-mono text-[10px] tracking-wider text-leather-muted/60 dark:text-text-muted/40 tabular-nums">
            &copy; {new Date().getFullYear()} {authorName} — Teyvat Traveler Dossier
          </p>
        </div>
      </div>
    </footer>
  );
}
