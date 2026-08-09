"use client";

import { motion } from "framer-motion";
import { StatusDot } from "@/components/ui/status-dot";
import { Badge } from "@/components/ui/badge";

/**
 * HeroTerminalPanel — the hero's terminal-style dossier card.
 *
 * Extracted from the hero section: a chamfered glass panel with the
 * classic terminal chrome (traffic dots, `$ whoami` prompt, mono log
 * lines) and the core-stack tech badges. Reusable wherever a
 * "system readout" panel is needed (about sections, profile headers).
 */
export function HeroTerminalPanel() {
  return (
    <motion.div
      className="relative mx-auto mt-16 max-w-4xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="glass-panel chamfered overflow-hidden corner-brackets transition-all duration-300 hover:border-border-glass hover:shadow-[0_0_30px_rgba(242,201,76,0.08)]">
        {/* Terminal-style header */}
        <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
          <div className="flex gap-1.5">
            <StatusDot tone="danger" label="Terminal closed" className="h-3 w-3" />
            <StatusDot tone="warning" label="Terminal minimized" className="h-3 w-3" />
            <StatusDot tone="active" label="Terminal open" className="h-3 w-3" />
          </div>
          <div className="ml-4 flex gap-1 sys-label">
            <span className="chamfered-xs bg-[rgba(242,201,76,0.1)] px-2 py-0.5 text-gold-400">
              aether
            </span>
            <span className="text-text-muted/30">/</span>
            <span className="text-text-muted/50">$(whoami)</span>
          </div>
          <span className="ml-auto sys-label text-text-muted/20">NODE//01 // ACTIVE</span>
        </div>

        {/* Terminal content */}
        <div className="p-6 sm:p-10">
          <div className="space-y-3 font-mono text-sm">
            <p className="text-text-muted">
              <span className="text-gold-400">[AETHER@HUD]</span>
              <span className="text-text-muted/30">:~$</span> cat /etc/profile
            </p>
            <p className="text-text-main/80">
              {">"} Full-Stack Developer specializing in AI-driven applications
            </p>
            <p className="text-text-main/80">
              {">"} Core Stack: Next.js · TypeScript · Prisma · Python
            </p>
            <p className="text-text-main/80">
              {">"} Design Philosophy: AAA Game HUD Aesthetics · Luxury Cybernetics
            </p>
            <p className="text-gold-400/70">
              {">"} <span className="animate-energy-pulse">_</span> Ready for deployment
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="gold" size="sm">Next.js</Badge>
            <Badge variant="gold" size="sm">TypeScript</Badge>
            <Badge variant="stellar" size="sm">AI</Badge>
            <Badge variant="gold" size="sm">Prisma</Badge>
            <Badge variant="default" size="sm">Tailwind v4</Badge>
            <Badge variant="default" size="sm">Framer Motion</Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
