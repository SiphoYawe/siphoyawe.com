import { isConfigured } from "./env";
import { fetchNowPlaying, type FetchDeps, type Track } from "./spotify";

export type NowPlayingResponse =
  | ({
      isPlaying: true;
      _mock?: true;
    } & Track)
  | {
      isPlaying: false;
      lastPlayed?: Track;
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

  let value: NowPlayingResponse;

  if (!isConfigured.spotify) {
    value = mockResponse();
  } else {
    try {
      const result = await fetchNowPlaying(deps);
      value = result.isPlaying
        ? { isPlaying: true, ...result.track }
        : result.lastPlayed
          ? { isPlaying: false, lastPlayed: result.lastPlayed }
          : { isPlaying: false };
    } catch (err) {
      console.error("[now-playing] Spotify fetch failed", err);
      value = { isPlaying: false };
    }
  }

  cache = { value, expiresAt: now() + CACHE_TTL_MS };
  return value;
}
