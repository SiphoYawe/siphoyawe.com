import { captureServerEvent } from "./analytics";
import { hashIp } from "./db";
import { sendSpeakingEmail } from "./email";
import type { ServiceResponse } from "./http";
import { speakingRateLimiter, type RateLimiter } from "./rate-limit";
import {
  firstError,
  honeypotTripped,
  speakingSchema,
} from "./validation";

export type { ServiceResponse } from "./http";

export type SpeakingDeps = {
  rateLimiter?: RateLimiter;
  send?: typeof sendSpeakingEmail;
  capture?: typeof captureServerEvent;
};

export async function handleSpeaking(
  raw: unknown,
  ip: string,
  deps: SpeakingDeps = {},
): Promise<ServiceResponse> {
  const rateLimiter = deps.rateLimiter ?? speakingRateLimiter;
  const send = deps.send ?? sendSpeakingEmail;
  const capture = deps.capture ?? captureServerEvent;

  if (raw === null || typeof raw !== "object") {
    return { status: 400, body: { ok: false, error: "Invalid JSON body" } };
  }

  // Honeypot: silently accept so bots don't learn they were caught.
  if (honeypotTripped((raw as Record<string, unknown>).website)) {
    console.warn("[speaking] honeypot tripped — dropping submission from", ip);
    return { status: 200, body: { ok: true } };
  }

  const parsed = speakingSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: firstError(parsed.error) } };
  }
  const input = parsed.data;

  const limit = await rateLimiter.check(`speaking:${ip}`);
  if (!limit.allowed) {
    return {
      status: 429,
      body: { ok: false, error: "Too many requests. Try again later." },
      headers: { "retry-after": String(limit.retryAfterSeconds) },
    };
  }

  const sent = await send(input);
  if (!sent.ok) {
    return { status: 502, body: { ok: false, error: sent.error } };
  }

  await capture(hashIp(ip), "speaking_form_submitted", {
    org: input.org,
    eventName: input.eventName,
  });

  return { status: 200, body: { ok: true } };
}
