/**
 * Analytics seam. PostHog is the tool (brief section 10) and Claude finishes
 * the wiring; every call site in the UI already fires through `trackEvent`,
 * so instrumentation is a config change, not a refactor.
 *
 * Events that matter (the success metric): outbound social clicks, cal.com
 * bookings, speaking-form submits, guestbook signs, section views.
 */

export const AnalyticsEvents = {
  OutboundClick: "outbound_click",
  CalcomClick: "calcom_click",
  SpeakingSubmit: "speaking_submit",
  GuestbookSign: "guestbook_sign",
  SectionView: "section_view",
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

type PostHogLike = { capture: (event: string, props?: object) => void };
let posthog: PostHogLike | null = null;
let initAttempted = false;

async function getPostHog(): Promise<PostHogLike | null> {
  if (posthog || initAttempted) return posthog;
  initAttempted = true;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || typeof window === "undefined") return null;
  try {
    const { default: posthogJs } = await import("posthog-js");
    posthogJs.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
    });
    posthog = posthogJs;
  } catch {
    posthog = null;
  }
  return posthog;
}

/** Fire-and-forget. No-ops quietly until PostHog env vars are set. */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  void getPostHog().then((ph) => ph?.capture(event, properties));
}
