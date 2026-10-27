import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { z } from "zod"

const autosaveSchema = z.object({
  content: z.string().max(500_000),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireUser()
  if (error) return error

  try {
    const { id } = await params
    const { content } = autosaveSchema.parse(await request.json())

    const proposal = await prisma.proposal.updateMany({
      where: { id, userId: user.id },
      data: { content },
    })

    if (proposal.count === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Saved", savedAt: new Date().toISOString() })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error autosaving proposal:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
