import { NextRequest, NextResponse } from "next/server";
import {
  createSignedSessionToken,
  getAdminPassword,
  getAdminSessionCookieOptions,
  verifyAdminPassword,
} from "../../../../lib/admin-session";
import {
  checkLoginRateLimit,
  clearLoginRateLimit,
  getClientIpFromRequest,
  recordFailedLoginAttempt,
} from "../../../../lib/admin-rate-limit";

/**
 * POST /api/admin/login
 * Sets admin_session via Set-Cookie on a JSON 200 response (reliable on Vercel vs Server Action races).
 */
export async function POST(req: NextRequest) {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return NextResponse.json(
      { ok: false, message: "Admin access is not configured." },
      { status: 503 }
    );
  }

  const ip = getClientIpFromRequest(req);
  const rate = checkLoginRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: `Too many failed attempts. Try again in ${Math.ceil((rate.retryAfter || 0) / 60)} minutes.`,
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON." }, { status: 400 });
  }

  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof (body as { password: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (!verifyAdminPassword(password)) {
    recordFailedLoginAttempt(ip);
    return NextResponse.json({ ok: false, message: "Invalid password." }, { status: 401 });
  }

  clearLoginRateLimit(ip);

  const token = createSignedSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, getAdminSessionCookieOptions());
  return res;
}
