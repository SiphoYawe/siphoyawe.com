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
          "error-callback"?: (code?: string) => void;
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
  const [errored, setErrored] = useState(false);
  const [attempt, setAttempt] = useState(0);

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
    script.onerror = () => setErrored(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!SITE_KEY || !ready || !containerRef.current || !window.turnstile) return;
    const el = containerRef.current;
    el.innerHTML = ""; // clear any prior widget before a retry re-render
    let widgetId: string | undefined;
    try {
      widgetId = window.turnstile.render(el, {
        sitekey: SITE_KEY,
        theme: "auto",
        size: "compact",
        callback: (token) => {
          setErrored(false);
          onToken(token);
        },
        "expired-callback": () => onToken(null),
        "error-callback": (code) => {
          // Log the code for diagnosis (often a hostname-allowlist mismatch).
          console.debug("[turnstile] error-callback", code);
          onToken(null);
          setErrored(true);
        },
      });
    } catch (err) {
      console.debug("[turnstile] render failed", err);
      setErrored(true);
    }
    return () => {
      // Reset the live widget before React tears the container down; nulling the
      // ref first would strand the widget with no node to reset against.
      if (widgetId) {
        try {
          window.turnstile?.reset(widgetId);
        } catch {
          /* widget already gone */
        }
      }
    };
  }, [ready, onToken, attempt]);

  const retry = () => {
    onToken(null);
    setErrored(false);
    setAttempt((a) => a + 1);
  };

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

  return (
    <div className={className}>
      <div ref={containerRef} aria-label="Spam check" className={errored ? "hidden" : ""} />
      {errored && (
        <p className="font-hand text-lg text-ink-soft" role="status">
          spam check hiccuped.{" "}
          <button
            type="button"
            onClick={retry}
            className="cursor-pointer underline decoration-accent decoration-2 underline-offset-2 hover:text-ink"
          >
            tap to retry
          </button>
        </p>
      )}
    </div>
  );
}
