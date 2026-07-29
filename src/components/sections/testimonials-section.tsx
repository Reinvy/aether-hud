"use client";

import { motion } from "framer-motion";
import { MessageCircle, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/lib/use-data";

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

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

export function TestimonialsSection() {
  const { data: testimonials, loading } = useData<Testimonial[]>("/api/testimonials");

  return (
    <section id="testimonials" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
          <Badge variant="gold" size="md" className="mb-4">
            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
            TESTIMONIALS // FEEDBACK
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-[0.08em] text-text-main sm:text-4xl">
            Verified <span className="text-gradient-gold">Reports</span>
          </h2>
          <p className="mt-4 text-lg text-text-muted font-body">
            After-action reports from collaborators, clients, and peers.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2"
          {...stagger}
        >
          {loading && (
            <div className="col-span-full flex justify-center py-12">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                <span className="sys-label text-xs text-text-muted">LOADING REPORTS...</span>
              </div>
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
                    <Quote className="h-8 w-8 text-gold-400/20" />
                  </div>

                  {/* Content */}
                  <p className="text-sm leading-relaxed text-text-muted font-body italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="mt-6 flex items-center gap-4">
                    {/* Avatar placeholder */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border-glass bg-surface-primary">
                      <span className="font-mono text-xs text-gold-400">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

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
                    <span className="sys-label text-[8px] text-text-muted/20">
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
