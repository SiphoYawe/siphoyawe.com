import { z } from "zod";

const honeypot = z
  .string()
  .max(0, "honeypot must be empty")
  .optional()
  .or(z.literal(""));

export const speakingSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  org: z.string().trim().max(200).optional(),
  eventName: z.string().trim().max(200).optional(),
  eventDate: z.string().trim().max(100).optional(),
  audienceSize: z.string().trim().max(100).optional(),
  budget: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10).max(5000),
  website: honeypot,
  turnstileToken: z.string().optional(),
});

export type SpeakingInput = z.infer<typeof speakingSchema>;

export const guestbookSchema = z.object({
  name: z.string().trim().min(1).max(50),
  message: z.string().trim().min(1).max(500),
  website: honeypot,
  turnstileToken: z.string().optional(),
});

export type GuestbookInput = z.infer<typeof guestbookSchema>;

export const moderateActionSchema = z.object({
  token: z.string().min(1),
  id: z.string().uuid(),
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
