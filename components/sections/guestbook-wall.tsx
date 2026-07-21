"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { springs } from "@/lib/motion";
import { getGuestbook, signGuestbook } from "@/lib/api";
import { Turnstile } from "@/components/forms/turnstile";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import type { GuestbookEntry } from "@/lib/types";

/** Pastel paper, cycled yellow / pink / blue. Fixed hexes: the notes are
 * paper artifacts, so they stay pastel in both themes. */
const NOTE_COLORS = ["#FFF3BF", "#FFE0EC", "#D9E8FF"] as const;

/** Deterministic tilt from the entry id, so the wall looks hand-stuck and
 * stable between renders. Roughly -3.5 to +3.5 degrees. */
function hashRotation(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(h) % 700) / 100 - 3.5;
}

/**
 * One sticky note: pastel square, name in big handwriting, message below,
 * and a curled bottom-right corner showing the wall behind.
 * Micro-interaction: a fresh note settles in from scale 1.15 (springs.bouncy).
 */
function StickyNote({
  entry,
  index,
  fresh,
}: {
  entry: GuestbookEntry;
  index: number;
  fresh: boolean;
}) {
  const reduce = useReducedMotion();
  const rotate = hashRotation(entry.id);

  return (
    <motion.figure
      initial={fresh && !reduce ? { scale: 1.15, opacity: 0, rotate: rotate * 2 } : false}
      animate={{ scale: 1, opacity: 1, rotate }}
      transition={springs.bouncy}
      className="relative min-h-40 p-5 pb-8 shadow-[0_10px_20px_rgb(0_0_0/0.16)]"
      style={{ background: NOTE_COLORS[index % NOTE_COLORS.length], color: "#141416" }}
    >
      <figcaption className="font-hand text-2xl leading-tight font-semibold break-words">
        {entry.name}
      </figcaption>
      <blockquote className="mt-2 text-sm leading-relaxed break-words whitespace-pre-wrap">
        {entry.message}
      </blockquote>
      {/* curled corner: folded triangle revealing the canvas underneath */}
      <span
        aria-hidden
        className="absolute right-0 bottom-0 size-7 rounded-tl-md"
        style={{
          background:
            "linear-gradient(315deg, var(--canvas) 47%, rgb(0 0 0 / 0.16) 50%, rgb(0 0 0 / 0.05) 72%, transparent 100%)",
        }}
      />
    </motion.figure>
  );
}

type FormErrors = { name?: string; message?: string };

/**
 * The wall plus the sign form. New notes stick on immediately after a
 * successful POST (optimistic against the stub, confirmed by the response).
 */
export function GuestbookWall({ initialEntries }: { initialEntries: GuestbookEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [pendingNote, setPendingNote] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Swap the static seed for live entries once /api/guestbook exists
  // (getGuestbook falls back to the same mock while it doesn't).
  useEffect(() => {
    let cancelled = false;
    void getGuestbook().then((live) => {
      if (!cancelled && live.length > 0) setEntries(live);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "give me a name to stick up";
    else if (name.trim().length > 40) next.name = "keep it under 40 characters";
    if (!message.trim()) next.message = "write a little something first";
    else if (message.trim().length > 240) next.message = "240 characters is the whole note, trim a bit";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting" || !validate()) return;

    // Honeypot: bots get a quiet fake success, no note, no request.
    if (website) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      const res = await signGuestbook({
        name: name.trim(),
        message: message.trim(),
        website,
        turnstileToken: turnstileToken ?? undefined,
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      // Entries are pre-moderated: the note queues for approval instead of
      // sticking straight onto the public wall.
      setPendingNote(res.pending !== false);
      setName("");
      setMessage("");
      setErrors({});
      setStatus("success");
      trackEvent(AnalyticsEvents.GuestbookSign);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      {/* The wall */}
      <Reveal>
        {entries.length === 0 ? (
          <p className="py-6 text-center font-hand text-2xl text-ink-soft">
            the wall is bare, be the first to stick one up
          </p>
        ) : (
          <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, i) => (
              <li key={entry.id}>
                <StickyNote entry={entry} index={i} fresh={false} />
              </li>
            ))}
          </ul>
        )}
      </Reveal>

      {/* Sign form */}
      <Reveal className="mx-auto mt-14 max-w-xl">
        <form
          onSubmit={onSubmit}
          noValidate
          className="grid gap-5 rounded-2xl border border-line bg-canvas-raised p-6 sm:p-8"
        >
          <p className="-rotate-1 font-hand text-2xl text-ink-soft">your turn, stick one up</p>

          <div>
            <label htmlFor="gb-name" className="mb-1.5 block text-sm font-medium">
              Name
            </label>
            <input
              id="gb-name"
              name="name"
              type="text"
              required
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="who's saying hi"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "gb-name-error" : undefined}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none placeholder:text-ink-soft/60 focus-visible:ring-2 focus-visible:ring-accent"
            />
            {errors.name && (
              <p id="gb-name-error" role="alert" className="mt-1.5 text-sm text-gules">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="gb-message" className="mb-1.5 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="gb-message"
              name="message"
              required
              maxLength={240}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="something nice, something funny, a verse, whatever fits"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "gb-message-error" : "gb-message-count"}
              className="w-full resize-y rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none placeholder:text-ink-soft/60 focus-visible:ring-2 focus-visible:ring-accent"
            />
            {errors.message ? (
              <p id="gb-message-error" role="alert" className="mt-1.5 text-sm text-gules">
                {errors.message}
              </p>
            ) : (
              <p id="gb-message-count" className="mt-1.5 text-xs text-ink-soft">
                {240 - message.length} characters left
              </p>
            )}
          </div>

          {/* Honeypot: humans never see or tab into this field */}
          <div aria-hidden="true" className="absolute -left-[100vw] size-0 overflow-hidden">
            <label htmlFor="gb-website">leave this field empty</label>
            <input
              id="gb-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <Turnstile onToken={setTurnstileToken} />

          <motion.button
            type="submit"
            disabled={status === "submitting"}
            whileTap={status === "submitting" ? undefined : { scale: 0.97 }}
            transition={springs.snappy}
            className="inline-flex cursor-pointer items-center justify-center justify-self-start rounded-full bg-sable px-6 py-2.5 text-sm font-semibold text-paper shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 dark:bg-paper dark:text-sable"
          >
            {status === "submitting" ? "Sticking it up..." : "Stick it on the wall"}
          </motion.button>

          <p aria-live="polite" className="min-h-5 text-sm">
            {status === "success" && (
              <span className="text-ink-soft">
                {pendingNote
                  ? "your note is in the queue, it sticks once approved. thanks =)"
                  : "stuck to the wall. thanks for saying hi =)"}
              </span>
            )}
            {status === "error" && (
              <span role="alert" className="text-gules">
                hmm, that did not stick. try again in a moment?
              </span>
            )}
          </p>
        </form>
      </Reveal>
    </div>
  );
}
