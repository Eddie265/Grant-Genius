"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Sparkles, Info, X } from "lucide-react"
import { Button, ButtonLink, Card, Field, Input, Notice, PageHeader, Textarea } from "@/components/ui"

interface Grant {
  id: string
  title: string
  description: string
  fundingBody: string
}

const orgTypes = ["NGO / Non-profit", "Community-based organisation", "Social enterprise", "Cooperative", "Research institution", "Faith-based organisation"]

function ProposalFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const grantId = searchParams.get("grantId")
  const [grantTitle, setGrantTitle] = useState("")
  const [goal, setGoal] = useState("")
  const [orgType, setOrgType] = useState("")
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [limitReached, setLimitReached] = useState(false)
  const [usage, setUsage] = useState<{ used: number; allowance: number } | null>(null)

  useEffect(() => {
    fetch("/api/account")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setUsage(d.usage))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!grantId) return
    fetch(`/api/grants/${grantId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.grant) {
          setSelectedGrant(data.grant)
          setGrantTitle(data.grant.title)
        }
      })
      .catch(() => {})
  }, [grantId])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setGenerating(true)

    try {
      const response = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grantTitle,
          goal,
          orgType,
          grantId: selectedGrant?.id,
          grantDescription: selectedGrant?.description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === "LIMIT_REACHED") setLimitReached(true)
        throw new Error(data.error || "Failed to generate proposal")
      }

      router.push(`/dashboard/proposals/${data.proposal.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate proposal")
      setGenerating(false)
    }
  }

  const remaining = usage ? Math.max(0, usage.allowance - usage.used) : null

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <PageHeader
        title="New proposal"
        description="Describe your project and we’ll draft a structured proposal for you to review and edit."
      />

      {error && (
        <Notice tone="error">
          {error}
          {limitReached && (
            <Link href="/dashboard/upgrade" className="ml-1 font-medium underline underline-offset-2">
              See plans
            </Link>
          )}
        </Notice>
      )}

      <Card className="p-6">
        <form onSubmit={handleGenerate} className="space-y-5">
          <Field label="Grant opportunity" htmlFor="grantTitle" required>
            {selectedGrant ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-950">{selectedGrant.title}</p>
                  <p className="truncate text-xs text-zinc-500">{selectedGrant.fundingBody}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGrant(null)
                    setGrantTitle("")
                    router.replace("/dashboard/proposals/new")
                  }}
                  className="rounded-md p-1 text-zinc-400 hover:bg-white hover:text-zinc-900"
                  title="Unlink grant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Input
                id="grantTitle"
                required
                maxLength={300}
                value={grantTitle}
                onChange={(e) => setGrantTitle(e.target.value)}
                placeholder="e.g. Climate-Smart Agriculture Fund 2026"
              />
            )}
          </Field>

          <Field label="Organisation type" htmlFor="orgType" required>
            <Input
              id="orgType"
              required
              list="org-types"
              maxLength={200}
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              placeholder="e.g. NGO / Non-profit"
            />
            <datalist id="org-types">
              {orgTypes.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>

          <Field
            label="Project goal or idea"
            htmlFor="goal"
            required
            hint="Who you serve, the problem, what you’ll do, where, and for how long. Plain language is fine."
          >
            <Textarea
              id="goal"
              required
              minLength={10}
              maxLength={5000}
              rows={7}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="We want to train 200 women smallholder farmers in Zomba district in drought-resilient farming over 18 months…"
            />
          </Field>

          <div className="flex gap-3 rounded-lg bg-zinc-50 p-4 text-[13px] leading-relaxed text-zinc-600 ring-1 ring-inset ring-zinc-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
            <p>
              The AI drafts a starting point and marks unknown facts as <strong className="text-zinc-900">[placeholders]</strong>.
              Review every claim, add your real figures, and follow the funder’s rules on AI use. Don’t include sensitive
              personal data. <Link href="/legal/ai-disclaimer" className="underline underline-offset-2">AI disclaimer</Link>
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500">
              {remaining !== null && `${remaining} of ${usage!.allowance} AI proposals left this month.`}
            </p>
            <div className="flex gap-2">
              <ButtonLink href="/dashboard/proposals" variant="secondary">
                Cancel
              </ButtonLink>
              <Button type="submit" disabled={generating || !grantTitle || !goal || !orgType || remaining === 0}>
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? "Drafting… (up to a minute)" : "Generate draft"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Loading…</div>}>
      <ProposalFormContent />
    </Suspense>
  )
}
