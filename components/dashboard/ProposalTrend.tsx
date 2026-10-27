"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MonthPoint } from "@/lib/dashboard"

const ROWS = 14

export function ProposalTrend({ data, total }: { data: MonthPoint[]; total: number }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.drafts + d.completed), 1)
  // Each square represents `unit` proposals so the tallest month fits in ROWS squares
  const unit = Math.max(1, Math.ceil(max / ROWS))
  const ticks = [ROWS, Math.round(ROWS * 0.75), Math.round(ROWS / 2), Math.round(ROWS / 4), 0]
  const isEmpty = total === 0

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">Proposal Trend</p>
        <button className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <p className="flex items-baseline gap-2">
            <span className="text-xs text-zinc-500">Total proposals :</span>
            <span className="tabular font-mono text-2xl font-semibold tracking-tight">{total.toLocaleString()}</span>
          </p>
          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-brand-200" /> Draft
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-brand-600" /> Completed
            </span>
          </div>
        </div>
        <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          Last 12 months
        </span>
      </div>

      <div className="relative flex gap-3 px-4 pb-4 pt-5">
        {/* Y axis */}
        <div className="flex h-[196px] flex-col justify-between pb-0 text-right font-mono text-[10px] text-zinc-400">
          {ticks.map((t) => (
            <span key={t} className="tabular leading-none">
              {t * unit}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative flex h-[196px] items-end justify-between gap-1">
            {data.map((d, i) => {
              const completedSq = Math.ceil(d.completed / unit)
              const draftSq = Math.ceil(d.drafts / unit)
              const active = hovered === i
              return (
                <div
                  key={`${d.label}-${d.year}`}
                  className="relative flex h-full flex-1 cursor-default flex-col-reverse items-center gap-[2px]"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {Array.from({ length: completedSq }).map((_, k) => (
                    <span key={`c${k}`} className="h-[12px] w-full max-w-[26px] rounded-[2px] bg-brand-600" />
                  ))}
                  {Array.from({ length: draftSq }).map((_, k) => (
                    <span key={`d${k}`} className="h-[12px] w-full max-w-[26px] rounded-[2px] bg-brand-200" />
                  ))}
                  {active && (
                    <>
                      <span className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-dashed border-brand-400" />
                      <div
                        className={cn(
                          "pointer-events-none absolute top-6 z-10 w-36 rounded-lg border border-zinc-200 bg-white p-2.5 text-xs shadow-lg",
                          i > data.length / 2 ? "right-1/2 mr-2" : "left-1/2 ml-2"
                        )}
                      >
                        <p className="mb-1.5 font-medium text-zinc-500">
                          {d.label} {d.year}
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-zinc-500">
                            <span className="h-2 w-2 rounded-xs bg-brand-200" /> Draft
                          </span>
                          <span className="tabular font-mono font-semibold">{d.drafts}</span>
                        </p>
                        <p className="mt-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-zinc-500">
                            <span className="h-2 w-2 rounded-xs bg-brand-600" /> Completed
                          </span>
                          <span className="tabular font-mono font-semibold">{d.completed}</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
            {isEmpty && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="rounded-md bg-white px-3 py-1.5 text-sm text-zinc-500">
                  No proposals yet — generate one to see your trend.
                </p>
              </div>
            )}
          </div>
          <div className="mt-2 flex justify-between gap-1 border-t border-zinc-200 pt-2">
            {data.map((d, i) => (
              <span
                key={`${d.label}-${d.year}`}
                className={cn(
                  "flex-1 text-center font-mono text-[10px] uppercase",
                  hovered === i ? "font-semibold text-zinc-900" : "text-zinc-400"
                )}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
