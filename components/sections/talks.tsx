"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { springs } from "@/lib/motion";
import { aiAsset } from "@/lib/ai-assets";
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
  // AI lanyard + badge (AI-ASSET-PROMPTS.md C11) replaces the CSS artifact
  // when it lands; the SPEAKER strip and the text overlay stay in code.
  const aiSrc = aiAsset("artifacts/lanyard");

  return (
    <TalkShell talk={talk} className="w-60">
      <motion.div
        whileHover={reduce ? undefined : { rotate: 2 }}
        transition={springs.soft}
        style={{ transformOrigin: "top center" }}
        className="flex flex-col items-center"
      >
        {aiSrc ? (
          <div className="flex w-full flex-col items-center">
            {/* the strap + clip (cleaned asset), hanging from the top */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={aiSrc} alt="" loading="lazy" className="w-16 object-contain drop-shadow-sm sm:w-20" />
            {/* the badge card, hooked onto the clip */}
            <div className="relative -mt-7 w-44 overflow-hidden rounded-xl border border-line bg-canvas-raised shadow-(--shadow-polaroid)">
              {/* the slot the clip hooks through */}
              <span aria-hidden className="mx-auto mt-2.5 block h-1.5 w-9 rounded-full bg-sable/25" />
              <div className="mt-2 px-4 py-1.5 text-center" style={{ background: strip }}>
                <p className="font-sans text-[10px] font-bold tracking-[0.35em] text-[#F7F5F0]">SPEAKER</p>
              </div>
              <div className="px-4 py-4 text-center">
                <p className="line-clamp-2 font-display text-sm leading-snug font-semibold text-ink">{talk.title}</p>
                <p className="mt-1 line-clamp-1 text-xs text-ink-soft">{talk.venue}</p>
                <p className="mt-1.5 font-sans text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
                  {talk.date}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
        {/* the strap, an inverted V */}
        <svg viewBox="0 0 200 56" aria-hidden className="h-12 w-44 text-azure">
          <path d="M22 2 L100 50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
          <path d="M178 2 L100 50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        </svg>

        {/* the hanging badge */}
        <div className="-mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-canvas-raised shadow-(--shadow-polaroid)">
          <div className="px-4 pt-2 pb-1.5 text-center" style={{ background: strip }}>
            <span aria-hidden className="mx-auto mb-1.5 block h-1 w-8 rounded-full bg-sable/25" />
            <p className="font-sans font-semibold text-[10px] tracking-[0.35em] text-[#F7F5F0]">SPEAKER</p>
          </div>
          <div className="p-4 text-center">
            <p className="font-display text-base leading-snug font-semibold">{talk.title}</p>
            <p className="mt-1.5 text-sm text-ink-soft">{talk.venue}</p>
            <p className="mt-1 font-sans font-semibold text-[10px] tracking-[0.25em] text-accent uppercase">
              {talk.date}
            </p>
            {talk.note && <p className="mt-1.5 text-xs text-ink-soft">{talk.note}</p>}
          </div>
        </div>
          </>
        )}
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
  // AI ticket stub (AI-ASSET-PROMPTS.md C12) replaces the torn-edge CSS
  // ticket when it lands; the SY nub and the text overlay stay in code.
  const aiSrc = aiAsset("artifacts/ticket-stub");

  return (
    <TalkShell talk={talk} className="w-full">
      <div
        className="drop-shadow-sm dark:drop-shadow-md"
        style={{ transform: `rotate(${STUB_TILTS[index % STUB_TILTS.length]}deg)` }}
      >
        {aiSrc ? (
          <motion.div
            whileHover={reduce ? undefined : { x: 6 }}
            transition={springs.soft}
            className="relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={aiSrc} alt="" loading="lazy" className="w-full" />
            {/* text kept inside the ticket's cream safe area: the ornamental
                border and torn stub start near 78% width, so cap the right. */}
            <div className="absolute inset-y-[15%] left-[9%] right-[27%] flex flex-col justify-center">
              <p className="line-clamp-2 font-display text-sm leading-snug font-semibold text-[#141416] sm:text-base">
                {talk.title}
              </p>
              <p className="mt-1 line-clamp-1 text-xs text-[#55534e] sm:text-sm">{talk.venue}</p>
              <p className="mt-1.5 font-sans text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
                {talk.date}
              </p>
            </div>
          </motion.div>
        ) : (
        <motion.div
          whileHover={reduce ? undefined : { x: 6 }}
          transition={springs.soft}
          className="flex border border-line bg-canvas-raised"
          style={{ clipPath: TORN_EDGE }}
        >
          {/* the torn-off nub, kept for luck */}
          <div className="grid w-12 shrink-0 place-items-center border-r-2 border-dashed border-line">
            <span aria-hidden className="-rotate-90 font-sans font-semibold text-[10px] tracking-[0.3em] text-ink-soft">
              SY
            </span>
          </div>
          <div className="min-w-0 p-4 sm:p-5">
            <p className="font-display text-base leading-snug font-semibold">{talk.title}</p>
            <p className="mt-1 text-sm text-ink-soft">{talk.venue}</p>
            <p className="mt-1.5 font-sans font-semibold text-[10px] tracking-[0.25em] text-accent uppercase">
              {talk.date}
            </p>
            {talk.note && <p className="mt-1.5 text-xs text-ink-soft">{talk.note}</p>}
          </div>
        </motion.div>
        )}
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
    <Section id="talks" title="Talks & media" aside="stages & hackathons so far">
      <Reveal className="mb-12">
        <figure className="mx-auto max-w-xl">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-line bg-canvas-raised shadow-(--shadow-polaroid)">
            <Image
              src="/images/sipho-talk-2400.webp"
              alt="Sipho Yawe mid-talk, gesturing to the room"
              fill
              sizes="(max-width: 640px) 90vw, 36rem"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-center font-hand text-lg text-ink-soft">
            mid-flow, doing the thing I love
          </figcaption>
        </figure>
      </Reveal>

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
          the hackathon stubs I kept
        </Handwritten>
      </Reveal>
    </Section>
  );
}
