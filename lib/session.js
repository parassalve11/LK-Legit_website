import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "lk_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a 32+ character random value in .env",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}

export async function decrypt(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload;
  } catch {
    // Tampered, expired or signed with an old secret — treat as logged out.
    return null;
  }
}

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + MAX_AGE_MS);
  // Payload stays minimal on purpose: no email, no name, no role-sensitive data.
  const token = await encrypt({ userId, expiresAt: expiresAt.toISOString() });
  const store = await cookies();

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function readSession() {
  const store = await cookies();
  return decrypt(store.get(SESSION_COOKIE)?.value);
}

export { SESSION_COOKIE };
