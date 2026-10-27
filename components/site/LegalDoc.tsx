import Link from "next/link"
import type { ReactNode } from "react"
import { legal, legalPages } from "@/lib/site"

export type LegalSection = { id: string; title: string; body: ReactNode }

export function LegalDoc({
  title,
  summary,
  sections,
  current,
}: {
  title: string
  summary: ReactNode
  sections: LegalSection[]
  current: string
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Legal</p>
          <nav className="mt-3 flex flex-wrap gap-1 lg:flex-col">
            {legalPages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className={`rounded-lg px-2.5 py-1.5 text-[13px] transition-colors ${
                  p.href === current ? "bg-brand-600 font-medium text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                {p.title}
              </Link>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-[-0.03em] text-zinc-950 sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-zinc-500">
            Effective {legal.effectiveDate} · Version {legal.termsVersion}
          </p>
          <div className="mt-8 rounded-xl bg-zinc-50 p-5 text-[15px] leading-relaxed text-zinc-700 ring-1 ring-inset ring-zinc-200">
            {summary}
          </div>

          <nav aria-label="On this page" className="mt-10 border-l border-zinc-200 pl-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">On this page</p>
            <ol className="mt-2 columns-1 gap-8 text-[13px] sm:columns-2">
              {sections.map((s, i) => (
                <li key={s.id} className="py-0.5">
                  <a href={`#${s.id}`} className="text-zinc-600 hover:text-zinc-950">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose-doc mt-6">
            {sections.map((s, i) => (
              <section key={s.id}>
                <h2 id={s.id}>
                  {i + 1}. {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
