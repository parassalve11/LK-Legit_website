"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { createSession, deleteSession } from "@/lib/session";
import { LoginSchema, fieldErrors } from "@/lib/validations";

// Crude per-email throttle to slow credential stuffing.
const attempts = new Map();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 8;

function tooManyAttempts(key) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.start > WINDOW_MS) {
    attempts.set(key, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function login(prevState, formData) {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error) };
  }

  const { email, password } = parsed.data;

  if (tooManyAttempts(email)) {
    return { ok: false, message: "Too many attempts. Please wait 15 minutes and try again." };
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("[login] database unreachable:", error?.message);
    return {
      ok: false,
      message: "We can't reach the database right now. Please try again shortly.",
    };
  }

  const valid = user && (await verifyPassword(password, user.passwordHash));

  // Same message either way, so the form never reveals which emails exist.
  if (!valid) {
    return { ok: false, message: "That email and password combination didn't work." };
  }

  attempts.delete(email);
  await createSession(String(user.id));
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
