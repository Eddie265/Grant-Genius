import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { Badge, Card, CardHeader, PageHeader } from "@/components/ui"
import { PlanSelect } from "./PlanSelect"

export const dynamic = "force-dynamic"

async function checkDatabase(): Promise<{ ok: boolean; version?: string; latency?: number }> {
  const started = Date.now()
  try {
    const [{ version }] = await prisma.$queryRaw<{ version: string }[]>`SELECT version()`
    return { ok: true, version: version.split(" on ")[0], latency: Date.now() - started }
  } catch {
    return { ok: false }
  }
}

export default async function SystemPage() {
  const user = await getCurrentUser()
  if (user?.role !== "ADMIN") redirect("/dashboard")

  const database = await checkDatabase()

  const [users, proposals, grants, openInquiries, recentUsers] = database.ok
    ? await Promise.all([
        prisma.user.count(),
        prisma.proposal.count(),
        prisma.grant.count({ where: { isActive: true } }),
        prisma.inquiry.count({ where: { status: "OPEN" } }),
        prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          take: 50,
          select: { id: true, name: true, email: true, role: true, plan: true, createdAt: true, _count: { select: { proposals: true } } },
        }),
      ])
    : [0, 0, 0, 0, []]

  const aiProvider = process.env.AI_PROVIDER || (process.env.GROQ_API_KEY ? "groq" : process.env.OPENAI_API_KEY ? "openai" : "none")
  const aiKeySet = Boolean(
    { groq: process.env.GROQ_API_KEY, openai: process.env.OPENAI_API_KEY }[aiProvider as "groq" | "openai"]
  )

  const checks = [
    { label: "Database (Neon Postgres)", ok: database.ok, detail: database.ok ? `${database.version} · ${database.latency} ms` : "Unreachable" },
    { label: "Neon branch", ok: Boolean(process.env.NEON_BRANCH), detail: process.env.NEON_BRANCH ?? "Not set" },
    { label: "AI provider", ok: aiKeySet, detail: aiKeySet ? aiProvider : `${aiProvider} — API key missing` },
    { label: "Auth secret", ok: Boolean(process.env.NEXTAUTH_SECRET), detail: process.env.NEXTAUTH_SECRET ? "Configured" : "Missing" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <PageHeader title="System" description="Service health, totals and user plans." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Users", users],
          ["Proposals", proposals],
          ["Active grants", grants],
          ["Open inquiries", openInquiries],
        ].map(([label, value]) => (
          <Card key={label as string} className="p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
            <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-zinc-950">{value as number}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Health checks" />
        <ul className="divide-y divide-zinc-100">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
              <span className="text-zinc-700">{c.label}</span>
              <span className="flex items-center gap-2 text-right">
                <span className="truncate text-zinc-500">{c.detail}</span>
                <Badge tone={c.ok ? "solid" : "outline"}>{c.ok ? "OK" : "Action needed"}</Badge>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Users" description="Most recent 50. Change a plan after a customer has paid." />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="px-5 py-2.5 font-medium">User</th>
                <th className="px-5 py-2.5 font-medium">Joined</th>
                <th className="px-5 py-2.5 font-medium">Proposals</th>
                <th className="px-5 py-2.5 font-medium">Plan</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-zinc-950">
                      {u.name || "—"} {u.role === "ADMIN" && <Badge tone="outline" className="ml-1">Admin</Badge>}
                    </p>
                    <p className="text-xs text-zinc-500">{u.email}</p>
                  </td>
                  <td className="px-5 py-3 text-zinc-600">{u.createdAt.toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-3 font-mono text-zinc-900">{u._count.proposals}</td>
                  <td className="px-5 py-3">
                    <PlanSelect userId={u.id} plan={u.plan} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
