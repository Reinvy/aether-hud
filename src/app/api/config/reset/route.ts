import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { hasDatabase } from "@/lib/portfolio-repo";
import { portfolioData } from "@/data/portfolio";
import { SECTION_FALLBACKS } from "@/data/sections";
import { APP_DESCRIPTION, APP_NAME, PORTFOLIO_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Restore the MySQL/PostgreSQL tables to the authored dataset.
 *
 * All seven steps run in ONE `prisma.$transaction` so a failure mid-way can
 * never leave the codex with, say, sections re-seeded but projects deleted.
 */
export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("CONFIG_RESET");

  try {
    const configValues = {
      name: portfolioData.name,
      tagline: portfolioData.tagline,
      bio: portfolioData.bio,
      email: PORTFOLIO_CONFIG.email,
      location: PORTFOLIO_CONFIG.location,
      avatar: portfolioData.avatar,
      status: PORTFOLIO_CONFIG.status,
      sysVersion: PORTFOLIO_CONFIG.sysVersion,
      siteName: APP_NAME,
      siteDescription: APP_DESCRIPTION,
      themePreset: "teyvat-codex",
      animationsEnabled: true,
    };

    await prisma.$transaction([
      prisma.portfolioConfig.upsert({
        where: { id: "main" },
        update: configValues,
        create: { id: "main", ...configValues },
      }),

      ...SECTION_FALLBACKS.map((s) =>
        prisma.section.upsert({ where: { id: s.id }, update: s, create: s })
      ),

      prisma.project.deleteMany({}),
      ...portfolioData.projects.map((p, order) =>
        prisma.project.create({
          data: {
            id: p.id,
            title: p.title,
            description: p.description,
            image: p.image,
            tags: JSON.stringify(p.tags),
            category: p.category,
            complexity: p.complexity,
            performance: p.performance,
            year: p.year,
            liveUrl: p.links.live ?? null,
            githubUrl: p.links.github ?? null,
            order,
          },
        })
      ),

      prisma.skill.deleteMany({}),
      ...portfolioData.skills.map((s, order) =>
        prisma.skill.create({
          data: { id: s.id, name: s.name, level: s.level, category: s.category, icon: s.icon, order },
        })
      ),

      prisma.experience.deleteMany({}),
      ...portfolioData.experiences.map((e) => prisma.experience.create({ data: e })),

      prisma.testimonial.deleteMany({}),
      ...portfolioData.testimonials.map((t) => prisma.testimonial.create({ data: t })),

      prisma.socialLink.deleteMany({}),
      ...portfolioData.socials.map((s, order) =>
        prisma.socialLink.create({
          data: { id: s.id, platform: s.platform, url: s.url, icon: s.icon, order },
        })
      ),
    ]);

    return ok({ success: true, message: "Portfolio data successfully reset and re-seeded" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Reset failed", "CONFIG_RESET");
  }
}
