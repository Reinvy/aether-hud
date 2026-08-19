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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
        setError(data.error || "Transmission rejected by security firewall.");
      }
    } catch {
      setError("Network anomaly: failed to connect to communication gateway.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CONTACT NODE // ENCRYPTED"
          icon={<Terminal className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
          title="Establish"
          highlight="Connection"
          subtitle="Secure channel. Messages are encrypted end-to-end."
        />

        <div className="mt-14 mx-auto max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Contact Form — takes 3 cols */}
            <motion.div className="lg:col-span-3" {...fadeInView}>
              <Card variant="glass" hover="none" className="h-full">
                <CardContent className="p-6 sm:p-8">
                  {/* Form header */}
                  <div className="angled-bar flex items-center gap-2 pb-4 mb-6 border-b border-border-subtle">
                    <Lock className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    <span className="sys-label-gold">ENCRYPTED TRANSMISSION // AES-256</span>
                    <span className="ml-auto flex items-center gap-1.5">
                      <StatusDot tone="active" pulse label="Secure channel active" />
                      <span className="sys-label-active text-[9px]">SECURE</span>
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
                      <p className="font-display text-lg font-bold tracking-wider text-text-main">
                        TRANSMISSION DELIVERED
                      </p>
                      <p className="mt-2 text-sm text-text-muted font-mono">
                        [NODE] // Encrypted payload ingested. Transmission ID:
                      </p>
                      <span className="mt-2 inline-block chamfered-xs border border-gold-400/40 bg-gold-400/10 px-3 py-1 font-mono text-xs text-gold-300 tabular-nums">
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
                        TRANSMIT ANOTHER MESSAGE
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                          id="name"
                          name="name"
                          autoComplete="name"
                          label="FIELD_01 // DESIGNATION"
                          placeholder="e.g., Commander Shepard…"
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
                          label="FIELD_02 // COMM ADDRESS"
                          placeholder="comm@channel.domain…"
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
                          label="FIELD_03 // TRANSMISSION SUBJECT"
                          placeholder="Project collaboration inquiry…"
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
                          label="FIELD_04 // ENCRYPTED PAYLOAD"
                          rows={5}
                          className="resize-none"
                          placeholder="Type your encrypted message here…"
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

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full crosshair-ring"
                        loading={sending}
                        disabled={sent}
                      >
                        {!sending && !sent && <Send className="h-4 w-4" aria-hidden="true" />}
                        {sending ? "ENCRYPTING & TRANSMITTING…" : "TRANSMIT MESSAGE"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info — takes 2 cols */}
            <motion.div className="lg:col-span-2 space-y-4" {...fadeInView}>
              {/* Social Links */}
              <Card variant="glass" hover="sweep">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Terminal className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
                    <span className="sys-label-gold">COMM // CHANNELS</span>
                  </div>
                  <div className="space-y-2" aria-label="Communication channels">
                    {socialsLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-10 w-full chamfered-sm bg-glass-200 skeleton-hud" />
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
                          className="group/channel flex items-center gap-3 chamfered-sm border border-border-subtle bg-deep-space/30 px-4 py-3 text-xs font-mono tracking-wider text-text-muted transition-all hover:border-border-glass hover:text-gold-400 hover:bg-glass-200 hover-scale-sm press-scale focus-ring-gold"
                        >
                          <Icon className="h-4 w-4 text-gold-400/60 transition-transform duration-300 group-hover/channel:scale-110 group-hover/channel:text-gold-400" aria-hidden="true" />
                          <span className="flex-1">{social.platform}</span>
                          <span className="sys-label text-[8px] transition-colors duration-300 group-hover/channel:text-gold-400/60">[LINK]</span>
                          <ChevronRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/channel:translate-x-0 group-hover/channel:opacity-100 text-gold-400" aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Direct Contact */}
              <Card variant="glass" hover="sweep">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
                    <span className="sys-label-gold">DIRECT // NODE</span>
                  </div>
                  <a
                    href={`mailto:${directEmail}`}
                    aria-label={`Send direct email to ${directEmail}`}
                    className="group/channel flex items-center gap-3 chamfered-sm border border-border-subtle bg-deep-space/30 px-4 py-3 text-xs font-mono tracking-wider text-text-muted transition-all hover:border-border-glass hover:text-gold-400 hover:bg-glass-200 hover-scale-sm press-scale focus-ring-gold"
                  >
                    <Mail className="h-4 w-4 text-gold-400/60 transition-transform duration-300 group-hover/channel:scale-110 group-hover/channel:text-gold-400" aria-hidden="true" />
                    <span className="font-mono text-[11px] truncate">
                      {directEmail}
                    </span>
                    <span className="ml-auto sys-label text-[8px] transition-colors duration-300 group-hover/channel:text-gold-400/60">[SEND]</span>
                    <ChevronRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/channel:translate-x-0 group-hover/channel:opacity-100 text-gold-400" aria-hidden="true" />
                  </a>
                </CardContent>
              </Card>

              {/* Status */}
              <Card variant="glass" hover="none">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="led-active" aria-hidden="true" />
                    <span className="sys-label-active text-[10px]">
                      {status === "ONLINE" ? "AVAILABLE FOR MISSIONS & PROJECTS" : `STATUS: ${status}`}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-text-muted/50 tracking-wider">
                    Response time: typically within 24 hours
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
