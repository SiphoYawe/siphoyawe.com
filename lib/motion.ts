import type { Transition, Variants } from "framer-motion";

/**
 * Motion presets (brief section 4): springs, not linear transitions.
 * Two loud moments only (Connect button, hero stickers); everything else
 * stays quiet. Reveal travel is short, opacity delta low.
 */

export const springs = {
  /** Soft settle — cards, chips, reveals. */
  soft: { type: "spring", stiffness: 260, damping: 26, mass: 1 },
  /** Bouncy pop — stickers, pins, magnets. */
  bouncy: { type: "spring", stiffness: 420, damping: 17, mass: 0.9 },
  /** Snappy nudge — buttons, badges, dock icons. */
  snappy: { type: "spring", stiffness: 500, damping: 30, mass: 0.7 },
} satisfies Record<string, Transition>;

/** Quiet scroll reveal: short travel, low opacity delta. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...springs.soft },
  },
};

/** Directional reveals, so the scroll choreography can vary per section. */
export const revealLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { ...springs.soft } },
};
export const revealRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { ...springs.soft } },
};
export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { ...springs.soft } },
};
/** Clip-wipe from the top, for photos and framed artifacts. */
export const revealWipe: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 0 88% 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
  },
};

export const revealByName = {
  up: revealVariants,
  left: revealLeft,
  right: revealRight,
  scale: revealScale,
  wipe: revealWipe,
} as const;

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/** Item for staggerContainer groups: a small rise-and-settle. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { ...springs.soft } },
};

/** Item for stagger groups that should pop (pins, stickers, chips). */
export const staggerPop: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { ...springs.bouncy } },
};
