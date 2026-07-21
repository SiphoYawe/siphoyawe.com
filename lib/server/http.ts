export type ErrorEnvelope = { ok: false; error: string };

export type ServiceResponse = {
  status: number;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
};

export function json(
  data: unknown,
  init?: { status?: number; headers?: Record<string, string> },
): Response {
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  });
}

export function ok(
  data: Record<string, unknown> = {},
  init?: { status?: number; headers?: Record<string, string> },
): Response {
  return json({ ok: true, ...data }, init);
}

export function error(
  message: string,
  status = 400,
  headers?: Record<string, string>,
): Response {
  const body: ErrorEnvelope = { ok: false, error: message };
  return json(body, { status, headers });
}

export function notFound(): Response {
  return json({ ok: false, error: "Not found" }, { status: 404 });
}

const LOCAL_FALLBACK = "127.0.0.1";

function lastEntry(value: string | null): string | undefined {
  if (!value) return undefined;
  const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
  return parts[parts.length - 1];
}

/**
 * Client IP extraction, spoof-resistant.
 *
 * The LEFTMOST x-forwarded-for entry is client-controlled and trivially
 * spoofable (fresh rate-limit buckets, poisoned ip_hash), so we take the
 * RIGHTMOST hop: on Vercel the platform appends the true connecting IP as the
 * last entry, and `x-vercel-forwarded-for` is platform-set and preferred.
 */
export function clientIp(headers: Headers): string {
  const vercel = lastEntry(headers.get("x-vercel-forwarded-for"));
  if (vercel) return vercel;

  const forwarded = lastEntry(headers.get("x-forwarded-for"));
  if (forwarded) return forwarded;

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return LOCAL_FALLBACK;
}

export async function readJson<T = unknown>(
  request: Request,
): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
