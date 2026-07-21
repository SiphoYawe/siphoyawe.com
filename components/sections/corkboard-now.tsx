"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { springs } from "@/lib/motion";
import { aiAsset } from "@/lib/ai-assets";
import { NOW } from "@/data/now";

const PIN_COLORS = ["#D50000", "#2B5DF2", "#FCDD09", "#141416"];

/**
 * One pinned index card: off-white ruled card, glossy pushpin at top center.
 * Micro-interaction (brief 6.9): swings a few degrees on hover, pivoting on
 * its pin (transform-origin top center, springs.soft).
 */
function PinnedCard({
  card,
  index,
}: {
  card: (typeof NOW.cards)[number];
  index: number;
}) {
  const reduce = useReducedMotion();
  const pin = PIN_COLORS[index % PIN_COLORS.length];

  return (
    <motion.li
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      whileHover={reduce ? undefined : "hover"}
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0, y: 14, rotate: card.rotate * 2 },
        visible: {
          opacity: 1,
          y: 0,
          rotate: card.rotate,
          transition: { ...springs.soft, delay: index * 0.07 },
        },
        hover: { rotate: card.rotate + 3.5, transition: springs.soft },
      }}
      style={{ transformOrigin: "50% 0%" }}
      className="relative"
    >
      {/* pushpin */}
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 z-10 size-4 -translate-x-1/2 rounded-full shadow-[0_2px_4px_rgb(0_0_0/0.45),inset_0_-2px_3px_rgb(0_0_0/0.3)]"
        style={{
          background: `radial-gradient(circle at 35% 30%, rgb(255 255 255 / 0.9) 0 18%, transparent 46%), ${pin}`,
        }}
      />
      {/* ruled index card */}
      <div
        className="min-h-[150px] rounded-[3px] bg-[#fbf8ec] p-4 pt-5 shadow-[0_3px_8px_rgb(0_0_0/0.3)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 22px, rgb(43 93 242 / 0.16) 22px 23px)",
        }}
      >
        <p className="font-heraldic text-[10px] tracking-[0.28em] text-azure-deep uppercase">
          {card.label}
        </p>
        <p className="mt-2 text-sm leading-snug text-[#38352c]">{card.text}</p>
      </div>
    </motion.li>
  );
}

/**
 * Corkboard "Now" page (brief section 6.9): pinned index cards on a grained
 * cork board with a wooden frame, a red string between the pins, and an ink
 * stamp with the last-updated date.
 */
export function CorkboardNow() {
  // AI corkboard final (AI-ASSET-PROMPTS.md C6) replaces the CSS cork texture
  // when it lands; cards, pins, string and the updated stamp stay in code.
  const corkSrc = aiAsset("artifacts/corkboard");

  return (
    <Section
      id="now"
      kicker={<Kicker k="now" />}
      title="Right now"
      aside="updated periodically"
    >
      <Reveal>
        {/* wooden frame */}
        <div className="relative rounded-2xl bg-[linear-gradient(160deg,#7a5636,#583b20)] p-2.5 shadow-[0_18px_44px_rgb(0_0_0/0.28)] sm:p-3 dark:shadow-[0_18px_44px_rgb(0_0_0/0.6)]">
          {/* cork */}
          <div
            className="relative rounded-xl p-5 pt-8 shadow-[inset_0_2px_14px_rgb(0_0_0/0.35)] sm:p-7 sm:pt-9"
            style={{
              backgroundColor: "#b5855c",
              backgroundImage:
                "radial-gradient(circle at 25% 30%, rgb(90 60 35 / 0.28) 0 1.5px, transparent 1.5px), radial-gradient(circle at 70% 65%, rgb(255 225 180 / 0.22) 0 1.5px, transparent 1.5px), radial-gradient(circle at 45% 80%, rgb(90 60 35 / 0.2) 0 1px, transparent 1px), linear-gradient(160deg, #c1916a, #a67a4e)",
              backgroundSize: "90px 90px, 70px 70px, 50px 50px, 100% 100%",
            }}
          >
            {corkSrc && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={corkSrc}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full rounded-[inherit] object-cover"
                />
                {/* inset vignette re-applied over the image */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_2px_14px_rgb(0_0_0/0.35)]"
                />
              </>
            )}
            <ul className="relative grid gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              {NOW.cards.map((card, i) => (
                <PinnedCard key={card.id} card={card} index={i} />
              ))}
            </ul>

            {/* red string between the pins (decorative, wide screens only) */}
            <svg
              aria-hidden
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-[3%] top-9 hidden h-10 w-[94%] lg:block"
            >
              <path
                d="M-2 6 Q 6 9.5 12.5 3.5 Q 25 11 37.5 3.5 Q 50 11 62.5 3.5 Q 75 11 87.5 3.5 Q 94 9 102 6"
                fill="none"
                stroke="#D50000"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>

            {/* ink stamp, half off the board like a real one */}
            <p className="pointer-events-none absolute -bottom-3 right-6 -rotate-[8deg] rounded-md border-[2.5px] border-gules/70 px-2.5 py-0.5 font-heraldic text-[10px] font-bold tracking-[0.22em] text-gules/80 uppercase sm:text-[11px]">
              updated {NOW.updated}
            </p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <Handwritten className="mt-8 text-center" rotate={1.5}>
          string included for drama
        </Handwritten>
      </Reveal>
    </Section>
  );
}
