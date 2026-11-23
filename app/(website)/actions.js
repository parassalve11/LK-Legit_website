"use server";

import { LeadSchema, fieldErrors } from "@/lib/validations";
import { after } from "next/server";
import { createLead } from "@/services/leads";
import { notifyNewLead } from "@/services/telegram";

// Very small in-memory throttle. Enough to stop casual form spam; a real
// deployment behind a proxy should also rate limit at the edge.
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function throttled(key) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(key, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function submitContact(prevState, formData) {
  const raw = Object.fromEntries(formData);

  // Honeypot — bots fill hidden fields, humans don't. Pretend success.
  if (raw.website) {
    return { ok: true, message: "Thanks — we'll be in touch shortly." };
  }

  const parsed = LeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error) };
  }

  if (throttled(parsed.data.email)) {
    return {
      ok: false,
      message: "You've sent several messages already. Please try again in a minute.",
    };
  }

  try {
    await createLead({ ...parsed.data, type: "contact" });
    // Telegram alert runs after the response is sent, so it never slows the
    // form down and a Telegram outage can't make the submission fail.
    after(() => notifyNewLead(parsed.data));
    return { ok: true, message: "Thanks — we'll be in touch shortly." };
  } catch (error) {
    console.error("[contact] save failed:", error?.message);
    return {
      ok: false,
      message: "We couldn't save your message right now. Please try again shortly.",
    };
  }
}
