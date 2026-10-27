import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname, search } = request.nextUrl

  if (!token) {
    const login = new URL("/login", request.url)
    login.searchParams.set("callbackUrl", pathname + search)
    return NextResponse.redirect(login)
  }

  if (pathname.startsWith("/dashboard/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
