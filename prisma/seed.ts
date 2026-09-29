/**
 * Seed — populate PostgreSQL from the SAME authored dataset the codex falls back
 * to (`src/data/portfolio.ts`). Two copies of the archive used to drift: this
 * script carried four projects and three socials while the dataset carried
 * thirty-two, so a freshly seeded database published a different site than the
 * static build.
 *
 * Executed by Node (`npm run db:seed`, or `prisma db seed`), never bundled, so
 * it is written as a CommonJS-shaped script: Node's ESM resolver does not infer
 * file extensions, and TypeScript rejects a `.ts` extension in a static import.
 * `require("…/portfolio.ts")` is the one form both accept.
 *
 * The section rows stay literal here on purpose — `e2e/navigation.test.mjs`
 * parses their key strings and asserts each one resolves to a rendered section.
 * Keep them in sync with `SECTION_FALLBACKS` in `src/data/sections.ts`.
 */
require("dotenv/config");

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const { portfolioData } = require("../src/data/portfolio.ts");
const { APP_DESCRIPTION, APP_NAME, PORTFOLIO_CONFIG } = require("../src/lib/constants.ts");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("[CODEX_SEED] DATABASE_URL is not configured — nothing to seed.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ─── Sections ───────────────────────────────────
  const sections = [
    { id: "sec-hero", key: "hero", title: "Traveler", subtitle: "Traveler dossier & vision", enabled: true, order: 0 },
    { id: "sec-projects", key: "projects", title: "Domains", subtitle: "Artifact archive of forged platforms", enabled: true, order: 1 },
    { id: "sec-skills", key: "skills", title: "Talents", subtitle: "Elemental proficiencies & constellations", enabled: true, order: 2 },
    { id: "sec-experience", key: "experience", title: "Quests", subtitle: "Expedition chronicle of commissions", enabled: true, order: 3 },
    { id: "sec-testimonials", key: "testimonials", title: "Allies", subtitle: "Companion endorsements", enabled: true, order: 4 },
    { id: "sec-contact", key: "contact", title: "Summon", subtitle: "Dispatch portal for commissions", enabled: true, order: 5 },
  ];
  for (const s of sections) {
    await prisma.section.upsert({ where: { id: s.id }, update: s, create: s });
  }

  // ─── PortfolioConfig ────────────────────────────
  // Create-only: re-seeding must never overwrite what the operator published.
  await prisma.portfolioConfig.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      name: portfolioData.name,
      tagline: portfolioData.tagline,
      bio: portfolioData.bio,
      email: PORTFOLIO_CONFIG.email,
      location: PORTFOLIO_CONFIG.location,
      avatar: portfolioData.avatar,
      status: PORTFOLIO_CONFIG.status,
      edition: PORTFOLIO_CONFIG.edition,
      siteName: APP_NAME,
      siteDescription: APP_DESCRIPTION,
      animationsEnabled: true,
    },
  });

  // ─── Projects ───────────────────────────────────
  for (const [order, p] of portfolioData.projects.entries()) {
    const row = {
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
    };
    await prisma.project.upsert({ where: { id: row.id }, update: row, create: row });
  }

  // ─── Skills ─────────────────────────────────────
  for (const [order, s] of portfolioData.skills.entries()) {
    const row = { id: s.id, name: s.name, level: s.level, category: s.category, icon: s.icon, order };
    await prisma.skill.upsert({ where: { id: row.id }, update: row, create: row });
  }

  // ─── Experiences ────────────────────────────────
  for (const e of portfolioData.experiences) {
    const row = {
      id: e.id,
      company: e.company,
      role: e.role,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      type: e.type,
      order: e.order,
    };
    await prisma.experience.upsert({ where: { id: row.id }, update: row, create: row });
  }

  // ─── Testimonials ───────────────────────────────
  for (const t of portfolioData.testimonials) {
    const row = {
      id: t.id,
      name: t.name,
      role: t.role,
      content: t.content,
      avatar: t.avatar,
      order: t.order,
    };
    await prisma.testimonial.upsert({ where: { id: row.id }, update: row, create: row });
  }

  // ─── Social Links ───────────────────────────────
  for (const [order, s] of portfolioData.socials.entries()) {
    const row = { id: s.id, platform: s.platform, url: s.url, icon: s.icon, order };
    await prisma.socialLink.upsert({ where: { id: row.id }, update: row, create: row });
  }

  console.log(
    `✅ Seed complete — PostgreSQL aether_hud (${portfolioData.projects.length} domains, ` +
      `${portfolioData.skills.length} talents, ${portfolioData.socials.length} channels)`
  );
}

main()
  .catch((error) => {
    console.error("[CODEX_SEED]", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .then(() => process.exit());
