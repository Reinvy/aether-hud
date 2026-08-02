import { portfolioData } from "@/data/portfolio";
import { APP_URL } from "@/lib/constants";
import { HomeContent } from "./home-content";

/**
 * Homepage — server component wrapper.
 *
 * The heavy section rendering lives in the client-side <HomeContent />
 * (lazy-loaded sections + error boundaries). This server wrapper injects
 * server-rendered structured data (schema.org ItemList of the portfolio
 * projects) sourced from src/data/portfolio.ts, so crawlers get rich
 * project metadata without a client-side fetch.
 */
function buildProjectsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AETHER-HUD — Deployed Projects",
    description: "Tactical dossier of completed missions and active deployments.",
    numberOfItems: portfolioData.projects.length,
    itemListElement: portfolioData.projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: project.title,
        description: project.description,
        applicationCategory: "WebApplication",
        operatingSystem: "Web",
        inLanguage: "en",
        url: project.links.live || `${APP_URL}/#projects`,
        codeRepository: project.links.github,
      },
    })),
  };
}

export default function HomePage() {
  const projectsJsonLd = buildProjectsJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <HomeContent />
    </>
  );
}
