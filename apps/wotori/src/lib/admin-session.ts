import { createHash, randomBytes, timingSafeEqual } from "crypto";

/**
 * Trim and strip accidental wrapping quotes from Vercel env UI.
 */
export function getAdminPassword(): string {
  let v = process.env.ADMIN_PASSWORD ?? "";
  v = v.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  return v;
}

export function verifyAdminPassword(password: string): boolean {
  const admin = getAdminPassword();
  if (!admin) return false;

  const providedHash = createHash("sha256").update(password, "utf8").digest();
  const expectedHash = createHash("sha256").update(admin, "utf8").digest();

  return (
    providedHash.length === expectedHash.length &&
    timingSafeEqual(providedHash, expectedHash)
  );
}

function getSessionSecret(): string {
  return createHash("sha256")
    .update(`${getAdminPassword()}_session_secret`, "utf8")
    .digest("hex");
}

export function createSignedSessionToken(): string {
  const timestamp = Date.now();
  const randomPart = randomBytes(16).toString("hex");
  const tokenData = `${timestamp}.${randomPart}`;
  const sessionSecret = getSessionSecret();
  const signature = createHash("sha256")
    .update(`${tokenData}.${sessionSecret}`, "utf8")
    .digest("hex")
    .substring(0, 32);

  return `${tokenData}.${signature}`;
}

export function verifySignedSessionToken(token: string): boolean {
  if (!getAdminPassword()) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [timestampStr, , signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    const maxAge = 60 * 60 * 24 * 1000;
    if (isNaN(timestamp) || now - timestamp > maxAge) return false;

    const tokenData = `${parts[0]}.${parts[1]}`;
    const sessionSecret = getSessionSecret();
    const expectedSignature = createHash("sha256")
      .update(`${tokenData}.${sessionSecret}`, "utf8")
      .digest("hex")
      .substring(0, 32);

    const providedSig = Buffer.from(signature, "hex");
    const expectedSig = Buffer.from(expectedSignature, "hex");

    return (
      providedSig.length === expectedSig.length &&
      timingSafeEqual(providedSig, expectedSig)
    );
  } catch {
    return false;
  }
}

export function getAdminSessionCookieOptions() {
  const useSecureCookie =
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: useSecureCookie,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24,
    path: "/",
  };
}
