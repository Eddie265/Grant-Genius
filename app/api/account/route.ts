import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { plans } from "@/lib/site"

export async function GET() {
  const { user, error } = await requireUser()
  if (error) return error

  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, role: true, plan: true, createdAt: true, acceptedTermsAt: true, termsVersion: true },
  })
  if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 })

  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)
  const used = await prisma.proposal.count({ where: { userId: user.id, createdAt: { gte: monthStart } } })

  return NextResponse.json({
    account,
    usage: { used, allowance: plans[account.plan].monthlyGenerations, planName: plans[account.plan].name },
  })
}

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
})

export async function PATCH(request: Request) {
  const { user, error } = await requireUser()
  if (error) return error

  try {
    const { name } = profileSchema.parse(await request.json())
    await prisma.user.update({ where: { id: user.id }, data: { name } })
    return NextResponse.json({ message: "Profile updated", name })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Name must be 2–100 characters" }, { status: 400 })
    }
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

const deleteSchema = z.object({
  password: z.string().min(1),
})

// Permanently deletes the account; proposals cascade, inquiries are unlinked
export async function DELETE(request: Request) {
  const { user, error } = await requireUser()
  if (error) return error

  try {
    const { password } = deleteSchema.parse(await request.json())
    const account = await prisma.user.findUnique({ where: { id: user.id } })
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 })

    if (!(await bcrypt.compare(password, account.password))) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 })
    }

    await prisma.user.delete({ where: { id: user.id } })
    return NextResponse.json({ message: "Account deleted" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }
    console.error("Account deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
