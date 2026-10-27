"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/site/Logo"
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Search,
  LifeBuoy,
  CreditCard,
  Building2,
  Settings,
  ChevronsUpDown,
  LogOut,
  Inbox,
  Activity,
  Library,
} from "lucide-react"

const sections = [
  {
    title: "Workspace",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Grants", href: "/dashboard/grants", icon: Search },
      { name: "Proposals", href: "/dashboard/proposals", icon: FileText },
      { name: "Library", href: "/dashboard/library", icon: BookOpen },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Plans & billing", href: "/dashboard/upgrade", icon: CreditCard },
      { name: "Enterprise", href: "/dashboard/enterprise", icon: Building2 },
      { name: "Support", href: "/dashboard/contact", icon: LifeBuoy },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
]

const adminSection = {
  title: "Admin",
  items: [
    { name: "Manage grants", href: "/dashboard/admin/grants", icon: Library },
    { name: "Inquiries", href: "/dashboard/admin/inquiries", icon: Inbox },
    { name: "System", href: "/dashboard/admin/system", icon: Activity },
  ],
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const user = session?.user
  const visibleSections = user?.role === "ADMIN" ? [...sections, adminSection] : sections
  const initials = (user?.name || user?.email || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-24 items-center px-5">
        <Logo height={60} href="/dashboard" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {visibleSections.map((section, i) => (
          <div key={section.title} className={cn(i > 0 && "mt-6")}>
            <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors",
                      isActive
                        ? "bg-brand-50 font-medium text-brand-700"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-brand-600" : "text-zinc-400")} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative border-t border-zinc-100 p-3">
        {menuOpen && (
          <div className="absolute inset-x-3 bottom-full mb-2 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-xl">
            <Link
              href="/dashboard/settings"
              onClick={() => {
                setMenuOpen(false)
                onNavigate?.()
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <Settings className="h-4 w-4 text-zinc-400" /> Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <LogOut className="h-4 w-4 text-zinc-400" /> Sign out
            </button>
          </div>
        )}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-zinc-50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-semibold text-white">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-zinc-950">{user?.name || "Account"}</span>
            <span className="block truncate text-[11px] text-zinc-500">{user?.email}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" />
        </button>
      </div>
    </div>
  )
}
