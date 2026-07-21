import { z } from "zod";

/**
 * Each var is parsed independently: a malformed value only disables its own
 * surface (with a warning naming the exact var), never the whole config.
 */
function readVar(name: string, schema: z.ZodType<string>): string | undefined {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return undefined;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    console.warn(
      `[env] ${name} is set but invalid — ignoring it. (${parsed.error.issues[0]?.message ?? "invalid value"})`,
    );
    return undefined;
  }
  return parsed.data;
}

const str = z.string().min(1);
const email = z.string().email();

const values = {
  SPOTIFY_CLIENT_ID: readVar("SPOTIFY_CLIENT_ID", str),
  SPOTIFY_CLIENT_SECRET: readVar("SPOTIFY_CLIENT_SECRET", str),
  SPOTIFY_REFRESH_TOKEN: readVar("SPOTIFY_REFRESH_TOKEN", str),

  RESEND_API_KEY: readVar("RESEND_API_KEY", str),
  SPEAKING_TO_EMAIL: readVar("SPEAKING_TO_EMAIL", email),
  SPEAKING_FROM_EMAIL: readVar("SPEAKING_FROM_EMAIL", email),

  TURNSTILE_SECRET_KEY: readVar("TURNSTILE_SECRET_KEY", str),

  DATABASE_URL: readVar("DATABASE_URL", str),
  IP_HASH_SALT: readVar("IP_HASH_SALT", str),

  GUESTBOOK_MODERATION_TOKEN: readVar("GUESTBOOK_MODERATION_TOKEN", str),

  POSTHOG_API_KEY: readVar("POSTHOG_API_KEY", str),
  POSTHOG_HOST: readVar("POSTHOG_HOST", str),
};

const DEFAULT_POSTHOG_HOST = "https://eu.posthog.com";
const DEFAULT_SPEAKING_FROM = "speaking@siphoyawe.com";
const DEFAULT_IP_HASH_SALT = "dev-insecure-ip-hash-salt";

export const env = {
  spotify: {
    clientId: values.SPOTIFY_CLIENT_ID,
    clientSecret: values.SPOTIFY_CLIENT_SECRET,
    refreshToken: values.SPOTIFY_REFRESH_TOKEN,
  },
  resend: {
    apiKey: values.RESEND_API_KEY,
    toEmail: values.SPEAKING_TO_EMAIL,
    fromEmail: values.SPEAKING_FROM_EMAIL ?? DEFAULT_SPEAKING_FROM,
  },
  turnstile: {
    secretKey: values.TURNSTILE_SECRET_KEY,
  },
  database: {
    url: values.DATABASE_URL,
    ipHashSalt: values.IP_HASH_SALT ?? DEFAULT_IP_HASH_SALT,
  },
  guestbook: {
    moderationToken: values.GUESTBOOK_MODERATION_TOKEN,
  },
  posthog: {
    apiKey: values.POSTHOG_API_KEY,
    host: values.POSTHOG_HOST ?? DEFAULT_POSTHOG_HOST,
  },
} as const;

export const isConfigured = {
  spotify: Boolean(
    env.spotify.clientId &&
      env.spotify.clientSecret &&
      env.spotify.refreshToken,
  ),
  resend: Boolean(env.resend.apiKey && env.resend.toEmail),
  turnstile: Boolean(env.turnstile.secretKey),
  database: Boolean(env.database.url),
  posthog: Boolean(env.posthog.apiKey),
  guestbookModeration: Boolean(env.guestbook.moderationToken),
} as const;
