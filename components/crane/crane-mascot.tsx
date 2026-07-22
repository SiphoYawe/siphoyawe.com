"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { aiAsset } from "@/lib/ai-assets";

/**
 * The crowned crane — Uganda's national bird and the site's playful mascot
 * (brief section 3). Peeks from the bottom-right edge and tilts its head
 * toward the cursor. Lazy-mounted after first paint; reduced motion parks
 * it still. Illustration is a placeholder until Sipho commissions the real
 * crane.
 */
export function CraneMascot() {
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
    if (reduce || !mounted) return;
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
  }, [mounted, reduce, target]);

  if (!mounted) return null;

  // AI mascot final (AI-ASSET-PROMPTS.md section B) replaces the placeholder
  // illustration when it lands; the same peek + head-tilt behaviour stays.
  const aiSrc = aiAsset("mascot/crane-peek-bottom") ?? aiAsset("mascot/crane-peek-side");

  return (
    <motion.div
      ref={ref}
      aria-hidden
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="pointer-events-none fixed -right-2 bottom-0 z-40 w-16 translate-x-[15%] translate-y-[38%] sm:w-32 sm:translate-y-0"
    >
      {aiSrc ? (
        <motion.img
          src={aiSrc}
          alt=""
          style={reduce ? undefined : { rotate: tilt }}
          className="origin-[50%_80%] w-full"
        />
      ) : (
      <motion.svg
        viewBox="0 0 96 120"
        style={reduce ? undefined : { rotate: tilt }}
        className="origin-[50%_80%]"
      >
        {/* neck */}
        <path d="M42 120 C 40 96, 40 74, 46 56 L62 56 C 58 76, 58 98, 64 120 Z" fill="#4a4a52" />
        {/* head */}
        <g>
          <ellipse cx="54" cy="44" rx="19" ry="16" fill="#55555e" />
          {/* white cheek */}
          <ellipse cx="45" cy="44" rx="10" ry="10.5" fill="#F7F5F0" />
          {/* red patch */}
          <ellipse cx="43" cy="37" rx="4.6" ry="3.6" fill="#D50000" />
          {/* beak */}
          <path d="M35 46 L16 51 L35 55 Z" fill="#848484" />
          {/* eye */}
          <circle cx="52" cy="40" r="3.2" fill="#141416" />
          <circle cx="53.2" cy="38.8" r="1.1" fill="#F7F5F0" />
          {/* gold crown bristles */}
          <g stroke="#FCDD09" strokeWidth="2.6" strokeLinecap="round">
            <path d="M54 29 L46 10" />
            <path d="M58 28 L57 7" />
            <path d="M62 29 L68 10" />
            <path d="M66 31 L78 16" />
            <path d="M50 30 L36 15" />
          </g>
          <circle cx="58" cy="29" r="4" fill="#FCDD09" />
        </g>
      </motion.svg>
      )}
    </motion.div>
  );
}
