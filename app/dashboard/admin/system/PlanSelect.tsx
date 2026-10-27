"use client"

import { useState } from "react"
import { Select } from "@/components/ui"

export function PlanSelect({ userId, plan }: { userId: string; plan: string }) {
  const [value, setValue] = useState(plan)
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const change = async (next: string) => {
    const previous = value
    setValue(next)
    setState("saving")
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: next }),
    })
    if (res.ok) setState("saved")
    else {
      setValue(previous)
      setState("error")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onChange={(e) => change(e.target.value)} className="h-8 w-32 text-[13px]" aria-label="Plan">
        <option value="FREE">Free</option>
        <option value="PRO">Pro</option>
        <option value="ENTERPRISE">Enterprise</option>
      </Select>
      <span className="text-xs text-zinc-500">
        {state === "saving" ? "Saving…" : state === "saved" ? "Saved" : state === "error" ? "Failed" : ""}
      </span>
    </div>
  )
}
