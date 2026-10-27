import Link from "next/link"
import { ArrowRight, CalendarClock } from "lucide-react"
import type { DashboardData } from "@/lib/dashboard"

function daysLeft(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
}

export function UpcomingDeadlines({ deadlines }: { deadlines: DashboardData["deadlines"] }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">Upcoming deadlines</p>
        <Link href="/dashboard/grants" className="text-xs font-medium text-zinc-500 hover:text-zinc-950">
          All grants
        </Link>
      </div>
      {deadlines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <CalendarClock className="h-5 w-5 text-zinc-400" />
          <p className="mt-3 text-sm text-zinc-500">No upcoming grant deadlines listed right now.</p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-zinc-100">
          {deadlines.map((g) => {
            const days = daysLeft(g.deadline)
            return (
              <li key={g.id}>
                <Link
                  href={`/dashboard/proposals/new?grantId=${g.id}`}
                  className="group flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-50"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-brand-600 py-1.5 text-white">
                    <span className="font-mono text-base font-semibold leading-none">{days}</span>
                    <span className="mt-0.5 text-[9px] uppercase tracking-wider text-brand-100">{days === 1 ? "day" : "days"}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-950">{g.title}</p>
                    <p className="truncate text-xs text-zinc-500">{g.fundingBody}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
