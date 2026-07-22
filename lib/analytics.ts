/**
 * Client-side analytics (posthog-js). Event names and property shapes are
 * the frozen taxonomy from the backend (lib/server/analytics.ts
 * CLIENT_EVENTS); the two sides must never drift. Success metric: outbound
 * clicks, cal bookings, speaking-form submits.
 *
 * No-ops quietly until NEXT_PUBLIC_POSTHOG_KEY is set (PostHog EU host).
 */

export const AnalyticsEvents = {
  OutboundLink: "outbound_link_clicked",
  CalBooking: "cal_booking_opened",
  SpeakingSubmit: "speaking_form_submitted",
  GuestbookSign: "guestbook_entry_submitted",
  NewsletterSubscribe: "newsletter_subscribed",
  SectionView: "section_viewed",
  EasterEgg: "easter_egg_found",
  LanguageToggle: "language_toggled",
  ThemeToggle: "theme_toggled",
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

type EventProperties =
  | { destination: string }
  | { section: string }
  | { egg: string }
  | { lang: string }
  | { theme: string }
  | Record<string, never>;

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
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
    });
    posthog = posthogJs;
  } catch {
    posthog = null;
  }
  return posthog;
}

/** Fire-and-forget. Claude's route handlers also confirm submits server-side;
 * the client events capture intent. */
export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  void getPostHog().then((ph) => ph?.capture(event, properties));
}
