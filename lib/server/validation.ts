import { z } from "zod";

// The speaking schema is isomorphic and shared with the client form so the two
// can never drift. See lib/speaking-schema.ts.
export { speakingSchema } from "@/lib/speaking-schema";
export type { SpeakingInput } from "@/lib/speaking-schema";

const honeypot = z
  .string()
  .max(0, "honeypot must be empty")
  .optional()
  .or(z.literal(""));

export const guestbookSchema = z.object({
  name: z.string().trim().min(1).max(50),
  message: z.string().trim().min(1).max(500),
  website: honeypot,
  turnstileToken: z.string().optional(),
});

export type GuestbookInput = z.infer<typeof guestbookSchema>;

export const moderateActionSchema = z.object({
  token: z.string().min(1),
  id: z.uuid(),
  action: z.enum(["approve", "reject"]),
});

export type ModerateActionInput = z.infer<typeof moderateActionSchema>;

/** True when the honeypot field was filled — the request is almost certainly a bot. */
export function honeypotTripped(website: unknown): boolean {
  return typeof website === "string" && website.trim().length > 0;
}

export function firstError(err: z.ZodError): string {
  const issue = err.issues[0];
  if (!issue) return "Invalid request";
  const path = issue.path.join(".");
  return path ? `${path}: ${issue.message}` : issue.message;
}
