"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Theme toggle. Phase 2 gives this the danielsun sun-glyph morph treatment;
 * for now it is an honest, accessible switch.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-9 cursor-pointer place-items-center rounded-full text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
    >
      {/* Avoids hydration mismatch: render a stable glyph until mounted */}
      <span aria-hidden className="text-base leading-none">
        {mounted ? (isDark ? "☾" : "☀") : "◐"}
      </span>
    </button>
  );
}
