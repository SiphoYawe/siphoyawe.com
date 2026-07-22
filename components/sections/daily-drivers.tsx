"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { springs } from "@/lib/motion";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

type App = { name: string; file: string; href: string };

/**
 * The daily drivers (the apps actually opened, not the ones on the résumé).
 * Icons live at public/images/dock/. Note: superhuman.png is labelled
 * "Superhuman" per the brief.
 */
const APPS: readonly App[] = [
  { name: "Spark", file: "spark.png", href: "https://sparkmailapp.com" },
  { name: "Zen", file: "zen.png", href: "https://zen-browser.app" },
  { name: "Figma", file: "figma.png", href: "https://figma.com" },
  { name: "Bible", file: "bible.png", href: "https://bible.com" },
  { name: "Linear", file: "linear.png", href: "https://linear.app" },
  { name: "Notion", file: "notion.png", href: "https://notion.so" },
  { name: "Slack", file: "slack.png", href: "https://slack.com" },
  { name: "Superhuman", file: "superhuman.png", href: "https://superhuman.com" },
  { name: "Signal", file: "signal.png", href: "https://signal.org" },
] as const;

/** Resting icon edge (px), magnified edge, and the cursor falloff window. */
const BASE = 52;
const MAX = 92;
const MAG_RANGE = 130;
/** macOS-ish settle for the magnify. */
const SPRING = { mass: 0.1, stiffness: 170, damping: 14 };

/** Neutral rounded placeholder if an icon file is ever missing at build. */
function Placeholder({ name }: { name: string }) {
  return (
    <span className="grid size-full place-items-center rounded-[22%] bg-gradient-to-b from-steel/30 to-steel/10 font-display text-lg font-semibold text-ink-soft ring-1 ring-black/5 dark:ring-white/10">
      {name.slice(0, 1)}
    </span>
  );
}

function DockIcon({
  app,
  mouseX,
  reduce,
}: {
  app: App;
  mouseX: MotionValue<number>;
  reduce: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const [broken, setBroken] = useState(false);

  // Distance of the cursor from this icon's centre, in viewport px.
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: BASE };
    return val - bounds.x - bounds.width / 2;
  });
  const sizeRaw = useTransform(distance, [-MAG_RANGE, 0, MAG_RANGE], [BASE, MAX, BASE]);
  const size = useSpring(sizeRaw, SPRING);

  const show = hovered;

  return (
    <motion.a
      ref={ref}
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${app.name} (opens in a new tab)`}
      onClick={() =>
        trackEvent(AnalyticsEvents.OutboundLink, { destination: app.href })
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        width: reduce ? BASE : size,
        height: reduce ? BASE : size,
        transformOrigin: "bottom center",
      }}
      className="relative block shrink-0 rounded-[22%] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {/* name label, floats above the icon like the real dock */}
      <AnimatePresence>
        {show && (
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 6, scale: 0.9 }}
            transition={springs.snappy}
            className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 rounded-lg border border-line bg-canvas-raised px-2.5 py-1 font-display text-xs font-semibold whitespace-nowrap text-ink shadow-[var(--shadow-lift)]"
          >
            {app.name}
          </motion.span>
        )}
      </AnimatePresence>

      {/* the icon itself */}
      {broken ? (
        <Placeholder name={app.name} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/dock/${app.file}`}
          alt=""
          draggable={false}
          onError={() => setBroken(true)}
          className="pointer-events-none size-full object-contain drop-shadow-[0_6px_10px_rgb(0_0_0/0.22)] select-none"
        />
      )}

      {/* reflection on the dock glass */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-full h-1/2 overflow-hidden [mask-image:linear-gradient(to_bottom,rgb(0_0_0/0.55),transparent_75%)]"
      >
        {broken ? (
          <span className="block size-full -scale-y-100 opacity-25">
            <Placeholder name={app.name} />
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/images/dock/${app.file}`}
            alt=""
            draggable={false}
            className="absolute bottom-0 left-0 w-full -scale-y-100 object-contain opacity-25 select-none"
          />
        )}
      </span>
    </motion.a>
  );
}

/**
 * A macOS dock of daily-driver apps: a frosted, translucent bar with a soft
 * reflection under each icon. Hovering an icon magnifies it and its neighbours
 * with a genie falloff and floats the app name above. Reduced motion drops the
 * magnify and just shows labels on hover/focus.
 */
export function DailyDrivers() {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <Section id="daily-drivers" title="Daily drivers" aside="the apps I actually open">
      <Reveal>
        {/* headroom (pt) keeps floating labels + magnified icons from clipping;
            the wrapper scrolls horizontally on narrow screens, never the page. */}
        <div className="-mx-5 overflow-x-auto px-5 pt-24 pb-2 sm:mx-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <motion.ul
            onMouseMove={reduce ? undefined : (e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
            className="mx-auto flex w-max items-end gap-3 rounded-[1.7rem] border border-white/50 bg-white/55 px-3.5 py-3 shadow-[var(--shadow-lift)] ring-1 ring-black/5 backdrop-blur-xl sm:gap-4 dark:border-white/10 dark:bg-white/5 dark:ring-white/5"
          >
            {APPS.map((app) => (
              <li key={app.name} className="flex items-end">
                <DockIcon app={app} mouseX={mouseX} reduce={Boolean(reduce)} />
              </li>
            ))}
          </motion.ul>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <Handwritten className="mt-10 text-center" rotate={-1.5}>
          yes, the Bible app lives in the dock
        </Handwritten>
      </Reveal>
    </Section>
  );
}
