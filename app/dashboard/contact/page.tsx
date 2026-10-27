import Link from "next/link"
import { BookOpen, Mail, ShieldCheck } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { Card, PageHeader } from "@/components/ui"
import { site } from "@/lib/site"

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <PageHeader title="Support" description="Questions about your account, a proposal or a grant listing? We’re here to help." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <h2 className="text-[15px] font-semibold text-zinc-950">Send us a message</h2>
          <p className="mt-1 text-sm text-zinc-500">We reply by email, usually within two working days.</p>
          <div className="mt-5">
            <ContactForm type="SUPPORT" />
          </div>
        </Card>
        <div className="space-y-3">
          {[
            { icon: Mail, title: "Email", body: site.supportEmail, href: `mailto:${site.supportEmail}` },
            { icon: BookOpen, title: "Library", body: "Guides and templates for stronger proposals.", href: "/dashboard/library" },
            { icon: ShieldCheck, title: "Privacy & data", body: "Export or delete your data from Settings.", href: "/dashboard/settings" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="block">
              <Card className="flex gap-4 p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-950">{item.title}</h3>
                  <p className="mt-0.5 truncate text-sm text-zinc-600">{item.body}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
