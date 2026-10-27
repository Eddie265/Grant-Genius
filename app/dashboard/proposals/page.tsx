"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Plus, Trash2, Loader2, Search } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge, Button, ButtonLink, Card, EmptyState, Input, Notice, PageHeader } from "@/components/ui"

interface Proposal {
  id: string
  title: string
  status: "DRAFT" | "COMPLETED" | "ARCHIVED"
  orgType: string
  createdAt: string
  updatedAt: string
  grant: { id: string; title: string; fundingBody: string } | null
}

const statusTone = { COMPLETED: "solid", DRAFT: "outline", ARCHIVED: "muted" } as const
const statusLabel = { COMPLETED: "Completed", DRAFT: "Draft", ARCHIVED: "Archived" }

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"ALL" | Proposal["status"]>("ALL")
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/proposals")
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        setProposals(data.proposals)
      })
      .catch(() => setError("We couldn't load your proposals. Refresh to try again."))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/proposals/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error()
      setProposals((list) => list.filter((p) => p.id !== id))
    } catch {
      setError("Failed to delete the proposal. Please try again.")
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  const visible = proposals.filter(
    (p) =>
      (status === "ALL" || p.status === status) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.grant?.title.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <PageHeader
        title="Proposals"
        description="Every draft you’ve generated or edited."
        actions={
          <ButtonLink href="/dashboard/proposals/new" size="sm">
            <Plus className="h-3.5 w-3.5" /> New proposal
          </ButtonLink>
        }
      />

      {error && <Notice tone="error">{error}</Notice>}

      <Card>
        <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input placeholder="Search proposals" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-1 rounded-full bg-zinc-100 p-1 text-[13px]">
            {(["ALL", "DRAFT", "COMPLETED", "ARCHIVED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  status === s ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {s === "ALL" ? "All" : statusLabel[s]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading proposals…
          </div>
        ) : proposals.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-5 w-5" />}
            title="No proposals yet"
            description="Describe your project and we’ll draft a structured proposal you can edit and export."
            action={
              <ButtonLink href="/dashboard/proposals/new" size="sm">
                <Plus className="h-3.5 w-3.5" /> Create your first proposal
              </ButtonLink>
            }
          />
        ) : visible.length === 0 ? (
          <p className="py-14 text-center text-sm text-zinc-500">No proposals match your filters.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {visible.map((proposal) => (
              <li key={proposal.id} className="flex items-center gap-4 px-4 py-4 sm:px-5">
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 sm:flex">
                  <FileText className="h-[18px] w-[18px]" />
                </div>
                <Link href={`/dashboard/proposals/${proposal.id}`} className="group min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-zinc-950 group-hover:underline">{proposal.title}</p>
                    <Badge tone={statusTone[proposal.status]}>{statusLabel[proposal.status]}</Badge>
                  </div>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {proposal.grant ? `${proposal.grant.fundingBody} · ` : ""}
                    {proposal.orgType} · Updated {formatDate(proposal.updatedAt)}
                  </p>
                </Link>
                {confirmId === proposal.id ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-xs text-zinc-500 sm:inline">Delete permanently?</span>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="danger" disabled={deletingId === proposal.id} onClick={() => handleDelete(proposal.id)}>
                      {deletingId === proposal.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Delete"}
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(proposal.id)}
                    className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950"
                    title="Delete proposal"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {proposal.title}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
