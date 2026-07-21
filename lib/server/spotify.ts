import { env } from "./env";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const CURRENTLY_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

const TOKEN_SAFETY_MARGIN_MS = 60_000;

export type Track = {
  title: string;
  artist: string;
  album: string;
  albumArtUrl: string;
  songUrl: string;
};

type SpotifyImage = { url: string };
type SpotifyArtist = { name: string };
type SpotifyItem = {
  name?: string;
  artists?: SpotifyArtist[];
  album?: { name?: string; images?: SpotifyImage[] };
  external_urls?: { spotify?: string };
};
type CurrentlyPlaying = { is_playing?: boolean; item?: SpotifyItem | null };
type RecentlyPlayed = { items?: { track?: SpotifyItem }[] };

type CachedToken = { accessToken: string; expiresAt: number };
let cachedToken: CachedToken | null = null;

export function resetSpotifyTokenCache(): void {
  cachedToken = null;
}

function basicAuthHeader(): string {
  const raw = `${env.spotify.clientId}:${env.spotify.clientSecret}`;
  return `Basic ${Buffer.from(raw).toString("base64")}`;
}

async function getAccessToken(
  fetchImpl: typeof fetch,
  now: () => number,
): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > now()) {
    return cachedToken.accessToken;
  }

  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("refresh_token", env.spotify.refreshToken ?? "");

  const res = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: {
      authorization: basicAuthHeader(),
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Spotify token exchange failed (${res.status})`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: now() + data.expires_in * 1000 - TOKEN_SAFETY_MARGIN_MS,
  };

  return cachedToken.accessToken;
}

function shapeTrack(item: SpotifyItem | null | undefined): Track | null {
  if (!item || !item.name) return null;
  return {
    title: item.name,
    artist: (item.artists ?? []).map((a) => a.name).join(", "),
    album: item.album?.name ?? "",
    albumArtUrl: item.album?.images?.[0]?.url ?? "",
    songUrl: item.external_urls?.spotify ?? "",
  };
}

async function spotifyGet(
  url: string,
  token: string,
  fetchImpl: typeof fetch,
): Promise<Response> {
  return fetchImpl(url, {
    headers: { authorization: `Bearer ${token}` },
  });
}

async function withRetryOn429(
  attempt: () => Promise<Response>,
  sleep: (ms: number) => Promise<void>,
): Promise<Response> {
  const first = await attempt();
  if (first.status !== 429) return first;

  const retryAfter = Number(first.headers.get("retry-after") ?? "1");
  const waitMs = Math.min(Math.max(retryAfter, 0), 10) * 1000;
  await sleep(waitMs);
  return attempt();
}

export type SpotifyResult =
  | { isPlaying: true; track: Track }
  | { isPlaying: false; lastPlayed?: Track };

export type FetchDeps = {
  fetchImpl?: typeof fetch;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
};

export async function fetchNowPlaying(
  deps: FetchDeps = {},
): Promise<SpotifyResult> {
  const fetchImpl = deps.fetchImpl ?? globalThis.fetch;
  const now = deps.now ?? Date.now;
  const sleep =
    deps.sleep ?? ((ms: number) => new Promise((r) => setTimeout(r, ms)));

  const token = await getAccessToken(fetchImpl, now);

  const current = await withRetryOn429(
    () => spotifyGet(CURRENTLY_PLAYING_URL, token, fetchImpl),
    sleep,
  );

  if (current.status === 200) {
    const data = (await current.json()) as CurrentlyPlaying;
    const track = shapeTrack(data.item);
    if (data.is_playing && track) {
      return { isPlaying: true, track };
    }
  } else if (current.status !== 204) {
    throw new Error(`Spotify currently-playing failed (${current.status})`);
  }

  // Nothing playing (204 or paused) — fall back to recently played.
  const recent = await withRetryOn429(
    () => spotifyGet(RECENTLY_PLAYED_URL, token, fetchImpl),
    sleep,
  );

  if (recent.status === 200) {
    const data = (await recent.json()) as RecentlyPlayed;
    const track = shapeTrack(data.items?.[0]?.track);
    if (track) return { isPlaying: false, lastPlayed: track };
  }

  return { isPlaying: false };
}
