export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  retryAfterSec?: number;
}

const buckets = new Map<string, number[]>();
let lastSweep = Date.now();

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  if (now - lastSweep > windowMs) {
    for (const [bucketKey, hits] of buckets) {
      const cutoff = now - windowMs;
      const filtered = hits.filter((hit) => hit >= cutoff);
      if (filtered.length === 0) {
        buckets.delete(bucketKey);
      } else {
        buckets.set(bucketKey, filtered);
      }
    }
    lastSweep = now;
  }

  const cutoff = now - windowMs;
  const hits = (buckets.get(key) ?? []).filter((hit) => hit >= cutoff);

  if (hits.length >= limit) {
    const oldest = hits[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { ok: false, limit, remaining: 0, retryAfterSec };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, limit, remaining: limit - hits.length };
}
