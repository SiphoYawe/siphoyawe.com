import type { Track } from "./spotify";

/**
 * Durable last-played store. The Now Playing section must ALWAYS show a track,
 * so we remember the last track Spotify handed us across two layers:
 *
 *   1. an in-memory cache pinned to `globalThis` (survives warm serverless
 *      invocations within a running instance);
 *   2. Vercel KV, when `KV_REST_API_URL` + `KV_REST_API_TOKEN` are set
 *      (survives cold starts and deploys). KV is loaded lazily and any failure
 *      degrades to a warning, never an error.
 *
 * Read order for the section is live -> recently-played -> memory -> KV ->
 * FALLBACK_TRACK, so something always renders.
 */

const KV_KEY = "now-playing:last-track";

type LastPlayedGlobal = { track?: Track };

const globalStore = globalThis as typeof globalThis & {
  __siphoLastPlayed?: LastPlayedGlobal;
};
globalStore.__siphoLastPlayed ??= {};

/** Absolute last resort so the section never renders empty. No album art, so
 * the component falls back to its vinyl-only state. */
export const FALLBACK_TRACK: Track = {
  title: "Gethsemane (Live)",
  artist: "Worship Culture Collective",
  album: "",
  albumArtUrl: "",
  songUrl:
    "https://open.spotify.com/search/Gethsemane%20Worship%20Culture%20Collective",
};

export function getMemoryTrack(): Track | null {
  return globalStore.__siphoLastPlayed?.track ?? null;
}

export function setMemoryTrack(track: Track): void {
  globalStore.__siphoLastPlayed ??= {};
  globalStore.__siphoLastPlayed.track = track;
}

/** Test hook: clear the durable memory so cases stay isolated. */
export function resetLastPlayedMemory(): void {
  globalStore.__siphoLastPlayed = {};
}

function kvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

export async function readKvTrack(): Promise<Track | null> {
  if (!kvConfigured()) return null;
  try {
    const { kv } = await import("@vercel/kv");
    const track = await kv.get<Track>(KV_KEY);
    return track ?? null;
  } catch (err) {
    console.warn("[now-playing] KV read failed, skipping", err);
    return null;
  }
}

export async function writeKvTrack(track: Track): Promise<void> {
  if (!kvConfigured()) return;
  try {
    const { kv } = await import("@vercel/kv");
    await kv.set(KV_KEY, track);
  } catch (err) {
    console.warn("[now-playing] KV write failed, skipping", err);
  }
}

/**
 * Persist a freshly-fetched track to every durable layer (memory now, KV when
 * configured). Memory is synchronous; the KV write is awaited so it completes
 * before a serverless instance can freeze.
 */
export async function rememberTrack(track: Track): Promise<void> {
  setMemoryTrack(track);
  await writeKvTrack(track);
}

/** The durable fallback chain: in-memory -> KV -> hardcoded FALLBACK_TRACK. */
export async function durableLastPlayed(): Promise<Track> {
  return getMemoryTrack() ?? (await readKvTrack()) ?? FALLBACK_TRACK;
}
