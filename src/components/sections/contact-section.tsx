"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInView } from "@/lib/motion-variants";
import { Send, Lock, Terminal, GitBranch, Globe, MessageCircle, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/lib/use-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/features/section-heading";

type Social = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
};

type Config = {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  status: string;
  sysVersion: string;
};


const socialIcons: Record<string, React.ElementType> = {
  GitBranch, Globe, MessageCircle,
};

const defaultSocials: Social[] = [
  { id: "default-1", platform: "GitHub", url: "https://github.com", icon: "GitBranch", order: 0 },
  { id: "default-2", platform: "LinkedIn", url: "https://linkedin.com", icon: "Globe", order: 1 },
];

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const { data: socials } = useData<Social[]>("/api/socials");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate send
    setTimeout(() => setSent(true), 1000);
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CONTACT NODE // ENCRYPTED"
          icon={<Terminal className="mr-1.5 h-3.5 w-3.5" />}
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
                    <Lock className="h-4 w-4 text-gold-400" />
                    <span className="sys-label-gold">ENCRYPTED TRANSMISSION // AES-256</span>
                    <span className="ml-auto flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-hud-active" />
                      <span className="sys-label-active text-[9px]">SECURE</span>
                    </span>
                  </div>

                  {sent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <CheckCircle className="h-12 w-12 text-hud-active mb-4" />
                      <p className="font-display text-lg font-bold tracking-wider text-text-main">
                        TRANSMISSION SENT
                      </p>
                      <p className="mt-2 text-sm text-text-muted font-mono">
                        [NODE] // Message received. Awaiting response.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                          id="name"
                          label="FIELD_01 // NAME"
                          placeholder="Enter your designation..."
                          required
                        />
                        <Input
                          id="email"
                          label="FIELD_02 // EMAIL"
                          type="email"
                          placeholder="comm@channel.domain"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="sys-label mb-2 block text-text-muted">
                          FIELD_03 // SUBJECT
                        </label>
                        <input
                          id="subject"
                          className="input-recessed w-full px-4 py-2.5 text-sm font-body"
                          placeholder="Transmission subject..."
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="sys-label mb-2 block text-text-muted">
                          FIELD_04 // MESSAGE BODY
                        </label>
                        <textarea
                          id="message"
                          rows={5}
                          className="input-recessed w-full px-4 py-2.5 text-sm font-body resize-none"
                          placeholder="Type your encrypted message..."
                          required
                        />
                      </div>
                      <Button type="submit" variant="primary" size="lg" className="w-full crosshair-ring">
                        <Send className="h-4 w-4" />
                        TRANSMIT MESSAGE
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
                    <Terminal className="h-3.5 w-3.5 text-gold-400" />
                    <span className="sys-label-gold">COMM // CHANNELS</span>
                  </div>
                  <div className="space-y-2">
                    {(socials || defaultSocials).map((social) => {
                      const Icon = socialIcons[social.icon] || Terminal;
                      return (
                        <a
                          key={social.platform}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded border border-border-subtle px-4 py-3 text-xs font-mono tracking-wider text-text-muted transition-all hover:border-border-glass hover:text-gold-400 hover:bg-glass-200 group"
                        >
                          <Icon className="h-4 w-4 text-gold-400/60 group-hover:text-gold-400 transition-colors" />
                          <span className="flex-1">{social.platform}</span>
                          <span className="sys-label text-[8px]">[LINK]</span>
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
                    <Mail className="h-3.5 w-3.5 text-gold-400" />
                    <span className="sys-label-gold">DIRECT // NODE</span>
                  </div>
                  <a
                    href="mailto:hello@aether-hud.dev"
                    className="flex items-center gap-3 rounded border border-border-subtle px-4 py-3 text-xs font-mono tracking-wider text-text-muted transition-all hover:border-border-glass hover:text-gold-400 hover:bg-glass-200 group"
                  >
                    <Mail className="h-4 w-4 text-gold-400/60 group-hover:text-gold-400" />
                    <span className="font-mono text-[11px]">
                      hello@aether-hud.dev
                    </span>
                    <span className="ml-auto sys-label text-[8px]">[SEND]</span>
                  </a>
                </CardContent>
              </Card>

              {/* Status */}
              <Card variant="glass" hover="none">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="led-active" />
                    <span className="sys-label-active text-[10px]">AVAILABLE FOR PROJECTS</span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-text-muted/50 tracking-wider">
                    Response time: usually within 24 hours
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
