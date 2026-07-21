"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileProps = {
  onToken: (token: string | null) => void;
  className?: string;
};

/**
 * Cloudflare Turnstile gate for the two forms. Renders the real widget when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY exists; until then a dashed placeholder box
 * (the backend skips verification while TURNSTILE_SECRET_KEY is unset, so dev
 * works end to end with no keys).
 */
export function Turnstile({ onToken, className = "" }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return;
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      const id = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(id);
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!SITE_KEY || !ready || !containerRef.current || !window.turnstile) return;
    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme: "auto",
      size: "compact",
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });
    return () => {
      // Reset the live widget before React tears the container down; nulling the
      // ref first would strand the widget with no node to reset against.
      window.turnstile?.reset(widgetId);
    };
  }, [ready, onToken]);

  if (!SITE_KEY) {
    return (
      <div
        data-turnstile-placeholder
        className={`rounded-xl border border-dashed border-line px-4 py-3 text-center text-xs text-ink-soft ${className}`}
      >
        turnstile lands here (site key goes in NEXT_PUBLIC_TURNSTILE_SITE_KEY)
      </div>
    );
  }

  return <div ref={containerRef} className={className} aria-label="Spam check" />;
}
