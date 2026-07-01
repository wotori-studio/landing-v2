import { NextRequest, NextResponse } from "next/server";
import { buildDigest } from "../../../../lib/build-digest";
import { sendTelegramMessage } from "../../../../lib/telegram";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/digest
 * Triggered by Vercel Cron (see vercel.json). Vercel automatically sends
 * `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set — we reject
 * anything else so the endpoint can't be spammed. Also callable manually with
 * the same header for testing.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  const message = await buildDigest();
  if (!message) {
    return NextResponse.json(
      { ok: false, message: "Could not build digest." },
      { status: 500 }
    );
  }

  const sent = await sendTelegramMessage(message);
  return NextResponse.json({ ok: sent, sent });
}
