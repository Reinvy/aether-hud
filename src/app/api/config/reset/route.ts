import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-helpers";
import { portfolioData } from "@/data/portfolio";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 1. Reset PortfolioConfig
    await prisma.portfolioConfig.upsert({
      where: { id: "main" },
      update: {
        name: portfolioData.name,
        tagline: portfolioData.tagline,
        bio: portfolioData.bio,
        email: "hello@aether-hud.dev",
        location: "Jakarta, Indonesia",
        avatar: portfolioData.avatar,
        status: "ONLINE",
        sysVersion: "v2.4.1",
        siteName: "AETHER-HUD",
        siteDescription: "High-End Tactical Portfolio — Obsidian & Imperial Gold Edition",
        themePreset: "obsidian",
        animationsEnabled: true,
      },
      create: {
        id: "main",
        name: portfolioData.name,
        tagline: portfolioData.tagline,
        bio: portfolioData.bio,
        email: "hello@aether-hud.dev",
        location: "Jakarta, Indonesia",
        avatar: portfolioData.avatar,
        status: "ONLINE",
        sysVersion: "v2.4.1",
        siteName: "AETHER-HUD",
        siteDescription: "High-End Tactical Portfolio — Obsidian & Imperial Gold Edition",
        themePreset: "obsidian",
        animationsEnabled: true,
      },
    });

    // 2. Re-seed Sections
    const sections = [
      { id: "sec-hero", key: "hero", title: "Profile", subtitle: "Personal profile & terminal introduction", enabled: true, order: 0 },
      { id: "sec-projects", key: "projects", title: "Projects", subtitle: "Portfolio project archive dossiers", enabled: true, order: 1 },
      { id: "sec-skills", key: "skills", title: "Skills", subtitle: "Technical attribute matrix", enabled: true, order: 2 },
      { id: "sec-experience", key: "experience", title: "Experience", subtitle: "Career timeline history", enabled: true, order: 3 },
      { id: "sec-testimonials", key: "testimonials", title: "Testimonials", subtitle: "Verified feedback reports", enabled: true, order: 4 },
      { id: "sec-contact", key: "contact", title: "Contact", subtitle: "Encrypted communication node", enabled: true, order: 5 },
    ];
    for (const s of sections) {
      await prisma.section.upsert({ where: { id: s.id }, update: s, create: s });
    }

    // 3. Clear and re-seed projects
    await prisma.project.deleteMany({});
    for (let i = 0; i < portfolioData.projects.length; i++) {
      const p = portfolioData.projects[i];
      await prisma.project.create({
        data: {
          id: p.id,
          title: p.title,
          description: p.description,
          image: p.image || "/placeholder.svg",
          tags: JSON.stringify(p.tags),
          category: p.category,
          complexity: p.complexity,
          performance: p.performance,
          year: p.year,
          liveUrl: p.links?.live ?? null,
          githubUrl: p.links?.github ?? null,
          order: i,
        },
      });
    }

    // 4. Clear and re-seed skills
    await prisma.skill.deleteMany({});
    for (let i = 0; i < portfolioData.skills.length; i++) {
      const s = portfolioData.skills[i];
      await prisma.skill.create({
        data: {
          id: s.id,
          name: s.name,
          level: s.level,
          category: s.category,
          icon: s.icon,
          order: i,
        },
      });
    }

    // 5. Clear and re-seed experiences
    await prisma.experience.deleteMany({});
    const experiences = [
      { id: "aniverse-founder", company: "AniVerse", role: "Founder & Lead Developer", description: "Building AI-powered anime art platform from ground up. Managing full-stack architecture, AI pipeline integration, and community features with 10K+ users.", startDate: "2024-01", endDate: null, type: "work", order: 0 },
      { id: "microapp-dev", company: "MicroApp Studio", role: "Full-Stack Developer", description: "Developing a no-code micro-app builder with real-time preview, drag-drop interface, and offline-first architecture using IndexedDB.", startDate: "2025-01", endDate: null, type: "work", order: 1 },
      { id: "reinvy-content", company: "ReinvyLibrary", role: "Content Creator & Developer", description: "Creating bilingual educational content platform with structured curriculum for technology learning.", startDate: "2024-06", endDate: null, type: "work", order: 2 },
      { id: "ai-research", company: "AI Research Lab", role: "AI Engineer", description: "Researched and implemented large language model fine-tuning pipelines, RAG systems, and AI agent architectures for production deployment.", startDate: "2023-01", endDate: "2024-06", type: "work", order: 3 },
      { id: "itb-education", company: "Institut Teknologi Bandung", role: "Computer Science", description: "Studied computer science with focus on AI/ML and software engineering. Graduated with honors.", startDate: "2019-09", endDate: "2023-06", type: "education", order: 4 },
    ];
    for (const e of experiences) {
      await prisma.experience.create({ data: e });
    }

    // 6. Clear and re-seed testimonials
    await prisma.testimonial.deleteMany({});
    const testimonials = [
      { id: "sarah-chen", name: "Sarah Chen", role: "Design Lead @ CreativeX", content: "Working with Bahrul was incredible. His ability to translate complex design systems into pixel-perfect implementations is unmatched. The AETHER-HUD design system is a true masterpiece of UI engineering.", order: 0 },
      { id: "alex-rivera", name: "Alex Rivera", role: "CTO @ TechVentures", content: "Bahrul's full-stack expertise and AI integration skills are exceptional. He delivered our platform ahead of schedule with zero technical debt. His architecture decisions saved us months of rework.", order: 1 },
    ];
    for (const t of testimonials) {
      await prisma.testimonial.create({ data: t });
    }

    // 7. Clear and re-seed socials
    await prisma.socialLink.deleteMany({});
    for (let i = 0; i < portfolioData.socials.length; i++) {
      const s = portfolioData.socials[i];
      await prisma.socialLink.create({
        data: {
          platform: s.platform,
          url: s.url,
          icon: s.icon,
          order: i,
        },
      });
    }

    return ok({ success: true, message: "Portfolio data successfully reset and re-seeded" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Reset failed", "CONFIG_RESET");
  }
}
