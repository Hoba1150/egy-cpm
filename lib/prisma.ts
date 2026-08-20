import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getSecureDbUrl() {
  let dbUrl = process.env.DATABASE_URL || "";
  
  if (!dbUrl) {
    dbUrl = "postgresql://postgres:EgyCpm2026SecurePass!@db.rwxugaseleipcgzbromp.supabase.co:6543/postgres?sslmode=require&connect_timeout=30";
  }

  // Ensure sslmode=require and connect_timeout exist
  if (!dbUrl.includes("sslmode=")) {
    dbUrl += (dbUrl.includes("?") ? "&" : "?") + "sslmode=require";
  }
  if (!dbUrl.includes("connect_timeout=")) {
    dbUrl += "&connect_timeout=30";
  }

  return dbUrl;
}

const secureUrl = getSecureDbUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: secureUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
