import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";
import { elementForCategory, formatGrade } from "@/lib/project-meta";
import type { ProjectDto } from "@/lib/dto";

interface ProjectDetailProps {
  project: ProjectDto;
}

/**
 * ProjectDetail — the full-page domain dossier for a single artifact.
 *
 * Presentation-only and server-safe (no hooks, no client bundle): the route
 * resolves the project through the repository and hands it down, so the
 * dossier ships complete in the first byte and stays crawlable.
 */
export function ProjectDetail({ project }: ProjectDetailProps) {
  const element = elementForCategory(project.category);
  const stats = [
    { label: "Category", value: project.category },
    { label: "Year", value: project.year },
    { label: "Artifact grade", value: formatGrade(project.complexity) },
    { label: "Performance", value: project.performance },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-parchment-base py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-30" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/#projects"
          className="codex-btn-secondary codex-sheen codex-focus inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to domains
        </Link>

        <article className="codex-panel codex-panel-radius codex-rise mt-6 overflow-hidden">
          <div className="relative h-56 w-full overflow-hidden border-b border-leather-caramel/25 bg-parchment-subtle sm:h-72">
            {project.image && project.image !== "/placeholder.svg" ? (
              <Image
                src={project.image}
                alt={`Artifact of the domain ${project.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-parchment-elevated via-parchment-base to-parchment-subtle">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="codex-icon-plate h-11 w-11">
                    <Image
                      src={element.whiteIcon}
                      alt=""
                      width={24}
                      height={24}
                      className="codex-icon-on-plate h-6 w-6 object-contain"
                      unoptimized
                    />
                  </span>
                  <span className="font-display text-5xl text-leather-caramel/40">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                  <span className="codex-label">{project.category}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10">
            <header className="max-w-3xl">
              <span className="codex-label-gold">Domain Dossier</span>
              <h1 className="mt-2 font-serif text-3xl font-bold uppercase tracking-[0.04em] text-leather-dark sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-4 font-body text-sm leading-relaxed text-leather-muted sm:text-base">
                {project.description}
              </p>
            </header>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="codex-card codex-radius-card codex-lift px-4 py-3"
                >
                  <dt className="codex-label">{stat.label}</dt>
                  <dd className="mt-1 font-serif text-sm font-bold text-leather-dark">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <section className="mt-8" aria-labelledby="domain-tags-heading">
              <h2 id="domain-tags-heading" className="codex-label">
                Forged With
              </h2>
              {project.tags.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="codex-badge">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 font-body text-sm text-leather-muted">
                  No artifact lore recorded for this domain yet.
                </p>
              )}
            </section>

            {(project.liveUrl || project.githubUrl) && (
              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-leather-caramel/20 pt-6">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Enter the ${project.title} domain`}
                    className="codex-btn-primary codex-sheen codex-focus inline-flex items-center gap-2 px-5 py-2.5 font-serif text-[11px] font-bold uppercase tracking-wider transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    Enter Domain
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View the ${project.title} source`}
                    className="codex-btn-secondary codex-sheen codex-focus inline-flex items-center gap-2 px-5 py-2.5 font-serif text-[11px] font-bold uppercase tracking-wider transition-all"
                  >
                    <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                    Forge Lore
                  </a>
                )}
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
