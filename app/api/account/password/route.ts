import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { rateLimit, tooManyRequests } from "@/lib/rate-limit"

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(200),
})

export async function POST(request: Request) {
  const { user, error } = await requireUser()
  if (error) return error

  const limit = rateLimit(`password:${user.id}`, 5, 15 * 60_000)
  if (!limit.ok) return tooManyRequests(limit.retryAfter)

  try {
    const { currentPassword, newPassword } = passwordSchema.parse(await request.json())
    const account = await prisma.user.findUnique({ where: { id: user.id } })
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 })

    if (!(await bcrypt.compare(currentPassword, account.password))) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(newPassword, 12) },
    })
    return NextResponse.json({ message: "Password updated" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
