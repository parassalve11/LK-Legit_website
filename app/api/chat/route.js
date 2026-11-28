import { NextResponse, after } from "next/server";
import { createLead } from "@/services/leads";
import { notifyNewLead } from "@/services/telegram";

// POST /api/chat — saves a call-back request from the website chat assistant.
// Body: { name, phone, interest, transcript: string[] (visitor's messages) }
// The lead lands in the admin Leads page and is sent to Telegram.

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function limited(key) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now - v.start > WINDOW_MS) hits.delete(k);
  }
  const entry = hits.get(key);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(key, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

const clean = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export async function POST(request) {
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body?.name, 120);
  const phone = clean(body?.phone, 30);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || digits.length < 10 || digits.length > 15) {
    return NextResponse.json({ ok: false, error: "Please enter a valid name and phone number." }, { status: 400 });
  }

  const interest = clean(body?.interest, 160) || "General enquiry";
  const said = (Array.isArray(body?.transcript) ? body.transcript : [])
    .map((line) => clean(line, 300))
    .filter(Boolean)
    .slice(-8);
  const message = said.length
    ? `Visitor's messages in chat:\n${said.map((line) => `• ${line}`).join("\n")}`
    : "Requested a call back from the website chat.";

  const lead = { name, phone, email: "", subject: interest, message };
  try {
    await createLead({ ...lead, type: "chat" });
    // Telegram runs after the reply is sent, so it never slows the chat down.
    after(() => notifyNewLead({ ...lead, title: "New lead from website chat" }));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[chat] save failed:", error?.message);
  }

  // Database unreachable: still deliver the lead through Telegram.
  if (await notifyNewLead({ ...lead, title: "New lead from website chat (not saved in admin, database was down)" })) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "Couldn't save right now." }, { status: 500 });
}
