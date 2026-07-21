import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyTurnstile } from "../../lib/server/turnstile";

test("skips verification (returns true) when unconfigured", async () => {
  // No TURNSTILE_SECRET_KEY in the test env — should short-circuit to true
  // without touching the network.
  let called = false;
  const fakeFetch = (async () => {
    called = true;
    return new Response("{}");
  }) as unknown as typeof fetch;

  const result = await verifyTurnstile("any-token", "1.2.3.4", fakeFetch);
  assert.equal(result, true);
  assert.equal(called, false);
});
