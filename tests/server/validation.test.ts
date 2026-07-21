import { test } from "node:test";
import assert from "node:assert/strict";
import {
  guestbookSchema,
  honeypotTripped,
  speakingSchema,
} from "../../lib/server/validation";

test("speaking schema accepts a valid submission", () => {
  const result = speakingSchema.safeParse({
    name: "Ada Lovelace",
    email: "ada@example.com",
    org: "Analytical Engines",
    eventName: "DeFi Summit",
    message: "We would love to have you speak about tokenisation.",
    website: "",
  });
  assert.equal(result.success, true);
});

test("speaking schema rejects short message", () => {
  const result = speakingSchema.safeParse({
    name: "Ada",
    email: "ada@example.com",
    message: "hi",
  });
  assert.equal(result.success, false);
});

test("speaking schema rejects bad email", () => {
  const result = speakingSchema.safeParse({
    name: "Ada",
    email: "not-an-email",
    message: "A perfectly long enough message here.",
  });
  assert.equal(result.success, false);
});

test("honeypot detection", () => {
  assert.equal(honeypotTripped(""), false);
  assert.equal(honeypotTripped(undefined), false);
  assert.equal(honeypotTripped("http://spam"), true);
});

test("guestbook schema accepts valid entry", () => {
  const result = guestbookSchema.safeParse({
    name: "Musa",
    message: "Great work!",
    website: "",
  });
  assert.equal(result.success, true);
});

test("guestbook schema rejects overlong name", () => {
  const result = guestbookSchema.safeParse({
    name: "x".repeat(51),
    message: "hi",
  });
  assert.equal(result.success, false);
});

test("guestbook schema rejects empty message", () => {
  const result = guestbookSchema.safeParse({ name: "Musa", message: "" });
  assert.equal(result.success, false);
});
