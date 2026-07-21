import { test } from "node:test";
import assert from "node:assert/strict";
import { screenMessage } from "../../lib/server/moderation";

test("passes a normal message", () => {
  assert.equal(screenMessage("Loved the talk, thank you!").ok, true);
});

test("passes a message with one link", () => {
  assert.equal(
    screenMessage("Check my project at https://example.com").ok,
    true,
  );
});

test("rejects URL spam (more than two links)", () => {
  const result = screenMessage(
    "http://a.com http://b.com http://c.com http://d.com",
  );
  assert.equal(result.ok, false);
});

test("rejects blocklisted content", () => {
  assert.equal(screenMessage("cheap viagra here").ok, false);
});

test("does not trip on embedded terms (Scunthorpe)", () => {
  assert.equal(screenMessage("Greetings from Scunthorpe!").ok, true);
  assert.equal(screenMessage("I love pornography-free feeds").ok, true);
});
