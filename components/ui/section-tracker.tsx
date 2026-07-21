"use client";

import { useEffect, useRef } from "react";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

/**
 * Fires the SectionView analytics event once when its section first crosses
 * into view. Part of the success-metric instrumentation (brief section 10);
 * a no-op until PostHog env vars exist.
 */
export function SectionTracker({ id }: { id: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const section = el.closest("section");
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackEvent(AnalyticsEvents.SectionView, { section: id });
          observer.disconnect();
        }
      },
      { rootMargin: "-30% 0px -50% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [id]);

  return <span ref={ref} hidden aria-hidden />;
}
