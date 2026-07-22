"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { springs } from "@/lib/motion";
import { aiAsset } from "@/lib/ai-assets";
import { MEDALS, type Medal } from "@/data/medals";

/** Hook centres along the walnut rack, as fractions of its width. */
const HOOKS = [0.1375, 0.371, 0.617, 0.862];

/** Idle sway per slot: amplitude and period staggered so they never sync. */
const SWAYS = [
  { amp: 2.4, dur: 2.9, delay: 0 },
  { amp: 1.9, dur: 3.4, delay: 0.45 },
  { amp: 2.7, dur: 3.1, delay: 0.9 },
  { amp: 1.4, dur: 3.8, delay: 1.3 },
];

/**
 * One medal on its hook: the gold disc on an azure ribbon, hanging from the
 * rack's brass hook (its straps tuck behind the rack image, so it reads
 * hooked). Pendulum idle sway from the hang point, straightens on hover.
 * The ghost slot renders the same medal desaturated with a dashed ring and a
 * question mark — the empty hook waiting for the next win.
 */
function HangingMedal({
  medal,
  index,
  ghost = false,
  medalSrc,
  reduce,
}: {
  medal?: Medal;
  index: number;
  ghost?: boolean;
  medalSrc: string | null;
  reduce: boolean;
}) {
  const hook = HOOKS[index % HOOKS.length];
  const sway = SWAYS[index % SWAYS.length];

  const drop: Variants = {
    hidden: { opacity: 0, y: -22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...springs.bouncy, delay: 0.3 + index * 0.14 },
    },
  };

  return (
    <motion.div
      variants={drop}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-60px" }}
      className="absolute top-[23%] z-0 w-[13.5%] -translate-x-1/2"
      style={{ left: `${hook * 100}%`, transformOrigin: "top center" }}
    >
      <motion.div
        animate={
          reduce
            ? undefined
            : { rotate: [sway.amp, -sway.amp, sway.amp] }
        }
        transition={{
          duration: sway.dur,
          delay: sway.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={reduce ? undefined : { rotate: 0, scale: 1.07 }}
        style={{ transformOrigin: "top center" }}
        className="relative"
      >
        {medalSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={medalSrc}
            alt={ghost ? "" : `${medal?.name} gold medal`}
            loading="lazy"
            className={`w-full select-none drop-shadow-[0_10px_12px_rgb(0_0_0/0.3)] ${
              ghost ? "opacity-40 grayscale" : ""
            }`}
          />
        ) : (
          /* CSS disc while the asset is absent */
          <div
            className={`mx-auto aspect-[671/1379] w-full ${
              ghost ? "opacity-40 grayscale" : ""
            }`}
          >
            <div className="mx-auto h-[30%] w-[34%] bg-azure" />
            <div className="mx-auto grid aspect-square w-full place-items-center rounded-full bg-or font-display text-3xl font-bold text-[#7a5c00] shadow-md ring-4 ring-[#d4af37]">
              1
            </div>
          </div>
        )}
        {ghost && (
          <>
            {/* dashed ring around the disc + the question mark */}
            <span
              aria-hidden
              className="absolute right-[6%] bottom-[6%] left-[6%] aspect-square rounded-full border-2 border-dashed border-ink-soft/60"
            />
            <span className="absolute bottom-[24%] left-1/2 -translate-x-1/2 font-display text-[clamp(1rem,4.5vw,1.9rem)] font-bold text-ink-soft">
              ?
            </span>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/** The small engraved plate under each hook. */
function CaptionPlate({ medal, index, ghost = false }: { medal?: Medal; index: number; ghost?: boolean }) {
  const hook = HOOKS[index % HOOKS.length];
  return (
    <div
      className="absolute top-0 w-[23%] -translate-x-1/2 text-center"
      style={{ left: `${hook * 100}%` }}
    >
      <div
        className={`inline-block rounded-[4px] border px-2 py-1 shadow-sm ${
          ghost
            ? "border-dashed border-line bg-transparent"
            : "border-[#c9b68f] bg-[#ece0c6] dark:border-[#6b5a35] dark:bg-[#3a3323]"
        }`}
      >
        {ghost ? (
          <p className="font-hand text-[clamp(0.6rem,2.4vw,0.85rem)] leading-tight text-ink-soft">
            the next one
          </p>
        ) : (
          <>
            <p className="font-display text-[clamp(0.55rem,2.2vw,0.72rem)] leading-tight font-semibold text-[#4a3d1c] dark:text-[#e8dca8]">
              {medal?.name}
              <span className="font-sans font-normal text-[#8a7434] dark:text-[#b8a258]">
                {" "}· {medal?.result}
              </span>
            </p>
            <p className="mt-0.5 text-[clamp(0.45rem,1.8vw,0.58rem)] leading-tight text-[#8a7434] dark:text-[#b8a258]">
              {medal?.event}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Hackathon medals (new section): a walnut hook rack on the wall, three gold
 * medals swaying on their ribbons, and a greyed-out ghost on the fourth hook
 * teasing the next win. Stubs in Talks stay as the events; this rack is the
 * wins.
 */
export function Medals() {
  const reduce = useReducedMotion();
  const rackSrc = aiAsset("awards/medal-rack");
  const medalSrc = aiAsset("awards/medal-gold");
  const slots: (Medal | undefined)[] = [...MEDALS, undefined]; // 4th = ghost

  return (
    <Section id="medals" title="First place finishes" aside="gold so far, room for more">
      <Reveal>
        {/* rack + hanging space: one fixed-aspect stage so the hooks, medals
            and captions stay registered at every width */}
        <div className="relative mx-auto aspect-[1200/760] w-full max-w-2xl">
          {/* medals hang first so their straps tuck behind the rack */}
          {slots.map((medal, i) => (
            <HangingMedal
              key={medal?.id ?? "ghost"}
              medal={medal}
              index={i}
              ghost={!medal}
              medalSrc={medalSrc}
              reduce={Boolean(reduce)}
            />
          ))}
          {/* the rack mounts on top */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -26 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={springs.soft}
            className="absolute inset-x-0 top-0 z-10"
          >
            {rackSrc ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={rackSrc}
                alt="Walnut hook rack with four brass hooks"
                loading="lazy"
                className="w-full select-none drop-shadow-[0_14px_22px_rgb(0_0_0/0.3)]"
              />
            ) : (
              <div className="h-16 w-full rounded-lg bg-[#6b4a2e] shadow-md sm:h-20" />
            )}
          </motion.div>
          {/* engraved caption plates, aligned to the hooks */}
          <div className="absolute inset-x-0 top-[66%] h-16">
            {slots.map((medal, i) => (
              <CaptionPlate key={medal?.id ?? "ghost"} medal={medal} index={i} ghost={!medal} />
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <Handwritten className="mt-6 text-center" rotate={1.2}>
          the fourth hook is not empty, it is loading
        </Handwritten>
      </Reveal>
    </Section>
  );
}
