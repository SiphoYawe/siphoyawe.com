"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { SquiggleUnderline } from "@/components/ui/doodles";
import { springs } from "@/lib/motion";

const NAV_LINKS = [
  { href: "/#about", id: "about", label: "About" },
  { href: "/#work", id: "work", label: "Work" },
  { href: "/#reading", id: "reading", label: "Reading" },
  { href: "/#connect", id: "connect", label: "Connect" },
] as const;

/**
 * Floating pill nav (danielsun pattern): shield mark left, jump links centre,
 * "Book me" CTA right, theme + language toggles tucked in. The active link
 * wears a hand-drawn yellow-to-Azure underline that springs between links.
 */
export function PillNav() {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);

  // Scroll-spy: a section counts as active while it crosses the viewport's
  // middle band. Only meaningful on the homepage.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }
    const sections = NAV_LINKS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((current) => (current === entry.target.id ? null : current));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...springs.soft, delay: 0.15 }}
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-canvas-raised/90 py-1.5 pr-1.5 pl-2 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/30"
      >
        <Link
          href="/"
          aria-label="Sipho Yawe — home"
          className="mr-1 flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/crest-badge.svg" alt="" className="size-7" />
        </Link>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`relative hidden rounded-full px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent sm:block ${
              active === link.id ? "text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            {link.label}
            {active === link.id && (
              <motion.span
                layoutId="nav-squiggle"
                transition={springs.bouncy}
                className="absolute inset-x-2 -bottom-0.5"
              >
                <SquiggleUnderline gradient className="h-1.5 w-full" />
              </motion.span>
            )}
          </Link>
        ))}

        <Link
          href="/blog"
          className={`relative hidden rounded-full px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent sm:block ${
            pathname.startsWith("/blog") ? "text-ink" : "text-ink-soft hover:text-ink"
          }`}
        >
          Blog
          {pathname.startsWith("/blog") && (
            <motion.span
              layoutId="nav-squiggle"
              transition={springs.bouncy}
              className="absolute inset-x-2 -bottom-0.5"
            >
              <SquiggleUnderline gradient className="h-1.5 w-full" />
            </motion.span>
          )}
        </Link>

        <LanguageToggle />
        <ThemeToggle />

        <Link
          href="/#connect"
          className="ml-1 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white outline-none transition-all hover:bg-azure-deep focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.97] dark:text-sable"
        >
          Book me
        </Link>
      </nav>
    </motion.header>
  );
}
