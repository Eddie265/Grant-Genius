import Link from "next/link"
import { cn } from "@/lib/utils"
import { legal, legalPages } from "@/lib/site"

export function LegalFooter({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between", inverted ? "text-brand-200/60" : "text-zinc-500", className)}>
      <p>
        © {new Date().getFullYear()} {legal.entity} · {legal.country}
      </p>
      <nav className="flex flex-wrap gap-x-4 gap-y-1">
        {legalPages.map((p) => (
          <Link key={p.href} href={p.href} className={inverted ? "hover:text-white" : "hover:text-zinc-950"}>
            {p.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
