"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { springs } from "@/lib/motion";

/**
 * Theme toggle with the danielsun sun-glyph morph: on hover the glyph's rays
 * spin, shorten, and a gold ring fades in — the quiet promise of a switch.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={{ scale: 0.9 }}
      transition={springs.snappy}
      className="grid size-9 cursor-pointer place-items-center rounded-full text-ink-soft outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="relative grid size-5 place-items-center">
        {/* gold ring morphs in on hover */}
        <motion.span
          aria-hidden
          variants={{ rest: { opacity: 0, scale: 0.5 }, hover: { opacity: 1, scale: 1 } }}
          transition={springs.bouncy}
          className="absolute inset-0 rounded-full border-2 border-or"
        />
        <motion.svg
          viewBox="0 0 24 24"
          className="size-4"
          variants={{ rest: { rotate: 0 }, hover: { rotate: 120 } }}
          transition={springs.soft}
          aria-hidden
        >
          {!mounted ? (
            <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.4" />
          ) : isDark ? (
            <path
              d="M20 14.5 A8.5 8.5 0 0 1 9.5 4 A8.5 8.5 0 1 0 20 14.5 Z"
              fill="currentColor"
            />
          ) : (
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
              <path d="M12 2.5 v2.4 M12 19.1 v2.4 M2.5 12 h2.4 M19.1 12 h2.4 M5 5 l1.7 1.7 M17.3 17.3 L19 19 M19 5 l-1.7 1.7 M6.7 17.3 L5 19" />
            </g>
          )}
        </motion.svg>
      </span>
    </motion.button>
  );
}
