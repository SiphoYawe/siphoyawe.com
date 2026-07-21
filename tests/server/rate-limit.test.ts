import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryRateLimiter } from "../../lib/server/rate-limit";

test("allows up to the limit then blocks", async () => {
  const now = 1000;
  const limiter = new InMemoryRateLimiter(2, 10_000, () => now);

  const a = await limiter.check("ip");
  const b = await limiter.check("ip");
  const c = await limiter.check("ip");

  assert.equal(a.allowed, true);
  assert.equal(b.allowed, true);
  assert.equal(c.allowed, false);
  assert.ok(c.retryAfterSeconds > 0);
});

test("window slides forward and re-allows", async () => {
  let now = 1000;
  const limiter = new InMemoryRateLimiter(1, 10_000, () => now);

  assert.equal((await limiter.check("ip")).allowed, true);
  assert.equal((await limiter.check("ip")).allowed, false);

  now += 10_001;
  assert.equal((await limiter.check("ip")).allowed, true);
});

test("separate keys are independent", async () => {
  const limiter = new InMemoryRateLimiter(1, 10_000);
  assert.equal((await limiter.check("a")).allowed, true);
  assert.equal((await limiter.check("b")).allowed, true);
  assert.equal((await limiter.check("a")).allowed, false);
});
