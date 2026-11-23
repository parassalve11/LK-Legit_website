import "server-only";

// Sends a new-lead alert to Telegram through a bot.
// Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the environment; when either
// is missing this does nothing, so the contact form keeps working without it.

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function notifyNewLead(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!token || chatIds.length === 0) return;

  const lines = [
    "<b>📩 New contact form message</b>",
    "",
    `<b>Name:</b> ${escapeHtml(lead.name)}`,
    `<b>Email:</b> ${escapeHtml(lead.email)}`,
    lead.phone ? `<b>Phone:</b> ${escapeHtml(lead.phone)}` : null,
    lead.subject ? `<b>Subject:</b> ${escapeHtml(lead.subject)}` : null,
    "",
    `<b>Message:</b>\n${escapeHtml(lead.message).slice(0, 3500)}`,
  ].filter((line) => line !== null);
  const text = lines.join("\n");

  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
          signal: AbortSignal.timeout(10_000),
        });
        if (!res.ok) {
          const body = await res.text();
          console.error(`[telegram] send failed (${res.status}):`, body.slice(0, 300));
        }
      } catch (error) {
        console.error("[telegram] send failed:", error?.message);
      }
    }),
  );
}
