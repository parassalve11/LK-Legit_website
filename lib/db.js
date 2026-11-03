import "server-only";
import { PrismaClient } from "@prisma/client";

// Reuse one client across hot reloads in dev, otherwise every reload opens a
// new connection pool and the database runs out of connections.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
