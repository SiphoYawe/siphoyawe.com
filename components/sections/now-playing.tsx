"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { PillButton } from "@/components/ui/pill-button";
import { Magnetic } from "@/components/ui/magnetic";
import { springs } from "@/lib/motion";
import { getNowPlaying } from "@/lib/api";
import type { NowPlaying as NowPlayingTrack } from "@/lib/types";
import { aiAsset } from "@/lib/ai-assets";

/** Cruising speed of the record, seconds per revolution. */
const SPIN_SECONDS = 2.6;
/** Flicked speed, and how long the burst lasts (about a beat). */
const FLICK_SECONDS = 0.55;
const FLICK_MS = 700;
/** Poll the endpoint every 45s (brief section 10: cache 30 to 60s). */
const POLL_MS = 45_000;

/**
 * Client-side last resort mirroring the server FALLBACK_TRACK, used only for
 * the brief moment before the first fetch resolves. The section must NEVER
 * render an empty idle state, so there is always a title to show. No album art
 * here on purpose, so the vinyl-only label state renders.
 */
const CLIENT_FALLBACK = {
  title: "Gethsemane (Live)",
  artist: "Worship Culture Collective",
  album: undefined as string | undefined,
  albumArtUrl: undefined as string | undefined,
  songUrl:
    "https://open.spotify.com/search/Gethsemane%20Worship%20Culture%20Collective",
};

/**
 * Now Playing (brief section 6.8): a spinning vinyl driven by the Spotify
 * stub. The record spins only while isPlaying is true (CSS keyframes,
 * play-state gated; never under reduced motion). Micro-interaction: flicking
 * the record speeds it briefly, then it settles back to cruising speed.
 */
export function NowPlaying() {
  const reduce = useReducedMotion();
  const [track, setTrack] = useState<NowPlayingTrack | null>(null);
  const [flick, setFlick] = useState(false);
  const flickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      void getNowPlaying().then((data) => {
        if (alive) setTrack(data);
      });
    };
    load();
    const poll = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(poll);
    };
  }, []);

  useEffect(
    () => () => {
      if (flickTimer.current) clearTimeout(flickTimer.current);
    },
    [],
  );

  const handleFlick = () => {
    if (reduce || !track?.isPlaying) return;
    setFlick(true);
    if (flickTimer.current) clearTimeout(flickTimer.current);
    flickTimer.current = setTimeout(() => setFlick(false), FLICK_MS);
  };

  const spinning = Boolean(track?.isPlaying) && !reduce;
  // AI record player deck (AI-ASSET-PROMPTS.md C5) slides under the record
  // when it lands; the code vinyl keeps spinning on top either way.
  const deckSrc = aiAsset("artifacts/vinyl-player");
  const isStub = track?._mock === true || (track?.title?.includes("Stub") ?? false);

  // The API always hands back a track: the live one when playing, else a
  // durable last-played (recently-played -> memory -> KV -> fallback). So the
  // section always has real title/artist/art to render, never empty copy.
  const playing = Boolean(track?.isPlaying);
  const source = playing
    ? {
        title: track?.title,
        artist: track?.artist,
        album: track?.album,
        albumArtUrl: track?.albumArtUrl,
        songUrl: track?.songUrl,
      }
    : (track?.lastPlayed ?? CLIENT_FALLBACK);
  const art = source.albumArtUrl;
  const title = source.title ?? CLIENT_FALLBACK.title;
  const artist = source.artist;
  const album = source.album;
  const songUrl = source.songUrl ?? CLIENT_FALLBACK.songUrl;

  return (
    <Section
      id="now-playing"
      title="Currently listening to"
      aside="live(ish) from spotify"
    >
      <style>{`@keyframes vinyl-spin { to { transform: rotate(360deg); } }
@keyframes vinyl-sheen { to { transform: rotate(-360deg); } }`}</style>
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-14">
        <Reveal variant="left" className="shrink-0">
          {/* the record player: the deck asset with the vinyl seated on its
              platter (platter centre measured on artifacts/vinyl-player). */}
          <motion.button
            type="button"
            onClick={handleFlick}
            aria-label="Flick the record to spin it faster"
            whileHover={reduce ? undefined : { scale: 1.02 }}
            whileTap={reduce ? undefined : { scale: 0.99 }}
            transition={springs.soft}
            className={`relative w-72 shrink-0 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:w-96 ${
              deckSrc ? "aspect-[952/871]" : "aspect-square"
            }`}
          >
            {deckSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={deckSrc}
                alt=""
                loading="lazy"
                className="pointer-events-none absolute inset-0 size-full object-contain drop-shadow-xl"
              />
            )}
            {/* positioned wrapper: seats the disc on the platter, no spin here */}
            <span
              aria-hidden
              className="absolute aspect-square -translate-x-1/2 -translate-y-1/2"
              style={{
                left: deckSrc ? "41%" : "50%",
                top: deckSrc ? "43%" : "50%",
                width: deckSrc ? "62%" : "80%",
              }}
            >
              {/* the spinning grooved disc, true-centre origin */}
              <span
                className="absolute inset-0 grid place-items-center rounded-full"
                style={{
                  transformOrigin: "center",
                  background:
                    "repeating-radial-gradient(circle at 50% 50%, #101012 0px, #101012 2px, #1d1d21 3px, #101012 4px)",
                  boxShadow:
                    "0 20px 40px -14px rgb(0 0 0 / 0.55), inset 0 0 0 1px rgb(255 255 255 / 0.06)",
                  animation: reduce
                    ? "none"
                    : `vinyl-spin ${flick ? FLICK_SECONDS : SPIN_SECONDS}s linear infinite`,
                  animationPlayState: spinning ? "running" : "paused",
                }}
              >
                {/* centre label: the album art, spins with the record */}
                {art ? (
                  <Image
                    src={art}
                    alt=""
                    width={160}
                    height={160}
                    sizes="(max-width: 640px) 72px, 96px"
                    className="size-[34%] rounded-full border-4 border-black/70 object-cover"
                  />
                ) : (
                  <span className="size-[34%] rounded-full border-4 border-black/70 bg-azure" />
                )}
                {/* spindle hole */}
                <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper shadow" />
              </span>
              {/* room light sheen, drifts slowly against the grooves */}
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 210deg, transparent 0deg, rgb(255 255 255 / 0.09) 20deg, transparent 60deg, transparent 180deg, rgb(255 255 255 / 0.06) 200deg, transparent 240deg)",
                  animation: reduce ? "none" : "vinyl-sheen 11s linear infinite",
                }}
              />
            </span>
          </motion.button>
        </Reveal>

        {/* track info */}
        <Reveal variant="right" delay={0.12} className="max-w-md">
          <div className="text-center sm:text-left" aria-live="polite">
            <p className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase sm:justify-start">
              {playing ? (
                <>
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c55e] opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex size-2 rounded-full bg-[#22c55e]" />
                  </span>
                  <span className="text-[#157a34] dark:text-[#7de3a8]">Playing now</span>
                </>
              ) : (
                <>
                  <span className="inline-flex size-2 rounded-full bg-steel" />
                  <span className="text-ink-soft">Last played</span>
                </>
              )}
            </p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance">
              {title}
            </h3>
            {artist && <p className="mt-1 text-lg text-ink-soft">{artist}</p>}
            {album && <p className="mt-0.5 text-sm text-ink-soft/80">{album}</p>}
            {isStub && (
              <p className="mt-3 inline-block rounded-full border border-line px-3 py-1 text-xs text-ink-soft">
                dev stub until Spotify is wired
              </p>
            )}
            {songUrl && (
              <div className="mt-5 flex justify-center sm:justify-start">
                <Magnetic strength={0.3}>
                  <PillButton label="Open in Spotify" href={songUrl} external badge="or" />
                </Magnetic>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
