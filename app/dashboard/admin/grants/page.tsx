"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge, Button, Card, CardHeader, EmptyState, Field, Input, Notice, PageHeader, Textarea } from "@/components/ui"

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
  isActive: boolean
}

const emptyForm = { title: "", description: "", category: "", region: "", fundingBody: "", amount: "", deadline: "", link: "" }

export default function AdminGrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const [reloadKey, setReloadKey] = useState(0)
  const load = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let active = true
    fetch("/api/grants?all=1")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        setGrants(data.grants ?? [])
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadKey])

  const startEdit = (g: Grant) => {
    setEditingId(g.id)
    setForm({
      title: g.title,
      description: g.description,
      category: g.category,
      region: g.region,
      fundingBody: g.fundingBody,
      amount: g.amount ?? "",
      deadline: g.deadline ? g.deadline.slice(0, 10) : "",
      link: g.link ?? "",
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setError("")
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    const res = await fetch(editingId ? `/api/grants/${editingId}` : "/api/grants", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(data.details?.[0] ? `${data.details[0].path?.join(".")}: ${data.details[0].message}` : data.error)
      return
    }
    closeForm()
    load()
  }

  const toggleActive = async (g: Grant) => {
    await fetch(`/api/grants/${g.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !g.isActive }),
    })
    load()
  }

  const remove = async (id: string) => {
    await fetch(`/api/grants/${id}`, { method: "DELETE" })
    setConfirmId(null)
    load()
  }

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value })

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <PageHeader
        title="Manage grants"
        description="Add, edit, hide or remove grant listings. Only active grants are shown to users."
        actions={
          !showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-3.5 w-3.5" /> Add grant
            </Button>
          )
        }
      />

      {showForm && (
        <Card>
          <CardHeader
            title={editingId ? "Edit grant" : "New grant"}
            action={
              <button onClick={closeForm} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900">
                <X className="h-4 w-4" />
              </button>
            }
          />
          <form onSubmit={save} className="grid gap-4 p-5 sm:grid-cols-2">
            {error && <Notice tone="error" className="sm:col-span-2">{error}</Notice>}
            <div className="sm:col-span-2">
              <Field label="Title" htmlFor="g-title" required>
                <Input id="g-title" required value={form.title} onChange={set("title")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Description" htmlFor="g-desc" required hint="At least 10 characters.">
                <Textarea id="g-desc" required minLength={10} rows={4} value={form.description} onChange={set("description")} />
              </Field>
            </div>
            <Field label="Funding body" htmlFor="g-funder" required>
              <Input id="g-funder" required value={form.fundingBody} onChange={set("fundingBody")} />
            </Field>
            <Field label="Category" htmlFor="g-cat" required>
              <Input id="g-cat" required value={form.category} onChange={set("category")} placeholder="e.g. Agriculture" />
            </Field>
            <Field label="Region" htmlFor="g-region" required>
              <Input id="g-region" required value={form.region} onChange={set("region")} placeholder="e.g. Southern Africa" />
            </Field>
            <Field label="Amount" htmlFor="g-amount">
              <Input id="g-amount" value={form.amount} onChange={set("amount")} placeholder="e.g. Up to USD 50,000" />
            </Field>
            <Field label="Deadline" htmlFor="g-deadline">
              <Input id="g-deadline" type="date" value={form.deadline} onChange={set("deadline")} />
            </Field>
            <Field label="Official link" htmlFor="g-link">
              <Input id="g-link" type="url" value={form.link} onChange={set("link")} placeholder="https://" />
            </Field>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button type="button" variant="secondary" size="sm" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {editingId ? "Save changes" : "Create grant"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : grants.length === 0 ? (
          <EmptyState icon={<Plus className="h-5 w-5" />} title="No grants yet" description="Add your first grant listing so users can draft proposals for it." />
        ) : (
          <ul className="divide-y divide-zinc-100">
            {grants.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-zinc-950">{g.title}</p>
                    <Badge tone={g.isActive ? "solid" : "muted"}>{g.isActive ? "Active" : "Hidden"}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {g.fundingBody} · {g.category} · {g.region}
                    {g.deadline ? ` · Deadline ${formatDate(g.deadline)}` : ""}
                  </p>
                </div>
                {confirmId === g.id ? (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>Cancel</Button>
                    <Button size="sm" variant="danger" onClick={() => remove(g.id)}>Delete</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(g)}>
                      {g.isActive ? "Hide" : "Publish"}
                    </Button>
                    <button onClick={() => startEdit(g)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirmId(g.id)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
