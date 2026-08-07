import { CardSkeleton, SectionHeaderSkeleton } from "./skeleton";

/**
 * SectionSkeleton — reusable HUD loading placeholder for lazy-loaded
 * landing sections.
 *
 * Centralizes the skeleton JSX that previously lived inline inside
 * home-content.tsx's next/dynamic() loading callbacks. Every section gets
 * a consistent, chamfered HUD loading state (Obsidian & Imperial Gold) —
 * no rounded corners, no flat shadows, segment-bar for skill progress.
 */

type SectionSkeletonVariant =
  | "hero"
  | "projects"
  | "skills"
  | "experience"
  | "testimonials"
  | "contact";

export function SectionSkeleton({ variant }: { variant: SectionSkeletonVariant }) {
  switch (variant) {
    case "hero":
      return (
        <section className="relative min-h-screen flex items-center justify-center py-28">
          <div className="pointer-events-none absolute inset-0 bg-deep-space" />
          <div className="text-center space-y-4">
            <span className="h-2 w-2 rotate-45 bg-gold-400 skeleton-hud inline-block" />
            <p className="sys-label text-xs text-text-muted mt-2">DEPLOYING HERO MODULE...</p>
          </div>
        </section>
      );

    case "projects":
      return (
        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeaderSkeleton />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </section>
      );

    case "skills":
      return (
        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto max-w-4xl px-4">
            <SectionHeaderSkeleton />
            <div className="mt-14 glass-panel chamfered p-8">
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-32 bg-glass-300 rounded-none skeleton-hud" />
                      <div className="h-3 w-16 bg-glass-300 rounded-none skeleton-hud" />
                    </div>
                    <div className="segment-bar">
                      {Array.from({ length: 10 }).map((_, j) => (
                        <div key={j} className="segment bg-glass-200 skeleton-hud" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );

    case "experience":
      return (
        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto max-w-5xl px-4">
            <SectionHeaderSkeleton />
            <div className="mt-14 space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 chamfered-sm border border-border-glass bg-glass-200 skeleton-hud shrink-0" />
                  <div className="flex-1 glass-panel chamfered p-6">
                    <div className="space-y-3">
                      <div className="h-4 w-1/3 bg-glass-300 rounded-none skeleton-hud" />
                      <div className="h-5 w-1/2 bg-glass-300 rounded-none skeleton-hud" />
                      <div className="h-3 w-full bg-glass-200 rounded-none skeleton-hud" />
                      <div className="h-3 w-5/6 bg-glass-200 rounded-none skeleton-hud" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "testimonials":
      return (
        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto max-w-7xl px-4">
            <SectionHeaderSkeleton />
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              <CardSkeleton />
              <CardSkeleton />
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
                  <div className="glass-panel chamfered p-8 h-80 skeleton-hud" />
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="glass-panel chamfered p-5 h-40 skeleton-hud" />
                  <div className="glass-panel chamfered p-5 h-32 skeleton-hud" />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
  }
}
