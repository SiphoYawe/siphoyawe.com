"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { PillButton } from "@/components/ui/pill-button";
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

  return (
    <Section
      id="now-playing"
      title="Now playing"
      aside="live(ish) from spotify"
    >
      <style>{`@keyframes vinyl-spin { to { transform: rotate(360deg); } }`}</style>
      <Reveal>
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-14">
          {/* the record */}
          <button
            type="button"
            onClick={handleFlick}
            aria-label="Flick the record to spin it faster"
            className="relative shrink-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {deckSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={deckSrc}
                alt=""
                loading="lazy"
                className="pointer-events-none absolute top-1/2 left-1/2 size-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-xl"
              />
            )}
            <span
              aria-hidden
              className="relative grid size-60 place-items-center rounded-full sm:size-72"
              style={{
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
              {track?.albumArtUrl ? (
                <Image
                  src={track.albumArtUrl}
                  alt=""
                  width={112}
                  height={112}
                  sizes="(max-width: 640px) 96px, 112px"
                  className="size-24 rounded-full border-4 border-black/70 object-cover sm:size-28"
                />
              ) : (
                <span className="size-24 rounded-full border-4 border-black/70 bg-azure sm:size-28" />
              )}
              {/* spindle hole */}
              <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper shadow" />
            </span>
            {/* room light sheen, stays put while the grooves turn */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 210deg, transparent 0deg, rgb(255 255 255 / 0.09) 20deg, transparent 60deg, transparent 180deg, rgb(255 255 255 / 0.06) 200deg, transparent 240deg)",
              }}
            />
          </button>

          {/* track info */}
          <div className="max-w-md text-center sm:text-left" aria-live="polite">
            <p className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase sm:justify-start">
              {track?.isPlaying ? (
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
                  <span className="text-ink-soft">{track ? "Paused" : "Tuning in"}</span>
                </>
              )}
            </p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance">
              {track?.title ?? "Warming up the needle"}
            </h3>
            {track?.artist && <p className="mt-1 text-lg text-ink-soft">{track.artist}</p>}
            {track?.album && <p className="mt-0.5 text-sm text-ink-soft/80">{track.album}</p>}
            {isStub && (
              <p className="mt-3 inline-block rounded-full border border-line px-3 py-1 text-xs text-ink-soft">
                dev stub until Spotify is wired
              </p>
            )}
            {track?.songUrl && (
              <div className="mt-5 flex justify-center sm:justify-start">
                <PillButton label="Open in Spotify" href={track.songUrl} external badge="or" />
              </div>
            )}
            <p aria-hidden className="mt-6 -rotate-2 font-hand text-lg text-ink-soft">
              flick the record, it likes it
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
