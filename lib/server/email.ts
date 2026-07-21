import { Resend } from "resend";
import { env, isConfigured } from "./env";
import type { SpeakingInput } from "./validation";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Field = { label: string; value: string | undefined };

function fields(input: SpeakingInput): Field[] {
  return [
    { label: "Name", value: input.name },
    { label: "Email", value: input.email },
    { label: "Organisation", value: input.org },
    { label: "Event", value: input.eventName },
    { label: "Event date", value: input.eventDate },
    { label: "Audience size", value: input.audienceSize },
    { label: "Budget", value: input.budget },
    { label: "Message", value: input.message },
  ];
}

function toText(input: SpeakingInput): string {
  return fields(input)
    .filter((f) => f.value)
    .map((f) => `${f.label}: ${f.value}`)
    .join("\n");
}

function toHtml(input: SpeakingInput): string {
  const rows = fields(input)
    .filter((f) => f.value)
    .map(
      (f) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top">${escapeHtml(
          f.label,
        )}</td><td style="padding:4px 0">${escapeHtml(f.value ?? "")}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5">
  <h2 style="margin:0 0 12px">New speaking request</h2>
  <table style="border-collapse:collapse">${rows}</table>
</div>`;
}

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendSpeakingEmail(
  input: SpeakingInput,
): Promise<SendResult> {
  const subject = `Speaking request from ${input.name}${input.eventName ? ` — ${input.eventName}` : ""}`;

  if (!isConfigured.resend || !env.resend.apiKey || !env.resend.toEmail) {
    console.info(
      "[email] RESEND_API_KEY/SPEAKING_TO_EMAIL not set — logging email instead of sending (dev mode).",
    );
    console.info(`[email] To: ${env.resend.toEmail ?? "(unset)"}`);
    console.info(`[email] From: ${env.resend.fromEmail}`);
    console.info(`[email] Subject: ${subject}`);
    console.info(`[email] Reply-To: ${input.email}`);
    console.info(`[email] Body:\n${toText(input)}`);
    return { ok: true };
  }

  try {
    const resend = new Resend(env.resend.apiKey);
    const { error } = await resend.emails.send({
      from: env.resend.fromEmail,
      to: env.resend.toEmail,
      replyTo: input.email,
      subject,
      text: toText(input),
      html: toHtml(input),
    });
    if (error) {
      console.error("[email] Resend error", error);
      return { ok: false, error: "Email delivery failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false, error: "Email delivery failed" };
  }
}
