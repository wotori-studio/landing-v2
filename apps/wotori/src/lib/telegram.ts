// Generic Telegram sender. Configure TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.
// Returns false (no-op) if not configured or the API call fails.

// Send to a specific chat id (used to reply to whoever sent a command).
export async function sendTelegramTo(
  chatId: string | number,
  text: string
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return false;
  return sendTelegramTo(chatId, text);
}
