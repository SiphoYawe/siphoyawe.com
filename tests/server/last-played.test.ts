import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FALLBACK_TRACK,
  durableLastPlayed,
  getMemoryTrack,
  rememberTrack,
  resetLastPlayedMemory,
} from "../../lib/server/last-played";

const SAMPLE = {
  title: "Coram Deo",
  artist: "Solo",
  album: "Devotion",
  albumArtUrl: "https://img/large.jpg",
  songUrl: "https://open.spotify.com/track/1",
};

test("durableLastPlayed returns FALLBACK_TRACK when nothing is remembered", async () => {
  resetLastPlayedMemory();
  const track = await durableLastPlayed();
  assert.deepEqual(track, FALLBACK_TRACK);
  assert.equal(track.title, "Gethsemane (Live)");
  assert.equal(track.artist, "Worship Culture Collective");
  assert.ok(track.songUrl.startsWith("https://open.spotify.com/"));
});

test("rememberTrack surfaces the last track from durable memory", async () => {
  resetLastPlayedMemory();
  await rememberTrack(SAMPLE);
  assert.deepEqual(getMemoryTrack(), SAMPLE);
  assert.deepEqual(await durableLastPlayed(), SAMPLE);
});

test("resetLastPlayedMemory clears back to the fallback", async () => {
  resetLastPlayedMemory();
  await rememberTrack(SAMPLE);
  resetLastPlayedMemory();
  assert.equal(getMemoryTrack(), null);
  assert.deepEqual(await durableLastPlayed(), FALLBACK_TRACK);
});
