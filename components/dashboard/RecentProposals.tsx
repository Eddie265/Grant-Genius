import Link from "next/link"
import { CheckCircle2, Clock, Archive, MoreHorizontal, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DashboardData } from "@/lib/dashboard"

const statusStyles = {
  COMPLETED: { label: "Completed", icon: CheckCircle2, className: "bg-brand-600 text-white ring-brand-600" },
  DRAFT: { label: "Draft", icon: Clock, className: "bg-white text-zinc-900 ring-zinc-300" },
  ARCHIVED: { label: "Archived", icon: Archive, className: "bg-zinc-100 text-zinc-500 ring-zinc-200" },
}

export function RecentProposals({ rows }: { rows: DashboardData["recent"] }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">Recent Proposals</p>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/proposals"
            className="hidden h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50 sm:flex"
          >
            View all
          </Link>
          <Link
            href="/dashboard/proposals/new"
            className="flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 px-3 text-xs font-medium text-zinc-900 hover:bg-zinc-50"
          >
            <Plus className="h-3.5 w-3.5" /> New Proposal
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-2.5 font-medium">ID</th>
              <th className="px-4 py-2.5 font-medium">Proposal</th>
              <th className="px-4 py-2.5 font-medium">Grant</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Organisation</th>
              <th className="px-4 py-2.5 font-medium">Updated</th>
              <th className="px-4 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">
                  No proposals yet.{" "}
                  <Link href="/dashboard/proposals/new" className="font-medium text-zinc-900 underline underline-offset-2">
                    Create your first one
                  </Link>
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const status = statusStyles[row.status]
              return (
                <tr key={row.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/70">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">#{row.id.slice(-6)}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 font-medium text-zinc-900">
                    <Link href={`/dashboard/proposals/${row.id}`} className="hover:underline">
                      {row.title}
                    </Link>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-zinc-600">{row.grant ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                        status.className
                      )}
                    >
                      <status.icon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{row.orgType}</td>
                  <td className="tabular px-4 py-3 font-mono text-xs text-zinc-600">
                    {new Date(row.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/proposals/${row.id}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-white hover:text-zinc-900"
                    >
                      <span className="sr-only">Open</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
