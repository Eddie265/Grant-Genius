
import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: string
  unit?: string
  spark: number[]
  delta: number
  deltaSuffix?: string
}

export function StatCard({ label, value, unit, spark, delta, deltaSuffix = "" }: StatCardProps) {
  const max = Math.max(...spark, 1)
  const sign = delta > 0 ? "+" : ""

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="tabular font-mono text-[26px] font-semibold leading-none tracking-tight text-zinc-900">
              {value}
            </span>
            {unit && <span className="text-xs text-zinc-500">{unit}</span>}
          </p>
        </div>
        {/* Monthly sparkline — latest month is emphasized */}
        <div className="flex h-10 items-end gap-[2px]" aria-hidden>
          {spark.map((v, i) => (
            <span
              key={i}
              className={cn(
                "w-[3px] rounded-t-xs",
                i === spark.length - 1 ? "bg-brand-600" : "bg-brand-100"
              )}
              style={{ height: `${Math.max(12, (v / max) * 100)}%` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 px-4 py-2.5">
        <span className="text-[11px] text-zinc-400">Last 12 months</span>
        <p className="text-xs text-zinc-500">
          <span
            className={cn(
              "tabular font-mono font-medium",
              delta !== 0 ? "text-brand-700" : "text-zinc-400"
            )}
          >
            {delta > 0 ? "↑ " : delta < 0 ? "↓ " : ""}
            {sign}
            {delta}
            {deltaSuffix}
          </span>{" "}
          vs last month
        </p>
      </div>
    </div>
  )
}
