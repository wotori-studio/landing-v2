import type { NextRequest } from "next/server";

type RateRecord = { attempts: number; lastAttempt: number; blockedUntil: number };

const rateLimitMap = new Map<string, RateRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_DURATION_MS = 30 * 60 * 1000;

export function getClientIpFromRequest(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}

export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (record && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, retryAfter };
  }

  if (record && record.blockedUntil <= now) {
    rateLimitMap.delete(ip);
  }

  return { allowed: true };
}

export function recordFailedLoginAttempt(ip: string): void {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: 0,
    });
    return;
  }

  if (now - record.lastAttempt > WINDOW_MS) {
    record.attempts = 1;
    record.lastAttempt = now;
    record.blockedUntil = 0;
  } else {
    record.attempts++;
    record.lastAttempt = now;
    if (record.attempts >= MAX_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_DURATION_MS;
    }
  }

  rateLimitMap.set(ip, record);
}

export function clearLoginRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}
