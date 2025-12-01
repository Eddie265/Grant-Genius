import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const grantSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  category: z.string().min(1),
  region: z.string().min(1),
  fundingBody: z.string().min(1),
  amount: z.string().optional(),
  deadline: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const region = searchParams.get("region")
    const fundingBody = searchParams.get("fundingBody")
    const search = searchParams.get("search")

    const where: any = {
      isActive: true,
    }

    if (category) where.category = category
    if (region) where.region = region
    if (fundingBody) where.fundingBody = fundingBody
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const grants = await prisma.grant.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ grants })
  } catch (error) {
    console.error("Error fetching grants:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = grantSchema.parse(body)

    const grant = await prisma.grant.create({
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : null,
        createdBy: session.user.id,
      },
    })

    return NextResponse.json({ grant }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating grant:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}



