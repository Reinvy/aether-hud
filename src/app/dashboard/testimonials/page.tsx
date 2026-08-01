"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Plus,
  Pencil,
  Trash2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { useData } from "@/lib/use-data";
import { DashboardListSkeleton } from "@/components/ui/skeleton";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

interface ApiTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  order: number;
}

type FormData = {
  name: string;
  role: string;
  content: string;
  avatar: string;
  order: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  role: "",
  content: "",
  avatar: "",
  order: "0",
};

export default function DashboardTestimonials() {
  const { data: testimonials, loading, refetch } = useData<ApiTestimonial[]>("/api/testimonials");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(t: ApiTestimonial) {
    setEditingId(t.id);
    setForm({
      name: t.name,
      role: t.role,
      content: t.content,
      avatar: t.avatar,
      order: String(t.order),
    });
    setModalOpen(true);
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        role: form.role,
        content: form.content,
        avatar: form.avatar,
        order: parseInt(form.order, 10) || 0,
      };

      if (editingId) {
        await fetch("/api/testimonials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...body }),
        });
      } else {
        await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setModalOpen(false);
      refetch();
    } catch (e) {
      console.error("Failed to save testimonial", e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("PURGE TESTIMONIAL? This action cannot be undone.")) return;
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      refetch();
    } catch (e) {
      console.error("Failed to delete testimonial", e);
    }
  }

  if (loading) {
    return <DashboardListSkeleton rows={4} />;
  }

  const list = testimonials ?? [];

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">DASHBOARD // TESTIMONIAL ARCHIVE</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              Manage <span className="text-gradient-gold">Testimonials</span>
            </h1>
          </div>
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            NEW TESTIMONIAL
          </Button>
        </div>
      </motion.div>

      {/* Testimonials Grid */}
      <motion.div className="grid gap-4 sm:grid-cols-2" {...fadeInUp}>
        {list.length === 0 ? (
          <Card variant="glass" hover="none" className="sm:col-span-2">
            <CardContent className="p-8 text-center">
              <p className="font-mono text-sm text-text-muted">
                [EMPTY] // No testimonials recorded
              </p>
            </CardContent>
          </Card>
        ) : (
          list.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="glass" hover="sweep" diamond>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-glass bg-deep-space/50">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="h-full w-full rounded-full object-cover"
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

                  <div className="mt-3 rounded border border-border-subtle bg-deep-space/30 p-3">
                    <p className="font-mono text-[11px] leading-relaxed text-text-muted italic line-clamp-3">
                      &ldquo;{t.content}&rdquo;
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="sys-label text-[8px]">ORDER: {t.order}</span>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        glow="none"
                        className="p-1.5 sm:p-2"
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        glow="none"
                        className="p-1.5 sm:p-2 text-hud-danger hover:text-hud-danger"
                        onClick={() => handleDelete(t.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* New / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "EDIT TESTIMONIAL" : "NEW TESTIMONIAL"}
        sysId={editingId ? `DASH//05 // ${editingId.slice(0, 8)}` : "DASH//05 // NEW"}
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              CANCEL
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              SAVE TESTIMONIAL
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="FIELD_01 // NAME"
              placeholder="Client or colleague name..."
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <Input
              label="FIELD_02 // ROLE"
              placeholder="e.g., CTO at Company"
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
            />
          </div>
          <Textarea
            label="FIELD_03 // TESTIMONIAL CONTENT"
            placeholder="What did they say about your work?..."
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            rows={4}
          />
          <Input
            label="FIELD_04 // AVATAR URL"
            placeholder="https://example.com/avatar.jpg"
            value={form.avatar}
            onChange={(e) => updateField("avatar", e.target.value)}
          />
          <Input
            label="FIELD_05 // ORDER"
            type="number"
            placeholder="0"
            value={form.order}
            onChange={(e) => updateField("order", e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
