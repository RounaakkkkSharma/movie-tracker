// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Use a global singleton in dev, create a new client in production
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // optional
  });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
