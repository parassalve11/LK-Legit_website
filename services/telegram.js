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
  if (!token || chatIds.length === 0) return false;

  const lines = [
    `<b>📩 ${escapeHtml(lead.title || "New lead from the website")}</b>`,
    "",
    `<b>Name:</b> ${escapeHtml(lead.name)}`,
    lead.phone ? `<b>Phone:</b> ${escapeHtml(lead.phone)}` : null,
    lead.email ? `<b>Email:</b> ${escapeHtml(lead.email)}` : null,
    lead.subject ? `<b>Interested in:</b> ${escapeHtml(lead.subject)}` : null,
    "",
    `<b>Summary:</b>\n${escapeHtml(lead.message).slice(0, 3500)}`,
  ].filter((line) => line !== null);
  const text = lines.join("\n");

  // Resolves true when at least one chat received the alert.
  const results = await Promise.all(
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
          return false;
        }
        return true;
      } catch (error) {
        console.error("[telegram] send failed:", error?.message);
        return false;
      }
    }),
  );
  return results.some(Boolean);
}
