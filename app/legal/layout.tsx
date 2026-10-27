import Link from "next/link"
import { Logo } from "@/components/site/Logo"
import { LegalFooter } from "@/components/site/LegalFooter"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo height={56} />
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center rounded-full bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
          >
            Open app
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <div className="border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <LegalFooter />
        </div>
      </div>
    </div>
  )
}
