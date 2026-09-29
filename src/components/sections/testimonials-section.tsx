"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/features/section-heading";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
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
          icon={
            <div className="codex-icon-plate h-7 w-7 shrink-0">
              <Image
                src={GENSHIN_UI_ICONS.friends}
                alt="Friends Icon"
                width={16}
                height={16}
                className="codex-icon-on-plate h-4 w-4 object-contain"
                unoptimized
              />
            </div>
          }
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
                    <div className="codex-icon-plate h-7 w-7 shrink-0">
                      <Image
                        src={GENSHIN_UI_ICONS.mail}
                        alt="Letter"
                        width={24}
                        height={24}
                        className="codex-icon-on-plate h-4 w-4 object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-leather-caramel/10 border border-leather-caramel/25">
                      <div className="codex-icon-plate h-7 w-7 shrink-0">
                        <Image
                          src={GENSHIN_UI_ICONS.sereniteaPot}
                          alt=""
                          width={16}
                          height={16}
                          className="codex-icon-on-plate h-4 w-4 object-contain"
                          unoptimized
                        />
                      </div>
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
                  {testimonial.avatar && testimonial.avatar !== "/placeholder.svg" ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-leather-caramel/40 shrink-0 shadow-sm">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-leather-caramel/40 bg-leather-caramel/15 shrink-0 shadow-sm">
                      <span className="font-serif text-base font-bold text-leather-dark">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

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
                    <div className="codex-icon-plate h-6 w-6 shrink-0">
                      <Image
                        src={GENSHIN_UI_ICONS.achievements}
                        alt=""
                        width={14}
                        height={14}
                        className="codex-icon-on-plate h-3.5 w-3.5 object-contain"
                        unoptimized
                      />
                    </div>
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
                <div className="codex-icon-plate mx-auto mb-4 h-11 w-11">
                  <Image
                    src={GENSHIN_UI_ICONS.mail}
                    alt=""
                    width={28}
                    height={28}
                    className="codex-icon-on-plate h-6 w-6 object-contain"
                    unoptimized
                  />
                </div>
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
