"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { subscribeNewsletter } from "@/lib/api";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { springs } from "@/lib/motion";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Newsletter email gate on a gated blog post. Subscribing stores the email
 * (Neon) and reveals the download; the unlock is remembered in localStorage so
 * a returning reader gets the file straight away. Honeypot + reduced-motion safe.
 */
export function EmailGate({ pdf, note }: { pdf: string; note?: string }) {
  const reduce = useReducedMotion();
  const storeKey = `nl:${pdf}`;
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-time localStorage read; doing it here (not in the initializer) avoids a hydration mismatch
      if (localStorage.getItem(storeKey) === "1") setUnlocked(true);
    } catch {
      /* private mode: gate stays up, still works */
    }
  }, [storeKey]);

  function unlock() {
    try {
      localStorage.setItem(storeKey, "1");
    } catch {
      /* ignore */
    }
    setUnlocked(true);
    setStatus("idle");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setErrorMsg("That email does not look right. Try again?");
      return;
    }
    // Honeypot: bots get a quiet unlock, no request leaves the page.
    if (website) {
      unlock();
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await subscribeNewsletter({ email: trimmed, source: pdf, website });
      if (!res.ok) {
        setStatus("error");
        setErrorMsg("That did not go through. Try again in a moment?");
        return;
      }
      trackEvent(AnalyticsEvents.NewsletterSubscribe);
      unlock();
    } catch {
      setStatus("error");
      setErrorMsg("That did not go through. Try again in a moment?");
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-line bg-canvas-raised p-6 text-center shadow-(--shadow-polaroid) sm:p-8">
      {unlocked ? (
        <>
          <p className="font-display text-2xl font-semibold tracking-tight">
            The paper is yours.
          </p>
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent(AnalyticsEvents.OutboundLink, { destination: pdf })
            }
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-sable px-6 py-2.5 text-sm font-semibold text-paper shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:bg-paper dark:text-sable"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className="size-4">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Open the PDF
          </a>
          <p className="mt-2 text-xs text-ink-soft">opens in a new tab</p>
        </>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mx-auto max-w-md">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Read the full paper
          </p>
          {note && (
            <p className="mt-2 leading-relaxed text-ink-soft">{note}</p>
          )}
          <div className="mt-5 flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@somewhere.com"
              aria-label="Your email"
              aria-invalid={Boolean(errorMsg)}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none placeholder:text-ink-soft/60 focus-visible:ring-2 focus-visible:ring-accent"
            />
            <motion.button
              type="submit"
              disabled={status === "submitting"}
              whileTap={reduce || status === "submitting" ? undefined : { scale: 0.98 }}
              transition={springs.snappy}
              className="w-full cursor-pointer rounded-full bg-sable px-6 py-3 text-sm font-semibold text-paper shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 dark:bg-paper dark:text-sable"
            >
              {status === "submitting" ? "Subscribing..." : "Subscribe and read"}
            </motion.button>
          </div>

          {/* Honeypot: humans never see or tab into this field */}
          <div aria-hidden="true" className="absolute -left-[100vw] size-0 overflow-hidden">
            <label htmlFor="nl-website">leave this field empty</label>
            <input
              id="nl-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <p aria-live="polite" className="mt-3 min-h-5 text-sm text-gules">
            {errorMsg}
          </p>
          <p className="text-xs text-ink-soft">
            No spam. The occasional note, and this paper the moment you subscribe.
          </p>
        </form>
      )}
    </div>
  );
}
