import { Building2, FileSignature, GraduationCap, Gauge } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { Card, PageHeader } from "@/components/ui"

const offers = [
  { icon: Gauge, title: "Custom limits", body: "Generation limits sized to your team’s application volume." },
  { icon: GraduationCap, title: "Onboarding", body: "Live sessions to help your team get the most from Grant Genius." },
  { icon: FileSignature, title: "Invoice billing & terms", body: "Annual invoicing and contract terms tailored to your organisation." },
  { icon: Building2, title: "Multi-programme use", body: "For networks, foundations and organisations running several programmes." },
]

export default function EnterprisePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <PageHeader
        title="Enterprise"
        description="For organisations that write many proposals a year. Tell us what you need and we’ll send a tailored quote."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {offers.map((o) => (
            <Card key={o.title} className="flex gap-4 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                <o.icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">{o.title}</h3>
                <p className="mt-0.5 text-sm text-zinc-600">{o.body}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <h2 className="text-[15px] font-semibold text-zinc-950">Talk to sales</h2>
          <p className="mt-1 text-sm text-zinc-500">We reply by email within two working days.</p>
          <div className="mt-5">
            <ContactForm
              type="SALES"
              plan="ENTERPRISE"
              showCompany
              showSubject={false}
              submitLabel="Contact sales"
              messagePlaceholder="Team size, proposals per year, programmes, anything else we should know…"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
