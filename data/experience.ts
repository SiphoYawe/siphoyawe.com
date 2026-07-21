export type Experience = {
  id: string;
  company: string;
  role: string;
  /** Display dates. */
  start: string;
  end: string;
  /** Enamel pin face colour. */
  pinColor: "azure" | "or" | "gules" | "mint" | "sable";
  /** Short pin inscription (1-2 chars). */
  monogram: string;
  note?: string;
};

/**
 * The enamel-pin timeline (brief section 6.4): three roles, Kampala (March
 * 2023) to now. Grounded in Sipho's CV (WORK-HISTORY-AUTHORITATIVE). Newest
 * last so the pins read left-to-right as a journey; the first pin sits in
 * Uganda. Kampala 2023 → Sheffield 2025 → LI.FI 2026.
 */
export const EXPERIENCE: Experience[] = [
  {
    id: "pegasus",
    company: "Pegasus Technologies Ltd.",
    role: "Web Developer Intern",
    start: "Mar 2023",
    end: "May 2023",
    pinColor: "sable",
    monogram: "PT",
    note: "Kampala, Uganda. Where it all started: a full website redesign and rebuild.",
  },
  {
    id: "sheffield-su",
    company: "Sheffield Students' Union",
    role: "Web Developer & Digital Support",
    start: "Sep 2025",
    end: "Jun 2026",
    pinColor: "gules",
    monogram: "SU",
    note: "The big website redesign in React and Next.js, for tens of thousands of students.",
  },
  {
    id: "lifi",
    company: "LI.FI",
    role: "DevRel Engineer",
    start: "Jun 2026",
    end: "now",
    pinColor: "azure",
    monogram: "LI",
    note: "Docs, integration guides, and developer content for cross-chain bridging. The dream gig.",
  },
];
