import { redirect } from "next/navigation"
import { getDashboardData } from "@/lib/dashboard"
import { getCurrentUser } from "@/lib/session"
import { StatCard } from "@/components/dashboard/StatCard"
import { ProposalTrend } from "@/components/dashboard/ProposalTrend"
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines"
import { RecentProposals } from "@/components/dashboard/RecentProposals"
import { ExportButton } from "@/components/dashboard/ExportButton"

// Always read fresh numbers from Neon
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?callbackUrl=/dashboard")

  const data = await getDashboardData(user.id)
  const firstName = data.user.name?.split(" ")[0]
  const remaining = Math.max(0, data.usage.allowance - data.usage.used)

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {data.user.planName} plan · {remaining} of {data.usage.allowance} AI proposals left this month
          </p>
        </div>
        <ExportButton trend={data.trend} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="My proposals"
          value={data.totals.proposals.toLocaleString()}
          unit="total"
          spark={data.sparks.proposals}
          delta={data.deltas.proposals}
        />
        <StatCard
          label="Completed"
          value={data.totals.completed.toLocaleString()}
          unit={`${data.totals.completionRate}% of all`}
          spark={data.sparks.completed}
          delta={data.deltas.completed}
        />
        <StatCard
          label="AI drafts this month"
          value={`${data.usage.used}/${data.usage.allowance}`}
          spark={data.sparks.usage}
          delta={data.deltas.proposals}
        />
        <StatCard
          label="Open grants"
          value={data.totals.grants.toLocaleString()}
          unit="listed"
          spark={data.sparks.grants}
          delta={data.deltas.grants}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProposalTrend data={data.trend} total={data.totals.proposals} />
        </div>
        <UpcomingDeadlines deadlines={data.deadlines} />
      </div>

      <RecentProposals rows={data.recent} />
    </div>
  )
}
