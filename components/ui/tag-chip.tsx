"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";

export type ChipColor = "blue" | "pink" | "orange" | "purple" | "mint";

const CHIP_STYLES: Record<ChipColor, string> = {
  blue: "bg-chip-blue text-azure-deep dark:bg-chip-blue/15 dark:text-azure-bright",
  pink: "bg-chip-pink text-[#a4134f] dark:bg-chip-pink/15 dark:text-[#ff9cc2]",
  orange: "bg-chip-orange text-[#8a4d00] dark:bg-chip-orange/15 dark:text-[#ffc069]",
  purple: "bg-chip-purple text-[#5b21b6] dark:bg-chip-purple/15 dark:text-[#c4a8f5]",
  mint: "bg-chip-mint text-[#0f6b3a] dark:bg-chip-mint/15 dark:text-[#7de3a8]",
};

type TagChipProps = {
  label: string;
  color?: ChipColor;
  /** Hand-scattered rotation. */
  rotate?: number;
  className?: string;
};

/**
 * 3D pastel tag chip (Portfolix): dot marker, soft inner highlight, drop
 * shadow. Micro-interaction: straightens and lifts a touch on hover.
 */
export function TagChip({ label, color = "blue", rotate = 0, className = "" }: TagChipProps) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      initial={reduce ? false : { opacity: 0, scale: 0.8, rotate: rotate * 2 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={reduce ? undefined : { rotate: 0, y: -3, scale: 1.04 }}
      transition={springs.bouncy}
      className={`inline-flex cursor-default items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_2px_6px_rgb(0_0_0/0.12)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_2px_6px_rgb(0_0_0/0.4)] ${CHIP_STYLES[color]} ${className}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" />
      {label}
    </motion.span>
  );
}
