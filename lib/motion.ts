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

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
