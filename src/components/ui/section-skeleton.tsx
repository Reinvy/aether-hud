import { CardSkeleton, SectionHeaderSkeleton } from "./skeleton";
import { cn } from "@/lib/utils";

/**
 * SectionSkeleton — reusable HUD loading placeholder for lazy-loaded
 * landing sections.
 *
 * Centralizes the skeleton JSX that previously lived inline inside
 * home-content.tsx's next/dynamic() loading callbacks. Every section gets
 * a consistent, chamfered HUD loading state (Obsidian & Imperial Gold) —
 * no rounded corners, no flat shadows, segment-bar for skill progress.
 *
 * The *Body* components below (SkillsArraySkeleton, ExperienceTimelineSkeleton,
 * ProjectsGridSkeleton, TestimonialsGridSkeleton) are the same markup the
 * full-section variants render, exported separately so each section can use
 * them for its own /api/* data-loading state too — no more centered
 * HudLoader spinner during data fetch, the layout stays stable while the
 * content streams in.
 */

type SectionSkeletonVariant =
  | "hero"
  | "projects"
  | "skills"
  | "experience"
  | "testimonials"
  | "contact";

/* ─── Reusable body skeletons (section data-loading states) ─── */

/** Skill-matrix body: label rows + segment-bar placeholders. */
export function SkillsArraySkeleton({ rows = 6, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-3 w-32 bg-leather-caramel/15 dark:bg-gold-400/15 rounded-md skeleton-hud" />
            <div className="h-3 w-16 bg-leather-caramel/15 dark:bg-gold-400/15 rounded-md skeleton-hud" />
          </div>
          <div className="segment-bar">
            {Array.from({ length: 10 }).map((_, j) => (
              <div key={j} className="segment bg-leather-caramel/10 dark:bg-surface-primary skeleton-hud" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Experience timeline body: node diamond + content card placeholders. */
export function ExperienceTimelineSkeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-10 w-10 rounded-2xl border-2 border-leather-caramel/30 dark:border-gold-400/30 bg-[#FAF7EE] dark:bg-surface-primary skeleton-hud shrink-0" />
          <div className="flex-1 bg-[#FFFFFF] dark:bg-surface-primary/75 parchment-panel dark:glass-panel rounded-3xl p-6 border-2 border-leather-caramel/25 dark:border-gold-400/20">
            <div className="space-y-3">
              <div className="h-4 w-1/3 bg-leather-caramel/15 dark:bg-gold-400/15 rounded-md skeleton-hud" />
              <div className="h-5 w-1/2 bg-leather-caramel/15 dark:bg-gold-400/15 rounded-md skeleton-hud" />
              <div className="h-3 w-full bg-leather-caramel/10 dark:bg-gold-400/10 rounded-md skeleton-hud" />
              <div className="h-3 w-5/6 bg-leather-caramel/10 dark:bg-gold-400/10 rounded-md skeleton-hud" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Projects archive body: 2 dossier card placeholders. */
export function ProjectsGridSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-2", className)}>
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

/** Testimonials body: 2 report card placeholders. */
export function TestimonialsGridSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2", className)}>
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function SectionSkeleton({ variant }: { variant: SectionSkeletonVariant }) {
  switch (variant) {
    case "hero":
      return (
        <section className="relative min-h-screen flex items-center justify-center py-28 bg-[#FAF7EE] dark:bg-deep-space">
          <div className="text-center space-y-4">
            <span className="h-3 w-3 rotate-45 bg-[#8C6239] dark:bg-gold-400 skeleton-hud inline-block" />
            <p className="font-display text-xs text-[#8C6239] dark:text-gold-400 font-bold mt-2 tracking-widest uppercase">
              OPENING TEYVAT CODEX...
            </p>
          </div>
        </section>
      );

    case "projects":
      return (
        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeaderSkeleton />
            <div className="mt-14">
              <ProjectsGridSkeleton />
            </div>
          </div>
        </section>
      );

    case "skills":
      return (
        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto max-w-4xl px-4">
            <SectionHeaderSkeleton />
            <div className="mt-14 bg-[#FAF7EE] dark:bg-surface-primary/80 parchment-panel dark:glass-panel rounded-3xl p-8 border-2 border-leather-caramel/30 dark:border-gold-400/30">
              <SkillsArraySkeleton />
            </div>
          </div>
        </section>
      );

    case "experience":
      return (
        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto max-w-5xl px-4">
            <SectionHeaderSkeleton />
            <div className="mt-14">
              <ExperienceTimelineSkeleton />
            </div>
          </div>
        </section>
      );

    case "testimonials":
      return (
        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto max-w-7xl px-4">
            <SectionHeaderSkeleton />
            <div className="mt-14">
              <TestimonialsGridSkeleton />
            </div>
          </div>
        </section>
      );

    case "contact":
      return (
        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto max-w-4xl px-4">
            <SectionHeaderSkeleton />
            <div className="mt-14 mx-auto max-w-4xl">
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="bg-[#FFFFFF] dark:bg-surface-primary/80 parchment-panel dark:glass-panel rounded-3xl p-8 h-80 border-2 border-leather-caramel/30 skeleton-hud" />
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-[#FFFFFF] dark:bg-surface-primary/80 parchment-panel dark:glass-panel rounded-3xl p-5 h-40 border-2 border-leather-caramel/30 skeleton-hud" />
                  <div className="bg-[#FFFFFF] dark:bg-surface-primary/80 parchment-panel dark:glass-panel rounded-3xl p-5 h-32 border-2 border-leather-caramel/30 skeleton-hud" />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
  }
}
