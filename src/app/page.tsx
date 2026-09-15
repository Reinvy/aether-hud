import type { ProjectDto } from "@/lib/dto";
import { APP_URL } from "@/lib/constants";
import {
  getConfig,
  getExperiences,
  getProjects,
  getSections,
  getSkills,
  getSocials,
  getTestimonials,
} from "@/lib/portfolio-repo";
import { HomeContent } from "./home-content";

// The dossier is content, not a feed: it changes only through the console, so
// it is served statically and revalidated instead of fetching on every visit.
export const revalidate = 300;

function buildProjectsJsonLd(projects: ProjectDto[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Teyvat Codex — Deployed Domains",
    description: "Artifact archive of forged platforms and commissioned systems.",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: project.title,
        description: project.description,
        applicationCategory: "WebApplication",
        operatingSystem: "Web",
        inLanguage: "en",
        url: project.liveUrl || `${APP_URL}/#projects`,
        ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
      },
    })),
  };
}

/**
 * Homepage — the server composition root.
 *
 * Every section's data is fetched here through the repository and handed to
 * `<HomeContent />` as props, so the page renders complete markup on the first
 * byte — with or without a database — and crawlers see every project without
 * executing client JavaScript.
 */
export default async function HomePage() {
  const [config, sections, projects, skills, experiences, testimonials, socials] =
    await Promise.all([
      getConfig(),
      getSections(),
      getProjects(),
      getSkills(),
      getExperiences(),
      getTestimonials(),
      getSocials(),
    ]);

  const projectsJsonLd = buildProjectsJsonLd(projects);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <HomeContent
        config={config}
        sections={sections}
        projects={projects}
        skills={skills}
        experiences={experiences}
        testimonials={testimonials}
        socials={socials}
      />
    </>
  );
}
