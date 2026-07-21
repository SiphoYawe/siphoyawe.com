import { PostHog } from "posthog-node";
import { env, isConfigured } from "./env";

/**
 * Canonical CLIENT-SIDE event taxonomy.
 *
 * Documented here so Kimi's frontend and this backend agree on names. These
 * events are captured in the browser with posthog-js; the shapes below are the
 * source of truth for their `properties`.
 */
export const CLIENT_EVENTS = {
  outbound_link_clicked: {} as { destination: string },
  cal_booking_opened: {} as Record<string, never>,
  speaking_form_submitted: {} as Record<string, never>,
  guestbook_entry_submitted: {} as Record<string, never>,
  section_viewed: {} as { section: string },
  easter_egg_found: {} as { egg: string },
  language_toggled: {} as { lang: string },
  theme_toggled: {} as { theme: string },
} as const;

export type ClientEventName = keyof typeof CLIENT_EVENTS;

/** Server-side events emitted by the route handlers in this package. */
export type ServerEventName =
  | "speaking_form_submitted"
  | "guestbook_entry_submitted"
  | "now_playing_fetched";

let client: PostHog | null = null;

function getClient(): PostHog | null {
  if (!isConfigured.posthog || !env.posthog.apiKey) return null;
  if (!client) {
    client = new PostHog(env.posthog.apiKey, {
      host: env.posthog.host,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

export async function captureServerEvent(
  distinctId: string,
  event: ServerEventName,
  properties: Record<string, unknown> = {},
): Promise<void> {
  const ph = getClient();
  if (!ph) {
    console.info(`[analytics] (no-op) ${event}`, properties);
    return;
  }
  ph.capture({ distinctId, event, properties });
  try {
    await ph.flush();
  } catch (err) {
    console.error("[analytics] flush failed", err);
  }
}

/**
 * Capture `now_playing_fetched` sampled 1-in-10 to keep event volume sane.
 */
export async function captureNowPlayingSampled(
  distinctId: string,
  properties: Record<string, unknown> = {},
  random: () => number = Math.random,
): Promise<void> {
  if (random() >= 0.1) return;
  await captureServerEvent(distinctId, "now_playing_fetched", properties);
}

/** Flush and close the client. Safe to call when unconfigured. */
export async function shutdownAnalytics(): Promise<void> {
  if (!client) return;
  try {
    await client.shutdown();
  } catch (err) {
    console.error("[analytics] shutdown failed", err);
  }
}
