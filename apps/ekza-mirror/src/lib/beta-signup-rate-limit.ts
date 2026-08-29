// Lightweight first-line spam protection for the public beta signup endpoint.
// State is per server instance, so this complements (rather than replaces) a
// distributed limiter if signup traffic eventually spans many instances.

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const records = new Map<string, RateLimitRecord>();

const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_RECORDS = 10_000;
const CLEANUP_INTERVAL_MS = 60 * 1000;

let nextCleanupAt = 0;

function cleanupExpired(now: number): void {
  for (const [key, record] of records) {
    if (record.resetAt <= now) records.delete(key);
  }
  nextCleanupAt = now + CLEANUP_INTERVAL_MS;
}

function makeRoom(): void {
  while (records.size >= MAX_RECORDS) {
    const oldestKey = records.keys().next().value as string | undefined;
    if (oldestKey === undefined) return;
    records.delete(oldestKey);
  }
}

export function checkBetaSignupRateLimit(
  ip: string,
  now = Date.now()
): { allowed: boolean; retryAfter?: number } {
  if (now >= nextCleanupAt || records.size >= MAX_RECORDS) {
    cleanupExpired(now);
  }

  const existing = records.get(ip);

  if (!existing || existing.resetAt <= now) {
    if (existing) records.delete(ip);
    makeRoom();
    records.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true };
}
