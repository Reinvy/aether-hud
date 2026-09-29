"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Terminal,
  Users,
  User,
  AtSign,
  Hash,
  Globe,
  GitBranch,
  MessageCircle,
  Mail,
  Link2,
  MonitorPlay,
  Palette,
  Heart,
  Coffee,
  Video,
  Camera,
  Send,
  Code,
  Music,
  BookOpen,
  GitFork,
  MessageSquare,
  Rss,
} from "lucide-react";
import { fadeInView } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusDot } from "@/components/ui/status-dot";
import { SectionHeading } from "@/components/features/section-heading";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import type { ConfigDto, SectionDto, SocialDto } from "@/lib/dto";

const socialIcons: Record<string, React.ElementType> = {
  Globe,
  GitBranch,
  MessageCircle,
  Mail,
  Link2,
  MonitorPlay,
  Palette,
  Heart,
  Coffee,
  Video,
  Camera,
  Send,
  Code,
  Music,
  AtSign,
  BookOpen,
  GitFork,
  MessageSquare,
  Rss,
};

interface ContactResponse {
  error?: string;
  transmissionId?: string;
}

export function ContactSection({
  config,
  socials,
  section,
}: {
  config: ConfigDto;
  socials: SocialDto[];
  section: SectionDto;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transmissionId, setTransmissionId] = useState<string>("");

  const directEmail = config.email || "hello@aether-hud.dev";
  const isAvailable = config.status.toUpperCase() === "ONLINE";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ContactResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "The dispatch scroll could not be delivered. Try again.");
        return;
      }

      setTransmissionId(data.transmissionId ?? `TX-${Date.now().toString(36).toUpperCase()}`);
      setSent(true);
    } catch {
      setError("The dispatch portal is unreachable. Try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15 dark:opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Dispatch Portal"
          icon={
            <span className="codex-icon-plate h-7 w-7 shrink-0">
              <Image
                src={GENSHIN_UI_ICONS.mail}
                alt="Mail Icon"
                width={16}
                height={16}
                className="codex-icon-on-plate h-4 w-4 object-contain"
              />
            </span>
          }
          title={section.title || "Summon"}
          highlight={section.title ? undefined : "Architect"}
          subtitle={
            section.subtitle ||
            "Ad Astra Abyssosque. Direct telepathic message portal for commissions, collaborations, and guild contracts."
          }
        />

        <div className="mt-14 mx-auto max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Contact Form — takes 3 cols */}
            <motion.div className="lg:col-span-3" {...fadeInView}>
              <div className="bg-parchment-base dark:bg-surface-primary/80 codex-panel rounded-3xl p-6 sm:p-8 border-2 border-leather-caramel/30 shadow-2xl h-full">
                {/* Form header */}
                <div className="flex flex-wrap items-center gap-2.5 pb-4 mb-6 border-b border-leather-caramel/20">
                  <span className="codex-icon-plate h-7 w-7 shrink-0">
                    <Image
                      src={GENSHIN_UI_ICONS.mail}
                      alt="Dispatch"
                      width={16}
                      height={16}
                      className="codex-icon-on-plate h-4 w-4 object-contain"
                    />
                  </span>
                  <span className="font-serif text-xs tracking-widest text-leather-caramel font-bold uppercase">
                    Encrypted Dispatch Scroll
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-jade-500/10 border border-jade-500/30">
                    <StatusDot tone="active" pulse label="Dispatch portal online" />
                    <span className="font-mono text-[9px] text-jade-600 dark:text-jade-300 font-bold uppercase">
                      Open
                    </span>
                  </span>
                </div>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                    aria-live="polite"
                  >
                    <CheckCircle className="h-12 w-12 text-jade-500 mb-4" aria-hidden="true" />
                    <p className="font-serif text-lg font-bold tracking-wider text-leather-dark uppercase">
                      Dispatch Delivered
                    </p>
                    <p className="mt-2 text-sm text-leather-caramel dark:text-text-muted font-mono font-medium">
                      Summoning scroll received. Seal ID:
                    </p>
                    <span className="mt-2 inline-block rounded-full border border-leather-caramel/40 bg-leather-caramel/10 px-4 py-1 font-mono text-xs text-leather-caramel font-bold tabular-nums">
                      {transmissionId}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSent(false);
                        setFormData({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="mt-6 font-serif uppercase tracking-widest"
                    >
                      Send Another Dispatch
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        label="Summoner Name"
                        placeholder="Traveler / Collaborator…"
                        prefix={<User className="h-4 w-4 text-leather-caramel/70" aria-hidden="true" />}
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        disabled={sending}
                      />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        spellCheck={false}
                        label="Comm Address"
                        placeholder="traveler@teyvat.realm…"
                        prefix={<AtSign className="h-4 w-4 text-leather-caramel/70" aria-hidden="true" />}
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                        disabled={sending}
                      />
                    </div>
                    <div>
                      <Input
                        id="subject"
                        name="subject"
                        label="Commission Topic"
                        placeholder="Project collaboration or contract inquiry…"
                        prefix={<Hash className="h-4 w-4 text-leather-caramel/70" aria-hidden="true" />}
                        value={formData.subject}
                        onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                        required
                        disabled={sending}
                      />
                    </div>
                    <div>
                      <Textarea
                        id="message"
                        name="message"
                        label="Scroll Content"
                        rows={5}
                        className="resize-none"
                        placeholder="Write your mission details and dispatch message here…"
                        value={formData.message}
                        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                        required
                        disabled={sending}
                      />
                    </div>

                    {/* Error Alert */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 rounded-xl border border-hud-danger/40 bg-hud-danger/10 px-4 py-3 text-hud-danger"
                          role="alert"
                          aria-live="polite"
                        >
                          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span className="font-mono text-xs">{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={sending || sent}
                      className="w-full codex-btn-primary py-4 font-serif text-xs font-bold tracking-[0.2em] uppercase hover:opacity-95 shadow-lg transition-all inline-flex items-center justify-center gap-2.5"
                    >
                      <div className="w-4 h-4 relative">
                        <Image
                          src={GENSHIN_UI_ICONS.wish}
                          alt="Wish Icon"
                          width={16}
                          height={16}
                          className="codex-icon-ink object-contain"
                        />
                      </div>
                      <span>{sending ? "Dispatching Scroll…" : "Dispatch Summoning Scroll"}</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info / Social Runes — takes 2 cols */}
            <motion.div className="lg:col-span-2 space-y-4" {...fadeInView}>
              {/* Social Channels */}
              <div className="bg-parchment-base dark:bg-surface-primary/80 codex-panel rounded-3xl p-5 border-2 border-leather-caramel/30 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="codex-icon-plate h-7 w-7 shrink-0">
                    <Image
                      src={GENSHIN_UI_ICONS.community}
                      alt="Community"
                      width={16}
                      height={16}
                      className="codex-icon-on-plate h-4 w-4 object-contain"
                    />
                  </span>
                  <span className="font-serif text-xs tracking-widest text-leather-caramel font-bold uppercase">
                    Guild Channels
                  </span>
                </div>

                {socials.length > 0 ? (
                  <div
                    className="space-y-2 max-h-72 overflow-y-auto pr-1"
                    aria-label="Social communication channels"
                  >
                    {socials.map((social) => {
                      const Icon = socialIcons[social.icon] || Terminal;
                      return (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Connect on ${social.platform}`}
                          className="group/channel flex items-center gap-3 rounded-2xl border border-leather-caramel/30 bg-parchment-subtle hover:bg-parchment-elevated dark:bg-deep-space/40 dark:hover:bg-glass-200 px-4 py-2.5 text-xs font-mono tracking-wider text-leather-dark transition-all hover:border-leather-caramel shadow-sm"
                        >
                          <Icon className="h-4 w-4 text-leather-caramel transition-transform group-hover/channel:scale-110" aria-hidden="true" />
                          <span className="flex-1 font-bold">{social.platform}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-leather-caramel opacity-0 group-hover/channel:opacity-100 transition-opacity" />
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-leather-caramel/30 dark:border-border-subtle px-4 py-8 text-center">
                    <Users className="h-6 w-6 text-leather-caramel/70" aria-hidden="true" />
                    <p className="font-serif text-sm font-bold text-leather-dark">
                      No guild channels inscribed yet
                    </p>
                    <p className="font-body text-xs text-leather-muted">
                      The roster is still being written. Send a direct letter below and the reply
                      will find you.
                    </p>
                  </div>
                )}
              </div>

              {/* Direct Letter */}
              <div className="bg-parchment-base dark:bg-surface-primary/80 codex-panel rounded-3xl p-5 border-2 border-leather-caramel/30 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="codex-icon-plate h-7 w-7 shrink-0">
                    <Image
                      src={GENSHIN_UI_ICONS.mail}
                      alt="Mail"
                      width={16}
                      height={16}
                      className="codex-icon-on-plate h-4 w-4 object-contain"
                    />
                  </span>
                  <span className="font-serif text-xs tracking-widest text-leather-caramel font-bold uppercase">
                    Direct Letter
                  </span>
                </div>
                <a
                  href={`mailto:${directEmail}`}
                  aria-label={`Send direct email to ${directEmail}`}
                  className="group/channel flex items-center gap-3 rounded-2xl border border-leather-caramel/30 bg-parchment-subtle hover:bg-parchment-elevated dark:bg-deep-space/40 dark:hover:bg-glass-200 px-4 py-2.5 text-xs font-mono tracking-wider text-leather-dark transition-all hover:border-leather-caramel shadow-sm"
                >
                  <span className="codex-icon-plate h-7 w-7 shrink-0">
                    <Image
                      src={GENSHIN_UI_ICONS.mail}
                      alt="Direct Mail"
                      width={16}
                      height={16}
                      className="codex-icon-on-plate h-4 w-4 object-contain"
                    />
                  </span>
                  <span className="font-mono text-[11px] truncate font-bold">
                    {directEmail}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 ml-auto text-leather-caramel" />
                </a>
              </div>

              {/* Availability */}
              <div className="bg-parchment-base dark:bg-surface-primary/80 codex-panel rounded-3xl p-5 border-2 border-leather-caramel/30 shadow-xl">
                <div className="flex items-center gap-2">
                  <StatusDot tone={isAvailable ? "active" : "warning"} pulse={isAvailable} />
                  <span className="font-mono text-[10px] font-bold text-jade-600 dark:text-jade-300 uppercase">
                    {isAvailable ? "Available for commissions" : config.status}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[10px] text-leather-muted tracking-wider font-bold">
                  Katheryne&apos;s Dispatch: response within 24h
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
