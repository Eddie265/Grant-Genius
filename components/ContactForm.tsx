"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Check, Loader2, Send } from "lucide-react"
import { Button, Field, Input, Notice, Textarea } from "@/components/ui"

type InquiryType = "SUPPORT" | "SALES" | "UPGRADE"

export function ContactForm({
  type,
  plan,
  submitLabel = "Send message",
  showCompany = false,
  showSubject = true,
  messagePlaceholder,
}: {
  type: InquiryType
  plan?: string
  submitLabel?: string
  showCompany?: boolean
  showSubject?: boolean
  messagePlaceholder?: string
}) {
  const { data: session } = useSession()
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "", website: "" })
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState("")

  // Prefill from the signed-in account without overwriting what the user typed
  const name = form.name || session?.user?.name || ""
  const email = form.email || session?.user?.email || ""

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setState("sending")
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          plan,
          name,
          email,
          company: form.company || undefined,
          subject: form.subject || undefined,
          message: form.message,
          website: form.website,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      setState("sent")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setState("idle")
    }
  }

  if (state === "sent") {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
          <Check className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-950">Message received</h3>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          Thanks{name ? `, ${name.split(" ")[0]}` : ""}. We reply by email to {email}, usually within two working days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <Notice tone="error">{error}</Notice>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="cf-name" required>
          <Input id="cf-name" required minLength={2} value={name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Email" htmlFor="cf-email" required>
          <Input id="cf-email" type="email" required value={email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
      </div>
      {showCompany && (
        <Field label="Organisation" htmlFor="cf-company">
          <Input id="cf-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </Field>
      )}
      {showSubject && (
        <Field label="Subject" htmlFor="cf-subject">
          <Input id="cf-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </Field>
      )}
      <Field label="Message" htmlFor="cf-message" required>
        <Textarea
          id="cf-message"
          required
          minLength={5}
          rows={6}
          placeholder={messagePlaceholder}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </Field>
      {/* Honeypot for bots — hidden from people and assistive tech */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />
      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
          We use your details only to reply. See our{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" disabled={state === "sending"}>
          {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
