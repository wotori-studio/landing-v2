// Instant notification for new project inquiries via a Telegram bot.
// Configure TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID to enable. If they are not
// set, this is a no-op (returns false) and the inquiry still lives in Supabase.

import { sendTelegramMessage } from "./telegram";

export type InquiryPayload = {
  name: string;
  email: string;
  budget: string;
  timeline: string;
  message: string;
};

export async function notifyTelegram(p: InquiryPayload): Promise<boolean> {
  const text =
    "🚀 New project inquiry — wotori.io\n\n" +
    `👤 ${p.name}\n` +
    `✉️ ${p.email}\n` +
    `💰 ${p.budget || "—"}\n` +
    `⏱ ${p.timeline || "—"}\n\n` +
    p.message;

  return sendTelegramMessage(text);
}
