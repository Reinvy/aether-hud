"use client";

import dynamic from "next/dynamic";
import { HudFooter } from "@/components/layout/hud-footer";
import { NavRail } from "@/components/layout/nav-rail";
import { MobileNavDock } from "@/components/layout/mobile-nav-dock";
import { SakuraCanvas } from "@/components/features/sakura-canvas";
import { IntroGate } from "@/components/features/intro-gate";
import { useData } from "@/lib/use-data";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

// ─── Lazy-loaded sections (dynamic imports for bundle splitting) ───
const HeroSection = dynamic(
  () => import("@/components/sections/hero-section").then((m) => ({ default: m.HeroSection })),
  { loading: () => <SectionSkeleton variant="hero" /> }
);

const ProjectsSection = dynamic(
  () => import("@/components/sections/projects-section").then((m) => ({ default: m.ProjectsSection })),
  { loading: () => <SectionSkeleton variant="projects" /> }
);

const SkillsSection = dynamic(
  () => import("@/components/sections/skills-section").then((m) => ({ default: m.SkillsSection })),
  { loading: () => <SectionSkeleton variant="skills" /> }
);

const ExperienceSection = dynamic(
  () => import("@/components/sections/experience-section").then((m) => ({ default: m.ExperienceSection })),
  { loading: () => <SectionSkeleton variant="experience" /> }
);

const TestimonialsSection = dynamic(
  () => import("@/components/sections/testimonials-section").then((m) => ({ default: m.TestimonialsSection })),
  { loading: () => <SectionSkeleton variant="testimonials" /> }
);

const ContactSection = dynamic(
  () => import("@/components/sections/contact-section").then((m) => ({ default: m.ContactSection })),
  { loading: () => <SectionSkeleton variant="contact" /> }
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

/**
 * HomeContent — client-side Teyvat Codex homepage composition.
 *
 * Mounts the IntroGate ("Click to Proceed" with 7 Elements),
 * ambient SakuraCanvas particle overlay, Left NavRail, Top HudHeader,
 * and lazy-loaded Teyvat sections with error boundaries.
 */
export function HomeContent() {
  const { data: sections, loading } = useData<Section[]>("/api/sections");

  const sectionList =
    !loading && sections && sections.length > 0
      ? sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order)
      : null;

  return (
    <>
      {/* Skip to main content for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-parchment-base focus:text-leather-dark focus:border focus:border-leather-caramel/60 focus:outline-none focus:ring-2 focus:ring-leather-caramel/40 chamfered-sm font-mono text-xs tracking-wider shadow-lg"
      >
        SKIP TO MAIN CONTENT [↓]
      </a>

      {/* Interactive 7 Elements Intro Gate */}
      <IntroGate />

      {/* Atmospheric Falling Sakura & Stardust Canvas */}
      <SakuraCanvas />

      {/* Left Navigation Rail (Desktop) */}
      <NavRail />

      {/* Floating Tactical Bottom Dock (Mobile & Tablet) */}
      <MobileNavDock />

      <main id="main-content" tabIndex={-1} className="outline-none relative z-20">
        {sectionList === null ? (
          <>
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
          </>
        ) : (
          sectionList.map((section) => {
            const SectionComponent = SECTION_MAP[section.key];
            if (!SectionComponent) return null;
            return (
              <ErrorBoundary key={section.id} section={section.key}>
                <SectionComponent />
              </ErrorBoundary>
            );
          })
        )}
      </main>

      <HudFooter />
    </>
  );
}
