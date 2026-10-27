"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { cn } from "@/lib/utils"

// Access is enforced by proxy.ts, which redirects signed-out visitors to /login
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex lg:hidden",
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn("absolute inset-0 bg-zinc-950/40 transition-opacity", sidebarOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={cn(
            "relative h-full transition-transform duration-200",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden h-full lg:block">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
