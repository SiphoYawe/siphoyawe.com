export type Experience = {
  id: string;
  company: string;
  role: string;
  /** Display dates — TODO(Sipho): confirm exact years for the early roles. */
  start: string;
  end: string;
  /** Enamel pin face colour. */
  pinColor: "azure" | "or" | "gules" | "mint" | "sable";
  /** Short pin inscription (1-2 chars). */
  monogram: string;
  note?: string;
};

/**
 * The enamel-pin timeline, 2020 to now (brief section 6.4).
 * Grounded in Sipho's CV; early dates are best-effort until confirmed.
 */
export const EXPERIENCE: Experience[] = [
  {
    id: "pegasus",
    company: "Pegasus Technologies",
    role: "Web Developer",
    start: "2020",
    end: "2021",
    pinColor: "sable",
    monogram: "PT",
    note: "Kampala, Uganda. Where it all started.",
  },
  {
    id: "skybound",
    company: "SkyBound Studios",
    role: "Full-Stack Developer",
    start: "2021",
    end: "2022",
    pinColor: "azure",
    monogram: "SB",
  },
  {
    id: "nutritoken",
    company: "Nutritoken",
    role: "UI/UX Design Lead",
    start: "2022",
    end: "2023",
    pinColor: "mint",
    monogram: "NT",
  },
  {
    id: "homei",
    company: "HOMEi Student",
    role: "App Developer & Designer",
    start: "2023",
    end: "2024",
    pinColor: "or",
    monogram: "HO",
  },
  {
    id: "sheffield-su",
    company: "Sheffield Students' Union",
    role: "Web Developer",
    start: "2024",
    end: "2026",
    pinColor: "gules",
    monogram: "SU",
    note: "The big website redesign, for 30,000+ students.",
  },
  {
    id: "lifi",
    company: "LI.FI",
    role: "DevRel Engineer",
    start: "2026",
    end: "now",
    pinColor: "azure",
    monogram: "LI",
    note: "Cross-chain everything. The dream gig.",
  },
];
