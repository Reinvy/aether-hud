"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/features/section-heading";
import { AssetIcon } from "@/components/ui/asset-icon";
import type { SectionDto, TestimonialDto } from "@/lib/dto";

interface TestimonialsSectionProps {
  testimonials: TestimonialDto[];
  section: SectionDto;
}

const AUTHORED = { title: "Companion", highlight: "Endorsements" };

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.1 },
};

/**
 * TestimonialsSection — companion letters from allies and guild partners.
 * Presentation-only: the letters are a prop from the server render.
 */
export function TestimonialsSection({ testimonials, section }: TestimonialsSectionProps) {
  const sectionTitle = (section.title || "").trim();

  return (
    <section id="testimonials" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="Companion Letters // Serenitea Pot Trust"
          icon={<AssetIcon icon="friends" size="sm" className="shrink-0" />}
          title={sectionTitle || AUTHORED.title}
          highlight={sectionTitle ? undefined : AUTHORED.highlight}
          subtitle={
            section.subtitle ||
            "Official commendations, letters of transit, and alliance trust records from peers and guild partners across Teyvat."
          }
        />

        {/* Companion Letters Grid */}
        <motion.div className="mt-14 grid gap-6 sm:grid-cols-2" {...stagger}>
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="codex-card codex-radius-card p-6 sm:p-7 codex-lift h-full flex flex-col justify-between relative">
                {/* Letter Seal & Serenitea Trust Badge */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <AssetIcon icon="mail" size="sm" />
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-leather-caramel/10 border border-leather-caramel/25">
                      <AssetIcon icon="sereniteaPot" size="sm" />
                      <span className="codex-label-active">
                        Serenitea trust · Lv. 10
                      </span>
                    </div>
                  </div>

                  {/* Letter body */}
                  <blockquote className="text-sm leading-relaxed text-leather-dark font-body font-medium italic text-pretty">
                    “{testimonial.content}”
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-4 border-t border-leather-caramel/20 flex items-center gap-3.5">
                  <div className="codex-icon-plate hover-scale-sm h-12 w-12 shrink-0">
                    <span className="font-display text-base text-parchment-base">
                      {testimonial.name
                        .split(/\s+/)
                        .map((word) => word.charAt(0))
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-sm sm:text-base font-bold tracking-wide text-leather-dark uppercase truncate">
                      {testimonial.name}
                    </p>
                    <p className="font-body text-xs tracking-wider text-leather-caramel truncate font-semibold">
                      {testimonial.role}
                    </p>
                  </div>

                  {/* Verified Seal */}
                  <div className="flex items-center gap-1.5 shrink-0 px-3 py-1 rounded-full bg-leather-caramel/10 border border-leather-caramel/30">
                    <AssetIcon icon="achievements" size="sm" />
                    <span className="codex-label-active">
                      Sealed
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {testimonials.length === 0 && (
            <div className="col-span-full">
              <div className="codex-card codex-radius-card mx-auto max-w-md px-8 py-10 text-center">
                <AssetIcon icon="mail" size="lg" className="mx-auto mb-4" />
                <h3 className="font-serif text-lg font-bold uppercase tracking-wide text-leather-dark">
                  No companion letters yet
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-leather-muted">
                  Endorsements from allies and guild partners will be delivered to this notice board
                  as they arrive.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
