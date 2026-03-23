import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Only protect /admin/analytics (and nested paths).
 * /admin and /admin/login must NOT run through this — avoids redirect edge cases and lets /admin show the login UI without a cookie.
 */
export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session");

  if (!adminSession?.value) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const token = adminSession.value;
  const parts = token.split(".");

  if (parts.length !== 3) {
    const response = NextResponse.redirect(new URL("/admin", request.url));
    response.cookies.delete("admin_session");
    return response;
  }

  const timestamp = parseInt(parts[0], 10);
  if (!isNaN(timestamp)) {
    const now = Date.now();
    const maxAge = 60 * 60 * 24 * 1000;
    if (now - timestamp > maxAge) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/analytics", "/admin/analytics/:path*"],
};
