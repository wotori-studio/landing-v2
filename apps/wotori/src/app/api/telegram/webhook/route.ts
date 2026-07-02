import { NextRequest, NextResponse } from "next/server";
import { buildDigest } from "../../../../lib/build-digest";
import { sendTelegramTo } from "../../../../lib/telegram";

export const dynamic = "force-dynamic";

/**
 * POST /api/telegram/webhook
 * Telegram delivers bot updates here. Send `/stats` to the bot and it replies
 * with the current traffic digest. Verified via the secret token Telegram sends
 * (set with setWebhook), and only answers the owner chat so stats aren't leaked.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const got = req.headers.get("x-telegram-bot-api-secret-token");
    if (got !== secret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  let update: unknown;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = (update as { message?: { text?: string; chat?: { id?: number } } })
    ?.message;
  const text = (msg?.text || "").trim();
  const chatId = msg?.chat?.id;
  if (!chatId) return NextResponse.json({ ok: true });

  // Only the owner chat may pull stats.
  const owner = process.env.TELEGRAM_CHAT_ID;
  if (owner && String(chatId) !== String(owner)) {
    return NextResponse.json({ ok: true });
  }

  if (/^\/stats?(@\w+)?\b/i.test(text)) {
    const digest = await buildDigest();
    await sendTelegramTo(
      chatId,
      digest || "Couldn't build stats right now — try again shortly."
    );
  } else if (/^\/start\b/.test(text) || /^\/help\b/.test(text)) {
    await sendTelegramTo(
      chatId,
      "wotori.io bot. Send /stats for the current traffic digest."
    );
  }

  return NextResponse.json({ ok: true });
}
