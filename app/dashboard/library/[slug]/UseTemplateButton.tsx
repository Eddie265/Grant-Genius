"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FilePlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui"

export function UseTemplateButton({ slug }: { slug: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const create = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: slug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/dashboard/proposals/${data.proposal.id}`)
    } catch {
      setError("Couldn't create the proposal. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={create} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus className="h-4 w-4" />}
        Use this template
      </Button>
      {error && <p className="text-xs text-zinc-950">{error}</p>}
    </div>
  )
}
