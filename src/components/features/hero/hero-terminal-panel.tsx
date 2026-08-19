"use client";

import { motion } from "framer-motion";
import { StatusDot } from "@/components/ui/status-dot";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/lib/use-data";

interface TerminalConfig {
  tagline?: string;
  bio?: string;
  location?: string;
  status?: string;
  sysVersion?: string;
  siteName?: string;
}

interface SkillItem {
  id: string;
  name: string;
  level: number;
  category: string;
}

interface HeroTerminalPanelProps {
  config?: TerminalConfig;
  skills?: SkillItem[];
}

/**
 * HeroTerminalPanel — the hero's terminal-style dossier card.
 *
 * Chamfered glass panel with terminal chrome, dynamic profile telemetry
 * lines derived from live database config, and dynamic core stack badges
 * mapped from the skills matrix.
 */
export function HeroTerminalPanel({ config: propConfig, skills: propSkills }: HeroTerminalPanelProps) {
  const { data: fetchedSkills } = useData<SkillItem[]>("/api/skills");
  const { data: fetchedConfig } = useData<TerminalConfig>("/api/config");

  const config = propConfig || fetchedConfig || {
    tagline: "Full-Stack Developer & AI Engineer",
    location: "Jakarta, Indonesia",
    status: "ONLINE",
    sysVersion: "v2.4.1",
  };

  const skillsList = propSkills || fetchedSkills || [];
  const topSkills = skillsList.length > 0
    ? skillsList.slice(0, 6)
    : [
        { id: "s1", name: "Next.js", level: 95, category: "Frontend" },
        { id: "s2", name: "TypeScript", level: 92, category: "Language" },
        { id: "s3", name: "Python", level: 88, category: "AI" },
        { id: "s4", name: "Prisma", level: 85, category: "Backend" },
        { id: "s5", name: "Tailwind v4", level: 90, category: "Frontend" },
        { id: "s6", name: "Framer Motion", level: 85, category: "Frontend" },
      ];

  const coreStackNames = topSkills.slice(0, 4).map((s) => s.name).join(" · ");

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
          <span className="ml-auto sys-label text-text-muted/40 font-mono tabular-nums">
            NODE//01 // {config.status || "ACTIVE"}
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-6 sm:p-10">
          <div className="space-y-3 font-mono text-sm">
            <p className="text-text-muted">
              <span className="text-gold-400">[AETHER@HUD]</span>
              <span className="text-text-muted/30">:~$</span> cat /etc/profile
            </p>
            <p className="text-text-main/90">
              {">"} {config.tagline || "Full-Stack Developer specializing in AI & modern web systems"}
            </p>
            <p className="text-text-main/80">
              {">"} Core Stack: {coreStackNames || "Next.js · TypeScript · Prisma · Python"}
            </p>
            <p className="text-text-main/80">
              {">"} Deployment Node: {config.location || "Jakarta, Indonesia // Global Edge"}
            </p>
            <p className="text-gold-400/80">
              {">"} <span className="animate-energy-pulse">_</span> System {config.status || "ONLINE"} // {config.sysVersion || "v2.4.1"} — Ready for mission deployment
            </p>
          </div>

          {/* Dynamic Core Stack Badges */}
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Core stack proficiencies">
            {topSkills.map((skill) => {
              const variant = skill.category === "AI" ? "stellar" : skill.level >= 90 ? "gold" : "default";
              return (
                <Badge key={skill.id} variant={variant} size="sm">
                  {skill.name}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
