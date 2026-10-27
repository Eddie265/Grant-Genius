import { NextResponse } from "next/server"
import { marked } from "marked"
import { generateProposal } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { plans } from "@/lib/site"
import { rateLimit, tooManyRequests } from "@/lib/rate-limit"
import { z } from "zod"

const generateSchema = z.object({
  grantTitle: z.string().trim().min(1).max(300),
  goal: z.string().trim().min(10).max(5000),
  orgType: z.string().trim().min(1).max(200),
  grantId: z.string().optional(),
  grantDescription: z.string().max(10_000).optional(),
})

export async function POST(request: Request) {
  const { user, error } = await requireUser()
  if (error) return error

  const burst = rateLimit(`generate:${user.id}`, 3, 60_000)
  if (!burst.ok) return tooManyRequests(burst.retryAfter)

  try {
    const { grantTitle, goal, orgType, grantId, grantDescription } = generateSchema.parse(
      await request.json()
    )

    // Monthly AI generation allowance depends on the user's plan
    const account = await prisma.user.findUnique({ where: { id: user.id }, select: { plan: true } })
    const allowance = plans[account?.plan ?? "FREE"].monthlyGenerations
    const monthStart = new Date()
    monthStart.setUTCDate(1)
    monthStart.setUTCHours(0, 0, 0, 0)
    const used = await prisma.proposal.count({
      where: { userId: user.id, createdAt: { gte: monthStart } },
    })
    if (used >= allowance) {
      return NextResponse.json(
        {
          error: `You've used all ${allowance} AI proposals included in your plan this month. Upgrade or wait until next month.`,
          code: "LIMIT_REACHED",
        },
        { status: 402 }
      )
    }

    const markdown = await generateProposal({
      grantTitle,
      goal,
      orgType,
      grantDescription,
    })

    // The editor works with HTML; the model writes Markdown
    const content = await marked.parse(markdown)

    const proposal = await prisma.proposal.create({
      data: {
        title: `Proposal for ${grantTitle}`,
        grantId: grantId || null,
        userId: user.id,
        goal,
        orgType,
        content,
        status: "DRAFT",
      },
    })

    return NextResponse.json({
      proposal: {
        id: proposal.id,
        content: proposal.content,
        title: proposal.title,
      },
      usage: { used: used + 1, allowance },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Proposal generation error:", error)
    return NextResponse.json(
      { error: "We couldn't generate a proposal right now. Please try again." },
      { status: 500 }
    )
  }
}
