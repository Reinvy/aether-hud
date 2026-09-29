import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/features/project-detail";
import { APP_URL } from "@/lib/constants";
import { getProject } from "@/lib/portfolio-repo";

/**
 * Domain dossier route.
 *
 * Rendered per request rather than prerendered, for two reasons that both
 * matter to a CMS-backed portfolio:
 *
 * 1. A domain published from the console must be reachable immediately, not
 *    after the next deploy — `generateStaticParams` would pin the set at build
 *    time.
 * 2. A prerendered/ISR dynamic segment served a not-found render with HTTP 200
 *    (a soft 404 that search engines may index). Resolving the id per request
 *    lets `notFound()` produce a real 404.
 *
 * The lookup goes through the repository, so it stays correct in static-data
 * mode and cheap in database mode (one indexed primary-key read).
 */
export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}


export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  // Metadata resolves before the response shell is flushed, so this is where an
  // unknown id can still produce a real 404 status. Calling `notFound()` only in
  // the page body renders the not-found UI but by then the status is already 200
  // (a soft 404).
  if (!project) notFound();

  return {
    title: `${project.title} — Domain Dossier`,
    description: project.description,
    alternates: { canonical: `${APP_URL}/projects/${id}` },
  };
}

/**
 * Project dossier — the server composition root for `/projects/[id]`.
 *
 * The project is resolved through the repository, so the page renders complete
 * markup on the first byte (with or without a database) and crawlers see the
 * full dossier plus its structured data without executing client JavaScript.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    url: project.liveUrl ?? `${APP_URL}/projects/${id}`,
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectDetail project={project} />
    </>
  );
}
