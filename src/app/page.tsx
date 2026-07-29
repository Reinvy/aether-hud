"use client";

import dynamic from "next/dynamic";
import { HudHeader } from "@/components/layout/hud-header";
import { HudFooter } from "@/components/layout/hud-footer";
import { useData } from "@/lib/use-data";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SectionHeaderSkeleton, CardSkeleton } from "@/components/ui/skeleton";

// ─── Lazy-loaded sections (dynamic imports for bundle splitting) ───
const HeroSection = dynamic(
  () => import("@/components/sections/hero-section").then((m) => ({ default: m.HeroSection })),
  {
    loading: () => (
      <section className="relative min-h-screen flex items-center justify-center py-28">
        <div className="pointer-events-none absolute inset-0 bg-deep-space" />
        <div className="text-center space-y-4">
          <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse inline-block" />
          <p className="sys-label text-xs text-text-muted mt-2">DEPLOYING HERO MODULE...</p>
        </div>
      </section>
    ),
  }
);

const ProjectsSection = dynamic(
  () => import("@/components/sections/projects-section").then((m) => ({ default: m.ProjectsSection })),
  {
    loading: () => (
      <section className="relative py-20 sm:py-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </section>
    ),
  }
);

const SkillsSection = dynamic(
  () => import("@/components/sections/skills-section").then((m) => ({ default: m.SkillsSection })),
  {
    loading: () => (
      <section className="relative py-20 sm:py-28">
        <div className="relative mx-auto max-w-4xl px-4">
          <SectionHeaderSkeleton />
          <div className="mt-14 glass-panel chamfered p-8">
            <div className="space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 bg-glass-300 rounded-none animate-pulse" />
                    <div className="h-3 w-16 bg-glass-300 rounded-none animate-pulse" />
                  </div>
                  <div className="segment-bar">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <div key={j} className="segment bg-glass-200 animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

const ExperienceSection = dynamic(
  () => import("@/components/sections/experience-section").then((m) => ({ default: m.ExperienceSection })),
  {
    loading: () => (
      <section className="relative py-20 sm:py-28">
        <div className="relative mx-auto max-w-5xl px-4">
          <SectionHeaderSkeleton />
          <div className="mt-14 space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 rounded-full border border-border-glass bg-glass-200 animate-pulse shrink-0" />
                <div className="flex-1 glass-panel chamfered p-6">
                  <div className="space-y-3">
                    <div className="h-4 w-1/3 bg-glass-300 rounded-none animate-pulse" />
                    <div className="h-5 w-1/2 bg-glass-300 rounded-none animate-pulse" />
                    <div className="h-3 w-full bg-glass-200 rounded-none animate-pulse" />
                    <div className="h-3 w-5/6 bg-glass-200 rounded-none animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/sections/testimonials-section").then((m) => ({ default: m.TestimonialsSection })),
  {
    loading: () => (
      <section className="relative py-20 sm:py-28">
        <div className="relative mx-auto max-w-7xl px-4">
          <SectionHeaderSkeleton />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </section>
    ),
  }
);

const ContactSection = dynamic(
  () => import("@/components/sections/contact-section").then((m) => ({ default: m.ContactSection })),
  {
    loading: () => (
      <section className="relative py-20 sm:py-28">
        <div className="relative mx-auto max-w-4xl px-4">
          <SectionHeaderSkeleton />
          <div className="mt-14 mx-auto max-w-4xl">
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <div className="glass-panel chamfered p-8 h-80 animate-pulse" />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-panel chamfered p-5 h-40 animate-pulse" />
                <div className="glass-panel chamfered p-5 h-32 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

// ─── Section interface ──────────────────────────────────────────
interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  enabled: boolean;
  order: number;
}

const SECTION_MAP: Record<string, React.ElementType> = {
  hero: HeroSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
};

export default function HomePage() {
  const { data: sections, loading } = useData<Section[]>("/api/sections");

  // Fallback: if sections are loading, show all sections
  const sectionList =
    !loading && sections && sections.length > 0
      ? sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order)
      : null;

  // If no dynamic data yet, render all sections as fallback
  if (sectionList === null) {
    return (
      <>
        <HudHeader />
        <main>
          <ErrorBoundary section="hero">
            <HeroSection />
          </ErrorBoundary>
          <ErrorBoundary section="projects">
            <ProjectsSection />
          </ErrorBoundary>
          <ErrorBoundary section="skills">
            <SkillsSection />
          </ErrorBoundary>
          <ErrorBoundary section="experience">
            <ExperienceSection />
          </ErrorBoundary>
          <ErrorBoundary section="testimonials">
            <TestimonialsSection />
          </ErrorBoundary>
          <ErrorBoundary section="contact">
            <ContactSection />
          </ErrorBoundary>
        </main>
        <HudFooter />
      </>
    );
  }

  return (
    <>
      <HudHeader />
      <main>
        {sectionList.map((section) => {
          const SectionComponent = SECTION_MAP[section.key];
          if (!SectionComponent) return null;
          return (
            <ErrorBoundary key={section.id} section={section.key}>
              <SectionComponent />
            </ErrorBoundary>
          );
        })}
      </main>
      <HudFooter />
    </>
  );
}
