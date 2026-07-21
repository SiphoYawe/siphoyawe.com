import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/#reading", label: "Reading" },
  { href: "/#connect", label: "Connect" },
] as const;

/**
 * Floating pill nav (danielsun pattern): shield mark left, jump links centre,
 * "Book me" CTA right, theme + language toggles tucked in. Phase 0 ships the
 * shell; Phase 2 adds the hand-drawn active underline and hover craft.
 */
export function PillNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-canvas-raised/90 py-1.5 pr-1.5 pl-2 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/30"
      >
        <Link
          href="/"
          aria-label="Sipho Yawe — home"
          className="mr-1 flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-accent"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/crest-badge.svg" alt="" className="size-7" />
        </Link>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-accent sm:block"
          >
            {link.label}
          </Link>
        ))}

        <LanguageToggle />
        <ThemeToggle />

        <Link
          href="/#connect"
          className="ml-1 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-azure-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-sable"
        >
          Book me
        </Link>
      </nav>
    </header>
  );
}
