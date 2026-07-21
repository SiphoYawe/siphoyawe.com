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
    setShow(true);
    const timer = window.setTimeout(dismiss, 1900);
    const onKey = () => dismiss();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [reduce]);

  const dismiss = () => {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    setShow(false);
  };

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/brand/crest-badge.svg"
              alt=""
              className="size-32"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
            />
            <motion.p
              className="absolute -bottom-14 font-heraldic text-sm tracking-[0.5em] text-ink"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              CORAM DEO
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
