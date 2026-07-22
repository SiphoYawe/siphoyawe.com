"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Route transition (blog ↔ home): a short settle on every navigation — a
 * soft fade and a few px of rise, never a hard cut. Reduced motion renders
 * the page instantly with no transition.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
