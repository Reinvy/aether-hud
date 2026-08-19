"use client";

import dynamic from "next/dynamic";
import { HudHeader } from "@/components/layout/hud-header";
import { HudFooter } from "@/components/layout/hud-footer";
import { useData } from "@/lib/use-data";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

// ─── Lazy-loaded sections (dynamic imports for bundle splitting) ───
// Each section renders a shared HUD skeleton (SectionSkeleton) while its
// chunk is loading — see src/components/ui/section-skeleton.tsx.
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
 * HomeContent — client-side homepage composition.
 *
 * Renders the HUD header/footer plus the section map (hero, projects,
 * skills, experience, testimonials, contact) with per-section error
 * boundaries. Each section is lazy-loaded for bundle splitting and shows
 * a shared SectionSkeleton while its chunk loads.
 *
 * Kept separate from the route page so the page.tsx server component can
 * inject server-rendered structured data (JSON-LD) around it without
 * forcing the whole tree into a client bundle.
 */
export function HomeContent() {
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
        <main id="main-content" tabIndex={-1} className="outline-none">
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
      <main id="main-content" tabIndex={-1} className="outline-none">
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
