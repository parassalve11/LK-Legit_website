import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";

// Data Access Layer.
//
// proxy.js only does an optimistic cookie check so unauthenticated visitors
// bounce quickly. The real authorisation happens here, next to the data, and
// every admin page/action must go through it. cache() dedupes the lookup
// within a single render pass.

export const verifySession = cache(async () => {
  const session = await readSession();
  if (!session?.userId) {
    redirect("/admin/login");
  }
  return { isAuth: true, userId: session.userId };
});

/** Non-redirecting variant for places that need to branch instead of bounce. */
export const optionalSession = cache(async () => {
  const session = await readSession();
  return session?.userId ? { isAuth: true, userId: session.userId } : null;
});

export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  try {
    return await prisma.user.findUnique({
      where: { id: Number(session.userId) },
      // Never select passwordHash.
      select: { id: true, email: true, name: true, role: true },
    });
  } catch {
    return null;
  }
});

/** Guard for server actions: throws instead of redirecting. */
export async function requireAdmin() {
  const session = await readSession();
  if (!session?.userId) {
    throw new Error("Not authorised.");
  }
  return session;
}
