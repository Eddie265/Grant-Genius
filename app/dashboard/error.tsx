"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui"

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        We couldn’t load this page, usually because of a brief connection problem. Please try again.
      </p>
      <Button className="mt-6" onClick={reset}>
        <RefreshCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  )
}
