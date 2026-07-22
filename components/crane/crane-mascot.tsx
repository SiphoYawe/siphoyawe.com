"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { aiAsset } from "@/lib/ai-assets";

/**
 * The crowned crane — Uganda's national bird and the site's playful mascot
 * (brief section 3). It is genuinely alive: a continuous idle bob/sway, a
 * periodic peek-in-then-out at the screen edge, and a curious head-tilt toward
 * the cursor. Reduced motion parks every crane still. The inline `Crane` below
 * scatters the standing / pointing / sleeping / flying poses through the page.
 */

/* ---------------------------------------------------------------- corner peek */

/** One edge crane that hides off-screen, peeks in on an interval, lingers, then
 * slides back — all via transforms so it never grows the page's scroll width. */
function PeekCrane({
  slot,
  fallbackSlot,
  edge,
  phase,
  followCursor = false,
  fallback,
  className = "",
}: {
  slot: string;
  fallbackSlot?: string;
  /** Which edge it peeks in from. */
  edge: "bottom-right" | "bottom-left";
  /** Loop offset (seconds) so instances never move in sync. */
  phase: number;
  /** Only the primary crane tracks the cursor. */
  followCursor?: boolean;
  /** Inline SVG shown when no AI asset is present. */
  fallback?: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const target = useMotionValue(0);
  const tilt = useSpring(target, { stiffness: 120, damping: 14 });

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 1200); // lazy-mount
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduce || !mounted || !followCursor) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
      // clamp so the head only ever tilts curiously, never spins
      target.set(Math.max(-16, Math.min(16, angle + 90)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mounted, reduce, followCursor, target]);

  if (!mounted) return null;

  const aiSrc = aiAsset(slot) ?? (fallbackSlot ? aiAsset(fallbackSlot) : null);
  if (!aiSrc && !fallback) return null;

  const isBottom = edge === "bottom-right";
  // hidden -> peeked -> linger -> retreat -> hidden, then a gap (repeatDelay)
  const peekKeyframes = isBottom
    ? { y: reduce ? "10%" : ["66%", "66%", "8%", "8%", "66%"] }
    : { x: reduce ? "-8%" : ["-70%", "-70%", "-6%", "-6%", "-70%"] };
  const peekTransition = reduce
    ? undefined
    : {
        duration: 8,
        times: [0, 0.42, 0.52, 0.86, 1],
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatDelay: 3.5,
        delay: 1 + phase,
      };

  const cornerClass = isBottom
    ? "right-0 bottom-0 origin-[50%_80%]"
    : "left-0 bottom-8 origin-[50%_80%]";

  return (
    <motion.div
      ref={ref}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className={`pointer-events-none fixed z-40 select-none ${cornerClass} ${className}`}
    >
      {/* layer 1: the periodic peek in/out */}
      <motion.div animate={peekKeyframes} transition={peekTransition}>
        {/* layer 2: continuous idle bob + cursor-driven head tilt */}
        <motion.div
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: phase }
          }
          style={followCursor && !reduce ? { rotate: tilt } : undefined}
          className="origin-[50%_80%]"
        >
          {aiSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={aiSrc} alt="" className="w-full" />
          ) : (
            fallback
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Hand-drawn crane, the fallback for the primary corner mascot when the AI
 * asset is absent. */
function CraneSvg() {
  return (
    <svg viewBox="0 0 96 120" className="w-full">
      {/* neck */}
      <path d="M42 120 C 40 96, 40 74, 46 56 L62 56 C 58 76, 58 98, 64 120 Z" fill="#4a4a52" />
      {/* head */}
      <g>
        <ellipse cx="54" cy="44" rx="19" ry="16" fill="#55555e" />
        <ellipse cx="45" cy="44" rx="10" ry="10.5" fill="#F7F5F0" />
        <ellipse cx="43" cy="37" rx="4.6" ry="3.6" fill="#D50000" />
        <path d="M35 46 L16 51 L35 55 Z" fill="#848484" />
        <circle cx="52" cy="40" r="3.2" fill="#141416" />
        <circle cx="53.2" cy="38.8" r="1.1" fill="#F7F5F0" />
        <g stroke="#FCDD09" strokeWidth="2.6" strokeLinecap="round">
          <path d="M54 29 L46 10" />
          <path d="M58 28 L57 7" />
          <path d="M62 29 L68 10" />
          <path d="M66 31 L78 16" />
          <path d="M50 30 L36 15" />
        </g>
        <circle cx="58" cy="29" r="4" fill="#FCDD09" />
      </g>
    </svg>
  );
}

/**
 * The fixed edge cranes: a primary that peeks from the bottom-right and tracks
 * the cursor, plus a shy second one that peeks from the left on wide screens.
 * Distinct phases keep them out of sync.
 */
export function CraneMascot() {
  return (
    <>
      <PeekCrane
        slot="mascot/crane-peek-bottom"
        fallbackSlot="mascot/crane-peek-side"
        edge="bottom-right"
        phase={0}
        followCursor
        fallback={<CraneSvg />}
        className="w-16 sm:w-32"
      />
      <PeekCrane
        slot="mascot/crane-peek-side"
        edge="bottom-left"
        phase={2.3}
        className="hidden w-20 lg:block"
      />
    </>
  );
}

/* ------------------------------------------------------------- inline cranes */

type Pose = "standing" | "pointing" | "sleeping" | "flying";

/** Idle character per pose: bob height/speed, gentle sway, and how far/often it
 * throws a curious head-tilt. Sleeping just breathes; flying banks and drifts. */
const POSE: Record<
  Pose,
  { bob: number; dy: number; sway: number; tilt: number; tiltDur: number; dx?: number; driftDur?: number }
> = {
  standing: { bob: 4.0, dy: 5, sway: 1.6, tilt: 8, tiltDur: 6.5 },
  pointing: { bob: 3.4, dy: 4, sway: 1.2, tilt: 5, tiltDur: 5.5 },
  sleeping: { bob: 5.8, dy: 3, sway: 0.6, tilt: 0, tiltDur: 9 },
  flying: { bob: 2.6, dy: 9, sway: 3.2, tilt: 0, tiltDur: 5, dx: 8, driftDur: 6 },
};

/** A single decorative crane in a chosen pose that idles forever — bobbing,
 * swaying, and (when awake) throwing the odd curious tilt. Fades in once on
 * scroll, then loops. `phase` desyncs instances; `flip` mirrors it. Reduced
 * motion renders it perfectly still. Renders nothing if the asset is absent. */
export function Crane({
  pose,
  phase = 0,
  flip = false,
  className = "",
}: {
  pose: Pose;
  phase?: number;
  flip?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const src = aiAsset(`mascot/crane-${pose}`);
  if (!src) return null;

  const c = POSE[pose];
  const idle = reduce
    ? undefined
    : {
        y: [0, -c.dy, 0],
        rotate: [0, c.sway, 0, -c.sway, 0, c.tilt, 0],
        ...(c.dx ? { x: [0, c.dx, 0, -c.dx, 0] } : {}),
      };
  const idleTransition = reduce
    ? undefined
    : {
        y: { duration: c.bob, repeat: Infinity, ease: "easeInOut" as const, delay: phase },
        rotate: {
          duration: c.tiltDur,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: phase + 0.4,
          times: [0, 0.1, 0.2, 0.3, 0.42, 0.52, 1],
        },
        ...(c.dx
          ? { x: { duration: c.driftDur, repeat: Infinity, ease: "easeInOut" as const, delay: phase } }
          : {}),
      };

  return (
    // outer: one-shot fade/rise in on scroll
    <motion.span
      aria-hidden
      className={`pointer-events-none block select-none ${className}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* inner: the perpetual idle loop, mirrored via scaleX when flipped */}
      <motion.span
        className="block origin-[50%_85%]"
        style={{ scaleX: flip ? -1 : 1 }}
        animate={idle}
        transition={idleTransition}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" className="block w-full" />
      </motion.span>
    </motion.span>
  );
}
