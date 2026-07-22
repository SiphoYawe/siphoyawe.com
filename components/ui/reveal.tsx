"use client";

import { motion, useReducedMotion } from "framer-motion";
import { revealByName } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Direction of the entrance; keeps the scroll choreography varied. */
  variant?: keyof typeof revealByName;
};

/**
 * Quiet scroll reveal (brief section 4): short travel, low opacity delta,
 * once only. Disabled entirely under prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0, variant = "up" }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={revealByName[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
