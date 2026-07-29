import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function getDbUrl(): string {
  const envUrl = process.env.DATABASE_URL || "file:./dev.db";
  if (envUrl.startsWith("file:")) {
    return `file:${path.resolve(process.cwd(), envUrl.slice(5))}`;
  }
  return envUrl;
}

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: getDbUrl() }),
});

async function seed() {
  await prisma.portfolioConfig.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      name: "Bahrul Ulumul Haq",
      tagline: "Full-Stack Developer & AI Engineer",
      bio: "Architecting high-performance digital experiences at the intersection of AI, game design, and full-stack engineering.",
      email: "hello@aether-hud.dev",
      location: "Jakarta, Indonesia",
      status: "ONLINE",
      sysVersion: "v2.4.1",
    },
  });

  const projects = [
    { id: "aniverse", title: "AniVerse", description: "AI-powered anime art platform with marketplace, community features, and real-time generation pipeline.", tags: JSON.stringify(["Next.js","TypeScript","Prisma","AI","Stripe"]), category: "AI Platform", complexity: "CLASS-S", performance: "98%", year: "2026", liveUrl: "https://aniverse-one-khaki.vercel.app", githubUrl: "https://github.com/Reinvy/aniverse", order: 0 },
    { id: "microapp-studio", title: "MicroApp Studio", description: "No-code micro-app builder with drag-and-drop interface and real-time preview.", tags: JSON.stringify(["Next.js","React","IndexedDB","Tailwind"]), category: "No-Code Platform", complexity: "CLASS-A", performance: "95%", year: "2026", liveUrl: "https://microapp-studio.vercel.app", githubUrl: null, order: 1 },
    { id: "reinvy-library", title: "ReinvyLibrary", description: "Bilingual educational content platform for technology learning.", tags: JSON.stringify(["Next.js","MDX","i18n","SEO"]), category: "Education", complexity: "CLASS-B", performance: "96%", year: "2026", liveUrl: null, githubUrl: "https://github.com/Reinvy/ReinvyLibrary", order: 2 },
    { id: "aether-hud", title: "AETHER-HUD", description: "High-end tactical portfolio with AAA game HUD design system.", tags: JSON.stringify(["Next.js","Framer Motion","Tailwind v4","HUD"]), category: "Portfolio", complexity: "CLASS-A", performance: "99%", year: "2026", liveUrl: null, githubUrl: "https://github.com/Reinvy/aether-hud", order: 3 },
  ];
  for (const p of projects) {
    await prisma.project.upsert({ where: { id: p.id }, update: p, create: p });
  }

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

  const experiences = [
    { id: "aniverse-founder", company: "AniVerse", role: "Founder & Lead Developer", description: "Building AI-powered anime art platform. Full-stack architecture, AI pipeline, 10K+ users.", startDate: "2024-01", endDate: null, type: "work", order: 0 },
    { id: "microapp-dev", company: "MicroApp Studio", role: "Full-Stack Developer", description: "No-code micro-app builder with real-time preview and offline-first architecture.", startDate: "2025-01", endDate: null, type: "work", order: 1 },
    { id: "reinvy-content", company: "ReinvyLibrary", role: "Content Creator", description: "Bilingual educational content platform for technology learning.", startDate: "2024-06", endDate: null, type: "work", order: 2 },
    { id: "ai-research", company: "AI Research Lab", role: "AI Engineer", description: "LLM fine-tuning, RAG systems, and AI agent architectures.", startDate: "2023-01", endDate: "2024-06", type: "work", order: 3 },
    { id: "itb-education", company: "ITB", role: "Computer Science", description: "AI/ML and software engineering focus.", startDate: "2019-09", endDate: "2023-06", type: "education", order: 4 },
  ];
  for (const e of experiences) {
    await prisma.experience.upsert({ where: { id: e.id }, update: e, create: e });
  }

  const testimonials = [
    { id: "sarah-chen", name: "Sarah Chen", role: "Design Lead @ CreativeX", content: "Working with Bahrul was incredible. His AETHER-HUD design system is a masterpiece of UI engineering.", order: 0 },
    { id: "alex-rivera", name: "Alex Rivera", role: "CTO @ TechVentures", content: "Exceptional full-stack expertise. He delivered ahead of schedule with zero technical debt.", order: 1 },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.upsert({ where: { id: t.id }, update: t, create: t });
  }

  const socials = [
    { id: "github", platform: "GitHub", url: "https://github.com/Reinvy", icon: "GitBranch", order: 0 },
    { id: "linkedin", platform: "LinkedIn", url: "https://linkedin.com/in/bahrul-ulumul-haq", icon: "Globe", order: 1 },
    { id: "twitter", platform: "Twitter", url: "https://twitter.com", icon: "MessageCircle", order: 2 },
  ];
  for (const s of socials) {
    await prisma.socialLink.upsert({ where: { id: s.id }, update: s, create: s });
  }

  console.log("✅ Seed complete");
}

seed().catch(console.error).then(() => process.exit(0));
