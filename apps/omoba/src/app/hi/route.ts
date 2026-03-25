import { NextResponse } from "next/server";

/** Lightweight health / ping for `SayHi` (production fetch). */
export function GET() {
  return new NextResponse(null, { status: 204 });
}
