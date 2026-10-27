import Link from "next/link"
import { notFound } from "next/navigation"
import { marked } from "marked"
import { ArrowLeft } from "lucide-react"
import { getGuide, guides } from "@/lib/library"
import { Badge, Card } from "@/components/ui"
import { UseTemplateButton } from "./UseTemplateButton"

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  // Library content is authored in-repo, so rendering its Markdown as HTML is safe
  const html = await marked.parse(guide.body)

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8">
      <Link href="/dashboard/library" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-950">
        <ArrowLeft className="h-3.5 w-3.5" /> Library
      </Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone={guide.type === "Template" ? "solid" : "muted"}>{guide.type}</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">{guide.title}</h1>
          <p className="mt-2 text-zinc-600">{guide.summary}</p>
        </div>
        {guide.type === "Template" && <UseTemplateButton slug={guide.slug} />}
      </div>
      <Card className="mt-8 px-6 py-2 sm:px-10 sm:py-6">
        <div className="prose-doc" dangerouslySetInnerHTML={{ __html: html }} />
      </Card>
    </div>
  )
}
