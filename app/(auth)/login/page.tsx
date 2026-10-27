"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/PasswordInput"
import { Button, Field, Input, Notice } from "@/components/ui"
import { site } from "@/lib/site"

// Only allow same-site relative redirects after sign-in
function safeCallback(url: string | null) {
  return url && url.startsWith("/") && !url.startsWith("//") ? url : "/dashboard"
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = safeCallback(searchParams.get("callbackUrl"))
  const registered = searchParams.get("registered") === "true"
  const deleted = searchParams.get("deleted") === "true"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin" ? "Incorrect email or password." : result.error
        )
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px] animate-fade-up">
      <div>
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.03em] text-zinc-950">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-500">Welcome back to {site.shortName}.</p>

        <div className="mt-6 space-y-4">
          {registered && <Notice tone="success">Account created. Sign in to get started.</Notice>}
          {deleted && <Notice>Your account and data have been deleted.</Notice>}
          {error && <Notice tone="error">{error}</Notice>}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field
            label="Password"
            htmlFor="password"
            hint={
              <>
                Forgot your password?{" "}
                <a href={`mailto:${site.supportEmail}?subject=Password%20reset`} className="underline underline-offset-2">
                  Contact support
                </a>
              </>
            }
          >
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-600">
        New to {site.shortName}?{" "}
        <Link
          href={`/register${callbackUrl !== "/dashboard" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-medium text-zinc-950 underline-offset-2 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
