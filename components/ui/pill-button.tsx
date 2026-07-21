"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

type PillButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  /** Arrow badge colour — Gules spark or Or jewel. */
  badge?: "gules" | "or";
  external?: boolean;
  className?: string;
};

/**
 * Black pill with a circular arrow badge (Portfolix "Let's talk ↗").
 * Micro-interaction: pill lifts, badge nudges up-right (spring).
 */
export function PillButton({
  label,
  href,
  onClick,
  badge = "gules",
  external = false,
  className = "",
}: PillButtonProps) {
  const reduce = useReducedMotion();
  const badgeBg = badge === "gules" ? "bg-gules" : "bg-or";

  const inner = (
    <>
      <span className="pr-1">{label}</span>
      <motion.span
        variants={{ rest: { x: 0, y: 0 }, hover: reduce ? {} : { x: 3, y: -3 } }}
        transition={springs.snappy}
        className={`grid size-7 shrink-0 place-items-center rounded-full text-white ${badgeBg} ${
          badge === "or" ? "text-sable" : ""
        }`}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
          <path
            d="M3 13 L13 3 M6 3 h7 v7"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    </>
  );

  const shared = `group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-sable py-2 pr-2 pl-5 text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-xl dark:bg-paper dark:text-sable ${className}`;

  const motionProps = {
    initial: "rest" as const,
    animate: "rest" as const,
    whileHover: "hover" as const,
    whileTap: reduce ? undefined : { scale: 0.97 },
    transition: springs.snappy,
  };

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        onClick={() => {
          if (external) {
            trackEvent(AnalyticsEvents.OutboundLink, { destination: href });
          }
          onClick?.();
        }}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={shared}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button {...motionProps} type="button" onClick={onClick} className={shared}>
      {inner}
    </motion.button>
  );
}
