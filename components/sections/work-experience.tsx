"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";
import { EXPERIENCE, type Experience } from "@/data/experience";
import { aiAsset } from "@/lib/ai-assets";

const PIN_COLORS: Record<Experience["pinColor"], { face: string; ink: string }> = {
  azure: { face: "#2B5DF2", ink: "#F7F5F0" },
  or: { face: "#FCDD09", ink: "#141416" },
  gules: { face: "#D50000", ink: "#F7F5F0" },
  mint: { face: "#34c77b", ink: "#141416" },
  sable: { face: "#141416", ink: "#FCDD09" },
};

/**
 * One enamel pin: metal rim, domed colour face, monogram, pin-post shadow.
 * Micro-interaction: wobbles on its post on hover (brief section 6.4).
 */
function EnamelPin({ job, index }: { job: Experience; index: number }) {
  const reduce = useReducedMotion();
  const { face, ink } = PIN_COLORS[job.pinColor];
  // Real enamel-pin art (content-drop/ai-assets/pins) replaces the CSS ball
  // when the slot is filled; the monogram ball stays as the fallback.
  const pinSrc = job.pinSlug ? aiAsset(job.pinSlug) : null;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...springs.soft, delay: index * 0.07 }}
      className="group relative flex w-36 shrink-0 flex-col items-center text-center sm:w-40"
    >
      <motion.div
        whileHover={reduce ? undefined : { rotate: [0, -9, 7, -3, 0] }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="relative grid size-20 cursor-default place-items-center sm:size-24"
        aria-hidden
      >
        {pinSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={pinSrc}
            alt=""
            loading="lazy"
            className="size-full object-contain drop-shadow-[0_6px_10px_rgb(0_0_0/0.35)] isolate [transform:translateZ(0)]"
          />
        ) : (
          <span
            className="relative grid size-16 place-items-center rounded-full sm:size-20"
            style={{
              background: `radial-gradient(circle at 32% 28%, #ffffffb8, transparent 42%), ${face}`,
              boxShadow:
                "0 0 0 4px #c9c9cf, 0 0 0 5.5px #8e8e96, 0 6px 14px rgb(0 0 0 / 0.35), inset 0 -6px 12px rgb(0 0 0 / 0.25)",
            }}
          >
            <span className="font-display text-lg font-bold tracking-wide sm:text-xl" style={{ color: ink }}>
              {job.monogram}
            </span>
            {/* pin post */}
            <span className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-steel shadow" />
          </span>
        )}
      </motion.div>

      <div className="mt-4">
        <p className="font-display text-sm leading-tight font-semibold sm:text-base">{job.company}</p>
        <p className="mt-0.5 text-xs text-ink-soft sm:text-sm">{job.role}</p>
        <p className="mt-1 font-sans font-semibold text-[10px] tracking-[0.2em] text-accent uppercase">
          {job.start} to {job.end}
        </p>
        {job.note && (
          <p className="mt-2 -rotate-2 font-hand text-base leading-tight text-ink-soft">{job.note}</p>
        )}
      </div>
    </motion.li>
  );
}

/**
 * Work Experience (brief section 6.4): company pins pinned above a
 * hand-drawn timeline arrow, 2023 to now, with handwritten annotation.
 */
export function WorkExperience() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={springs.soft}
          className="mb-10 sm:mb-14"
        >
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              The pin board of jobs
            </h2>
            <p className="-rotate-2 pb-1 font-hand text-xl text-ink-soft sm:text-2xl">
              from kampala, with love
            </p>
          </div>
        </motion.div>

        <div className="relative">
          {/* hand-drawn timeline arrow, draws in on scroll */}
          <svg
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute -top-2 left-0 hidden h-10 w-full text-ink-soft md:block"
          >
            <motion.path
              d="M4 34 C 140 20, 260 44, 400 32 S 660 20, 800 34 S 940 40, 966 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.path
              d="M948 18 L 972 29 L 950 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: 1.5, ease: "easeOut" }}
            />
          </svg>

          <ol className="flex flex-wrap justify-center gap-x-6 gap-y-10 pt-14 pb-4 md:flex-nowrap md:justify-between md:gap-6 md:pt-16">
            {EXPERIENCE.map((job, i) => (
              <EnamelPin key={job.id} job={job} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
