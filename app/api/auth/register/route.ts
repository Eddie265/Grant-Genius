import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { legal } from "@/lib/site"
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit"

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  acceptTerms: z.literal(true, { error: "You must accept the Terms of Service and Privacy Policy" }),
  confirmAge: z.literal(true, { error: `You must be at least ${legal.minimumAge} years old` }),
})

export async function POST(request: Request) {
  const limit = rateLimit(`register:${clientIp(request)}`, 5, 60 * 60_000)
  if (!limit.ok) return tooManyRequests(limit.retryAfter)

  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        acceptedTermsAt: new Date(),
        termsVersion: legal.termsVersion,
      },
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
