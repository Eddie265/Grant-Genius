import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/session"

const updateSchema = z.object({
  plan: z.enum(["FREE", "PRO", "ENTERPRISE"]),
})

// Admins activate a paid plan once the customer has paid
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const { plan } = updateSchema.parse(await request.json())
    const user = await prisma.user.update({ where: { id }, data: { plan }, select: { id: true, plan: true } })
    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }
    console.error("Plan update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
