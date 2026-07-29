import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDbUrl(): string {
  const envUrl = process.env.DATABASE_URL || "file:./dev.db";
  if (envUrl.startsWith("file:")) {
    const relPath = envUrl.slice(5);
    return `file:${path.resolve(process.cwd(), relPath)}`;
  }
  return envUrl;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaLibSql({ url: getDbUrl() }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
