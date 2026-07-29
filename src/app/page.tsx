"use client";

import { HudHeader } from "@/components/layout/hud-header";
import { HudFooter } from "@/components/layout/hud-footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function HomePage() {
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
