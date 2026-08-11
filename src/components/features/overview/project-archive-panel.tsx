"use client";

import { Boxes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectRow, type ProjectRowData } from "@/components/features/project-row";

export interface ArchiveProject extends ProjectRowData {
  id: string;
}

/**
 * ProjectArchivePanel — "Deployed Archives" quick-overview panel for the
 * dashboard overview page.
 *
 * Extracted from overview-view so the panel is a self-contained unit:
 * it owns its header (icon + title + active count badge) and renders the
 * compact ProjectRow list with a HUD-styled [EMPTY] fallback. The view
 * stays a thin data orchestrator that just feeds projects in.
 */
export function ProjectArchivePanel({ projects }: { projects: ArchiveProject[] }) {
  return (
    <Card variant="glass" hover="none" diamond>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-gold-400" />
            <CardTitle>Deployed Archives</CardTitle>
          </div>
          <Badge variant="gold" size="sm">
            {projects.length} ACTIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="py-4 text-center font-mono text-xs text-text-muted">
              [EMPTY] // No projects deployed
            </p>
          ) : (
            projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
