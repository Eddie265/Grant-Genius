import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/session"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(10).optional(),
  category: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  fundingBody: z.string().min(1).optional(),
  amount: z.string().optional(),
  deadline: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
})

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params
    const grant = await prisma.grant.findUnique({
      where: { id },
    })

    if (!grant) {
      return NextResponse.json(
        { error: "Grant not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ grant })
  } catch (error) {
    console.error("Error fetching grant:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const data = updateSchema.parse(await request.json())

    const grant = await prisma.grant.update({
      where: { id },
      data: {
        ...data,
        link: data.link || null,
        deadline: data.deadline === undefined ? undefined : data.deadline ? new Date(data.deadline) : null,
      },
    })

    return NextResponse.json({ grant })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating grant:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    await prisma.grant.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Grant deleted successfully" })
  } catch (error) {
    console.error("Error deleting grant:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
