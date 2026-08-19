"use client";

import Link from "next/link";
import { Activity, ArrowUp, Shield } from "lucide-react";
import { useData } from "@/lib/use-data";

interface SiteConfig {
  name: string;
  siteName: string;
  sysVersion: string;
}

export function HudFooter() {
  const { data: config } = useData<SiteConfig>("/api/config");

  const siteName = config?.siteName || "AETHER-HUD";
  const authorName = config?.name || "Bahrul Ulumul Haq";
  const sysVersion = config?.sysVersion || "v2.4.1";

  return (
    <footer aria-label="Portal Footer" className="relative border-t border-border-subtle bg-deep-space/80">
      {/* Accent bar */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Activity className="h-4 w-4 text-gold-500/50" aria-hidden="true" />
            <span className="font-display text-xs tracking-[0.2em] text-text-muted/40">
              {siteName}
            </span>
            <span className="sys-label font-mono tabular-nums">{sysVersion}</span>
          </div>

          {/* Center links */}
          <div className="flex items-center gap-5">
            <span className="sys-label hidden md:inline">
              [SYS_NODE//00]
            </span>
            <Link
              href="/login"
              aria-label="Portal Authentication"
              className="inline-flex items-center gap-1.5 sys-label text-text-muted hover:text-gold-400 focus-ring-gold chamfered-xs px-2 py-1 transition-colors duration-200"
            >
              <Shield className="h-3 w-3" aria-hidden="true" />
              PORTAL_AUTH
            </Link>
            <a
              href="#hero"
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1 sys-label text-text-muted hover:text-gold-400 focus-ring-gold chamfered-xs px-2 py-1 transition-colors duration-200"
            >
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
              TOP
            </a>
          </div>

          {/* Copyright */}
          <p className="font-mono text-[10px] tracking-wider text-text-muted/30 tabular-nums">
            &copy; {new Date().getFullYear()} {authorName}
          </p>
        </div>
      </div>
    </footer>
  );
}
