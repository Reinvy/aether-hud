"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInView } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusDot } from "@/components/ui/status-dot";
import { AssetIcon } from "@/components/ui/asset-icon";
import { CodexGlyph } from "@/components/ui/codex-glyph";
import { SectionHeading } from "@/components/features/section-heading";
import type { ConfigDto, SectionDto, SocialDto } from "@/lib/dto";

interface DispatchForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY_DISPATCH: DispatchForm = { name: "", email: "", subject: "", message: "" };

/**
 * Compose the hand-off link. The summon desk has no server side: the visitor's
 * own mail client carries the message, which is why the form validates the same
 * things the retired endpoint did (name, address, topic, body) before opening it.
 */
function buildMailto(address: string, form: DispatchForm): string {
  const subject = `Commission inquiry — ${form.name.trim()}`;
  const body = [
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    `Subject: ${form.subject.trim()}`,
    "",
    form.message.trim(),
  ].join("\n");
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
  const [formData, setFormData] = useState<DispatchForm>(EMPTY_DISPATCH);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  // The roster is long (29 channels); the panel leads with the first eight and
  // lets the visitor expand the rest instead of scrolling a wall of links.
  const [showAllSocials, setShowAllSocials] = useState(false);

  const directEmail = config.email || "hello@aether-hud.dev";
  const isAvailable = config.status.toUpperCase() === "ONLINE";
  const mailtoHref = buildMailto(directEmail, formData);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("Please fill in your name, email, topic and message.");
      return;
    }
    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      setError("That email address does not look right.");
      return;
    }

    setSending(true);
    setCopyState("idle");
    // Hand the composed message to the visitor's mail client.
    window.location.href = mailtoHref;
    setSent(true);
    setSending(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(directEmail);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const resetDispatch = () => {
    setSent(false);
    setCopyState("idle");
    setFormData(EMPTY_DISPATCH);
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Dispatch Portal"
          icon={<AssetIcon icon="mail" size="sm" className="shrink-0" />}
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
              <div className="codex-card codex-radius-card p-6 sm:p-8 h-full">
                {/* Form header */}
                <div className="flex flex-wrap items-center gap-2.5 pb-4 mb-6 border-b border-leather-caramel/20">
                  <AssetIcon icon="mail" size="sm" />
                  <span className="codex-label-active">
                    Encrypted Dispatch Scroll
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-jade-500/10 border border-jade-500/30">
                    <StatusDot tone="active" pulse label="Dispatch portal online" />
                    <span className="codex-label text-jade-ink">
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
                    <CodexGlyph name="confirm" className="mb-4 text-4xl text-jade-ink" />
                    <p className="font-serif text-lg font-bold tracking-wider text-leather-dark uppercase">
                      Dispatch composed
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-leather-muted font-body">
                      Your mail client has opened with the summoning scroll. If it did not, send the
                      message straight to the address below.
                    </p>
                    <span className="mt-3 inline-block codex-btn border border-leather-caramel/40 bg-leather-caramel/10 px-4 py-1 font-display text-xs tabular-nums text-leather-dark font-bold">
                      {directEmail}
                    </span>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleCopy}
                        className="font-serif uppercase tracking-widest"
                      >
                        {copyState === "copied"
                          ? "Address copied"
                          : copyState === "failed"
                            ? "Copy failed — select it"
                            : "Copy address"}
                      </Button>
                      <a
                        href={mailtoHref}
                        className="codex-btn-primary codex-sheen codex-focus px-4 py-2 font-serif text-[11px] font-bold tracking-wider uppercase"
                      >
                        Open mail app
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={resetDispatch}
                        className="font-serif uppercase tracking-widest"
                      >
                        Send another dispatch
                      </Button>
                    </div>
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
                        prefix={<AssetIcon icon="character" tone="ink" size="sm" />}
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
                        prefix={<AssetIcon icon="mail" tone="ink" size="sm" />}
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
                        prefix={<AssetIcon icon="deckList" tone="ink" size="sm" />}
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
                          className="flex items-center gap-2 codex-radius-card border border-crimson-600/30 bg-crimson-600/8 px-4 py-3 text-crimson-600"
                          role="alert"
                          aria-live="polite"
                        >
                          <AssetIcon icon="warning" size="sm" className="shrink-0" />
                          <span className="font-body text-xs">{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={sending || sent}
                      className="w-full codex-btn-primary codex-focus py-4 font-serif text-xs font-bold tracking-[0.2em] uppercase hover:opacity-95 shadow-lg transition-all inline-flex items-center justify-center gap-2.5"
                    >
                      <AssetIcon icon="wish" tone="ink" size="sm" />
                      <span>{sending ? "Dispatching Scroll…" : "Dispatch Summoning Scroll"}</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info / Social Runes — takes 2 cols */}
            <motion.div className="lg:col-span-2 space-y-4" {...fadeInView}>
              {/* Social Channels */}
              <div className="codex-card codex-radius-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AssetIcon icon="community" size="sm" />
                  <span className="codex-label-active">
                    Guild Channels
                  </span>
                </div>

                {socials.length > 0 ? (
                  <div className="space-y-2" aria-label="Social communication channels">
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {(showAllSocials ? socials : socials.slice(0, 8)).map((social) => {
                        return (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Connect on ${social.platform}`}
                            className="group/channel flex items-center gap-3 codex-radius-card border border-leather-caramel/30 bg-parchment-subtle hover:bg-parchment-elevated px-4 py-2.5 text-xs font-body tracking-wider text-leather-dark transition-all hover:border-leather-caramel shadow-sm press-scale hover-scale-sm codex-focus"
                          >
                            <AssetIcon icon="community" tone="ink" size="sm" />
                            <span className="flex-1 font-bold">{social.platform}</span>
                            <CodexGlyph
                              name="next"
                              className="text-leather-caramel opacity-0 group-hover/channel:opacity-100 transition-opacity"
                            />
                          </a>
                        );
                      })}
                    </div>
                    {socials.length > 8 && (
                      <button
                        type="button"
                        onClick={() => setShowAllSocials((open) => !open)}
                        aria-expanded={showAllSocials}
                        className="codex-btn-secondary codex-sheen codex-focus w-full px-4 py-2 text-[11px] tracking-wider uppercase"
                      >
                        {showAllSocials ? "Show fewer channels" : `Show all ${socials.length} channels`}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 codex-radius-card border border-dashed border-leather-caramel/30 px-4 py-8 text-center">
                    <AssetIcon icon="friends" size="sm" />
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
              <div className="codex-card codex-radius-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AssetIcon icon="mail" size="sm" />
                  <span className="codex-label-active">
                    Direct Letter
                  </span>
                </div>
                <a
                  href={`mailto:${directEmail}`}
                  aria-label={`Send direct email to ${directEmail}`}
                  className="group/channel flex items-center gap-3 codex-radius-card border border-leather-caramel/30 bg-parchment-subtle hover:bg-parchment-elevated px-4 py-2.5 text-xs font-body tracking-wider text-leather-dark transition-all hover:border-leather-caramel shadow-sm codex-focus"
                >
                  <AssetIcon icon="mail" size="sm" />
                  <span className="font-display text-[11px] tabular-nums truncate font-bold">
                    {directEmail}
                  </span>
                  <CodexGlyph name="next" className="ml-auto text-leather-caramel" />
                </a>
              </div>

              {/* Availability */}
              <div className="codex-card codex-radius-card p-5">
                <div className="flex items-center gap-2">
                  <StatusDot tone={isAvailable ? "active" : "warning"} pulse={isAvailable} />
                  <span className="codex-label text-jade-ink">
                    {isAvailable ? "Available for commissions" : config.status}
                  </span>
                </div>
                <p className="codex-label mt-2 tracking-wider">
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
