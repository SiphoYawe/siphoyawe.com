import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryStore } from "../../lib/server/db";
import {
  createGuestbookEntry,
  listGuestbook,
  listPendingGuestbook,
  moderateGuestbook,
} from "../../lib/server/guestbook";
import { InMemoryRateLimiter } from "../../lib/server/rate-limit";

function freshLimiter() {
  return new InMemoryRateLimiter(5, 60_000);
}

test("in-memory store seeds approved entries", async () => {
  const store = new InMemoryStore(true);
  const approved = await store.listApproved(100);
  assert.ok(approved.length >= 3);
  assert.equal(approved[0]?._mock, true);
});

test("insert creates a pending entry, hidden until approved", async () => {
  const store = new InMemoryStore(false);
  const { id } = await store.insert({
    name: "Test",
    message: "hi there",
    ipHash: "abc",
  });

  assert.equal((await store.listApproved(100)).length, 0);
  const pending = await store.listPending(100);
  assert.equal(pending.length, 1);
  assert.equal(pending[0]?.id, id);

  const changed = await store.moderate(id, true);
  assert.equal(changed, true);

  const approved = await store.listApproved(100);
  assert.equal(approved.length, 1);
  assert.equal(approved[0]?.id, id);
});

test("moderate reject removes the entry", async () => {
  const store = new InMemoryStore(false);
  const { id } = await store.insert({ name: "x", message: "y", ipHash: null });
  assert.equal(await store.moderate(id, false), true);
  assert.equal((await store.listPending(100)).length, 0);
});

test("moderate on unknown id returns false", async () => {
  const store = new InMemoryStore(false);
  assert.equal(
    await store.moderate("00000000-0000-0000-0000-000000000000", true),
    false,
  );
});

test("createGuestbookEntry returns pending and stores entry", async () => {
  const store = new InMemoryStore(false);
  const result = await createGuestbookEntry(
    { name: "Grace", message: "Beautiful site", website: "" },
    "9.9.9.9",
    { store, rateLimiter: freshLimiter() },
  );
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { ok: true, pending: true });
  assert.equal((await store.listPending(100)).length, 1);
});

test("createGuestbookEntry silently drops honeypot hits", async () => {
  const store = new InMemoryStore(false);
  const result = await createGuestbookEntry(
    { name: "Bot", message: "spam", website: "http://spam.example" },
    "9.9.9.9",
    { store, rateLimiter: freshLimiter() },
  );
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { ok: true, pending: true });
  assert.equal((await store.listPending(100)).length, 0);
});

test("createGuestbookEntry rejects invalid input", async () => {
  const store = new InMemoryStore(false);
  const result = await createGuestbookEntry(
    { name: "", message: "" },
    "9.9.9.9",
    { store, rateLimiter: freshLimiter() },
  );
  assert.equal(result.status, 400);
  assert.equal((result.body as { ok: boolean }).ok, false);
});

test("createGuestbookEntry enforces rate limit", async () => {
  const store = new InMemoryStore(false);
  const rateLimiter = new InMemoryRateLimiter(1, 60_000);
  const body = { name: "Grace", message: "hello there", website: "" };
  await createGuestbookEntry(body, "5.5.5.5", { store, rateLimiter });
  const second = await createGuestbookEntry(body, "5.5.5.5", {
    store,
    rateLimiter,
  });
  assert.equal(second.status, 429);
});

test("createGuestbookEntry silently drops spam-screen hits", async () => {
  const store = new InMemoryStore(false);
  const result = await createGuestbookEntry(
    { name: "Spam", message: "buy viagra now", website: "" },
    "9.9.9.9",
    { store, rateLimiter: freshLimiter() },
  );
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { ok: true, pending: true });
  assert.equal((await store.listPending(100)).length, 0);
});

test("moderation endpoints 404 when no token is configured", async () => {
  const store = new InMemoryStore(false);
  const list = await listPendingGuestbook("anything", { store });
  assert.equal(list.status, 404);
  const mod = await moderateGuestbook(
    {
      token: "anything",
      id: "00000000-0000-0000-0000-000000000000",
      action: "approve",
    },
    { store },
  );
  assert.equal(mod.status, 404);
});

test("listGuestbook returns only approved entries", async () => {
  const store = new InMemoryStore(false);
  await store.insert({ name: "Pending", message: "wait", ipHash: null });
  const result = await listGuestbook({ store });
  assert.deepEqual(result.body, { entries: [] });
});
