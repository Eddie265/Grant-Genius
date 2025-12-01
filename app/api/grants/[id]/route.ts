import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split("/").pop() as string

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

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateSchema.parse(body)

    const updateData: any = { ...data }
    if (data.deadline) {
      updateData.deadline = new Date(data.deadline)
    }

    const url = new URL(request.url)
    const id = url.pathname.split("/").pop() as string

    const grant = await prisma.grant.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ grant })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const url = new URL(request.url)
    const id = url.pathname.split("/").pop() as string

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



