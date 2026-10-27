import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, requireAdmin } from "@/lib/session"
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit"

const inquirySchema = z.object({
  type: z.enum(["SUPPORT", "SALES", "UPGRADE"]),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  company: z.string().trim().max(200).optional(),
  subject: z.string().trim().max(200).optional(),
  plan: z.string().trim().max(50).optional(),
  message: z.string().trim().min(5).max(5000),
  // Honeypot: real users never fill this hidden field
  website: z.string().max(0).optional(),
})

export async function POST(request: Request) {
  const limit = rateLimit(`inquiry:${clientIp(request)}`, 5, 60 * 60_000)
  if (!limit.ok) return tooManyRequests(limit.retryAfter)

  try {
    const { website: _honeypot, ...data } = inquirySchema.parse(await request.json())
    const user = await getCurrentUser()

    const inquiry = await prisma.inquiry.create({
      data: { ...data, userId: user?.id ?? null },
      select: { id: true },
    })

    return NextResponse.json({ message: "Received", id: inquiry.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please check the form and try again", details: error.issues },
        { status: 400 }
      )
    }
    console.error("Inquiry error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  const status = new URL(request.url).searchParams.get("status")
  const inquiries = await prisma.inquiry.findMany({
    where: status === "OPEN" || status === "CLOSED" ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  })
  return NextResponse.json({ inquiries })
}
