"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type MagneticProps = {
  children: React.ReactNode;
  /** Pull strength: fraction of the cursor offset applied to the element. */
  strength?: number;
  /** Max travel in px, so the pull never tears the layout. */
  max?: number;
  className?: string;
};

/**
 * Magnetic pull toward the cursor (danielsun CTA forensics): the wrapped
 * element eases a few px toward the pointer while inside its halo, and
 * springs back to rest on leave. Motion values only, no re-renders; dropped
 * entirely under prefers-reduced-motion.
 */
export function Magnetic({
  children,
  strength = 0.25,
  max = 10,
  className = "",
}: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 15, mass: 0.4 });
  const y = useSpring(my, { stiffness: 180, damping: 15, mass: 0.4 });

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    mx.set(Math.max(-max, Math.min(max, dx * strength)));
    my.set(Math.max(-max, Math.min(max, dy * strength)));
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
