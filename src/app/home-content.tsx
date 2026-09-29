"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NavRail } from "@/components/layout/nav-rail";
import { MobileNavDock } from "@/components/layout/mobile-nav-dock";
import { SakuraCanvas } from "@/components/features/sakura-canvas";
import { ScrollThread } from "@/components/features/scroll-thread";
import { IntroGate } from "@/components/features/intro-gate";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import type {
  ConfigDto,
  ExperienceDto,
  ProjectDto,
  SectionDto,
  SkillDto,
  SocialDto,
  TestimonialDto,
} from "@/lib/dto";

/**
 * Section chunks. The data arrives with the server render, so splitting here
 * only trims the interactive client bundle — no loading state is needed and a
 * skeleton would flash over already-rendered content.
 */
const HeroSection = dynamic(() =>
  import("@/components/sections/hero-section").then((m) => ({ default: m.HeroSection }))
);
const ProjectsSection = dynamic(() =>
  import("@/components/sections/projects-section").then((m) => ({ default: m.ProjectsSection }))
);
const SkillsSection = dynamic(() =>
  import("@/components/sections/skills-section").then((m) => ({ default: m.SkillsSection }))
);
const ExperienceSection = dynamic(() =>
  import("@/components/sections/experience-section").then((m) => ({ default: m.ExperienceSection }))
);
const TestimonialsSection = dynamic(() =>
  import("@/components/sections/testimonials-section").then((m) => ({ default: m.TestimonialsSection }))
);
const ContactSection = dynamic(() =>
  import("@/components/sections/contact-section").then((m) => ({ default: m.ContactSection }))
);

interface HomeContentProps {
  config: ConfigDto;
  sections: SectionDto[];
  projects: ProjectDto[];
  skills: SkillDto[];
  experiences: ExperienceDto[];
  testimonials: TestimonialDto[];
  socials: SocialDto[];
}

/** Ordered section renderers, keyed by the codex page `key` column. */
function renderSection(section: SectionDto, props: HomeContentProps, revealed: boolean) {
  switch (section.key) {
    case "hero":
      return (
        <HeroSection
          config={props.config}
          revealed={revealed}
          projects={props.projects}
          skills={props.skills}
          experiences={props.experiences}
        />
      );
    case "projects":
      return <ProjectsSection projects={props.projects} section={section} />;
    case "skills":
      return <SkillsSection skills={props.skills} section={section} />;
    case "experience":
      return <ExperienceSection experiences={props.experiences} section={section} />;
    case "testimonials":
      return <TestimonialsSection testimonials={props.testimonials} section={section} />;
    case "contact":
      return <ContactSection config={props.config} socials={props.socials} section={section} />;
    default:
      return null;
  }
}

/**
 * HomeContent — the public dossier composition.
 *
 * Mounts the intro gate, the ambient sakura layer, the three navigation
 * surfaces (header, desktop rail, mobile dock) and the enabled codex pages in
 * their configured order. Presentation-only: every dataset is a prop from the
 * server render, so a failure in one section cannot blank another and an API
 * outage can never leave the page half-built.
 */
export function HomeContent(props: HomeContentProps) {
  const ordered = [...props.sections]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  // The hero must not play its entrance behind the intro gate and then play it
  // again when the gate closes. `revealed` flips once — either when the visitor
  // enters, or immediately when this session has already met the gate.
  const [revealed, setRevealed] = useState(false);
  const handleGateDismiss = useCallback(() => setRevealed(true), []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-parchment-base focus:text-leather-dark focus:border focus:border-leather-caramel/60 codex-focus codex-radius-sm text-xs tracking-wider shadow-lg"
      >
        Skip to main content
      </a>

      <IntroGate onDismiss={handleGateDismiss} />

      <ScrollThread />

      <SakuraCanvas paused={!revealed} />

      <SiteHeader siteName={props.config.siteName} />

      <NavRail />

      <MobileNavDock />

      <main id="main-content" tabIndex={-1} className="outline-none relative z-20">
        {ordered.map((section) => (
          <ErrorBoundary key={section.id} section={section.key}>
            {renderSection(section, props, revealed)}
          </ErrorBoundary>
        ))}
      </main>

      <SiteFooter
        siteName={props.config.siteName}
        authorName={props.config.name}
        version={props.config.edition}
      />
    </>
  );
}
