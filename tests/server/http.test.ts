import { test } from "node:test";
import assert from "node:assert/strict";
import { clientIp } from "../../lib/server/http";

test("ignores spoofed leftmost x-forwarded-for entry", () => {
  const headers = new Headers({
    "x-forwarded-for": "6.6.6.6, 203.0.113.7",
  });
  assert.equal(clientIp(headers), "203.0.113.7");
});

test("prefers x-vercel-forwarded-for over x-forwarded-for", () => {
  const headers = new Headers({
    "x-vercel-forwarded-for": "198.51.100.9",
    "x-forwarded-for": "6.6.6.6, 203.0.113.7",
  });
  assert.equal(clientIp(headers), "198.51.100.9");
});

test("falls back to x-real-ip, then localhost", () => {
  assert.equal(
    clientIp(new Headers({ "x-real-ip": "192.0.2.4" })),
    "192.0.2.4",
  );
  assert.equal(clientIp(new Headers()), "127.0.0.1");
});
