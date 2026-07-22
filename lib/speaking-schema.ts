import { z } from "zod";

/**
 * Isomorphic speaking-inquiry schema, shared by the client form
 * (components/sections/connect.tsx) and the server validator
 * (lib/server/validation.ts). Keeping it in one place means the browser and the
 * API can never drift on the field shape, the 5000-character message cap, or the
 * honeypot rule. No server-only imports live here so it is safe in the bundle.
 */

/** Honeypot: humans leave it empty; a filled value is almost certainly a bot. */
const honeypot = z
  .string()
  .max(0, "honeypot must be empty")
  .optional()
  .or(z.literal(""));

export const speakingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "your name, so I know who I am talking to")
    .max(100),
  email: z
    .string()
    .trim()
    .min(1, "I need an email to reply to")
    .pipe(z.email("that email looks a little off").max(254)),
  org: z.string().trim().max(200).optional(),
  eventName: z.string().trim().max(200).optional(),
  eventDate: z.string().trim().max(100).optional(),
  audienceSize: z.string().trim().max(100).optional(),
  budget: z.string().trim().max(100).optional(),
  message: z
    .string()
    .trim()
    .min(10, "a sentence or two helps me say yes well")
    .max(5000),
  website: honeypot,
});

export type SpeakingInput = z.infer<typeof speakingSchema>;
