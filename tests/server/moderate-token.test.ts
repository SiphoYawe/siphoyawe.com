import { test } from "node:test";
import assert from "node:assert/strict";

// Configure the moderation token BEFORE importing (env is read at import time;
// each test file runs in its own process under `node --test`).
process.env.GUESTBOOK_MODERATION_TOKEN = "super-secret-moderation-token";

const { listPendingGuestbook, moderateGuestbook } = await import(
  "../../lib/server/guestbook"
);
const { InMemoryStore } = await import("../../lib/server/db");

test("listPending returns 404 on missing or wrong token", async () => {
  const store = new InMemoryStore(false);
  assert.equal((await listPendingGuestbook(null, { store })).status, 404);
  assert.equal((await listPendingGuestbook("", { store })).status, 404);
  assert.equal(
    (await listPendingGuestbook("wrong-token", { store })).status,
    404,
  );
  // Same length as the real token, different content (timingSafeEqual path).
  assert.equal(
    (
      await listPendingGuestbook("super-secret-moderation-tokeX", { store })
    ).status,
    404,
  );
});

test("listPending returns pending entries with the correct token", async () => {
  const store = new InMemoryStore(false);
  await store.insert({ name: "P", message: "waiting", ipHash: null });
  const result = await listPendingGuestbook(
    "super-secret-moderation-token",
    { store },
  );
  assert.equal(result.status, 200);
  assert.equal((result.body.entries as unknown[]).length, 1);
});

test("moderate returns 404 on wrong token and works with the right one", async () => {
  const store = new InMemoryStore(false);
  const { id } = await store.insert({ name: "P", message: "hi", ipHash: null });

  const denied = await moderateGuestbook(
    { token: "wrong", id, action: "approve" },
    { store },
  );
  assert.equal(denied.status, 404);

  const approved = await moderateGuestbook(
    { token: "super-secret-moderation-token", id, action: "approve" },
    { store },
  );
  assert.equal(approved.status, 200);
  assert.equal((await store.listApproved(10)).length, 1);
});
