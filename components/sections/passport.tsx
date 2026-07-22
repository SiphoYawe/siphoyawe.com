"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { springs } from "@/lib/motion";
import { aiAsset } from "@/lib/ai-assets";
import { STAMPS, JOURNEY_NOTE, type Stamp } from "@/data/stamps";

const INK: Record<Stamp["ink"], string> = {
  azure: "#2B5DF2",
  gules: "#D50000",
  sable: "#141416",
};

/** AI stamp slots (AI-ASSET-PROMPTS.md section G), keyed on the stamp id.
 * kampala and london get the generated imprints, the rest keep the CSS stamp. */
const STAMP_AI: Record<string, string> = {
  kampala: "stamps/stamp-kampala",
  london: "stamps/stamp-london",
};

/** Turns the full-colour crest into a gold foil imprint (brief 6.12). */
const GOLD_FOIL =
  "sepia(1) saturate(3.4) hue-rotate(-6deg) brightness(1.04) contrast(0.9)";

/** Cream passport paper, darkened at the spine side, lighter curl at the outer edge. */
const LEFT_PAGE =
  "linear-gradient(100deg, #e9e1cc 0%, #F7F5F0 16%, #F7F5F0 82%, #e4dbc2 100%)";
const RIGHT_PAGE =
  "linear-gradient(260deg, #e9e1cc 0%, #F7F5F0 16%, #F7F5F0 82%, #e4dbc2 100%)";

/** Dotted arc, Kampala to the UK. */
const FLIGHT_PATH = "M96 182 C 250 46, 470 18, 636 66";

/**
 * One ink imprint: ~3px border in the stamp's ink, dashed inner ring, heraldic
 * place, hand-written caption, mix-blend-multiply so the ink sits into the
 * paper. Micro-interaction: presses in on hover, ink deepens (brief 6.12).
 */
function InkStamp({ stamp, index }: { stamp: Stamp; index: number }) {
  const reduce = useReducedMotion();
  const ink = INK[stamp.ink];
  const circle = index % 2 === 1;
  const slot = STAMP_AI[stamp.id];
  const aiSrc = slot ? aiAsset(slot) : null;

  return (
    <motion.div
      whileHover={reduce ? undefined : { scale: 0.95, opacity: 1 }}
      transition={springs.bouncy}
      style={{ rotate: stamp.rotate }}
      className="opacity-75 mix-blend-multiply"
    >
      {aiSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={aiSrc} alt="" loading="lazy" className="size-24 object-contain sm:size-28" />
      ) : (
      <div
        className={`grid size-24 place-items-center border-[3px] p-1 sm:size-28 ${
          circle ? "rounded-full" : "rounded-lg"
        }`}
        style={{ borderColor: ink, color: ink }}
      >
        <div
          className={`grid h-full w-full place-items-center border border-dashed px-1.5 py-2 text-center ${
            circle ? "rounded-full" : "rounded-md"
          }`}
          style={{ borderColor: ink }}
        >
          <div>
            <p className="font-heraldic text-[9px] tracking-[0.12em] uppercase sm:text-[10px]">
              {stamp.place}
            </p>
            <p className="mt-0.5 font-hand text-sm leading-tight sm:text-base">
              {stamp.caption}
            </p>
            <p className="mt-0.5 text-[8px] tracking-[0.2em] uppercase sm:text-[9px]">
              {stamp.date}
            </p>
          </div>
        </div>
      </div>
      )}
    </motion.div>
  );
}

/** The Yawe wax seal: round gold blob with an SY monogram. Same press on hover. */
function WaxSeal() {
  const reduce = useReducedMotion();
  // AI seal stamp (AI-ASSET-PROMPTS.md G4) replaces the CSS blob when it lands.
  const aiSrc = aiAsset("stamps/stamp-yawe-seal");

  return (
    <motion.div
      whileHover={reduce ? undefined : { scale: 0.95 }}
      transition={springs.bouncy}
      style={{ rotate: -12 }}
      className="grid size-24 place-items-center sm:size-28"
      role="img"
      aria-label="The Yawe wax seal, gold, with an SY monogram"
    >
      {aiSrc ? (
        <span className="relative grid size-full place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={aiSrc} alt="" loading="lazy" className="absolute inset-0 size-full object-contain" />
          {/* the family crest pressed into the oval as a gold-ink mark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/crest-badge.svg"
            alt=""
            className="relative w-[42%] opacity-80 mix-blend-multiply"
            style={{ filter: GOLD_FOIL }}
          />
        </span>
      ) : (
      <div
        className="grid size-full place-items-center"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #ffe764 0%, #FCDD09 42%, #e3bc06 75%, #b8940a 100%)",
          borderRadius: "47% 53% 50% 50% / 49% 46% 54% 51%",
          boxShadow:
            "0 4px 10px rgb(0 0 0 / 0.3), inset 0 -5px 9px rgb(0 0 0 / 0.22), inset 0 2px 4px rgb(255 255 255 / 0.55)",
        }}
      >
        <div
          className="grid size-[72%] place-items-center"
          style={{
            borderRadius: "50% 48% 52% 49% / 51% 52% 48% 50%",
            border: "1.5px solid rgb(120 90 0 / 0.45)",
            boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.25)",
          }}
        >
          <span
            className="font-heraldic text-lg font-bold tracking-[0.12em] sm:text-xl"
            style={{ color: "#6b5200" }}
          >
            SY
          </span>
        </div>
      </div>
      )}
    </motion.div>
  );
}

/**
 * Illustrated map strip: two labelled dots, a dotted arc that draws in on
 * scroll (a white path in an SVG mask reveals the dashes, so the line stays
 * dotted while pathLength animates), and a small plane at the head.
 */
function FlightMap() {
  const reduce = useReducedMotion();
  // Embroidered-hoop map (textures/map-kampala-uk): the illustrated centrepiece
  // when present; the CSS dotted arc is the fallback.
  const mapSrc = aiAsset("textures/map-kampala-uk");

  if (mapSrc) {
    return (
      <Reveal className="mx-auto mt-12 max-w-xl">
        <figure className="flex flex-col items-center">
          <motion.img
            src={mapSrc}
            alt="Embroidered hoop map of the journey from Kampala to the UK"
            loading="lazy"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md drop-shadow-[0_18px_30px_rgb(0_0_0/0.28)]"
          />
          <figcaption className="mt-6 max-w-sm -rotate-1 text-center font-hand text-xl text-ink-soft sm:text-2xl">
            {JOURNEY_NOTE}
          </figcaption>
        </figure>
      </Reveal>
    );
  }

  return (
    <Reveal className="mx-auto mt-12 max-w-3xl">
      <div className="rounded-3xl border border-line bg-canvas-raised p-5 shadow-sm sm:p-7">
        <svg
          viewBox="0 0 760 240"
          role="img"
          aria-label="Illustrated dotted flight path from Kampala to the UK"
          className="h-auto w-full"
        >
          <defs>
            <mask id="flight-path-reveal">
              <motion.path
                d={FLIGHT_PATH}
                fill="none"
                stroke="#ffffff"
                strokeWidth="10"
                strokeLinecap="round"
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.9, ease: [0.65, 0, 0.35, 1] }}
              />
            </mask>
          </defs>

          <path
            d={FLIGHT_PATH}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="0.5 12"
            mask="url(#flight-path-reveal)"
          />

          {/* Kampala, the home end */}
          <circle cx="96" cy="182" r="13" fill="none" stroke="#D50000" strokeOpacity="0.3" strokeWidth="2" />
          <circle cx="96" cy="182" r="7" fill="#D50000" />
          <text
            x="96"
            y="216"
            textAnchor="middle"
            className="font-heraldic"
            style={{ fill: "var(--ink-soft)", fontSize: "13px", letterSpacing: "0.3em" }}
          >
            KAMPALA
          </text>

          {/* UK, the far end */}
          <circle cx="636" cy="66" r="13" fill="none" stroke="#2B5DF2" strokeOpacity="0.3" strokeWidth="2" />
          <circle cx="636" cy="66" r="7" fill="#2B5DF2" />
          <text
            x="636"
            y="38"
            textAnchor="middle"
            className="font-heraldic"
            style={{ fill: "var(--ink-soft)", fontSize: "13px", letterSpacing: "0.3em" }}
          >
            UK
          </text>

          {/* plane at the head of the path, lands once the line does */}
          <motion.g
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: reduce ? 0 : 1.75 }}
          >
            <path d="M0 -8 L18 0 L0 8 L4.5 0 Z" fill="var(--accent)" transform="translate(622 59) rotate(16)" />
          </motion.g>
        </svg>

        <Handwritten className="mt-3 sm:mt-4" rotate={-1.2}>
          {JOURNEY_NOTE}
        </Handwritten>
      </div>
    </Reveal>
  );
}

/**
 * Passport and travel stamps (brief section 6.12): an open passport spread,
 * gold-foil crest on the left page, ink stamps plus the wax seal on the
 * right, and the Kampala-to-UK flight path below.
 */
export function Passport() {
  // AI open-passport spread (AI-ASSET-PROMPTS.md C9) replaces the CSS page
  // gradients when the final lands; crest, text and stamps stay in code.
  const spreadSrc = aiAsset("artifacts/passport-spread");

  return (
    <Section
      id="passport"
      title="Kampala to the UK"
      aside="stamps so far"
    >
      <Reveal className="mx-auto max-w-3xl">
        <div className="relative -rotate-[0.6deg] rounded-[1.6rem] bg-night p-2.5 pb-4 shadow-(--shadow-lift) sm:p-3 sm:pb-5">
          <div className={`grid overflow-hidden rounded-[1.1rem] sm:grid-cols-2 ${spreadSrc ? "relative" : ""}`}>
            {spreadSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={spreadSrc}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            {/* left page: the crest in gold foil */}
            <div
              className="relative flex flex-col items-center justify-center gap-5 px-6 py-12"
              style={{ background: spreadSrc ? "transparent" : LEFT_PAGE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/crest-badge.svg"
                alt="Yawe family crest, embossed as a gold foil stamp"
                className="w-24 opacity-50 mix-blend-multiply sm:w-28"
                style={{ filter: GOLD_FOIL }}
              />
              <div className="text-center">
                <p className="font-heraldic text-base tracking-[0.45em] text-[#8a6d03] sm:text-lg">
                  PASSPORT
                </p>
                <p className="mt-2 font-hand text-xl text-[#3c3a36]">Sipho Yawe</p>
              </div>
            </div>

            {/* right page: travel stamps plus the wax seal */}
            <div
              className={`px-5 py-8 sm:py-10 ${spreadSrc ? "relative" : ""}`}
              style={{ background: spreadSrc ? "transparent" : RIGHT_PAGE }}
            >
              <div className="grid grid-cols-2 justify-items-center gap-3 sm:gap-4">
                {STAMPS.map((stamp, i) => (
                  <InkStamp key={stamp.id} stamp={stamp} index={i} />
                ))}
                <div className="col-span-2 mt-1 flex justify-center">
                  <WaxSeal />
                </div>
              </div>
            </div>
          </div>

          {/* centre spine shadow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-3 left-1/2 hidden w-16 -translate-x-1/2 sm:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgb(20 16 4 / 0.28) 50%, transparent 100%)",
            }}
          />
        </div>
      </Reveal>

      <FlightMap />
    </Section>
  );
}
