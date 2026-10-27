"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { Badge, Button, ButtonLink, Card, PageHeader } from "@/components/ui"
import { plans } from "@/lib/site"

type Account = { plan: keyof typeof plans }
type Usage = { used: number; allowance: number; planName: string }

const tiers = [
  {
    id: "FREE" as const,
    price: "$0",
    period: "forever",
    features: [`${plans.FREE.monthlyGenerations} AI proposals / month`, "Grant database", "Editor & exports", "Library guides & templates"],
  },
  {
    id: "PRO" as const,
    price: "$29",
    period: "per month",
    features: [`${plans.PRO.monthlyGenerations} AI proposals / month`, "Everything in Free", "Priority email support", "Early access to new features"],
  },
  {
    id: "ENTERPRISE" as const,
    price: "Custom",
    period: "annual",
    features: ["Custom generation limits", "Team onboarding", "Invoice billing", "Custom terms on request"],
  },
]

export default function UpgradePage() {
  const [account, setAccount] = useState<Account | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((d) => {
        setAccount(d.account)
        setUsage(d.usage)
      })
      .catch(() => {})
  }, [])

  const pct = usage ? Math.min(100, Math.round((usage.used / usage.allowance) * 100)) : 0

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <PageHeader title="Plans & billing" description="Your plan, this month’s usage, and upgrade options." />

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[13px] text-zinc-500">Current plan</p>
            <p className="mt-0.5 text-xl font-semibold text-zinc-950">{usage?.planName ?? "…"}</p>
          </div>
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-[13px]">
              <span className="text-zinc-500">AI proposals this month</span>
              <span className="font-mono font-medium text-zinc-950">
                {usage ? `${usage.used} / ${usage.allowance}` : "—"}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">Resets on the 1st of each month (UTC).</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {tiers.map((tier) => {
          const current = account?.plan === tier.id
          const featured = tier.id === "PRO"
          return (
            <Card key={tier.id} className={`flex flex-col p-6 ${featured ? "ring-2 ring-brand-600" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-zinc-950">{plans[tier.id].name}</h3>
                {current ? <Badge tone="solid">Current</Badge> : featured ? <Badge tone="outline">Popular</Badge> : null}
              </div>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-zinc-950">{tier.price}</span>
                <span className="text-sm text-zinc-500">{tier.period}</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-950" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {current ? (
                  <Button variant="secondary" disabled className="w-full">
                    Your plan
                  </Button>
                ) : tier.id === "PRO" ? (
                  <Button className="w-full" onClick={() => setRequesting(true)}>
                    Request Pro upgrade
                  </Button>
                ) : tier.id === "ENTERPRISE" ? (
                  <ButtonLink href="/dashboard/enterprise" variant="secondary" className="w-full">
                    Contact sales
                  </ButtonLink>
                ) : (
                  <Button variant="ghost" disabled className="w-full">
                    Included
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {requesting && (
        <Card className="p-6">
          <h2 className="text-[15px] font-semibold text-zinc-950">Request a Pro upgrade</h2>
          <p className="mt-1 text-sm text-zinc-500">
            We’ll email you a quote and payment options. Your plan changes only after you accept and pay; nothing is
            charged automatically.
          </p>
          <div className="mt-5">
            <ContactForm
              type="UPGRADE"
              plan="PRO"
              showSubject={false}
              showCompany
              submitLabel="Request upgrade"
              messagePlaceholder="Anything we should know? e.g. preferred payment method, billing currency, organisation details for the invoice."
            />
          </div>
        </Card>
      )}

      <p className="text-xs text-zinc-500">
        Prices in USD, excluding applicable taxes. See the{" "}
        <Link href="/legal/refunds" className="underline underline-offset-2">
          Billing & Refund Policy
        </Link>
        .
      </p>
    </div>
  )
}
