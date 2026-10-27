"use client"

import { useCallback, useEffect, useState } from "react"
import { Inbox, Loader2, Mail } from "lucide-react"
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui"

interface Inquiry {
  id: string
  type: "SUPPORT" | "SALES" | "UPGRADE"
  status: "OPEN" | "CLOSED"
  name: string
  email: string
  company: string | null
  subject: string | null
  plan: string | null
  message: string
  userId: string | null
  createdAt: string
}

const typeLabel = { SUPPORT: "Support", SALES: "Sales", UPGRADE: "Upgrade" }

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filter, setFilter] = useState<"OPEN" | "CLOSED" | "ALL">("OPEN")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [activated, setActivated] = useState<Record<string, string>>({})

  const [reloadKey, setReloadKey] = useState(0)
  const load = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let active = true
    fetch(`/api/inquiries${filter === "ALL" ? "" : `?status=${filter}`}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        setInquiries(data.inquiries ?? [])
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [filter, reloadKey])

  const setStatus = async (id: string, status: "OPEN" | "CLOSED") => {
    setBusy(id)
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setBusy(null)
    load()
  }

  const activatePlan = async (inquiry: Inquiry) => {
    if (!inquiry.userId || !inquiry.plan) return
    setBusy(inquiry.id)
    const res = await fetch(`/api/admin/users/${inquiry.userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: inquiry.plan }),
    })
    setBusy(null)
    if (res.ok) setActivated((a) => ({ ...a, [inquiry.id]: inquiry.plan! }))
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <PageHeader
        title="Inquiries"
        description="Support messages, sales leads and upgrade requests from the site and dashboard."
        actions={
          <div className="flex gap-1 rounded-full bg-zinc-100 p-1 text-[13px]">
            {(["OPEN", "CLOSED", "ALL"] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setLoading(true)
                  setFilter(f)
                }}
                className={`rounded-full px-3 py-1 font-medium ${filter === f ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"}`}
              >
                {f === "ALL" ? "All" : f === "OPEN" ? "Open" : "Closed"}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : inquiries.length === 0 ? (
        <Card>
          <EmptyState icon={<Inbox className="h-5 w-5" />} title="Inbox zero" description="No inquiries in this view." />
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((q) => (
            <Card key={q.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={q.type === "SUPPORT" ? "muted" : "solid"}>{typeLabel[q.type]}</Badge>
                    {q.plan && <Badge tone="outline">{q.plan}</Badge>}
                    {q.status === "CLOSED" && <Badge>Closed</Badge>}
                    <span className="text-xs text-zinc-400">
                      {new Date(q.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-950">
                    {q.subject || `${typeLabel[q.type]} request`}
                  </p>
                  <p className="text-[13px] text-zinc-500">
                    {q.name} · {q.email}
                    {q.company ? ` · ${q.company}` : ""}
                    {q.userId ? " · registered user" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${q.email}?subject=${encodeURIComponent(`Re: ${q.subject || `${typeLabel[q.type]} request`}`)}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium ring-1 ring-zinc-200 hover:bg-zinc-50"
                  >
                    <Mail className="h-3.5 w-3.5" /> Reply
                  </a>
                  {q.type === "UPGRADE" && q.userId && q.plan && (
                    <Button size="sm" variant="secondary" disabled={busy === q.id || !!activated[q.id]} onClick={() => activatePlan(q)}>
                      {activated[q.id] ? `${activated[q.id]} activated` : `Activate ${q.plan}`}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={q.status === "OPEN" ? "primary" : "secondary"}
                    disabled={busy === q.id}
                    onClick={() => setStatus(q.id, q.status === "OPEN" ? "CLOSED" : "OPEN")}
                  >
                    {q.status === "OPEN" ? "Mark closed" : "Reopen"}
                  </Button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">{q.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
