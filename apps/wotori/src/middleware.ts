import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /admin routes (except /admin/login)
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    const adminSession = request.cookies.get("admin_session");

    // If no session cookie, redirect to login
    if (!adminSession || !adminSession.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Basic token format validation (timestamp.randomBytes.signature)
    const token = adminSession.value;
    const parts = token.split(".");
    
    // If token format is invalid, remove cookie and redirect
    if (parts.length !== 3) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_session");
      return response;
    }

    // Check if token is expired (basic check - full validation in Server Component)
    const timestamp = parseInt(parts[0], 10);
    if (!isNaN(timestamp)) {
      const now = Date.now();
      const maxAge = 60 * 60 * 24 * 1000; // 24 hours
      if (now - timestamp > maxAge) {
        const response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("admin_session");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
