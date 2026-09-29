"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Briefcase, Globe, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import { RowActions } from "@/components/ui/row-actions";

type ExperienceType = "work" | "education" | "freelance";

export interface ExperienceCardData {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  type: ExperienceType;
  order: number;
}

const typeColors: Record<ExperienceType, string> = {
  work: "border-gold-400/40 text-gold-ink",
  education: "border-jade-400/40 text-jade-ink",
  freelance: "border-jade-400/40 text-jade-ink",
};

const typeIcons: Record<ExperienceType, React.ElementType> = {
  work: Briefcase,
  education: GraduationCap,
  freelance: Globe,
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

interface ExperienceCardProps {
  experience: ExperienceCardData;
  /** List position — drives the staggered enter animation delay. */
  index?: number;
  onEdit: (experience: ExperienceCardData) => void;
  onDelete: (experience: ExperienceCardData) => void;
}

/**
 * ExperienceCard — single experience-log row for the dashboard experience
 * page.
 *
 * Extracted from experiences-view so the log rows are a self-contained
 * unit: type icon, role/company, type badge, period and row actions all
 * render from one ExperienceCardData record. The view just maps the list
 * into cards and owns the edit/delete state.
 */
export const ExperienceCard = memo(function ExperienceCard({ experience: exp, index = 0, onEdit, onDelete }: ExperienceCardProps) {
  const TypeIcon = typeIcons[exp.type] || Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="glass" hover="sweep" className="codex-card codex-radius-card">
        <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4">
          <IconBox>
            <TypeIcon className="h-4 w-4 text-gold-ink" />
          </IconBox>

          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-sm font-semibold tracking-wide text-leather-dark group-hover:text-leather-caramel transition-colors duration-200">
              {exp.role}
            </p>
            <p className="mt-0.5 truncate font-body text-xs text-leather-muted">
              {exp.company}
            </p>
          </div>

          <div className="hidden w-24 sm:block">
            <Badge
              variant="default"
              size="sm"
              className={typeColors[exp.type] || ""}
            >
              {exp.type.toUpperCase()}
            </Badge>
          </div>

          <div className="hidden w-40 items-center gap-2 md:flex">
            <span className="font-body text-xs text-leather-muted tabular-nums">
              {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Present"}
            </span>
          </div>

          <div className="flex w-20 items-center justify-end">
            <RowActions
              onEdit={() => onEdit(exp)}
              onDelete={() => onDelete(exp)}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
