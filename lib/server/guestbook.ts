import { timingSafeEqual } from "node:crypto";
import { captureServerEvent } from "./analytics";
import {
  getGuestbookStore,
  hashIp,
  type GuestbookStore,
} from "./db";
import { env, isConfigured } from "./env";
import { screenMessage } from "./moderation";
import { guestbookRateLimiter, type RateLimiter } from "./rate-limit";
import { verifyTurnstile } from "./turnstile";
import {
  firstError,
  guestbookSchema,
  honeypotTripped,
  moderateActionSchema,
} from "./validation";
import type { ServiceResponse } from "./http";

const READ_LIMIT = 100;
const PENDING_LIMIT = 100;

export type GuestbookDeps = {
  store?: GuestbookStore;
  rateLimiter?: RateLimiter;
  verify?: typeof verifyTurnstile;
  capture?: typeof captureServerEvent;
};

export async function listGuestbook(
  deps: GuestbookDeps = {},
): Promise<ServiceResponse> {
  const store = deps.store ?? getGuestbookStore();
  const entries = await store.listApproved(READ_LIMIT);
  return { status: 200, body: { entries } };
}

export async function createGuestbookEntry(
  raw: unknown,
  ip: string,
  deps: GuestbookDeps = {},
): Promise<ServiceResponse> {
  const store = deps.store ?? getGuestbookStore();
  const rateLimiter = deps.rateLimiter ?? guestbookRateLimiter;
  const verify = deps.verify ?? verifyTurnstile;
  const capture = deps.capture ?? captureServerEvent;

  if (raw === null || typeof raw !== "object") {
    return { status: 400, body: { ok: false, error: "Invalid JSON body" } };
  }

  if (honeypotTripped((raw as Record<string, unknown>).website)) {
    console.warn("[guestbook] honeypot tripped — dropping entry from", ip);
    return { status: 200, body: { ok: true, pending: true } };
  }

  const parsed = guestbookSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: firstError(parsed.error) } };
  }
  const input = parsed.data;

  const limit = await rateLimiter.check(`guestbook:${ip}`);
  if (!limit.allowed) {
    return {
      status: 429,
      body: { ok: false, error: "Too many requests. Try again later." },
      headers: { "retry-after": String(limit.retryAfterSeconds) },
    };
  }

  const human = await verify(input.turnstileToken, ip);
  if (!human) {
    return { status: 400, body: { ok: false, error: "Verification failed" } };
  }

  // Spam screen: same silent-accept shape as the honeypot so spammers can't
  // A/B test against the blocklist.
  const screen = screenMessage(input.message);
  if (!screen.ok) {
    console.warn(
      `[guestbook] spam screen hit (${screen.reason}) — dropping entry from`,
      ip,
    );
    return { status: 200, body: { ok: true, pending: true } };
  }

  await store.insert({
    name: input.name,
    message: input.message,
    ipHash: hashIp(ip),
  });

  await capture(hashIp(ip), "guestbook_entry_submitted", {});

  return { status: 200, body: { ok: true, pending: true } };
}

function tokenMatches(provided: string | null | undefined): boolean {
  if (!isConfigured.guestbookModeration || !env.guestbook.moderationToken) {
    return false;
  }
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(env.guestbook.moderationToken);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function listPendingGuestbook(
  token: string | null | undefined,
  deps: GuestbookDeps = {},
): Promise<ServiceResponse> {
  if (!tokenMatches(token)) {
    return { status: 404, body: { ok: false, error: "Not found" } };
  }
  const store = deps.store ?? getGuestbookStore();
  const entries = await store.listPending(PENDING_LIMIT);
  return { status: 200, body: { entries } };
}

export async function moderateGuestbook(
  raw: unknown,
  deps: GuestbookDeps = {},
): Promise<ServiceResponse> {
  const providedToken =
    raw !== null && typeof raw === "object"
      ? ((raw as Record<string, unknown>).token as string | undefined)
      : undefined;

  if (!tokenMatches(providedToken)) {
    return { status: 404, body: { ok: false, error: "Not found" } };
  }

  const parsed = moderateActionSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: firstError(parsed.error) } };
  }
  const { id, action } = parsed.data;

  const store = deps.store ?? getGuestbookStore();
  const changed = await store.moderate(id, action === "approve");
  if (!changed) {
    return { status: 404, body: { ok: false, error: "Entry not found" } };
  }
  return { status: 200, body: { ok: true, id, action } };
}
