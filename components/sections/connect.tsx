"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { z } from "zod";
import { speakingSchema } from "@/lib/speaking-schema";
import { Section } from "@/components/ui/section";
import { ConnectButton } from "@/components/ui/connect-button";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { SocialDock } from "@/components/nav/social-dock";
import { Turnstile } from "@/components/forms/turnstile";
import { springs } from "@/lib/motion";
import { submitSpeaking } from "@/lib/api";
import { aiAsset } from "@/lib/ai-assets";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { CALCOM_CONFIRMED, CALCOM_LINK, CONTACT_EMAIL } from "@/data/socials";
import type { SpeakingInquiry } from "@/lib/types";

/** cal.com embed: iframe + script heavy, so client-only and lazy. */
const Cal = dynamic(() => import("@calcom/embed-react").then((m) => m.default), {
  ssr: false,
});

const INPUT_CLASS =
  "w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none placeholder:text-ink-soft/60 focus-visible:ring-2 focus-visible:ring-accent";

type SpeakingValues = z.infer<typeof speakingSchema>;
type FieldErrors = Partial<Record<keyof SpeakingValues, string>>;

const AUDIENCE_SIZES = ["under 50", "50 to 200", "200 to 1000", "1000+"] as const;

const EMPTY_VALUES: SpeakingValues = {
  name: "",
  email: "",
  org: "",
  eventName: "",
  eventDate: "",
  audienceSize: "",
  budget: "",
  message: "",
  website: "",
};

/** Label + input shell with an inline error line. */
function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {optional && <span className="ml-1.5 text-xs font-normal text-ink-soft">(optional)</span>}
      </label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-gules">
          {error}
        </p>
      )}
    </div>
  );
}

/** (b) cal.com booking block. Shows a designed placeholder until Sipho
 * confirms his cal.com link (CALCOM_CONFIRMED in data/socials.ts), so the
 * page never renders cal.com's 404 box. */
function BookingBlock() {
  return (
    <Reveal className="mt-20">
      <div id="booking" className="scroll-mt-24">
        <div className="mb-5 flex flex-wrap items-end gap-x-5 gap-y-1">
          <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Grab 30 minutes
          </h3>
          <p className="-rotate-1 pb-0.5 font-hand text-xl text-ink-soft">
            the calendar is real, pick a slot
          </p>
        </div>
        {CALCOM_CONFIRMED ? (
          <div className="overflow-hidden rounded-2xl border border-line bg-canvas-raised p-2 shadow-(--shadow-polaroid) sm:p-3">
            <div
              className="h-[620px]"
              onClick={() => trackEvent(AnalyticsEvents.CalBooking)}
            >
              <Cal calLink={CALCOM_LINK} style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        ) : (
          <div className="grid place-items-center gap-4 rounded-2xl border border-dashed border-line bg-canvas-raised px-6 py-16 text-center shadow-(--shadow-polaroid)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className="size-8 text-accent">
              <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
              <path d="M3 9.5h18M8 2.5v4M16 2.5v4M8 14h3M8 17h6" strokeLinecap="round" />
            </svg>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              The live calendar plugs in here the moment the cal.com link is
              confirmed. Until then the old-fashioned way works too:
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=30 minutes?`}
              onClick={() => trackEvent(AnalyticsEvents.CalBooking)}
              className="inline-flex items-center gap-2 rounded-full bg-sable px-5 py-2 text-sm font-semibold text-paper shadow-md transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-paper dark:text-sable"
            >
              email me instead
            </a>
          </div>
        )}
      </div>
    </Reveal>
  );
}

/** (c) "Book me to speak" form: zod-validated, honeypotted, four states. */
function SpeakingForm() {
  const [values, setValues] = useState<SpeakingValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const set = (key: keyof SpeakingValues) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const parsed = speakingSchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SpeakingValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    // Honeypot: quiet fake success, no request leaves the page.
    if (values.website) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    const inquiry: SpeakingInquiry = {
      name: parsed.data.name,
      email: parsed.data.email,
      org: parsed.data.org || undefined,
      eventName: parsed.data.eventName,
      eventDate: parsed.data.eventDate || undefined,
      audienceSize: parsed.data.audienceSize || undefined,
      budget: parsed.data.budget || undefined,
      message: parsed.data.message,
      website: parsed.data.website,
      turnstileToken: turnstileToken ?? undefined,
    };
    try {
      const res = await submitSpeaking(inquiry);
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      trackEvent(AnalyticsEvents.SpeakingSubmit);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-canvas-raised p-8 text-center shadow-(--shadow-polaroid) sm:p-10">
        <p className="font-display text-2xl font-semibold tracking-tight">
          Thank you, it is in the bag.
        </p>
        <Handwritten rotate={-1.5} className="mt-4">
          I will get back to you within a few days
        </Handwritten>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-5 rounded-2xl border border-line bg-canvas-raised p-6 shadow-(--shadow-polaroid) sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="sp-name" label="Name" error={errors.name}>
          {(props) => (
            <input
              {...props}
              type="text"
              required
              maxLength={80}
              value={values.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="your name"
              className={INPUT_CLASS}
            />
          )}
        </Field>
        <Field id="sp-email" label="Email" error={errors.email}>
          {(props) => (
            <input
              {...props}
              type="email"
              required
              value={values.email}
              onChange={(e) => set("email")(e.target.value)}
              placeholder="you@somewhere.com"
              className={INPUT_CLASS}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="sp-org" label="Organisation" optional error={errors.org}>
          {(props) => (
            <input
              {...props}
              type="text"
              maxLength={120}
              value={values.org}
              onChange={(e) => set("org")(e.target.value)}
              placeholder="who is hosting"
              className={INPUT_CLASS}
            />
          )}
        </Field>
        <Field id="sp-event" label="Event name" error={errors.eventName}>
          {(props) => (
            <input
              {...props}
              type="text"
              required
              maxLength={120}
              value={values.eventName}
              onChange={(e) => set("eventName")(e.target.value)}
              placeholder="what should I put in my calendar"
              className={INPUT_CLASS}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="sp-date" label="Event date" optional error={errors.eventDate}>
          {(props) => (
            <input
              {...props}
              type="date"
              value={values.eventDate}
              onChange={(e) => set("eventDate")(e.target.value)}
              className={INPUT_CLASS}
            />
          )}
        </Field>
        <Field id="sp-audience" label="Audience size" optional error={errors.audienceSize}>
          {(props) => (
            <select
              {...props}
              value={values.audienceSize}
              onChange={(e) => set("audienceSize")(e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              <option value="">not sure yet</option>
              {AUDIENCE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field id="sp-budget" label="Speaker budget" optional error={errors.budget}>
        {(props) => (
          <input
            {...props}
            type="text"
            maxLength={80}
            value={values.budget}
            onChange={(e) => set("budget")(e.target.value)}
            placeholder="a number, a range, or 'none, it is a community thing'"
            className={INPUT_CLASS}
          />
        )}
      </Field>

      <Field id="sp-message" label="About the event" error={errors.message}>
        {(props) => (
          <textarea
            {...props}
            required
            rows={5}
            maxLength={5000}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            placeholder="what is it, who is coming, and what would you like me to talk about?"
            className={`${INPUT_CLASS} resize-y`}
          />
        )}
      </Field>

      {/* Honeypot: humans never see or tab into this field */}
      <div aria-hidden="true" className="absolute -left-[100vw] size-0 overflow-hidden">
        <label htmlFor="sp-website">leave this field empty</label>
        <input
          id="sp-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website")(e.target.value)}
        />
      </div>

      <Turnstile onToken={setTurnstileToken} />

      {status === "error" && (
        <p role="alert" className="text-sm text-gules">
          something went wrong sending that, mind trying again?
        </p>
      )}

      <motion.button
        type="submit"
        disabled={status === "submitting"}
        whileTap={status === "submitting" ? undefined : { scale: 0.97 }}
        transition={springs.snappy}
        className="inline-flex cursor-pointer items-center justify-center justify-self-start rounded-full bg-sable px-6 py-2.5 text-sm font-semibold text-paper shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 dark:bg-paper dark:text-sable"
      >
        {status === "submitting" ? "Sending..." : "Send the invite"}
      </motion.button>
    </form>
  );
}

/** (d) Footer bar: dark band in both themes, email left, dock right. */
function FooterBar() {
  return (
    <div className="bg-sable text-paper">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-5 py-7 sm:flex-row sm:px-8">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={() =>
            trackEvent(AnalyticsEvents.OutboundLink, { destination: "mailto:" + CONTACT_EMAIL })
          }
          className="group inline-flex items-center gap-2.5 rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22l-4-9-9-4 20-7z" />
          </svg>
          {CONTACT_EMAIL}
        </a>
        {/* Dock recoloured for the dark band (light theme needs it; dark is a no-op) */}
        <SocialDock className="[&_a]:border-white/25! [&_a]:bg-white/10! [&_a]:text-paper! [&_span]:bg-paper! [&_span]:text-sable!" />
      </div>
    </div>
  );
}

/** (e) The closing wax seal: gules wax, or glint, crest pressed in.
 * MICRO: rotates a degree and the shadow deepens on hover. */
function WaxSeal() {
  const reduce = useReducedMotion();
  // AI wax seal (AI-ASSET-PROMPTS.md C10) replaces the CSS wax body when it
  // lands; the blob radius stays so the box shadow keeps the seal shape, and
  // the crest impression stays overlaid in code.
  const aiSrc = aiAsset("artifacts/wax-seal");

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-16 sm:py-20">
      <motion.div
        whileHover={reduce ? undefined : { rotate: 2 }}
        transition={springs.soft}
        className="relative grid size-28 cursor-default place-items-center shadow-[0_14px_30px_rgb(20_20_22/0.35)] transition-shadow duration-300 hover:shadow-[0_22px_46px_rgb(20_20_22/0.55)] sm:size-32"
        style={{
          borderRadius: "46% 54% 51% 49% / 52% 47% 53% 48%",
          background: aiSrc
            ? undefined
            : "radial-gradient(circle at 34% 28%, #f05545 0%, #D50000 42%, #8f0000 82%), radial-gradient(circle at 70% 82%, rgb(252 221 9 / 0.28), transparent 55%)",
        }}
        aria-hidden
      >
        {aiSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={aiSrc} alt="" loading="lazy" className="absolute inset-0 size-full object-contain" />
        )}
        {/* pressed rim, CSS seal only; the generated wax has its own rim */}
        {!aiSrc && (
        <span
          className="absolute inset-[7%]"
          style={{
            borderRadius: "48% 52% 50% 50% / 51% 49% 52% 48%",
            boxShadow:
              "inset 0 2px 6px rgb(0 0 0 / 0.45), inset 0 -1px 3px rgb(255 255 255 / 0.12), 0 0 0 2px rgb(252 221 9 / 0.35)",
          }}
        />
        )}
        {/* the crest, pressed in like an impression */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/crest-badge.svg" alt="" className="relative w-[52%] opacity-25 mix-blend-multiply" />
      </motion.div>
      <p className="font-heraldic text-sm tracking-[0.45em] text-ink">CORAM DEO</p>
      <p className="-rotate-2 font-hand text-xl text-ink-soft">coram deo</p>
      <p className="text-xs text-ink-soft">© 2026 Sipho Yawe</p>
    </div>
  );
}

/**
 * Connect (brief section 6.17), the finale: the neon Connect button, cal.com
 * booking, the speaking form, then the footer bar and the wax seal.
 */
export function Connect() {
  const reduce = useReducedMotion();

  const scrollToBooking = () => {
    document
      .getElementById("booking")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <Section id="connect">
        {/* (a) the marquee button */}
        <Reveal className="py-8 sm:py-12">
          <ConnectButton onClick={scrollToBooking} />
        </Reveal>

        <BookingBlock />

        {/* (c) speaking form */}
        <Reveal className="mx-auto mt-20 max-w-2xl">
          <div className="mb-5 flex flex-wrap items-end gap-x-5 gap-y-1">
            <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Book me to speak
            </h3>
            <p className="rotate-1 pb-0.5 font-hand text-xl text-ink-soft">
              conferences, podcasts, church halls
            </p>
          </div>
          <p className="mb-6 leading-relaxed text-ink-soft">
            I talk about DeFi, building in public, and faith and work. Tell me
            about your event and we will find a shape for it.
          </p>
          <SpeakingForm />
        </Reveal>
      </Section>

      {/* (d) + (e) the close of the page */}
      <footer className="mt-24">
        <FooterBar />
        <WaxSeal />
      </footer>
    </>
  );
}
