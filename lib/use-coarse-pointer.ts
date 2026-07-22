"use client";

import { useEffect, useState } from "react";

/**
 * True on coarse-pointer (touch) devices, where hover tooltips never fire, so
 * components can switch to tap-to-reveal. Returns false during SSR and on
 * mouse devices, leaving desktop hover/click behaviour untouched.
 */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must read matchMedia after mount; doing it in the initializer would break SSR/hydration
    setCoarse(mq.matches);
    const onChange = () => setCoarse(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return coarse;
}
