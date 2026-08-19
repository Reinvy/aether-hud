import Link from "next/link";
import { Activity, ArrowUp, Shield } from "lucide-react";
import { PORTFOLIO_CONFIG } from "@/lib/constants";

export function HudFooter() {
  return (
    <footer className="relative border-t border-border-subtle bg-deep-space/80">
      {/* Accent bar */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Activity className="h-4 w-4 text-gold-500/50" />
            <span className="font-display text-xs tracking-[0.2em] text-text-muted/40">
              AETHER-HUD
            </span>
            <span className="sys-label">{PORTFOLIO_CONFIG.sysVersion}</span>
          </div>

          {/* Center links */}
          <div className="flex items-center gap-5">
            <span className="sys-label hidden md:inline">
              [SYS_NODE//00]
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 sys-label text-text-muted hover:text-gold-400 transition-colors duration-200"
            >
              <Shield className="h-3 w-3" />
              PORTAL_AUTH
            </Link>
            <a
              href="#hero"
              className="inline-flex items-center gap-1 sys-label text-text-muted hover:text-gold-400 transition-colors duration-200"
            >
              <ArrowUp className="h-3 w-3" />
              TOP
            </a>
          </div>

          {/* Copyright */}
          <p className="font-mono text-[10px] tracking-wider text-text-muted/30">
            &copy; {new Date().getFullYear()} {PORTFOLIO_CONFIG.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
