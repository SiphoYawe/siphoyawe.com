import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryNewsletterStore } from "../../lib/server/db";
import { createSubscriber } from "../../lib/server/newsletter";
import { InMemoryRateLimiter } from "../../lib/server/rate-limit";

function limiter() {
  return new InMemoryRateLimiter(5, 60_000);
}

/** Records who got notified so tests can assert the email side effect without
 * touching Resend. */
function spyNotifier() {
  const calls: { email: string; source?: string | null }[] = [];
  return {
    calls,
    notify: async (entry: { email: string; source?: string | null }) => {
      calls.push(entry);
      return { ok: true as const };
    },
  };
}

test("createSubscriber stores a valid email", async () => {
  const store = new InMemoryNewsletterStore();
  const spy = spyNotifier();
  const result = await createSubscriber(
    { email: "grace@example.com", website: "" },
    "1.1.1.1",
    { store, rateLimiter: limiter(), notify: spy.notify },
  );
  assert.equal(result.status, 200);
  const body = result.body as { ok: boolean; subscribed: boolean; isNew: boolean };
  assert.equal(body.ok, true);
  assert.equal(body.subscribed, true);
  assert.equal(body.isNew, true);
});

test("createSubscriber de-duplicates (case-insensitive)", async () => {
  const store = new InMemoryNewsletterStore();
  const rl = limiter();
  const spy = spyNotifier();
  await createSubscriber({ email: "grace@example.com", website: "" }, "1.1.1.1", { store, rateLimiter: rl, notify: spy.notify });
  const again = await createSubscriber({ email: "GRACE@example.com", website: "" }, "1.1.1.1", { store, rateLimiter: rl, notify: spy.notify });
  assert.equal((again.body as { isNew: boolean }).isNew, false);
});

test("createSubscriber emails Sipho on a new subscriber, with the source", async () => {
  const store = new InMemoryNewsletterStore();
  const spy = spyNotifier();
  await createSubscriber(
    { email: "grace@example.com", source: "/essays/ai-future-of-mankind.pdf", website: "" },
    "1.1.1.1",
    { store, rateLimiter: limiter(), notify: spy.notify },
  );
  assert.equal(spy.calls.length, 1);
  assert.equal(spy.calls[0].email, "grace@example.com");
  assert.equal(spy.calls[0].source, "/essays/ai-future-of-mankind.pdf");
});

test("createSubscriber does not email on a duplicate subscribe", async () => {
  const store = new InMemoryNewsletterStore();
  const rl = limiter();
  const spy = spyNotifier();
  await createSubscriber({ email: "grace@example.com", website: "" }, "1.1.1.1", { store, rateLimiter: rl, notify: spy.notify });
  await createSubscriber({ email: "grace@example.com", website: "" }, "1.1.1.1", { store, rateLimiter: rl, notify: spy.notify });
  assert.equal(spy.calls.length, 1);
});

test("createSubscriber does not email on a honeypot hit", async () => {
  const store = new InMemoryNewsletterStore();
  const spy = spyNotifier();
  await createSubscriber(
    { email: "bot@example.com", website: "http://spam.example" },
    "1.1.1.1",
    { store, rateLimiter: limiter(), notify: spy.notify },
  );
  assert.equal(spy.calls.length, 0);
});

test("createSubscriber silently drops honeypot hits", async () => {
  const store = new InMemoryNewsletterStore();
  const result = await createSubscriber(
    { email: "bot@example.com", website: "http://spam.example" },
    "1.1.1.1",
    { store, rateLimiter: limiter() },
  );
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { ok: true, subscribed: true });
});

test("createSubscriber rejects an invalid email", async () => {
  const store = new InMemoryNewsletterStore();
  const result = await createSubscriber(
    { email: "not-an-email", website: "" },
    "1.1.1.1",
    { store, rateLimiter: limiter() },
  );
  assert.equal(result.status, 400);
  assert.equal((result.body as { ok: boolean }).ok, false);
});

test("createSubscriber enforces the rate limit", async () => {
  const store = new InMemoryNewsletterStore();
  const rl = new InMemoryRateLimiter(1, 60_000);
  await createSubscriber({ email: "a@example.com", website: "" }, "5.5.5.5", { store, rateLimiter: rl });
  const second = await createSubscriber({ email: "b@example.com", website: "" }, "5.5.5.5", { store, rateLimiter: rl });
  assert.equal(second.status, 429);
});
