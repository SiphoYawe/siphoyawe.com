import { isConfigured } from "./env";
import { durableLastPlayed, rememberTrack } from "./last-played";
import { fetchNowPlaying, type FetchDeps, type Track } from "./spotify";

export type NowPlayingResponse =
  | ({
      isPlaying: true;
      _mock?: true;
    } & Track)
  | {
      isPlaying: false;
      /** Always present: the section never renders an empty idle state. */
      lastPlayed: Track;
      _mock?: true;
    };

const CACHE_TTL_MS = 30_000;

type CacheEntry = { value: NowPlayingResponse; expiresAt: number };
let cache: CacheEntry | null = null;

export function resetNowPlayingCache(): void {
  cache = null;
}

const MOCK_TRACK: Track = {
  title: "Ffe Abaganda",
  artist: "Afrigo Band",
  album: "Best of Afrigo",
  albumArtUrl: "https://placehold.co/300x300/2B5DF2/FCDD09/png?text=Now+Playing",
  songUrl: "https://open.spotify.com/",
};

function mockResponse(): NowPlayingResponse {
  return { isPlaying: true, _mock: true, ...MOCK_TRACK };
}

export type NowPlayingDeps = FetchDeps & { now?: () => number };

export async function getNowPlaying(
  deps: NowPlayingDeps = {},
): Promise<NowPlayingResponse> {
  const now = deps.now ?? Date.now;

  if (cache && cache.expiresAt > now()) {
    return cache.value;
  }

  const value = isConfigured.spotify
    ? await resolveConfigured(deps)
    : mockResponse();

  cache = { value, expiresAt: now() + CACHE_TTL_MS };
  return value;
}

/**
 * Read order: live -> recently-played -> in-memory cache -> KV ->
 * FALLBACK_TRACK. A live or recently-played hit is remembered durably; any
 * miss (or a Spotify error) resolves to the durable last-played track so the
 * section always has something to render.
 */
async function resolveConfigured(
  deps: NowPlayingDeps,
): Promise<NowPlayingResponse> {
  try {
    const result = await fetchNowPlaying(deps);
    if (result.isPlaying) {
      await rememberTrack(result.track);
      return { isPlaying: true, ...result.track };
    }
    if (result.lastPlayed) {
      await rememberTrack(result.lastPlayed);
      return { isPlaying: false, lastPlayed: result.lastPlayed };
    }
  } catch (err) {
    console.error("[now-playing] Spotify fetch failed", err);
  }

  return { isPlaying: false, lastPlayed: await durableLastPlayed() };
}
