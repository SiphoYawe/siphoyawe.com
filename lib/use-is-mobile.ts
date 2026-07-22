"use client";

import { useEffect, useState } from "react";

/**
 * True below the Tailwind `sm` breakpoint (640px), so components can drop
 * desktop-only flourishes (paper tilt, side stagger) on phones. Returns false
 * during SSR and on wider screens, leaving the desktop layout untouched.
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must read matchMedia after mount; doing it in the initializer would break SSR/hydration
    setMobile(mq.matches);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return mobile;
}
