"use client";

import { motion } from "framer-motion";
import { Users, Quote, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { TestimonialsGridSkeleton } from "@/components/ui/section-skeleton";
import { useData } from "@/lib/use-data";
import { SectionHeading } from "@/components/features/section-heading";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  order: number;
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.1 },
};

export function TestimonialsSection() {
  const { data: testimonials, loading } = useData<Testimonial[]>("/api/testimonials");

  return (
    <section id="testimonials" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="COMPANION LETTERS // SERENITEA POT TRUST"
          icon={<Users className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
          title="Companion"
          highlight="Endorsements"
          subtitle="Official commendations, letters of transit, and alliance trust records from peers and guild partners across Teyvat."
        />

        {/* Testimonials Grid */}
        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2"
          {...stagger}
        >
          {loading && (
            <div className="col-span-full">
              <TestimonialsGridSkeleton />
            </div>
          )}

          {testimonials?.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="parchment-panel dark:glass-panel chamfered p-6 sm:p-7 card-lift border-2 border-leather-caramel/25 dark:border-gold-400/25 h-full flex flex-col justify-between shadow-xl relative">
                {/* Quote Icon */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Quote className="h-6 w-6 text-leather-caramel/40 dark:text-gold-400/40" aria-hidden="true" />
                    <span className="font-mono text-[9px] text-leather-caramel dark:text-gold-400 font-bold uppercase">
                      ALLIANCE TRUST // LV. 10
                    </span>
                  </div>

                  {/* Content */}
                  <blockquote className="text-sm leading-relaxed text-leather-dark/85 dark:text-platinum-200 font-body italic text-pretty">
                    “{testimonial.content}”
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-4 border-t border-leather-caramel/15 dark:border-gold-400/15 flex items-center gap-3.5">
                  {testimonial.avatar && testimonial.avatar !== "/placeholder.svg" ? (
                    <div className="relative h-12 w-12 overflow-hidden chamfered-sm border-2 border-leather-caramel/50 dark:border-gold-400/50 shrink-0 shadow-sm">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center chamfered-sm border-2 border-leather-caramel/50 dark:border-gold-400/50 bg-leather-caramel/15 dark:bg-surface-primary shrink-0 shadow-sm">
                      <span className="font-display text-base font-bold text-leather-dark dark:text-gold-400">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm sm:text-base font-bold tracking-wide text-leather-dark dark:text-platinum-50 uppercase truncate">
                      {testimonial.name}
                    </p>
                    <p className="font-mono text-xs tracking-wider text-leather-caramel dark:text-gold-400 truncate font-semibold">
                      {testimonial.role}
                    </p>
                  </div>

                  {/* Verified Seal */}
                  <div className="flex items-center gap-1 shrink-0 px-2.5 py-1 chamfered-xs bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/30 dark:border-gold-400/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-leather-caramel dark:text-gold-400" />
                    <span className="font-mono text-[9px] font-bold text-leather-caramel dark:text-gold-400">
                      SEALED
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {!loading && testimonials?.length === 0 && (
            <div className="col-span-full flex justify-center py-12">
              <span className="font-mono text-xs text-leather-muted dark:text-text-muted">NO COMPANION DATA AVAILABLE</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
