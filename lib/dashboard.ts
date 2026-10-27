import { prisma } from "./prisma"
import { plans } from "./site"

const MONTHS = 12

export type MonthPoint = {
  label: string
  year: number
  drafts: number
  completed: number
}

export type DashboardData = {
  user: { name: string | null; planName: string }
  totals: {
    proposals: number
    completed: number
    grants: number
    completionRate: number
  }
  usage: { used: number; allowance: number }
  deltas: {
    proposals: number
    completed: number
    grants: number
  }
  sparks: {
    proposals: number[]
    completed: number[]
    grants: number[]
    usage: number[]
  }
  trend: MonthPoint[]
  deadlines: { id: string; title: string; fundingBody: string; deadline: string }[]
  recent: {
    id: string
    title: string
    grant: string | null
    orgType: string
    status: "DRAFT" | "COMPLETED" | "ARCHIVED"
    updatedAt: string
  }[]
}

function monthKey(d: Date) {
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}`
}

function bucketByMonth(dates: Date[], months: Date[]) {
  const counts = new Map(months.map((m) => [monthKey(m), 0]))
  for (const d of dates) {
    const key = monthKey(d)
    if (counts.has(key)) counts.set(key, counts.get(key)! + 1)
  }
  return months.map((m) => counts.get(monthKey(m))!)
}

function delta(series: number[]) {
  return series[series.length - 1] - series[series.length - 2]
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const now = new Date()
  const months = Array.from({ length: MONTHS }, (_, i) =>
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS - 1 - i), 1))
  )
  const since = months[0]
  const monthStart = months[MONTHS - 1]

  const [account, proposalCount, completedCount, grantCount, proposalsInRange, grantsInRange, deadlines, recent] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, plan: true } }),
      prisma.proposal.count({ where: { userId } }),
      prisma.proposal.count({ where: { userId, status: "COMPLETED" } }),
      prisma.grant.count({ where: { isActive: true } }),
      prisma.proposal.findMany({
        where: { userId, createdAt: { gte: since } },
        select: { createdAt: true, updatedAt: true, status: true },
      }),
      prisma.grant.findMany({
        where: { createdAt: { gte: since }, isActive: true },
        select: { createdAt: true },
      }),
      prisma.grant.findMany({
        where: { isActive: true, deadline: { gte: now } },
        orderBy: { deadline: "asc" },
        take: 5,
        select: { id: true, title: true, fundingBody: true, deadline: true },
      }),
      prisma.proposal.findMany({
        where: { userId },
        take: 6,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          orgType: true,
          status: true,
          updatedAt: true,
          grant: { select: { title: true } },
        },
      }),
    ])

  const created = bucketByMonth(proposalsInRange.map((p) => p.createdAt), months)
  const completedSeries = bucketByMonth(
    proposalsInRange.filter((p) => p.status === "COMPLETED").map((p) => p.updatedAt),
    months
  )
  const drafts = bucketByMonth(
    proposalsInRange.filter((p) => p.status !== "COMPLETED").map((p) => p.createdAt),
    months
  )
  const completedByCreation = bucketByMonth(
    proposalsInRange.filter((p) => p.status === "COMPLETED").map((p) => p.createdAt),
    months
  )
  const grantSpark = bucketByMonth(grantsInRange.map((g) => g.createdAt), months)
  const plan = account?.plan ?? "FREE"

  return {
    user: { name: account?.name ?? null, planName: plans[plan].name },
    totals: {
      proposals: proposalCount,
      completed: completedCount,
      grants: grantCount,
      completionRate: proposalCount ? Math.round((completedCount / proposalCount) * 100) : 0,
    },
    usage: {
      used: proposalsInRange.filter((p) => p.createdAt >= monthStart).length,
      allowance: plans[plan].monthlyGenerations,
    },
    deltas: {
      proposals: delta(created),
      completed: delta(completedSeries),
      grants: delta(grantSpark),
    },
    sparks: {
      proposals: created,
      completed: completedSeries,
      grants: grantSpark,
      usage: created,
    },
    trend: months.map((m, i) => ({
      label: m.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      year: m.getUTCFullYear(),
      drafts: drafts[i],
      completed: completedByCreation[i],
    })),
    deadlines: deadlines.map((g) => ({
      id: g.id,
      title: g.title,
      fundingBody: g.fundingBody,
      deadline: g.deadline!.toISOString(),
    })),
    recent: recent.map((p) => ({
      id: p.id,
      title: p.title,
      grant: p.grant?.title ?? null,
      orgType: p.orgType,
      status: p.status,
      updatedAt: p.updatedAt.toISOString(),
    })),
  }
}
