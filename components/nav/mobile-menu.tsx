"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/use-mounted";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { springs } from "@/lib/motion";
import { NAV_LINKS } from "./pill-nav";

/**
 * Compact mobile menu (shown below `sm`, where the pill hides its jump links).
 * A small pill button opens a paper dropdown with the same jump links, Blog,
 * and the language + theme controls. Spring motion, reduced-motion safe, closes
 * on link tap, outside click, or Escape.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="grid size-9 cursor-pointer place-items-center rounded-full text-ink-soft outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden className="size-5">
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.12 } }}
            transition={springs.snappy}
            className="absolute right-0 top-12 w-52 origin-top-right overflow-hidden rounded-2xl border border-line bg-canvas-raised/95 p-2 shadow-xl shadow-black/10 backdrop-blur-md dark:shadow-black/40"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-ink-soft outline-none transition-colors hover:bg-accent/10 hover:text-ink focus-visible:bg-accent/10 focus-visible:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/blog"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-accent/10 hover:text-ink focus-visible:bg-accent/10 focus-visible:text-ink ${
                pathname.startsWith("/blog") ? "text-ink" : "text-ink-soft"
              }`}
            >
              Blog
            </Link>

            <div className="my-1 h-px bg-line" />

            <div className="flex items-center justify-end px-1 py-1">
              <MenuTheme />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Theme toggle styled for the menu row (label + glyph). */
function MenuTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => {
        const next = isDark ? "light" : "dark";
        setTheme(next);
        trackEvent(AnalyticsEvents.ThemeToggle, { theme: next });
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-8 cursor-pointer place-items-center rounded-full text-ink-soft outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        {!mounted ? (
          <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.4" />
        ) : isDark ? (
          <path d="M20 14.5 A8.5 8.5 0 0 1 9.5 4 A8.5 8.5 0 1 0 20 14.5 Z" fill="currentColor" />
        ) : (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
            <path d="M12 2.5 v2.4 M12 19.1 v2.4 M2.5 12 h2.4 M19.1 12 h2.4 M5 5 l1.7 1.7 M17.3 17.3 L19 19 M19 5 l-1.7 1.7 M6.7 17.3 L5 19" />
          </g>
        )}
      </svg>
    </button>
  );
}
