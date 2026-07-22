import type {
  GuestbookEntry,
  GuestbookSignResult,
  GuestbookSignature,
  NowPlaying,
  SpeakingInquiry,
} from "./types";

/**
 * API client for the four backend surfaces (route handlers live in
 * app/api/, ported from Claude's staging package; see backend/WIRING.md).
 *
 * Every call degrades gracefully: if an endpoint is unreachable (static
 * export, offline dev), the UI keeps working with clearly-labelled mocks.
 */

const PLACEHOLDER_ALBUM_ART =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#2B5DF2"/><circle cx="150" cy="150" r="120" fill="#141416"/><circle cx="150" cy="150" r="18" fill="#FCDD09"/><text x="150" y="270" font-family="sans-serif" font-size="16" fill="#F7F5F0" text-anchor="middle">album art stub</text></svg>`,
  );

const OFFLINE_NOW_PLAYING: NowPlaying = {
  isPlaying: true,
  title: "Offline stub — endpoint unreachable",
  artist: "The Mock Client",
  album: "Now Playing (client fallback)",
  albumArtUrl: PLACEHOLDER_ALBUM_ART,
  songUrl: "https://open.spotify.com",
  _mock: true,
};

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
  return live ?? OFFLINE_NOW_PLAYING;
}

/** POST /api/speaking — zod-validated server-side; honeypot + rate limit. */
export async function submitSpeaking(
  data: SpeakingInquiry,
): Promise<{ ok: boolean; error?: string }> {
  const live = await tryFetch<{ ok: boolean; error?: string }>("/api/speaking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (live) return live;
  console.info("[api offline] speaking inquiry:", data);
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true };
}

/**
 * GET /api/guestbook — approved entries only. The route answers
 * `{ entries: [...] }`; an array body is also tolerated (older mock shape).
 */
export async function getGuestbook(): Promise<GuestbookEntry[]> {
  const live = await tryFetch<{ entries: GuestbookEntry[] } | GuestbookEntry[]>(
    "/api/guestbook",
    { cache: "no-store" },
  );
  if (!live) return [];
  const entries = Array.isArray(live) ? live : live.entries;
  return (entries ?? []).filter((entry) => entry.approved !== false);
}

/**
 * POST /api/guestbook — entries are pre-moderated, so success means
 * "pending", not "on the wall".
 */
export async function signGuestbook(
  data: GuestbookSignature,
): Promise<GuestbookSignResult> {
  const live = await tryFetch<GuestbookSignResult>("/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (live) return live;
  console.info("[api offline] guestbook signature:", data);
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, pending: true };
}
