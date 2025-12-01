import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateProposal } from "@/lib/openai"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const generateSchema = z.object({
  grantTitle: z.string().min(1),
  goal: z.string().min(10),
  orgType: z.string().min(1),
  grantId: z.string().optional(),
  grantDescription: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { grantTitle, goal, orgType, grantId, grantDescription } = generateSchema.parse(body)

    // Generate proposal using OpenAI
    const proposalContent = await generateProposal({
      grantTitle,
      goal,
      orgType,
      grantDescription,
    })

    // Save proposal to database
    const proposal = await prisma.proposal.create({
      data: {
        title: `Proposal for ${grantTitle}`,
        grantId: grantId || null,
        userId: session.user.id,
        goal,
        orgType,
        content: proposalContent,
        status: "DRAFT",
      },
    })

    return NextResponse.json({
      proposal: {
        id: proposal.id,
        content: proposal.content,
        title: proposal.title,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Proposal generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate proposal" },
      { status: 500 }
    )
  }
}



