"use client";

import { motion } from "framer-motion";
import { MessageCircle, Quote } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 },
};

export function TestimonialsSection() {
  const { data: testimonials, loading } = useData<Testimonial[]>("/api/testimonials");

  return (
    <section id="testimonials" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="TESTIMONIALS // FEEDBACK"
          icon={<MessageCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
          title="Verified"
          highlight="Reports"
          subtitle="After-action reports from collaborators, clients, and peers."
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
              <Card
                variant="glass"
                hover="lift"
                className="group h-full"
              >
                <CardContent className="p-6">
                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-gold-400/20" aria-hidden="true" />
                  </div>

                  {/* Content as semantic blockquote */}
                  <blockquote className="text-sm leading-relaxed text-text-muted font-body italic text-pretty">
                    “{testimonial.content}”
                  </blockquote>

                  {/* Author */}
                  <div className="mt-6 flex items-center gap-4">
                    {testimonial.avatar && testimonial.avatar !== "/placeholder.svg" ? (
                      <div className="relative h-10 w-10 overflow-hidden chamfered-sm border border-border-glass">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center chamfered-sm border border-border-glass bg-surface-primary">
                        <span className="font-mono text-xs text-gold-400">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div>
                      <p className="font-display text-sm font-bold tracking-wider text-text-main">
                        {testimonial.name}
                      </p>
                      <p className="font-mono text-[10px] tracking-wider text-text-muted">
                        {testimonial.role}
                      </p>
                    </div>

                    {/* Verified sys badge */}
                    <span className="ml-auto sys-label text-[8px] text-stellar-400">
                      [VERIFIED]
                    </span>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute bottom-3 right-3">
                    <span className="sys-label text-[8px] text-text-muted/20 font-mono tabular-nums">
                      NODE//{testimonial.id.slice(0, 4).toUpperCase()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {!loading && testimonials?.length === 0 && (
            <div className="col-span-full flex justify-center py-12">
              <span className="sys-label text-xs text-text-muted">NO TESTIMONIAL DATA AVAILABLE</span>
            </div>
          )}
        </motion.div>

        {/* Bottom sys node decorations */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <span className="sys-node" />
            <span className="sys-label text-[9px] text-text-muted/30">END OF REPORTS // SYS_NODE</span>
            <span className="sys-node" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
