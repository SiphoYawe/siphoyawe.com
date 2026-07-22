"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "sy-preloaded";

/**
 * Preloader (brief section 3): the lion wakes. Crest scales in, a gold ring
 * draws around it, CORAM DEO letters settle, then the curtain lifts. Short,
 * skippable (click / key), once per session, skipped entirely under reduced
 * motion.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce || window.sessionStorage.getItem(SESSION_KEY)) return;
    // Async state updates only (lint: no synchronous setState in effects).
    const openTimer = window.setTimeout(() => setShow(true), 0);
    const closeTimer = window.setTimeout(dismiss, 1900);
    const onKey = () => dismiss();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [reduce]);

  function dismiss() {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="button"
          aria-label="Skip intro"
          tabIndex={0}
          onClick={dismiss}
          onKeyDown={(e) => e.key === "Enter" && dismiss()}
          exit={{ y: "-100%", transition: { type: "spring", stiffness: 120, damping: 22 } }}
          className="fixed inset-0 z-[100] grid cursor-pointer place-items-center bg-canvas"
        >
          <div className="relative grid place-items-center">
            {/* gold ring draws on */}
            <motion.svg
              viewBox="0 0 200 200"
              className="absolute size-52 -rotate-90"
              aria-hidden
            >
              <motion.circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="#FCDD09"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              />
            </motion.svg>
            {/* the lion wakes */}
            <motion.img
              src="/brand/crest-badge.svg"
              alt=""
              className="size-32"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
