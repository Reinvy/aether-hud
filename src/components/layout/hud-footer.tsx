import { Activity } from "lucide-react";
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
          <div className="flex items-center gap-6">
            <span className="sys-label">
              [SYS_NODE//00] // ALL RIGHTS RESERVED
            </span>
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
