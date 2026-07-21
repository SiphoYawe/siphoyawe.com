import { env, isConfigured } from "./env";

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type SiteVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

/**
 * Verify a Cloudflare Turnstile token.
 *
 * When no secret key is configured this returns `true` with a console warning
 * so local development works with zero keys.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip?: string,
  fetchImpl: typeof fetch = globalThis.fetch,
): Promise<boolean> {
  if (!isConfigured.turnstile || !env.turnstile.secretKey) {
    console.warn(
      "[turnstile] TURNSTILE_SECRET_KEY not set — skipping verification (dev mode).",
    );
    return true;
  }

  if (!token) return false;

  const body = new URLSearchParams();
  body.set("secret", env.turnstile.secretKey);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetchImpl(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as SiteVerifyResponse;
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] verification request failed", err);
    return false;
  }
}
