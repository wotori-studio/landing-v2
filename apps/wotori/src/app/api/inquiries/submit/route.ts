import { NextRequest, NextResponse } from "next/server";
import { getClientIpFromRequest } from "../../../../lib/admin-rate-limit";
import { checkInquiryRateLimit } from "../../../../lib/inquiry-rate-limit";
import { createServerClient } from "../../../../lib/supabase";
import { notifyTelegram } from "../../../../lib/inquiry-notify";

/**
 * POST /api/inquiries/submit
 * Public project-inquiry form. Stores the lead in Supabase (project_inquiries)
 * and pings Telegram. Succeeds if the lead is captured by at least one channel.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIpFromRequest(req);

  const rate = checkInquiryRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot — real users never fill this hidden field. Silently accept bots.
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  const name = str(body.name, 200);
  const email = str(body.email, 200);
  const budget = str(body.budget, 100);
  const timeline = str(body.timeline, 200);
  const message = str(body.message, 4000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, message: "Please fill in your name, email and project details." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  let stored = false;
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("project_inquiries").insert({
      name,
      email,
      budget: budget || null,
      timeline: timeline || null,
      message,
      ip_address: ip,
    });
    if (error) throw error;
    stored = true;
  } catch (err) {
    console.error("[inquiry] Supabase insert failed:", err);
  }

  const notified = await notifyTelegram({ name, email, budget, timeline, message });

  // Lead is safe if it landed in the DB or reached Telegram.
  if (!stored && !notified) {
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please email us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
