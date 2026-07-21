"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";

type TiltedCardProps = {
  children: React.ReactNode;
  /** Resting rotation, like paper dropped on a desk. */
  rotate?: number;
  /** Colour-coded top strip (Olivia pattern). */
  topColor?: "azure" | "or" | "gules" | "mint";
  className?: string;
};

const TOP_COLORS = {
  azure: "bg-azure",
  or: "bg-or",
  gules: "bg-gules",
  mint: "bg-[#34c77b]",
} as const;

/**
 * Tilted paper card (Olivia): rests rotated; squares up slightly and deepens
 * its shadow on hover. Used for projects, testimonials, quote cards.
 */
export function TiltedCard({
  children,
  rotate = -2,
  topColor,
  className = "",
}: TiltedCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, rotate: rotate * 1.6 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={reduce ? undefined : { rotate: rotate / 4, y: -6 }}
      transition={springs.soft}
      className={`relative overflow-hidden rounded-2xl border border-line bg-canvas-raised shadow-(--shadow-polaroid) hover:shadow-(--shadow-lift) ${className}`}
    >
      {topColor && <div aria-hidden className={`h-2 w-full ${TOP_COLORS[topColor]}`} />}
      {children}
    </motion.div>
  );
}
