import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// Public liveness check: reports only whether the database answers
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: "ok", database: { connected: true } })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json({ status: "error", database: { connected: false } }, { status: 503 })
  }
}
