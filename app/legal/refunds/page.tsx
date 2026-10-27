import type { Metadata } from "next"
import Link from "next/link"
import { LegalDoc, type LegalSection } from "@/components/site/LegalDoc"
import { plans, site } from "@/lib/site"

export const metadata: Metadata = { title: "Billing & Refund Policy" }

const sections: LegalSection[] = [
  {
    id: "plans",
    title: "Plans",
    body: (
      <p>
        The Free plan includes {plans.FREE.monthlyGenerations} AI proposal generations per calendar month. Paid plans
        (Pro and Enterprise) include higher limits as described on the <Link href="/dashboard/upgrade">Plans &amp; billing page</Link> or in
        your quote. Unused generations do not roll over.
      </p>
    ),
  },
  {
    id: "upgrades",
    title: "How upgrades and payment work",
    body: (
      <>
        <p>
          You request an upgrade from your dashboard or by contacting sales. We then send you a quote or invoice stating
          the plan, price, billing period and payment method. <strong>Your paid plan starts only after you accept the
          quote and your payment is received</strong>; we never charge you without your agreement.
        </p>
        <p>Prices are in US dollars unless your quote says otherwise, and exclude taxes unless stated.</p>
      </>
    ),
  },
  {
    id: "renewal",
    title: "Renewal and cancellation",
    body: (
      <p>
        Paid plans run for the billing period in your quote. We will remind you before renewal. You can cancel at any
        time by emailing <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>; cancellation takes effect at
        the end of the current paid period and your account then returns to the Free plan. Your proposals are not
        deleted when you downgrade.
      </p>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    body: (
      <>
        <ul>
          <li>
            <strong>14-day guarantee:</strong> if you are unhappy with your first paid period, ask for a refund within
            14 days of payment and we will refund it in full.
          </li>
          <li>
            <strong>Service failures:</strong> if the Service is unavailable for an extended period because of a fault
            on our side, we will offer a pro-rata credit or refund.
          </li>
          <li>Otherwise, fees for a period that has started are not refundable, except where the law requires.</li>
        </ul>
        <p>Refunds are paid to the original payment method within 14 days of approval.</p>
      </>
    ),
  },
  {
    id: "non-payment",
    title: "Non-payment",
    body: (
      <p>If an invoice is not paid by its due date, we may return your account to the Free plan after giving notice.</p>
    ),
  },
  {
    id: "rights",
    title: "Your statutory rights",
    body: (
      <p>
        This policy does not affect any rights you have under consumer protection law that cannot be excluded, including
        the Consumer Protection Act of Malawi.
      </p>
    ),
  },
]

export default function RefundsPage() {
  return (
    <LegalDoc
      current="/legal/refunds"
      title="Billing & Refund Policy"
      sections={sections}
      summary={
        <>
          <strong className="text-zinc-950">The short version:</strong> no charge without a quote you accept, cancel
          anytime, and a full refund within 14 days of your first payment if you’re not happy.
        </>
      }
    />
  )
}
