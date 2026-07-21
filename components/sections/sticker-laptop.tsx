"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { springs } from "@/lib/motion";
import { aiAsset } from "@/lib/ai-assets";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { LAPTOP_STICKERS, type LaptopSticker } from "@/data/laptop-stickers";

const FACE_COLORS: Record<LaptopSticker["color"], { face: string; ink: string }> = {
  azure: { face: "#2B5DF2", ink: "#F7F5F0" },
  or: { face: "#FCDD09", ink: "#141416" },
  gules: { face: "#D50000", ink: "#F7F5F0" },
  mint: { face: "#34c77b", ink: "#141416" },
  sable: { face: "#141416", ink: "#F7F5F0" },
  paper: { face: "#F7F5F0", ink: "#141416" },
};

/** Hand-scattered nudges (px) on top of the 3x3 grid, deterministic. The
 * centre sticker gets a bigger one so the crest decal can peek out. */
const NUDGES: ReadonlyArray<readonly [number, number]> = [
  [-8, 5],
  [6, -6],
  [9, 4],
  [-7, -7],
  [-18, 12],
  [8, 8],
  [-6, 9],
  [7, -8],
  [-9, -4],
];

/**
 * One die-cut sticker linking out: white rim, glossy coloured face, display
 * label. Micro-interaction (brief 6.10): peels on hover (lifts, rotates a
 * touch, corner shadow grows, springs.bouncy), then links out on click.
 */
function Sticker({ sticker, index }: { sticker: LaptopSticker; index: number }) {
  const reduce = useReducedMotion();
  const { face, ink } = FACE_COLORS[sticker.color];
  const round = sticker.label.length <= 6 ? "rounded-full" : "rounded-xl";
  const [nx, ny] = NUDGES[index % NUDGES.length];

  return (
    <li
      style={{
        gridColumn: sticker.col,
        gridRow: sticker.row,
        transform: `translate(${nx}px, ${ny}px)`,
      }}
      className="place-self-center"
    >
      <motion.a
        href={sticker.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${sticker.label} website (opens in a new tab)`}
        onClick={() =>
          trackEvent(AnalyticsEvents.OutboundLink, { destination: sticker.href })
        }
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        whileHover={reduce ? undefined : "hover"}
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: { opacity: 0, scale: 0.5, rotate: sticker.rotate * 2 },
          visible: {
            opacity: 1,
            scale: 1,
            rotate: sticker.rotate,
            transition: { ...springs.bouncy, delay: 0.1 + index * 0.05 },
          },
        }}
        className={`relative inline-block outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${round}`}
      >
        {/* ground shadow on the lid, grows as the sticker peels */}
        <motion.span
          aria-hidden
          variants={{
            visible: { opacity: 1, y: 0, scale: 1 },
            hover: { opacity: 0.7, y: 4, scale: 1.18, transition: springs.bouncy },
          }}
          className="absolute inset-x-1 -bottom-1 h-3 rounded-[50%] bg-black/25 blur-[5px]"
        />
        {/* white die-cut rim + coloured face */}
        <motion.span
          variants={{
            visible: { y: 0, rotate: 0, scale: 1 },
            hover: { y: -5, rotate: 4, scale: 1.07, transition: springs.bouncy },
          }}
          className={`relative block bg-white p-[3px] shadow-sm ${round}`}
        >
          <span
            className={`block px-3.5 py-1.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap sm:text-sm ${round}`}
            style={{
              background: `radial-gradient(circle at 30% 20%, rgb(255 255 255 / 0.5), transparent 52%), ${face}`,
              color: ink,
            }}
          >
            {sticker.label}
          </span>
        </motion.span>
      </motion.a>
    </li>
  );
}

/**
 * The stickered lid (brief section 6.10): an aluminium laptop lid covered in
 * die-cut stickers for the stack and the loves, each one linking out.
 */
export function StickerLaptop() {
  // AI lid final (AI-ASSET-PROMPTS.md C7) replaces the CSS slab gradient and
  // sheen when it lands; the crest decal and stickers stay in code.
  const lidSrc = aiAsset("artifacts/laptop-lid");

  return (
    <Section
      id="stack"
      kicker={<Kicker k="stack" />}
      title="The stickered lid"
      aside="every sticker links out"
    >
      <Reveal>
        <div className="mx-auto w-full max-w-2xl">
          {/* lid: thin darker edge around an aluminium slab */}
          <div className="rounded-[1.6rem] bg-[linear-gradient(150deg,#8f939a,#c9ccd1_32%,#7d8187)] p-[3px] shadow-[0_18px_44px_rgb(0_0_0/0.25)] dark:shadow-[0_18px_48px_rgb(0_0_0/0.6)]">
            <div className="relative aspect-[3/2] rounded-[1.35rem] bg-[linear-gradient(160deg,#f1f2f4,#d3d6da_48%,#babec4)]">
              {lidSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lidSrc}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full rounded-[inherit] object-cover"
                />
              ) : (
                /* sheen */
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(120%_85%_at_50%_0%,rgb(255_255_255/0.55),transparent_60%)]"
                />
              )}
              {/* crest decal, the "logo", peeking through the open grid cell */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/crest-badge.svg"
                alt=""
                aria-hidden
                className="absolute top-1/2 left-[64%] size-14 -translate-x-1/2 -translate-y-1/2 opacity-85 sm:size-16"
              />
              <ul className="absolute inset-0 grid grid-cols-4 grid-rows-3 p-5 sm:p-7">
                {LAPTOP_STICKERS.map((sticker, i) => (
                  <Sticker key={sticker.id} sticker={sticker} index={i} />
                ))}
              </ul>
            </div>
          </div>
          {/* base lip + thumb scoop, just enough to read "laptop" */}
          <div
            aria-hidden
            className="relative mx-auto h-2.5 w-[104%] -translate-x-[2%] rounded-t-sm rounded-b-2xl bg-[linear-gradient(180deg,#a2a6ac,#7a7e84)] shadow-md"
          >
            <div className="absolute top-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-b-md bg-black/20" />
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <Handwritten className="mt-8 text-center" rotate={1.5}>
          yes, the lid still closes
        </Handwritten>
      </Reveal>
    </Section>
  );
}
