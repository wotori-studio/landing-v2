"use server";

import { cookies, headers } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

/**
 * Read password at runtime (not module init) so Vercel/serverless always sees current env.
 * Top-level `process.env.X` can be inlined at build time and end up empty if the var was only set in the dashboard later.
 */
function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

// In-memory rate limiting (for production, consider using Redis or database)
// Key: IP address, Value: { attempts: number, lastAttempt: number, blockedUntil: number }
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number; blockedUntil: number }>();

// Rate limiting configuration
const MAX_ATTEMPTS = 5; // Maximum failed attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const BLOCK_DURATION_MS = 30 * 60 * 1000; // Block for 30 minutes after max attempts

// Session secret for signing tokens (derived from password for simplicity)
// In production with multiple instances, this ensures tokens are verifiable across instances
function getSessionSecret(): string {
  return createHash("sha256")
    .update(`${getAdminPassword()}_session_secret`)
    .digest("hex");
}

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
  // Debug: Log if password is configured (without exposing the actual password)
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    console.error("[Admin Auth] ADMIN_PASSWORD is not configured");
    return {
      success: false,
      message: "Admin access is not configured. Please check environment variables.",
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
  const expectedHash = createHash("sha256").update(adminPassword).digest();

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

  // Generate secure session token with signature
  // Format: timestamp.randomBytes.signature
  const cookieStore = await cookies();
  const timestamp = Date.now();
  const randomBytes = createHash("sha256")
    .update(`${Math.random()}${timestamp}${Date.now()}`)
    .digest("hex")
    .substring(0, 32);
  
  const sessionSecret = getSessionSecret();
  const tokenData = `${timestamp}.${randomBytes}`;
  const signature = createHash("sha256")
    .update(`${tokenData}.${sessionSecret}`)
    .digest("hex")
    .substring(0, 32);
  
  const sessionToken = `${tokenData}.${signature}`;

  // Set secure session cookie (expires in 24 hours)
  // Secure cookies on any HTTPS deploy (Vercel preview + production are HTTPS)
  const useSecureCookie =
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "production";
  cookieStore.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: useSecureCookie,
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
 * Validates that the session token exists and has valid signature
 * Also checks token expiration (24 hours)
 * 
 * Note: This function is called from Server Components, so it cannot delete cookies.
 * Invalid cookies will be ignored (return false) and can be cleaned up by middleware
 * or will expire naturally.
 */
export async function verifyAdminSession(): Promise<boolean> {
  if (!getAdminPassword()) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || !session.value) {
    return false;
  }

  try {
    const token = session.value;
    const parts = token.split(".");
    
    // Token format: timestamp.randomBytes.signature
    if (parts.length !== 3) {
      // Invalid format - return false (cannot delete cookie from Server Component)
      return false;
    }

    const [timestampStr, randomBytes, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // Check token expiration (24 hours = 86400000 ms)
    const now = Date.now();
    const maxAge = 60 * 60 * 24 * 1000; // 24 hours in milliseconds
    if (isNaN(timestamp) || now - timestamp > maxAge) {
      // Expired - return false (cookie will be ignored, middleware can clean it up)
      return false;
    }

    // Verify signature
    const sessionSecret = getSessionSecret();
    const tokenData = `${timestampStr}.${randomBytes}`;
    const expectedSignature = createHash("sha256")
      .update(`${tokenData}.${sessionSecret}`)
      .digest("hex")
      .substring(0, 32);

    // Use timing-safe comparison for signature
    const providedSig = Buffer.from(signature, "hex");
    const expectedSig = Buffer.from(expectedSignature, "hex");
    
    if (
      providedSig.length !== expectedSig.length ||
      !timingSafeEqual(providedSig, expectedSig)
    ) {
      // Invalid signature - return false
      return false;
    }

    return true;
  } catch (error) {
    // Invalid token format or other error - return false
    return false;
  }
}


/**
 * Logout admin
 * Deletes session cookie
 */
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
