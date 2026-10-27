import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

// Data portability: everything we hold about the user, as a JSON download
export async function GET() {
  const { user, error } = await requireUser()
  if (error) return error

  const data = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
      updatedAt: true,
      acceptedTermsAt: true,
      termsVersion: true,
      proposals: {
        select: { id: true, title: true, goal: true, orgType: true, content: true, status: true, grantId: true, createdAt: true, updatedAt: true },
      },
      inquiries: {
        select: { id: true, type: true, subject: true, message: true, status: true, createdAt: true },
      },
    },
  })

  return new NextResponse(JSON.stringify({ exportedAt: new Date().toISOString(), account: data }, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="grant-genius-data-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  })
}
