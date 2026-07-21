"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

/**
 * The hidden terminal (brief section 8). Press ` (backtick) anywhere to open
 * a mini-terminal. Devs will find it; that's the point.
 */

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const VERSES = [
  { text: "Commit to the Lord whatever you do, and he will establish your plans.", ref: "Proverbs 16:3" },
  { text: "Whatever you do, work at it with all your heart, as working for the Lord.", ref: "Colossians 3:23" },
  { text: "Be strong and courageous... for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9" },
];

const HELP = [
  "available commands:",
  "  whoami          a short bio",
  "  sipho --help    this list",
  "  coram deo       the motto",
  "  verse           scripture, random-ish",
  "  socials         where to find me",
  "  konami          try the classic code instead",
  "  clear           wipe the scrollback",
  "  exit            close the terminal",
];

const SOCIALS = [
  "x.com/SiphoYawe",
  "github.com/SiphoYawe",
  "linkedin.com/in/sipho-yawe-669406231",
];

type Line = { id: number; kind: "in" | "out"; text: string };

let lineId = 0;
const nextId = () => ++lineId;

export function HiddenTerminal() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { id: nextId(), kind: "out", text: "siphoyawe.com shell v1.0. type `sipho --help`." },
  ]);
  const [input, setInput] = useState("");
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [konamiDone, setKonamiDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const print = useCallback((texts: string | string[]) => {
    setLines((prev) => [
      ...prev,
      ...(Array.isArray(texts) ? texts : [texts]).map((text) => ({
        id: nextId(),
        kind: "out" as const,
        text,
      })),
    ]);
  }, []);

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      setLines((prev) => [...prev, { id: nextId(), kind: "in", text: raw }]);
      if (!cmd) return;
      if (cmd === "exit") {
        setOpen(false);
        return;
      }
      if (cmd === "clear") {
        setLines([]);
        return;
      }
      if (cmd === "whoami") {
        print("a man building, writing, living coram deo.");
      } else if (cmd === "sipho --help" || cmd === "help") {
        print(HELP);
      } else if (cmd === "coram deo") {
        print("before the face of God. it is how the work gets done.");
      } else if (cmd === "verse") {
        const v = VERSES[Math.floor(Math.random() * VERSES.length)];
        print([`"${v.text}"`, `  ${v.ref}`]);
      } else if (cmd === "socials") {
        print(SOCIALS);
      } else if (cmd === "konami") {
        print("up up down down left right left right b a. on your keyboard, not in here.");
      } else {
        print(`command not found: ${cmd}. try \`sipho --help\`.`);
      }
    },
    [print],
  );

  // Global keybindings: backtick toggles, Escape closes, Konami listens always.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((v) => {
          if (!v) trackEvent(AnalyticsEvents.EasterEgg, { egg: "hidden-terminal" });
          return !v;
        });
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      // Konami code (fires once per page load)
      if (!konamiDone) {
        const expected = KONAMI[konamiProgress];
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (key === expected) {
          const next = konamiProgress + 1;
          setKonamiProgress(next);
          if (next === KONAMI.length) {
            setKonamiDone(true);
            setKonamiProgress(0);
            trackEvent(AnalyticsEvents.EasterEgg, { egg: "konami" });
            setOpen(true);
            print([
              "KONAMI ACCEPTED. achievement unlocked: legendary dev.",
              "the crane salutes you. coram deo, player one.",
            ]);
          }
        } else {
          setKonamiProgress(key === KONAMI[0] ? 1 : 0);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [konamiDone, konamiProgress, print]);

  // Focus input on open; keep scrollback pinned to the bottom.
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [open]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Hidden terminal"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          transition={springs.snappy}
          className="fixed bottom-4 left-4 z-[90] flex w-[min(92vw,28rem)] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0c0c0e] font-mono text-sm text-[#e8e6df] shadow-2xl"
        >
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-3 py-2">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
            <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden />
            <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden />
            <span className="ml-2 text-xs text-white/50">guest@siphoyawe:~</span>
            <span className="ml-auto text-xs text-white/35">esc to close</span>
          </div>

          {/* scrollback */}
          <div ref={scrollRef} className="max-h-64 min-h-32 overflow-y-auto px-3 py-2">
            {lines.map((line) => (
              <p key={line.id} className={line.kind === "in" ? "text-[#FCDD09]" : "whitespace-pre-wrap"}>
                {line.kind === "in" ? `guest@siphoyawe:~$ ${line.text}` : line.text}
              </p>
            ))}
          </div>

          {/* input */}
          <form
            className="flex items-center gap-2 border-t border-white/10 px-3 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              runCommand(input);
              setInput("");
            }}
          >
            <span className="shrink-0 text-[#2B5DF2]" aria-hidden>❯</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Terminal input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full bg-transparent text-[#e8e6df] outline-none placeholder:text-white/25"
              placeholder="type a command"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
