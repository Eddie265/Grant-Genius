import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/session"

const updateSchema = z.object({
  status: z.enum(["OPEN", "CLOSED"]),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const { status } = updateSchema.parse(await request.json())
    const inquiry = await prisma.inquiry.update({ where: { id }, data: { status } })
    return NextResponse.json({ inquiry })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }
    console.error("Inquiry update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
