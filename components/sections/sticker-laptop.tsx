"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
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
 * One die-cut sticker linking out. When the AI-generated brand logo is present
 * (slot `stickers-brand/sticker-<slug>`) it renders that image, already
 * die-cut with a baked-in white rim, so it just gets a subtle drop shadow.
 * Otherwise it falls back to a text pill: white rim, glossy coloured face,
 * display label. Micro-interaction (brief 6.10): peels on hover (lifts,
 * rotates a touch, corner shadow grows, springs.bouncy), then links out on
 * click.
 */
function Sticker({ sticker, index }: { sticker: LaptopSticker; index: number }) {
  const reduce = useReducedMotion();
  const logoSrc = aiAsset(`stickers-brand/sticker-${sticker.slug}`);
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
        {/* the sticker face: AI die-cut logo when present, else a text pill.
            Stickers lie flat on the lid — no resting drop shadow — and only
            peel (lift + rotate) on hover. */}
        <motion.span
          variants={{
            visible: { y: 0, rotate: 0, scale: 1 },
            hover: { y: -5, rotate: 4, scale: 1.07, transition: springs.bouncy },
          }}
          className={
            logoSrc
              ? "relative block"
              : `relative block bg-white p-[3px] ${round}`
          }
        >
          {logoSrc ? (
            // Logo is already die-cut (white rim baked in): sits flat and
            // flush on the lid, no offset shadow. Phaneroo runs larger as the
            // hero decal.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt=""
              loading="lazy"
              className={
                sticker.big
                  ? "block h-16 w-auto max-w-[10rem] object-contain sm:h-20 sm:max-w-[12.5rem]"
                  : "block h-10 w-auto max-w-[6.5rem] object-contain sm:h-12 sm:max-w-[7.5rem]"
              }
            />
          ) : (
            <span
              className={`block px-3.5 py-1.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap sm:text-sm ${round}`}
              style={{
                background: `radial-gradient(circle at 30% 20%, rgb(255 255 255 / 0.5), transparent 52%), ${face}`,
                color: ink,
              }}
            >
              {sticker.label}
            </span>
          )}
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
  const crestSticker = aiAsset("stickers-brand/sticker-coram-deo");

  return (
    <Section
      id="stack"
      title="I never go anywhere without my laptop"
      aside="every sticker links out"
    >
      <Reveal variant="scale">
        <div className="mx-auto w-full max-w-2xl">
          {/* the closed MacBook lid, seen top-down */}
          <div className={lidSrc ? "" : "rounded-[1.6rem] bg-[linear-gradient(150deg,#8f939a,#c9ccd1_32%,#7d8187)] p-[3px] shadow-[0_18px_44px_rgb(0_0_0/0.25)] dark:shadow-[0_18px_48px_rgb(0_0_0/0.6)]"}>
            <div
              className={`relative rounded-[1.35rem] ${
                lidSrc ? "aspect-[1254/923]" : "aspect-[3/2] bg-[linear-gradient(160deg,#f1f2f4,#d3d6da_48%,#babec4)]"
              }`}
            >
              {lidSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lidSrc}
                  alt="A closed laptop lid, seen from above"
                  loading="lazy"
                  className="absolute inset-0 size-full object-contain drop-shadow-[0_18px_40px_rgb(0_0_0/0.28)]"
                />
              ) : (
                /* sheen */
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(120%_85%_at_50%_0%,rgb(255_255_255/0.55),transparent_60%)]"
                />
              )}
              {/* the Apple mark, pressed into the lid's centre recess — only in
                  the CSS-fallback lid. The AI lid asset already has the Apple
                  logo baked in, so rendering this too would duplicate it. */}
              {!lidSrc && (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="absolute top-[43.5%] left-[47%] size-9 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_1px_1px_rgb(255_255_255/0.35)] sm:size-11"
                  fill="#61656d"
                >
                  <path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.9-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.28-1.27 3.14-2.53.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.75-4.13zM14.6 4.59c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.09 3.18 1.15.09 2.32-.58 3.04-1.45z" />
                </svg>
              )}
              {/* CORAM DEO crest, as a die-cut decal on the lid */}
              {crestSticker && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={crestSticker}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute top-[62%] left-[70%] h-16 w-auto -translate-x-1/2 -translate-y-1/2 -rotate-6 drop-shadow-[0_1px_1px_rgb(0_0_0/0.3)] sm:h-20"
                />
              )}
              <ul className="absolute inset-0 grid grid-cols-4 grid-rows-3 p-6 sm:p-9">
                {LAPTOP_STICKERS.map((sticker, i) => (
                  <Sticker key={sticker.id} sticker={sticker} index={i} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
