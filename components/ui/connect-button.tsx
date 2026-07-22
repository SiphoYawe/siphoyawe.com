"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";
import { BurstStrokes } from "./doodles";

type ConnectButtonProps = {
  label?: string;
  caption?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * The marquee neon-glow Connect button (danielsun hover forensics, rebuilt).
 * On hover the dark 3D pill "switches on": an Azure neon glow (a faint gold
 * rim whispers the crest) floods the surround, the label lights azure, doodle
 * burst strokes fade in at the
 * corners (staggered, rotated), and a shine sweeps across. One of only two
 * loud moments on the site.
 */
export function ConnectButton({
  label = "Connect",
  caption = "press it, it lights up my day =)",
  onClick,
  className = "",
}: ConnectButtonProps) {
  const reduce = useReducedMotion();

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {caption && (
        <p className="-rotate-2 font-hand text-xl text-ink-soft sm:text-2xl">
          {caption}
        </p>
      )}

      <motion.button
        type="button"
        onClick={onClick}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={springs.snappy}
        aria-label={`${label} — jump to contact options`}
        className="group relative cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
      >
        {/* Neon glow — floods the surround when the switch flips. Painted
            first (DOM order) so it sits behind the pill without a negative
            z-index that ancestor backgrounds would swallow. */}
        <motion.div
          aria-hidden
          variants={{
            rest: { opacity: 0, scale: 0.85 },
            hover: { opacity: 1, scale: 1 },
          }}
          transition={springs.soft}
          className="pointer-events-none absolute -inset-x-32 -inset-y-24 blur-md"
          style={{
            background:
              "radial-gradient(closest-side, transparent 20%, rgb(43 93 242 / 0.9) 36%, rgb(43 93 242 / 0.5) 52%, rgb(92 130 255 / 0.3) 64%, rgb(252 221 9 / 0.22) 72%, transparent 80%)",
          }}
        />

        {/* Doodle burst strokes — staggered fade + rotate at the corners */}
        {[
          "top-[-3.5rem] left-[-4rem] -rotate-6",
          "bottom-[-4rem] right-[-4rem] rotate-[170deg]",
        ].map((position, i) => (
          <motion.span
            key={position}
            aria-hidden
            variants={{
              rest: { opacity: 0, scale: 0.6, rotate: -12 },
              hover: { opacity: 0.5, scale: 1, rotate: i === 0 ? -4 : 5 },
            }}
            transition={{ ...springs.bouncy, delay: 0.06 + i * 0.09 }}
            className={`pointer-events-none absolute size-20 text-ink sm:size-28 ${position}`}
          >
            <BurstStrokes className="size-full" />
          </motion.span>
        ))}

        {/* The dark 3D pill */}
        <span className="relative block overflow-hidden rounded-full bg-gradient-to-b from-[#33333a] via-[#101013] to-black px-14 py-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.18),inset_0_-3px_8px_rgb(0_0_0/0.8),0_18px_50px_-12px_rgb(0_0_0/0.55)] ring-1 ring-white/15 sm:px-20 sm:py-8">
          {/* Shine sweep */}
          {!reduce && (
            <motion.span
              aria-hidden
              variants={{
                rest: { x: "-220%", opacity: 0 },
                hover: { x: "220%", opacity: 0.6 },
              }}
              transition={{ duration: 0.85, ease: [0.35, 0, 0.2, 1], delay: 0.08 }}
              className="pointer-events-none absolute inset-y-[-40%] left-0 w-1/3 rotate-[18deg] bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          )}
          <span className="relative font-display text-4xl font-semibold tracking-tight text-paper transition-colors duration-200 group-hover:text-azure-bright group-focus-visible:text-azure-bright sm:text-6xl">
            {label}
          </span>
        </span>
      </motion.button>
    </div>
  );
}
