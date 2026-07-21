import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchNowPlaying, resetSpotifyTokenCache } from "../../lib/server/spotify";
import { getNowPlaying, resetNowPlayingCache } from "../../lib/server/now-playing";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function makeFetch(
  routes: Record<string, () => Response>,
): typeof fetch {
  return (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input.toString();
    if (url.startsWith(TOKEN_URL)) {
      return jsonResponse({ access_token: "test-token", expires_in: 3600 });
    }
    for (const [prefix, handler] of Object.entries(routes)) {
      if (url.startsWith(prefix)) return handler();
    }
    throw new Error(`Unexpected fetch: ${url}`);
  }) as unknown as typeof fetch;
}

const CURRENT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT = "https://api.spotify.com/v1/me/player/recently-played";

const playingPayload = {
  is_playing: true,
  item: {
    name: "Coram Deo",
    artists: [{ name: "Artist A" }, { name: "Artist B" }],
    album: {
      name: "Devotion",
      images: [{ url: "https://img/large.jpg" }, { url: "https://img/sm.jpg" }],
    },
    external_urls: { spotify: "https://open.spotify.com/track/1" },
  },
};

const recentPayload = {
  items: [
    {
      track: {
        name: "Old Song",
        artists: [{ name: "Solo" }],
        album: { name: "Past", images: [{ url: "https://img/old.jpg" }] },
        external_urls: { spotify: "https://open.spotify.com/track/2" },
      },
    },
  ],
};

test("shapes a currently-playing track", async () => {
  resetSpotifyTokenCache();
  const result = await fetchNowPlaying({
    fetchImpl: makeFetch({ [CURRENT]: () => jsonResponse(playingPayload) }),
  });
  assert.equal(result.isPlaying, true);
  if (result.isPlaying) {
    assert.equal(result.track.title, "Coram Deo");
    assert.equal(result.track.artist, "Artist A, Artist B");
    assert.equal(result.track.album, "Devotion");
    assert.equal(result.track.albumArtUrl, "https://img/large.jpg");
    assert.equal(result.track.songUrl, "https://open.spotify.com/track/1");
  }
});

test("falls back to recently-played on 204", async () => {
  resetSpotifyTokenCache();
  const result = await fetchNowPlaying({
    fetchImpl: makeFetch({
      [CURRENT]: () => new Response(null, { status: 204 }),
      [RECENT]: () => jsonResponse(recentPayload),
    }),
  });
  assert.equal(result.isPlaying, false);
  assert.equal(result.lastPlayed?.title, "Old Song");
});

test("respects 429 retry-after with a single retry", async () => {
  resetSpotifyTokenCache();
  let currentCalls = 0;
  const result = await fetchNowPlaying({
    fetchImpl: makeFetch({
      [CURRENT]: () => {
        currentCalls += 1;
        if (currentCalls === 1) {
          return new Response(null, {
            status: 429,
            headers: { "retry-after": "0" },
          });
        }
        return jsonResponse(playingPayload);
      },
    }),
    sleep: async () => {},
  });
  assert.equal(currentCalls, 2);
  assert.equal(result.isPlaying, true);
});

test("getNowPlaying returns a mock track when unconfigured", async () => {
  resetNowPlayingCache();
  const data = await getNowPlaying();
  assert.equal(data.isPlaying, true);
  assert.equal(data._mock, true);
  if (data.isPlaying) assert.ok(data.title.length > 0);
});

test("getNowPlaying caches within the TTL window", async () => {
  resetNowPlayingCache();
  let t = 0;
  const first = await getNowPlaying({ now: () => t });
  t = 5_000;
  const second = await getNowPlaying({ now: () => t });
  assert.strictEqual(first, second);
});
