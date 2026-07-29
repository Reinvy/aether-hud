"use client";

import { HudHeader } from "@/components/layout/hud-header";
import { HudFooter } from "@/components/layout/hud-footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactSection } from "@/components/sections/contact-section";
import { useData } from "@/lib/use-data";

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
          <HeroSection />
          <ProjectsSection />
          <SkillsSection />
          <ExperienceSection />
          <TestimonialsSection />
          <ContactSection />
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
          return <SectionComponent key={section.id} />;
        })}
      </main>
      <HudFooter />
    </>
  );
}
