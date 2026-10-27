import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated/prisma/client"

// Transient network failures (cold starts, dropped TLS handshakes) are worth a retry
const TRANSIENT = /connection terminated|timeout|ECONNRESET|ETIMEDOUT|ECONNREFUSED|Can't reach database/i
const MAX_ATTEMPTS = 3

function createPrismaClient() {
  const adapter = new PrismaPg({
    // Pooled Neon connection (PgBouncer) for app traffic
    connectionString: process.env.DATABASE_URL,
    // Allow for Neon scale-to-zero cold starts and slow networks
    connectionTimeoutMillis: 30_000,
    idleTimeoutMillis: 30_000,
    // Lower this on networks that struggle to open several TLS connections at once
    max: Number(process.env.DATABASE_POOL_MAX) || 5,
  })

  return new PrismaClient({ adapter }).$extends({
    query: {
      async $allOperations({ args, query }) {
        for (let attempt = 1; ; attempt++) {
          try {
            return await query(args)
          } catch (error) {
            if (attempt >= MAX_ATTEMPTS || !TRANSIENT.test(String(error))) throw error
            await new Promise((resolve) => setTimeout(resolve, 250 * attempt))
          }
        }
      },
    },
  })
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
