export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfterSeconds: number;
};

export interface RateLimiter {
  check(key: string): Promise<RateLimitResult>;
}

/**
 * In-memory sliding-window limiter.
 *
 * NOTE: Vercel serverless memory is per-instance, so this is best-effort at
 * scale. It is more than adequate for a personal site. The {@link RateLimiter}
 * interface is intentionally async so an Upstash Redis implementation can swap
 * in later without touching call sites.
 */
const SWEEP_EVERY = 500;

export class InMemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, number[]>();
  private checksSinceSweep = 0;

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  /** Evict keys whose entire window has expired so the map cannot grow unbounded. */
  private sweep(windowStart: number): void {
    for (const [key, timestamps] of this.hits) {
      if (!timestamps.some((t) => t > windowStart)) {
        this.hits.delete(key);
      }
    }
  }

  async check(key: string): Promise<RateLimitResult> {
    const now = this.now();
    const windowStart = now - this.windowMs;

    this.checksSinceSweep += 1;
    if (this.checksSinceSweep >= SWEEP_EVERY) {
      this.checksSinceSweep = 0;
      this.sweep(windowStart);
    }

    const timestamps = (this.hits.get(key) ?? []).filter(
      (t) => t > windowStart,
    );

    if (timestamps.length >= this.limit) {
      const oldest = timestamps[0] ?? now;
      const resetAt = oldest + this.windowMs;
      this.hits.set(key, timestamps);
      return {
        allowed: false,
        remaining: 0,
        limit: this.limit,
        resetAt,
        retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
      };
    }

    timestamps.push(now);
    this.hits.set(key, timestamps);

    return {
      allowed: true,
      remaining: this.limit - timestamps.length,
      limit: this.limit,
      resetAt: now + this.windowMs,
      retryAfterSeconds: 0,
    };
  }

  reset(): void {
    this.hits.clear();
  }
}

const TEN_MINUTES = 10 * 60 * 1000;

export const speakingRateLimiter = new InMemoryRateLimiter(3, TEN_MINUTES);
export const guestbookRateLimiter = new InMemoryRateLimiter(2, TEN_MINUTES);
export const newsletterRateLimiter = new InMemoryRateLimiter(5, TEN_MINUTES);
