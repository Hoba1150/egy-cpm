import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getSecureDbUrl() {
  let dbUrl = process.env.DATABASE_URL || "";
  
  if (!dbUrl) return dbUrl;

  // Fix Vercel serverless connection to Supabase pooler (Port 6543)
  if (dbUrl.includes("supabase.co:5432")) {
    dbUrl = dbUrl.replace(":5432", ":6543");
    if (!dbUrl.includes("pgbouncer=true")) {
      dbUrl += (dbUrl.includes("?") ? "&" : "?") + "pgbouncer=true";
    }
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
