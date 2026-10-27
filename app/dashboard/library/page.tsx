import Link from "next/link"
import { ArrowRight, BookOpen, FileText } from "lucide-react"
import { guides } from "@/lib/library"
import { Badge, Card, PageHeader } from "@/components/ui"

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <PageHeader
        title="Library"
        description="Practical guides and templates for writing stronger proposals. Templates open as editable proposals."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.slug} href={`/dashboard/library/${g.slug}`} className="group">
            <Card className="flex h-full flex-col p-5 transition-shadow group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  {g.type === "Template" ? <FileText className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                </div>
                <Badge tone={g.type === "Template" ? "solid" : "muted"}>{g.type}</Badge>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-zinc-950">{g.title}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-zinc-600">{g.summary}</p>
              <p className="mt-4 flex items-center gap-1 text-[13px] font-medium text-zinc-950">
                {g.minutes} min read
                <ArrowRight className="ml-auto h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-950" />
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
