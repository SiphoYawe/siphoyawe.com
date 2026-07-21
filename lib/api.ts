import type {
  GuestbookEntry,
  GuestbookSignature,
  NowPlaying,
  SpeakingInquiry,
} from "./types";

/**
 * API client seam (frontend scope boundary, brief section 10).
 *
 * Claude owns the four server surfaces: /api/now-playing, /api/speaking,
 * /api/guestbook, and analytics. Until those route handlers land, every
 * function here falls back to a clearly-labelled mock so the UI is fully
 * functional in dev. When the real endpoints exist they are used
 * automatically — nothing else in the app changes.
 */

const PLACEHOLDER_ALBUM_ART =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#2B5DF2"/><circle cx="150" cy="150" r="120" fill="#141416"/><circle cx="150" cy="150" r="18" fill="#FCDD09"/><text x="150" y="270" font-family="sans-serif" font-size="16" fill="#F7F5F0" text-anchor="middle">album art stub</text></svg>`,
  );

const MOCK_NOW_PLAYING: NowPlaying = {
  isPlaying: true,
  title: "Stub track — wire up Spotify",
  artist: "The Mock Endpoint",
  album: "Now Playing (dev stub)",
  albumArtUrl: PLACEHOLDER_ALBUM_ART,
  songUrl: "https://open.spotify.com",
};

const MOCK_GUESTBOOK: GuestbookEntry[] = [
  {
    id: "stub-1",
    name: "Stub entry",
    message:
      "This note is a mock from lib/api.ts. Real notes arrive once Claude wires the guestbook backend.",
    createdAt: new Date("2026-07-21T12:00:00Z").toISOString(),
    approved: true,
  },
  {
    id: "stub-2",
    name: "Another stub",
    message: "Yours could be the first real one. Say something nice below.",
    createdAt: new Date("2026-07-21T12:30:00Z").toISOString(),
    approved: true,
  },
];

/** SSG-safe seed for the guestbook wall's first paint (brief: static by
 * default). The client wall refetches /api/guestbook after mount and swaps
 * in live entries once Claude's endpoint exists. */
export function getGuestbookSeed(): GuestbookEntry[] {
  return MOCK_GUESTBOOK;
}

async function tryFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(input, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** GET /api/now-playing — poll every 30–60s; vinyl spin keys off isPlaying. */
export async function getNowPlaying(): Promise<NowPlaying> {
  const live = await tryFetch<NowPlaying>("/api/now-playing", {
    cache: "no-store",
  });
  return live ?? MOCK_NOW_PLAYING;
}

/** POST /api/speaking — stubbed to console + fake success for now. */
export async function submitSpeaking(
  data: SpeakingInquiry,
): Promise<{ ok: boolean }> {
  const live = await tryFetch<{ ok: boolean }>("/api/speaking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (live) return live;
  console.info("[api stub] speaking inquiry:", data);
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true };
}

/** GET /api/guestbook — renders approved entries only. */
export async function getGuestbook(): Promise<GuestbookEntry[]> {
  const live = await tryFetch<GuestbookEntry[]>("/api/guestbook", {
    cache: "no-store",
  });
  return (live ?? MOCK_GUESTBOOK).filter((entry) => entry.approved);
}

/** POST /api/guestbook — stubbed to console + fake success for now. */
export async function signGuestbook(
  data: GuestbookSignature,
): Promise<{ ok: boolean }> {
  const live = await tryFetch<{ ok: boolean }>("/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (live) return live;
  console.info("[api stub] guestbook signature:", data);
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true };
}
