"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Hydration-safe "are we on the client" flag (no effect, no setState). */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
