"use server";

import { cookies, headers } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

// In-memory rate limiting (for production, consider using Redis or database)
// Key: IP address, Value: { attempts: number, lastAttempt: number, blockedUntil: number }
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number; blockedUntil: number }>();

// Rate limiting configuration
const MAX_ATTEMPTS = 5; // Maximum failed attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const BLOCK_DURATION_MS = 30 * 60 * 1000; // Block for 30 minutes after max attempts

// Valid session tokens (in production, store in database)
const validSessions = new Set<string>();

/**
 * Get client IP address from headers
 */
async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIP = headersList.get("x-real-ip");
  return realIP || "unknown";
}

/**
 * Check rate limiting
 */
async function checkRateLimit(): Promise<{ allowed: boolean; retryAfter?: number }> {
  const ip = await getClientIP();
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // If IP is blocked, check if block period has expired
  if (record && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Clean up expired records
  if (record && record.blockedUntil <= now) {
    rateLimitMap.delete(ip);
  }

  return { allowed: true };
}

/**
 * Record failed login attempt
 */
async function recordFailedAttempt(): Promise<void> {
  const ip = await getClientIP();
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

  // Reset attempts if window has passed
  if (now - record.lastAttempt > WINDOW_MS) {
    record.attempts = 1;
    record.lastAttempt = now;
    record.blockedUntil = 0;
  } else {
    record.attempts++;
    record.lastAttempt = now;

    // Block if max attempts reached
    if (record.attempts >= MAX_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_DURATION_MS;
    }
  }

  rateLimitMap.set(ip, record);
}

/**
 * Clear rate limit for IP (on successful login)
 */
async function clearRateLimit(): Promise<void> {
  const ip = await getClientIP();
  rateLimitMap.delete(ip);
}

/**
 * Admin authentication Server Action
 * Verifies password and sets secure session cookie
 * Includes rate limiting to prevent brute force attacks
 */
export async function authenticateAdmin(password: string): Promise<{
  success: boolean;
  message: string;
  retryAfter?: number;
}> {
  if (!ADMIN_PASSWORD) {
    return {
      success: false,
      message: "Admin access is not configured",
    };
  }

  // Check rate limiting
  const rateLimitCheck = await checkRateLimit();
  if (!rateLimitCheck.allowed) {
    return {
      success: false,
      message: `Too many failed attempts. Please try again in ${Math.ceil((rateLimitCheck.retryAfter || 0) / 60)} minutes.`,
      retryAfter: rateLimitCheck.retryAfter,
    };
  }

  // Use timing-safe comparison to prevent timing attacks
  const providedHash = createHash("sha256").update(password).digest();
  const expectedHash = createHash("sha256").update(ADMIN_PASSWORD).digest();

  if (
    providedHash.length !== expectedHash.length ||
    !timingSafeEqual(providedHash, expectedHash)
  ) {
    // Record failed attempt
    await recordFailedAttempt();
    return {
      success: false,
      message: "Invalid password",
    };
  }

  // Clear rate limit on successful login
  await clearRateLimit();

  // Generate secure session token
  const cookieStore = await cookies();
  const timestamp = Date.now();
  const randomBytes = createHash("sha256")
    .update(`${Math.random()}${timestamp}`)
    .digest("hex");
  const sessionToken = createHash("sha256")
    .update(`${ADMIN_PASSWORD}${timestamp}${randomBytes}`)
    .digest("hex");

  // Store valid session token
  validSessions.add(sessionToken);

  // Set secure session cookie (expires in 24 hours)
  cookieStore.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return {
    success: true,
    message: "Authentication successful",
  };
}

/**
 * Verify admin session
 * Validates that the session token exists and is valid
 */
export async function verifyAdminSession(): Promise<boolean> {
  if (!ADMIN_PASSWORD) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || !session.value) {
    return false;
  }

  // Verify session token is in the valid sessions set
  // In production, you'd verify against a database with expiration times
  const isValid = validSessions.has(session.value);
  
  if (!isValid) {
    // Clean up invalid session cookie
    cookieStore.delete("admin_session");
    return false;
  }

  return true;
}

/**
 * Logout admin
 * Removes session token from valid sessions and deletes cookie
 */
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  
  if (session?.value) {
    // Remove from valid sessions
    validSessions.delete(session.value);
  }
  
  cookieStore.delete("admin_session");
}
