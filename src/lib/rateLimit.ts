/**
 * Simple in-memory sliding-window rate limiter per key (e.g. IP + route).
 * Resets entries lazily. Note: on multi-instance deployments each instance has its own
 * counters; use Redis/Upstash for strict global limits if needed.
 */

const buckets = new Map<string, number[]>();

function prune(timestamps: number[], windowMs: number, now: number): number[] {
  return timestamps.filter((t) => now - t < windowMs);
}

/**
 * @returns true if allowed, false if rate limit exceeded
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = prune(buckets.get(key) ?? [], windowMs, now);
  if (arr.length >= max) {
    buckets.set(key, arr);
    return false;
  }
  arr.push(now);
  buckets.set(key, arr);
  return true;
}

export function getClientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
