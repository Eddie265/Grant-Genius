"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, CalendarClock, Loader2, Search, Sparkles } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge, ButtonLink, Card, EmptyState, Input, Notice, PageHeader, Select } from "@/components/ui"

interface Grant {
  id: string
  title: string
  description: string
  category: string
  region: string
  fundingBody: string
  amount: string | null
  deadline: string | null
  link: string | null
}

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000)
}

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [region, setRegion] = useState("")

  useEffect(() => {
    fetch("/api/grants")
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error()
        setGrants(data.grants)
      })
      .catch(() => setError("We couldn't load grants. Refresh to try again."))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => [...new Set(grants.map((g) => g.category))].sort(), [grants])
  const regions = useMemo(() => [...new Set(grants.map((g) => g.region))].sort(), [grants])

  const visible = grants.filter((g) => {
    const q = search.toLowerCase()
    return (
      (!category || g.category === category) &&
      (!region || g.region === region) &&
      (!q || [g.title, g.description, g.fundingBody].some((v) => v.toLowerCase().includes(q)))
    )
  })

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <PageHeader
        title="Grant opportunities"
        description="Curated funding opportunities for African organisations. Always confirm details with the funder."
      />

      {error && <Notice tone="error">{error}</Notice>}

      <Card className="flex flex-col gap-3 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search by title, funder or keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="md:w-48" aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Select value={region} onChange={(e) => setRegion(e.target.value)} className="md:w-48" aria-label="Region">
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </Select>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading grants…
        </div>
      ) : grants.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="No grants listed yet"
            description="New opportunities are added regularly. Meanwhile, you can draft a proposal for any grant you’ve found yourself."
            action={
              <ButtonLink href="/dashboard/proposals/new" size="sm">
                <Sparkles className="h-3.5 w-3.5" /> Draft a proposal
              </ButtonLink>
            }
          />
        </Card>
      ) : visible.length === 0 ? (
        <p className="py-14 text-center text-sm text-zinc-500">No grants match your filters.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((grant) => {
            const days = grant.deadline ? daysUntil(grant.deadline) : null
            return (
              <Card key={grant.id} className="flex flex-col p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge>{grant.category}</Badge>
                  <Badge tone="outline">{grant.region}</Badge>
                  {days !== null && days >= 0 && days <= 14 && <Badge tone="solid">Closes in {days}d</Badge>}
                  {days !== null && days < 0 && <Badge>Closed</Badge>}
                </div>
                <h3 className="mt-3 text-[15px] font-semibold leading-snug text-zinc-950">{grant.title}</h3>
                <p className="mt-0.5 text-[13px] text-zinc-500">{grant.fundingBody}</p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600">{grant.description}</p>
                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
                  {grant.amount && (
                    <div className="flex gap-1.5">
                      <dt className="text-zinc-500">Amount</dt>
                      <dd className="font-medium text-zinc-900">{grant.amount}</dd>
                    </div>
                  )}
                  {grant.deadline && (
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-zinc-400" />
                      <dd className="font-medium text-zinc-900">{formatDate(grant.deadline)}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-5 flex items-center gap-2 border-t border-zinc-100 pt-4">
                  <ButtonLink href={`/dashboard/proposals/new?grantId=${grant.id}`} size="sm">
                    <Sparkles className="h-3.5 w-3.5" /> Draft proposal
                  </ButtonLink>
                  {grant.link && (
                    <Link
                      href={grant.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1 rounded-full px-3 text-[13px] font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    >
                      Funder’s page <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <p className="text-xs text-zinc-500">
        Listings are compiled from public sources and may change. Grant Genius is not affiliated with these funders.{" "}
        <Link href="/legal/ai-disclaimer#listings" className="underline underline-offset-2">
          About listings
        </Link>
      </p>
    </div>
  )
}
