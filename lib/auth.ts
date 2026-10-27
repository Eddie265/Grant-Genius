import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { rateLimit } from "./rate-limit"

// Comma-separated emails in ADMIN_EMAILS are promoted to ADMIN on sign-in
function isConfiguredAdmin(email: string) {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase())
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email.trim().toLowerCase()

        // Slow down password guessing against a single account
        if (!rateLimit(`login:${email}`, 10, 15 * 60_000).ok) {
          throw new Error("Too many sign-in attempts. Try again in 15 minutes.")
        }

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        let role = user.role
        if (role !== "ADMIN" && isConfiguredAdmin(email)) {
          await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } })
          role = "ADMIN"
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      // Profile edits in Settings refresh the name held in the token
      if (trigger === "update" && typeof session?.name === "string") {
        token.name = session.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
