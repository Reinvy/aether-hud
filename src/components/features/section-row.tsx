"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, GripVertical, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";
import { cn } from "@/lib/utils";

/**
 * SectionRow — one landing-section control row in the sections table.
 *
 * Extracted from the sections dashboard view (was inline) so the view stays a
 * thin orchestrator. Renders order/title/key/subtitle/status-toggle/actions;
 * the parent owns data fetching, the edit modal and the toggle handler.
 */

export interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  enabled: boolean;
  order: number;
}

interface SectionRowProps {
  section: Section;
  index: number;
  onToggle: (section: Section) => void;
  onEdit: (section: Section) => void;
}

export const SectionRow = memo(function SectionRow({
  section,
  index,
  onToggle,
  onEdit,
}: SectionRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        "border-b border-border-subtle/50 transition-colors hover:bg-glass-200/40",
        !section.enabled && "opacity-60"
      )}
    >
      {/* Order */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-3.5 w-3.5 text-text-muted/30" />
          <span className="font-mono text-[11px] text-text-muted">
            {String(section.order).padStart(2, "0")}
          </span>
        </div>
      </td>
      {/* Title */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <IconBox>
            <span className="font-mono text-[10px] text-gold-400">
              {String(section.order + 1).padStart(2, "0")}
            </span>
          </IconBox>
          <div>
            <p className="font-mono text-xs font-medium tracking-wider text-text-main">
              {section.title}
            </p>
            <p className="font-mono text-[9px] tracking-wider text-text-muted/60">
              sec-{section.key}
            </p>
          </div>
        </div>
      </td>
      {/* Key */}
      <td className="px-4 py-4 hidden md:table-cell">
        <Badge variant="default" size="sm">
          {section.key}
        </Badge>
      </td>
      {/* Subtitle */}
      <td className="px-4 py-4 hidden sm:table-cell">
        <span className="font-mono text-[10px] text-text-muted">
          {section.subtitle || "—"}
        </span>
      </td>
      {/* Status */}
      <td className="px-4 py-4 text-center">
        <button
          onClick={() => onToggle(section)}
          className={cn(
            "inline-flex items-center gap-1.5 chamfered-xs px-2.5 py-1 text-[10px] font-mono tracking-wider transition-all hover-scale-sm press-scale focus-ring-gold",
            section.enabled
              ? "bg-[rgba(56,239,125,0.1)] text-stellar-400 hover:bg-[rgba(56,239,125,0.15)]"
              : "bg-[rgba(239,68,68,0.1)] text-hud-danger hover:bg-[rgba(239,68,68,0.15)]"
          )}
        >
          {section.enabled ? (
            <>
              <Eye className="h-3 w-3" />
              ACTIVE
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" />
              HIDDEN
            </>
          )}
        </button>
      </td>
      {/* Actions */}
      <td className="px-4 py-4 text-right">
        <Button
          variant="ghost"
          size="sm"
          glow="none"
          className="min-h-9 min-w-9 p-0 sm:p-1.5"
          onClick={() => onEdit(section)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </td>
    </motion.tr>
  );
});
