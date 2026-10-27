import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "./auth"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user ?? null
}

type Guard =
  | { user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>; error: null }
  | { user: null; error: NextResponse }

// For API routes: returns the signed-in user or a ready-made 401/403 response
export async function requireUser(): Promise<Guard> {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  return { user, error: null }
}

export async function requireAdmin(): Promise<Guard> {
  const result = await requireUser()
  if (result.error) return result
  if (result.user.role !== "ADMIN") {
    return { user: null, error: NextResponse.json({ error: "Admin access required" }, { status: 403 }) }
  }
  return result
}
