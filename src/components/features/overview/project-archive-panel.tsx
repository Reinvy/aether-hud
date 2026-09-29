"use client";

import { Boxes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectRow } from "@/components/features/project-row";
import type { ProjectDto } from "@/lib/dto";

interface ProjectArchivePanelProps {
  /** Domain records to list, in codex order. */
  projects: ProjectDto[];
}

/**
 * ProjectArchivePanel — "Domain Archive" overview panel.
 *
 * Self-contained unit: it owns its header (icon, title, record count) and
 * renders the compact ProjectRow list, falling back to the shared EmptyState
 * when the codex has no domains yet. The view stays a thin data orchestrator
 * that feeds the records in.
 */
export function ProjectArchivePanel({ projects }: ProjectArchivePanelProps) {
  return (
    <Card variant="glass" hover="none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-gold-ink" aria-hidden="true" />
            <CardTitle>Domain Archive</CardTitle>
          </div>
          <Badge variant="gold" size="sm">
            {projects.length} RECORDED
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <EmptyState
            icon={<Boxes className="h-4 w-4" aria-hidden="true" />}
            title="No domains yet"
            message="Domains added to the codex appear here with their rank, tags and live link."
          />
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
