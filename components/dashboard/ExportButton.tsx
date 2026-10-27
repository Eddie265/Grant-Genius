"use client"

import { Download } from "lucide-react"
import type { MonthPoint } from "@/lib/dashboard"

export function ExportButton({ trend }: { trend: MonthPoint[] }) {
  const exportCsv = () => {
    const rows = [
      ["month", "year", "draft", "completed"],
      ...trend.map((d) => [d.label, d.year, d.drafts, d.completed]),
    ]
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "proposal-trend.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={exportCsv}
      className="flex h-8 items-center gap-1.5 rounded-md bg-brand-600 px-3 text-xs font-medium text-white shadow-xs hover:bg-brand-700"
    >
      <Download className="h-3.5 w-3.5" /> Export CSV
    </button>
  )
}
