import { getNewsletterStore, type NewsletterStore } from "./db";
import { newsletterRateLimiter, type RateLimiter } from "./rate-limit";
import { firstError, honeypotTripped, newsletterSchema } from "./validation";
import type { ServiceResponse } from "./http";

export type NewsletterDeps = {
  store?: NewsletterStore;
  rateLimiter?: RateLimiter;
};

/**
 * Subscribe an email to the newsletter (and, for gated posts, unlock the
 * download). Honeypot hits get a silent success; the address is lower-cased and
 * de-duplicated at the store. Never throws to the caller.
 */
export async function createSubscriber(
  raw: unknown,
  ip: string,
  deps: NewsletterDeps = {},
): Promise<ServiceResponse> {
  const store = deps.store ?? getNewsletterStore();
  const rateLimiter = deps.rateLimiter ?? newsletterRateLimiter;

  if (raw === null || typeof raw !== "object") {
    return { status: 400, body: { ok: false, error: "Invalid JSON body" } };
  }

  if (honeypotTripped((raw as Record<string, unknown>).website)) {
    return { status: 200, body: { ok: true, subscribed: true } };
  }

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: firstError(parsed.error) } };
  }
  const input = parsed.data;

  const limit = await rateLimiter.check(`newsletter:${ip}`);
  if (!limit.allowed) {
    return {
      status: 429,
      body: { ok: false, error: "Too many requests. Try again later." },
      headers: { "retry-after": String(limit.retryAfterSeconds) },
    };
  }

  const email = input.email.toLowerCase();
  const { isNew } = await store.subscribe(email, input.source ?? null);

  return { status: 200, body: { ok: true, subscribed: true, isNew } };
}
