"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInView } from "@/lib/motion-variants";
import {
  Send,
  Lock,
  Terminal,
  GitBranch,
  Globe,
  MessageCircle,
  Mail,
  CheckCircle,
  AlertCircle,
  User,
  AtSign,
  Hash,
  ChevronRight,
  BookOpen,
  GitFork,
  MessageSquare,
  Rss,
  MonitorPlay,
  Palette,
  Heart,
  Coffee,
  Video,
  Camera,
  Code,
  Music,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusDot } from "@/components/ui/status-dot";
import { useData } from "@/lib/use-data";
import { SectionHeading } from "@/components/features/section-heading";

type Social = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
};

const socialIcons: Record<string, React.ElementType> = {
  GitBranch, Globe, MessageCircle, BookOpen, GitFork, MessageSquare, Rss, MonitorPlay, Palette,
  Heart, Coffee, Video, Camera, Mail, Send, Code, Music, AtSign,
};

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [transmissionId, setTransmissionId] = useState("");

  const { data: socials, loading: socialsLoading } = useData<Social[]>("/api/socials");
  const { data: config } = useData<{ email?: string; status?: string }>("/api/config");
  const directEmail = config?.email || "hello@aether-hud.dev";
  const status = config?.status || "ONLINE";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSent(true);
        setTransmissionId(data.transmissionId || "TX-SUCCESS");
      } else {
        setError(data.error || "Summoning dispatch failed: channel unavailable.");
      }
    } catch {
      setError("Network resonance anomaly: failed to reach summoning portal.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="SUMMONING SHRINE // TRANSMISSION"
          icon={<Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
          title="Summon"
          highlight="Developer"
          subtitle="Direct telepathic dispatch channel. Messages are sent securely with prompt response."
        />

        <div className="mt-14 mx-auto max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Contact Form — takes 3 cols */}
            <motion.div className="lg:col-span-3" {...fadeInView}>
              <div className="parchment-panel dark:glass-panel chamfered p-6 sm:p-8 border border-leather-caramel/25 dark:border-gold-400/25 shadow-xl h-full">
                {/* Form header */}
                <div className="flex items-center gap-2 pb-4 mb-6 border-b border-leather-caramel/20 dark:border-gold-400/20">
                  <Lock className="h-4 w-4 text-leather-caramel dark:text-gold-400" aria-hidden="true" />
                  <span className="font-mono text-xs tracking-widest text-leather-caramel dark:text-gold-400 font-bold uppercase">
                    TEYVAT DISPATCH // ENCRYPTED
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <StatusDot tone="active" pulse label="Channel active" />
                    <span className="sys-label-active text-[9px]">ONLINE</span>
                  </span>
                </div>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                    aria-live="polite"
                  >
                    <CheckCircle className="h-12 w-12 text-hud-active mb-4" aria-hidden="true" />
                    <p className="font-display text-lg font-bold tracking-wider text-leather-dark dark:text-platinum-50 uppercase">
                      DISPATCH DELIVERED
                    </p>
                    <p className="mt-2 text-sm text-leather-muted dark:text-text-muted font-mono">
                      [TEYVAT] // Summoning scroll received. Seal ID:
                    </p>
                    <span className="mt-2 inline-block chamfered-xs border border-leather-caramel/40 dark:border-gold-400/40 bg-leather-caramel/10 dark:bg-gold-400/10 px-3 py-1 font-mono text-xs text-leather-caramel dark:text-gold-300 font-bold tabular-nums">
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
                      className="mt-6"
                    >
                      SEND ANOTHER DISPATCH
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        label="SUMMONER // NAME"
                        placeholder="e.g. Traveler / Recruiter…"
                        prefix={<User className="h-4 w-4" aria-hidden="true" />}
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
                        label="COMM ADDRESS // EMAIL"
                        placeholder="traveler@teyvat.realm…"
                        prefix={<AtSign className="h-4 w-4" aria-hidden="true" />}
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
                        label="MISSION // TOPIC"
                        placeholder="Collaboration or commission inquiry…"
                        prefix={<Hash className="h-4 w-4" aria-hidden="true" />}
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
                        label="SCROLL CONTENT // MESSAGE"
                        rows={5}
                        className="resize-none"
                        placeholder="Write your mission dispatch message here…"
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
                          className="flex items-center gap-2 chamfered-sm border border-hud-danger/40 bg-[rgba(255,0,85,0.08)] px-4 py-3 text-hud-danger"
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
                      className="w-full tactical-btn btn-glow-sweep py-3 bg-leather-caramel dark:bg-gold-400 text-parchment-base dark:text-deep-space font-mono text-xs font-bold tracking-widest uppercase hover:opacity-90 shadow-md hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
                    >
                      {!sending && !sent && <Send className="h-4 w-4" aria-hidden="true" />}
                      <span>{sending ? "DISPATCHING SCROLL…" : "DISPATCH SUMMONING SCROLL"}</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info / Social Runes — takes 2 cols */}
            <motion.div className="lg:col-span-2 space-y-4" {...fadeInView}>
              {/* Social Channels */}
              <div className="parchment-panel dark:glass-panel chamfered p-5 border border-leather-caramel/25 dark:border-gold-400/25 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-leather-caramel dark:text-gold-400" aria-hidden="true" />
                  <span className="font-mono text-xs tracking-widest text-leather-caramel dark:text-gold-400 font-bold uppercase">
                    GUILD // SOCIAL RUNES
                  </span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1" aria-label="Social communication channels">
                  {socialsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-10 w-full chamfered-sm bg-leather-caramel/10 skeleton-hud" />
                      ))}
                    </div>
                  ) : (socials ?? []).map((social) => {
                    const Icon = socialIcons[social.icon] || Terminal;
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Connect on ${social.platform}`}
                        className="group/channel flex items-center gap-3 chamfered-sm border border-leather-caramel/20 dark:border-border-subtle bg-parchment-subtle/80 dark:bg-deep-space/40 px-4 py-2.5 text-xs font-mono tracking-wider text-leather-dark dark:text-text-muted transition-all hover:border-leather-caramel dark:hover:border-gold-400 hover:text-leather-caramel dark:hover:text-gold-400 shadow-sm"
                      >
                        <Icon className="h-4 w-4 text-leather-caramel/70 dark:text-gold-400/70 transition-transform group-hover/channel:scale-110" aria-hidden="true" />
                        <span className="flex-1 font-semibold">{social.platform}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-leather-caramel dark:text-gold-400 opacity-0 group-hover/channel:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Direct Mail */}
              <div className="parchment-panel dark:glass-panel chamfered p-5 border border-leather-caramel/25 dark:border-gold-400/25 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-3.5 w-3.5 text-leather-caramel dark:text-gold-400" aria-hidden="true" />
                  <span className="font-mono text-xs tracking-widest text-leather-caramel dark:text-gold-400 font-bold uppercase">
                    DIRECT // LETTER
                  </span>
                </div>
                <a
                  href={`mailto:${directEmail}`}
                  aria-label={`Send direct email to ${directEmail}`}
                  className="group/channel flex items-center gap-3 chamfered-sm border border-leather-caramel/20 dark:border-border-subtle bg-parchment-subtle/80 dark:bg-deep-space/40 px-4 py-2.5 text-xs font-mono tracking-wider text-leather-dark dark:text-text-muted transition-all hover:border-leather-caramel dark:hover:border-gold-400 hover:text-leather-caramel dark:hover:text-gold-400"
                >
                  <Mail className="h-4 w-4 text-leather-caramel/70 dark:text-gold-400/70" aria-hidden="true" />
                  <span className="font-mono text-[11px] truncate font-semibold">
                    {directEmail}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 ml-auto text-leather-caramel dark:text-gold-400" />
                </a>
              </div>

              {/* Status */}
              <div className="parchment-panel dark:glass-panel chamfered p-5 border border-leather-caramel/25 dark:border-gold-400/25 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="led-active" aria-hidden="true" />
                  <span className="sys-label-active text-[10px]">
                    {status === "ONLINE" ? "AVAILABLE FOR GUILD COMMISSIONS" : `STATUS: ${status}`}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[10px] text-leather-muted/80 dark:text-text-muted/60 tracking-wider">
                  Response time: typically within 24 hours
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
