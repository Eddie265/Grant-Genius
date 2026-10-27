import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { LegalDoc, type LegalSection } from "@/components/site/LegalDoc"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Acceptable Use Policy",
  description: "What you may not do with Grant Genius Africa: honesty towards funders, prohibited content and protecting the platform.",
  path: "/legal/acceptable-use",
})

const sections: LegalSection[] = [
  {
    id: "purpose",
    title: "Purpose",
    body: (
      <p>
        This policy explains what you may not do with Grant Genius. It protects funders, other users and us, and forms
        part of our Terms of Service.
      </p>
    ),
  },
  {
    id: "honesty",
    title: "Honesty towards funders",
    body: (
      <>
        <p>You must not use the Service to:</p>
        <ul>
          <li>fabricate or falsify data, results, beneficiaries, budgets, partners, endorsements or credentials;</li>
          <li>impersonate an organisation or person, or apply on behalf of an organisation without authority;</li>
          <li>submit proposals that breach a funder’s rules, including any rules on disclosing the use of AI; or</li>
          <li>commit or facilitate grant fraud, bribery, money laundering or the misuse of funds.</li>
        </ul>
      </>
    ),
  },
  {
    id: "content",
    title: "Prohibited content",
    body: (
      <>
        <p>You must not create, upload or share content that:</p>
        <ul>
          <li>infringes copyright, trademarks or other rights, or plagiarises another applicant’s work;</li>
          <li>is unlawful, defamatory, harassing, hateful or that incites violence or discrimination;</li>
          <li>contains other people’s personal or sensitive data without a lawful basis; or</li>
          <li>contains malware or harmful code.</li>
        </ul>
      </>
    ),
  },
  {
    id: "platform",
    title: "Protecting the platform",
    body: (
      <>
        <p>You must not:</p>
        <ul>
          <li>access or attempt to access other users’ accounts or data;</li>
          <li>probe, scan, overload or disrupt the Service, or bypass security, rate limits or plan limits;</li>
          <li>scrape, copy or bulk-download the grant database or library, or use automated means to access the Service without our written permission;</li>
          <li>reverse engineer the Service, or resell or sublicense it; or</li>
          <li>use the Service to build a competing product or to train AI models.</li>
        </ul>
      </>
    ),
  },
  {
    id: "law",
    title: "Legal compliance",
    body: (
      <p>
        You must comply with all laws that apply to you, including data protection, anti-corruption, anti-money
        laundering and sanctions laws.
      </p>
    ),
  },
  {
    id: "enforcement",
    title: "Enforcement and reporting",
    body: (
      <p>
        We may investigate suspected breaches and remove content, limit features, suspend or close accounts, and report
        unlawful activity to the authorities. To report misuse, email{" "}
        <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>
    ),
  },
]

export default function AcceptableUsePage() {
  return (
    <LegalDoc
      current="/legal/acceptable-use"
      title="Acceptable Use Policy"
      sections={sections}
      summary={
        <>
          <strong className="text-zinc-950">The short version:</strong> be honest with funders, respect other people’s
          rights and data, and don’t abuse or try to break the platform.
        </>
      }
    />
  )
}
