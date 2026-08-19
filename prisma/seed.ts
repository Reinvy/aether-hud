import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ─── Sections ───────────────────────────────────
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

  // ─── PortfolioConfig ────────────────────────────
  await prisma.portfolioConfig.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      name: "Bahrul Ulumul Haq",
      tagline: "Full-Stack Developer & AI Engineer",
      bio: "Architecting high-performance digital experiences at the intersection of AI, game design, and full-stack engineering. Specializing in Next.js, AI integration, and immersive UI systems.",
      email: "hello@aether-hud.dev",
      location: "Jakarta, Indonesia",
      status: "ONLINE",
      sysVersion: "v2.4.1",
    },
  });

  // ─── Projects ───────────────────────────────────
  const projects = [
    { id: "aniverse", title: "AniVerse", description: "AI-powered anime art platform with marketplace, community features, and real-time generation pipeline.", tags: JSON.stringify(["Next.js","TypeScript","Prisma","AI","Stripe"]), category: "AI Platform", complexity: "CLASS-S", performance: "98%", year: "2026", liveUrl: "https://aniverse-one-khaki.vercel.app", githubUrl: "https://github.com/Reinvy/aniverse", order: 0 },
    { id: "microapp-studio", title: "MicroApp Studio", description: "No-code micro-app builder with drag-and-drop interface, real-time preview, and IndexedDB persistence.", tags: JSON.stringify(["Next.js","React","IndexedDB","Tailwind"]), category: "No-Code Platform", complexity: "CLASS-A", performance: "95%", year: "2026", liveUrl: "https://microapp-studio.vercel.app", githubUrl: null, order: 1 },
    { id: "reinvy-library", title: "ReinvyLibrary", description: "Bilingual educational content platform for technology learning with structured curriculum paths.", tags: JSON.stringify(["Next.js","MDX","i18n","SEO"]), category: "Education", complexity: "CLASS-B", performance: "96%", year: "2026", liveUrl: null, githubUrl: "https://github.com/Reinvy/ReinvyLibrary", order: 2 },
    { id: "aether-hud", title: "AETHER-HUD", description: "High-end tactical portfolio with AAA game HUD design system — chamfered corners, glassmorphism, and gold accents.", tags: JSON.stringify(["Next.js","Framer Motion","Tailwind v4","HUD"]), category: "Portfolio", complexity: "CLASS-A", performance: "99%", year: "2026", liveUrl: null, githubUrl: "https://github.com/Reinvy/aether-hud", order: 3 },
  ];
  for (const p of projects) {
    await prisma.project.upsert({ where: { id: p.id }, update: p, create: p });
  }

  // ─── Skills ─────────────────────────────────────
  const skills = [
    { id: "nextjs-react", name: "Next.js / React", level: 95, category: "Frontend", icon: "Globe", order: 0 },
    { id: "typescript", name: "TypeScript", level: 92, category: "Language", icon: "FileCode", order: 1 },
    { id: "tailwind-css", name: "Tailwind CSS", level: 90, category: "Frontend", icon: "Palette", order: 2 },
    { id: "nodejs-api", name: "Node.js / API", level: 88, category: "Backend", icon: "Server", order: 3 },
    { id: "prisma-sql", name: "Prisma / SQL", level: 85, category: "Backend", icon: "Database", order: 4 },
    { id: "python-ai", name: "Python / AI", level: 80, category: "AI", icon: "Brain", order: 5 },
    { id: "framer-motion", name: "Framer Motion", level: 85, category: "Frontend", icon: "Zap", order: 6 },
    { id: "docker-devops", name: "Docker / DevOps", level: 75, category: "DevOps", icon: "Container", order: 7 },
    { id: "figma-ui", name: "Figma / UI Design", level: 82, category: "Design", icon: "PenTool", order: 8 },
    { id: "vercel-deploy", name: "Vercel / Deploy", level: 90, category: "DevOps", icon: "Rocket", order: 9 },
  ];
  for (const s of skills) {
    await prisma.skill.upsert({ where: { id: s.id }, update: s, create: s });
  }

  // ─── Experiences ────────────────────────────────
  const experiences = [
    { id: "aniverse-founder", company: "AniVerse", role: "Founder & Lead Developer", description: "Building AI-powered anime art platform from ground up. Managing full-stack architecture, AI pipeline integration, and community features with 10K+ users.", startDate: "2024-01", endDate: null, type: "work", order: 0 },
    { id: "microapp-dev", company: "MicroApp Studio", role: "Full-Stack Developer", description: "Developing a no-code micro-app builder with real-time preview, drag-drop interface, and offline-first architecture using IndexedDB.", startDate: "2025-01", endDate: null, type: "work", order: 1 },
    { id: "reinvy-content", company: "ReinvyLibrary", role: "Content Creator & Developer", description: "Creating bilingual educational content platform with structured curriculum for technology learning.", startDate: "2024-06", endDate: null, type: "work", order: 2 },
    { id: "ai-research", company: "AI Research Lab", role: "AI Engineer", description: "Researched and implemented large language model fine-tuning pipelines, RAG systems, and AI agent architectures for production deployment.", startDate: "2023-01", endDate: "2024-06", type: "work", order: 3 },
    { id: "itb-education", company: "Institut Teknologi Bandung", role: "Computer Science", description: "Studied computer science with focus on AI/ML and software engineering. Graduated with honors.", startDate: "2019-09", endDate: "2023-06", type: "education", order: 4 },
  ];
  for (const e of experiences) {
    await prisma.experience.upsert({ where: { id: e.id }, update: e, create: e });
  }

  // ─── Testimonials ───────────────────────────────
  const testimonials = [
    { id: "sarah-chen", name: "Sarah Chen", role: "Design Lead @ CreativeX", content: "Working with Bahrul was incredible. His ability to translate complex design systems into pixel-perfect implementations is unmatched. The AETHER-HUD design system is a true masterpiece of UI engineering.", order: 0 },
    { id: "alex-rivera", name: "Alex Rivera", role: "CTO @ TechVentures", content: "Bahrul's full-stack expertise and AI integration skills are exceptional. He delivered our platform ahead of schedule with zero technical debt. His architecture decisions saved us months of rework.", order: 1 },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.upsert({ where: { id: t.id }, update: t, create: t });
  }

  // ─── Social Links ───────────────────────────────
  const socials = [
    { id: "github", platform: "GitHub", url: "https://github.com/Reinvy", icon: "GitBranch", order: 0 },
    { id: "linkedin", platform: "LinkedIn", url: "https://linkedin.com/in/bahrul-ulumul-haq", icon: "Globe", order: 1 },
    { id: "twitter", platform: "Twitter", url: "https://twitter.com", icon: "MessageCircle", order: 2 },
  ];
  for (const s of socials) {
    await prisma.socialLink.upsert({ where: { id: s.id }, update: s, create: s });
  }

  console.log("✅ Seed complete — PostgreSQL aether_hud");
}

main().catch(console.error).then(() => process.exit(0));
