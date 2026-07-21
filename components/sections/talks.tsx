"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { springs } from "@/lib/motion";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { TALKS, type Talk } from "@/data/talks";

/** SPEAKER strip cycles through the tinctures that take light text. */
const STRIP_COLORS = ["#2B5DF2", "#D50000"];

/** Hand-placed tilts so the stubs look fanned out of a pocket. */
const STUB_TILTS = [-1.6, 0.9, -0.7];

/** Zigzag torn edge down the left side of a ticket stub. */
const TORN_EDGE =
  "polygon(4% 0%, 100% 0%, 100% 100%, 4% 100%, 0.6% 96.5%, 4% 93%, 0.6% 89.5%, 4% 86%, 0.6% 82.5%, 4% 79%, 0.6% 75.5%, 4% 72%, 0.6% 68.5%, 4% 65%, 0.6% 61.5%, 4% 58%, 0.6% 54.5%, 4% 51%, 0.6% 47.5%, 4% 44%, 0.6% 40.5%, 4% 37%, 0.6% 33.5%, 4% 30%, 0.6% 26.5%, 4% 23%, 0.6% 19.5%, 4% 16%, 0.6% 12.5%, 4% 9%, 0.6% 5.5%, 4% 2%)";

/** Whole artifact links out when the talk has an href (tracked outbound click). */
function TalkShell({
  talk,
  className = "",
  children,
}: {
  talk: Talk;
  className?: string;
  children: React.ReactNode;
}) {
  const href = talk.href;
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${talk.title}, ${talk.venue} (opens in a new tab)`}
        onClick={() =>
          trackEvent(AnalyticsEvents.OutboundLink, { destination: href })
        }
        className={`block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${className}`}
      >
        {children}
      </a>
    );
  }
  return <div className={className}>{children}</div>;
}

/**
 * Conference lanyard: two strap lines meeting in a V above a hanging badge
 * (SPEAKER strip, title, venue, date). Micro-interaction: sways a little on
 * hover, pivoting from the top (brief 6.11).
 */
function Lanyard({ talk, index }: { talk: Talk; index: number }) {
  const reduce = useReducedMotion();
  const strip = STRIP_COLORS[index % STRIP_COLORS.length];

  return (
    <TalkShell talk={talk} className="w-60">
      <motion.div
        whileHover={reduce ? undefined : { rotate: 2 }}
        transition={springs.soft}
        style={{ transformOrigin: "top center" }}
        className="flex flex-col items-center"
      >
        {/* the strap, an inverted V */}
        <svg viewBox="0 0 200 56" aria-hidden className="h-12 w-44 text-azure">
          <path d="M22 2 L100 50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
          <path d="M178 2 L100 50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        </svg>

        {/* the hanging badge */}
        <div className="-mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-canvas-raised shadow-(--shadow-polaroid)">
          <div className="px-4 pt-2 pb-1.5 text-center" style={{ background: strip }}>
            <span aria-hidden className="mx-auto mb-1.5 block h-1 w-8 rounded-full bg-sable/25" />
            <p className="font-heraldic text-[10px] tracking-[0.35em] text-[#F7F5F0]">SPEAKER</p>
          </div>
          <div className="p-4 text-center">
            <p className="font-display text-base leading-snug font-semibold">{talk.title}</p>
            <p className="mt-1.5 text-sm text-ink-soft">{talk.venue}</p>
            <p className="mt-1 font-heraldic text-[10px] tracking-[0.25em] text-accent uppercase">
              {talk.date}
            </p>
          </div>
        </div>
      </motion.div>
    </TalkShell>
  );
}

/**
 * Torn ticket stub: zigzag clip-path edge, dashed perforation, title, venue,
 * date. Micro-interaction: slides a few px on hover (brief 6.11). The shadow
 * lives on a wrapper drop-shadow filter so it follows the torn silhouette
 * (clip-path would clip a box-shadow away).
 */
function Stub({ talk, index }: { talk: Talk; index: number }) {
  const reduce = useReducedMotion();

  return (
    <TalkShell talk={talk} className="w-full">
      <div
        className="drop-shadow-sm dark:drop-shadow-md"
        style={{ transform: `rotate(${STUB_TILTS[index % STUB_TILTS.length]}deg)` }}
      >
        <motion.div
          whileHover={reduce ? undefined : { x: 6 }}
          transition={springs.soft}
          className="flex border border-line bg-canvas-raised"
          style={{ clipPath: TORN_EDGE }}
        >
          {/* the torn-off nub, kept for luck */}
          <div className="grid w-12 shrink-0 place-items-center border-r-2 border-dashed border-line">
            <span aria-hidden className="-rotate-90 font-heraldic text-[10px] tracking-[0.3em] text-ink-soft">
              SY
            </span>
          </div>
          <div className="min-w-0 p-4 sm:p-5">
            <p className="font-display text-base leading-snug font-semibold">{talk.title}</p>
            <p className="mt-1 text-sm text-ink-soft">{talk.venue}</p>
            <p className="mt-1.5 font-heraldic text-[10px] tracking-[0.25em] text-accent uppercase">
              {talk.date}
            </p>
          </div>
        </motion.div>
      </div>
    </TalkShell>
  );
}

/**
 * Media and Talks (brief section 6.11): appearances as hanging conference
 * lanyards and torn ticket stubs, linked out where a link exists.
 */
export function Talks() {
  const lanyards = TALKS.filter((talk) => talk.kind === "lanyard");
  const stubs = TALKS.filter((talk) => talk.kind === "stub");

  return (
    <Section id="talks" kicker={<Kicker k="talks" />} title="Talks & media" aside="stages so far">
      <Reveal>
        <div className="flex flex-wrap items-start justify-center gap-10 sm:gap-14">
          {lanyards.map((talk, i) => (
            <Lanyard key={talk.id} talk={talk} index={i} />
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-12" delay={0.08}>
        <div className="grid items-start gap-6 sm:grid-cols-3">
          {stubs.map((talk, i) => (
            <Stub key={talk.id} talk={talk} index={i} />
          ))}
        </div>
        <Handwritten className="mt-7 text-center" rotate={-1}>
          the stubs I kept from pitching nights
        </Handwritten>
      </Reveal>
    </Section>
  );
}
