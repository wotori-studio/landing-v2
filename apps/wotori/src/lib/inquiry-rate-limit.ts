// Lightweight in-memory rate limit for the public project-inquiry form.
// Not distributed (per-instance); fine as a first spam guard alongside the
// honeypot. Swap for Upstash Redis if the form ever gets abused at scale.

type Record = { count: number; windowStart: number };

const map = new Map<string, Record>();

const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function checkInquiryRateLimit(ip: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const rec = map.get(ip);

  if (!rec || now - rec.windowStart > WINDOW_MS) {
    map.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (rec.count >= MAX_PER_WINDOW) {
    const retryAfter = Math.ceil((rec.windowStart + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  rec.count++;
  return { allowed: true };
}
