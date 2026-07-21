import { test } from "node:test";
import assert from "node:assert/strict";

// Env is read at import time, so configure the process env BEFORE the dynamic
// import. Each test file runs in its own process under `node --test`.
process.env.SPOTIFY_CLIENT_ID = "client-id";
process.env.SPOTIFY_CLIENT_SECRET = "client-secret";
process.env.SPOTIFY_REFRESH_TOKEN = "refresh-token";
process.env.RESEND_API_KEY = "re_test";
process.env.SPEAKING_TO_EMAIL = "not-an-email";

const { isConfigured, env } = await import("../../lib/server/env");

test("a malformed var only disables its own surface", () => {
  // SPEAKING_TO_EMAIL is invalid — resend must be off...
  assert.equal(isConfigured.resend, false);
  assert.equal(env.resend.toEmail, undefined);
  // ...but Spotify config must survive untouched.
  assert.equal(isConfigured.spotify, true);
  assert.equal(env.spotify.clientId, "client-id");
});

test("defaults still apply alongside partial config", () => {
  assert.equal(env.posthog.host, "https://eu.posthog.com");
  assert.equal(env.resend.fromEmail, "speaking@siphoyawe.com");
});
