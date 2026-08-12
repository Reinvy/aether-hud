"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RowActions } from "@/components/ui/row-actions";

export interface TestimonialCardData {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  order: number;
}

interface TestimonialCardProps {
  testimonial: TestimonialCardData;
  /** Grid position — drives the staggered enter animation delay. */
  index?: number;
  onEdit: (testimonial: TestimonialCardData) => void;
  onDelete: (testimonial: TestimonialCardData) => void;
}

/**
 * TestimonialCard — single testimonial archive card for the dashboard
 * testimonials page.
 *
 * Extracted from testimonials-view so each archive entry is a
 * self-contained unit: avatar frame, name/role header, quoted content
 * block and the order/actions footer all render from one
 * TestimonialCardData record. The view just maps the list into cards and
 * owns the edit/delete state.
 */
export function TestimonialCard({ testimonial: t, index = 0, onEdit, onDelete }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="glass" hover="sweep" diamond>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center chamfered-sm overflow-hidden border border-border-glass bg-deep-space/50">
              {t.avatar ? (
                // Raw img (not next/image): avatar URLs come from the
                // Prisma DB and may be arbitrary remote hosts, which
                // the image optimizer would reject. Native lazy loading
                // + async decoding still defer off-screen avatars.
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Quote className="h-5 w-5 text-gold-400/60" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-medium tracking-wider text-text-main">
                {t.name}
              </p>
              <p className="mt-0.5 font-mono text-[9px] text-text-muted">
                {t.role}
              </p>
            </div>
          </div>

          <div className="mt-3 chamfered-sm border border-border-subtle bg-deep-space/30 p-3">
            <p className="font-mono text-[11px] leading-relaxed text-text-muted italic line-clamp-3">
              &ldquo;{t.content}&rdquo;
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="sys-label text-[8px]">ORDER: {t.order}</span>
            <RowActions
              onEdit={() => onEdit(t)}
              onDelete={() => onDelete(t)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
