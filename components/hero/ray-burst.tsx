"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

/**
 * Azure ray-burst fanning from the top-left corner (danielsun hero pattern,
 * recoloured to the arms: Azure primary, a whisper of Or on one edge). Beams
 * stay narrow with paper between them and
 * fade out before the wordmark. Micro-animation per brief: the rays drift a
 * few pixels on load and on pointer move. Very subtle, pointer-events none.
 */
export function RayBurst() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 50, damping: 20 });
  const y = useSpring(my, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(nx * 14); // a few pixels, never more
      my.set(ny * 9);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  return (
    <motion.div
      aria-hidden
      style={reduce ? undefined : { x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.1, ease: "easeOut" } }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMinYMin slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* azure beams from the top-left corner, paper gaps between */}
        <path d="M-180 -180 L1620 -40 L1620 130 Z" fill="#2B5DF2" className="opacity-45 dark:opacity-28" />
        <path d="M-180 -180 L1500 210 L1400 330 Z" fill="#2B5DF2" className="opacity-28 dark:opacity-16" />
        <path d="M-180 -180 L1080 480 L900 560 Z" fill="#3E6BF5" className="opacity-16 dark:opacity-10" />
        <path d="M-180 -180 L560 640 L420 690 Z" fill="#6E93F7" className="opacity-12 dark:opacity-7" />
        {/* a thin gold edge on the top beam, the crest metal, no more than a whisper */}
        <path d="M-180 -180 L1620 -40 L1600 30 L-180 -140 Z" fill="#FCDD09" className="opacity-30 dark:opacity-20" />
      </svg>
      {/* blend the fan into the canvas */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-canvas via-canvas/70 to-transparent" />
    </motion.div>
  );
}
