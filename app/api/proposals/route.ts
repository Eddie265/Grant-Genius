import { NextResponse } from "next/server"
import { marked } from "marked"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { getGuide } from "@/lib/library"

const createSchema = z.object({
  title: z.string().trim().min(1).max(200).default("Untitled proposal"),
  // Start from a library template instead of a blank page
  template: z.string().optional(),
})

// Creates a proposal without AI (blank or from a library template)
export async function POST(request: Request) {
  const { user, error } = await requireUser()
  if (error) return error

  try {
    const { title, template } = createSchema.parse(await request.json())
    const guide = template ? getGuide(template) : undefined
    if (template && (!guide || guide.type !== "Template")) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const proposal = await prisma.proposal.create({
      data: {
        title: guide ? guide.title : title,
        userId: user.id,
        goal: guide ? `Started from template: ${guide.title}` : "Started from a blank document",
        orgType: "Not specified",
        content: guide ? await marked.parse(guide.body) : "",
        status: "DRAFT",
      },
      select: { id: true },
    })
    return NextResponse.json({ proposal }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 })
    }
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  const { user, error } = await requireUser()
  if (error) return error

  try {
    const proposals = await prisma.proposal.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        status: true,
        orgType: true,
        createdAt: true,
        updatedAt: true,
        grant: {
          select: {
            id: true,
            title: true,
            fundingBody: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({ proposals })
  } catch (error) {
    console.error("Error fetching proposals:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
