import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().max(500_000).optional(),
  status: z.enum(["DRAFT", "COMPLETED", "ARCHIVED"]).optional(),
})

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { user, error } = await requireUser()
  if (error) return error

  try {
    const { id } = await params
    const proposal = await prisma.proposal.findFirst({
      where: { id, userId: user.id },
      include: { grant: true },
    })

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error("Error fetching proposal:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { user, error } = await requireUser()
  if (error) return error

  try {
    const { id } = await params
    const data = updateSchema.parse(await request.json())

    const proposal = await prisma.proposal.updateMany({
      where: { id, userId: user.id },
      data,
    })

    if (proposal.count === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Proposal updated successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating proposal:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { user, error } = await requireUser()
  if (error) return error

  try {
    const { id } = await params
    const proposal = await prisma.proposal.deleteMany({
      where: { id, userId: user.id },
    })

    if (proposal.count === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Proposal deleted successfully" })
  } catch (error) {
    console.error("Error deleting proposal:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
