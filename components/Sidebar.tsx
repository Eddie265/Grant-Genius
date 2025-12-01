"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Headphones,
  ArrowUp,
  UserCircle,
  Database,
  List,
  MapPin,
  ChevronRight,
  User,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Library", href: "/dashboard/library", icon: BookOpen },
  { name: "Proposals", href: "/dashboard/proposals", icon: FileText },
  { name: "Contact", href: "/dashboard/contact", icon: Headphones },
  { name: "Upgrade", href: "/dashboard/upgrade", icon: ArrowUp },
  { name: "Sales", href: "/dashboard/sales", icon: UserCircle },
  { name: "Database", href: "/dashboard/database", icon: Database },
  { name: "Enterprise plan", href: "/dashboard/enterprise", icon: List },
]

export function Sidebar() {
  const pathname = usePathname()
  // Authentication removed - no session check needed

  return (
    <div className="flex h-screen w-64 flex-col bg-primary-900 text-white">
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-center border-b border-primary-800 px-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-orange-500" />
          <div className="flex flex-col">
            <span className="text-lg font-bold">GrantGenius</span>
            <span className="text-xs text-primary-300">frica</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-800 text-white"
                  : "text-primary-200 hover:bg-primary-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-primary-800 p-4 bg-primary-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center">
            <User className="h-6 w-6 text-primary-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              User
            </p>
          </div>
          <button className="p-1 hover:bg-primary-700 rounded">
            <ChevronRight className="h-5 w-5 text-primary-300" />
          </button>
        </div>
      </div>
    </div>
  )
}
