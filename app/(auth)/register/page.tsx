"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/PasswordInput"
import { Button, Field, Input, Notice } from "@/components/ui"
import { legal, site } from "@/lib/site"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // "Get Pro" on the pricing page lands here with ?next=upgrade
  const callbackUrl =
    searchParams.get("next") === "upgrade" ? "/dashboard/upgrade" : searchParams.get("callbackUrl") ?? ""
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [confirmAge, setConfirmAge] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, acceptTerms, confirmAge }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        return
      }

      const params = new URLSearchParams({ registered: "true" })
      if (callbackUrl.startsWith("/")) params.set("callbackUrl", callbackUrl)
      router.push(`/login?${params}`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[440px] animate-fade-up">
      <div>
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.03em] text-zinc-950">Create your account</h1>
        <p className="mt-1 text-sm text-zinc-500">Start free. No card required.</p>

        {error && <Notice tone="error" className="mt-6">{error}</Notice>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Full name" htmlFor="name">
            <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </Field>
          <Field label="Work email" htmlFor="email">
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password" htmlFor="password" hint="At least 8 characters.">
            <PasswordInput
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </Field>

          <div className="space-y-3 rounded-xl bg-zinc-50 p-4 ring-1 ring-inset ring-zinc-200">
            <label className="flex items-start gap-3 text-[13px] leading-relaxed text-zinc-700">
              <input
                type="checkbox"
                required
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
              />
              <span>
                I agree to the{" "}
                <Link href="/legal/terms" target="_blank" className="font-medium text-zinc-950 underline underline-offset-2">
                  Terms of Service
                </Link>
                ,{" "}
                <Link href="/legal/acceptable-use" target="_blank" className="font-medium text-zinc-950 underline underline-offset-2">
                  Acceptable Use Policy
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" target="_blank" className="font-medium text-zinc-950 underline underline-offset-2">
                  Privacy Policy
                </Link>
                , and I understand AI drafts must be reviewed before use.
              </span>
            </label>
            <label className="flex items-start gap-3 text-[13px] leading-relaxed text-zinc-700">
              <input
                type="checkbox"
                required
                checked={confirmAge}
                onChange={(e) => setConfirmAge(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
              />
              <span>I am at least {legal.minimumAge} years old.</span>
            </label>
          </div>

          <Button type="submit" disabled={loading || !acceptTerms || !confirmAge} className="w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-950 underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-zinc-400">
        {site.name} · Registered in {legal.country}
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
