"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Menu, Plus } from "lucide-react"
import { ButtonLink } from "@/components/ui"

type HeaderProps = {
  onMenuClick?: () => void
}

const labels: Record<string, string> = {
  grants: "Grants",
  proposals: "Proposals",
  library: "Library",
  upgrade: "Plans & billing",
  enterprise: "Enterprise",
  contact: "Support",
  settings: "Settings",
  admin: "Admin",
  inquiries: "Inquiries",
  system: "System",
  new: "New proposal",
}

function crumbsFor(pathname: string) {
  const parts = pathname.split("/").filter(Boolean).slice(1)
  return parts.map((part, i) => ({
    label: labels[part] ?? (part.length > 20 ? "Details" : part.replace(/-/g, " ")),
    href: "/dashboard/" + parts.slice(0, i + 1).join("/"),
  }))
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const crumbs = crumbsFor(pathname)

  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center gap-2">
        {onMenuClick && (
          <button
            type="button"
            className="-ml-1 inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
            onClick={onMenuClick}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-5 w-5" />
          </button>
        )}
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          <Link href="/dashboard" className={crumbs.length ? "text-zinc-400 hover:text-zinc-700" : "font-medium text-zinc-950"}>
            Overview
          </Link>
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-300" />
              {i === crumbs.length - 1 ? (
                <span className="truncate font-medium capitalize text-zinc-950">{c.label}</span>
              ) : (
                <Link href={c.href} className="truncate capitalize text-zinc-400 hover:text-zinc-700">
                  {c.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {pathname !== "/dashboard/proposals/new" && (
        <ButtonLink href="/dashboard/proposals/new" size="sm" className="shrink-0">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New proposal</span>
        </ButtonLink>
      )}
    </div>
  )
}
