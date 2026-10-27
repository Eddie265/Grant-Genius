import type { Metadata } from "next"
import Link from "next/link"
import { LegalDoc, type LegalSection } from "@/components/site/LegalDoc"
import { legal, site } from "@/lib/site"

export const metadata: Metadata = { title: "Privacy Policy" }

const processors = [
  ["Neon (Databricks, Inc.)", "Database hosting for accounts, proposals and messages", "United States (AWS us-east-2)"],
  ["Groq, Inc.", "AI model that generates proposal drafts from your inputs", "United States"],
  ["Our web hosting provider", "Serving the website and application", "Region of deployment"],
  ["OpenAI / Anthropic (only if enabled)", "Alternative AI models for proposal drafts", "United States"],
]

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <p>
        {legal.entity} (“we”, “us”), registered in {legal.country}, is the data controller for personal data processed
        through the Grant Genius website and application. We comply with {legal.dataProtectionLaw} and, where they
        apply to you, other data protection laws such as the GDPR, POPIA (South Africa), the Nigeria Data Protection Act
        and the Kenya Data Protection Act. Contact us at <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
      </p>
    ),
  },
  {
    id: "data-we-collect",
    title: "Personal data we collect",
    body: (
      <>
        <h3>Information you give us</h3>
        <ul>
          <li><strong>Account data:</strong> your name, email address and password (stored only as a one-way bcrypt hash).</li>
          <li><strong>Proposal data:</strong> grant titles, organisation type, project goals, generated drafts and your edits.</li>
          <li><strong>Messages:</strong> what you send through our contact, sales and upgrade forms, including your name, email and organisation.</li>
          <li><strong>Consent records:</strong> the date and version of the Terms and Privacy Policy you accepted.</li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li><strong>Technical data:</strong> IP address, browser type and request logs, used for security, abuse prevention and rate limiting.</li>
          <li><strong>Essential cookies:</strong> to keep you signed in and protect forms. See our <Link href="/legal/cookies">Cookie Policy</Link>.</li>
        </ul>
        <p>
          We do not use advertising or cross-site tracking cookies and we do not sell personal data. We do not currently
          collect payment card details. Please do not include sensitive personal data (such as health information,
          religious beliefs or national ID numbers) about yourself or others in your proposals.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your data and our legal bases",
    body: (
      <ul>
        <li><strong>To provide the Service</strong> (create your account, generate, store and export proposals) — necessary to perform our contract with you.</li>
        <li><strong>To keep the Service secure</strong> (authentication, rate limiting, fraud and abuse prevention) — our legitimate interests and legal obligations.</li>
        <li><strong>To respond to your messages</strong> and arrange plan upgrades — contract and legitimate interests.</li>
        <li><strong>To send service notices</strong> (for example changes to these policies) — contract and legal obligation.</li>
        <li><strong>To comply with law</strong> and enforce our Terms — legal obligation and legitimate interests.</li>
      </ul>
    ),
  },
  {
    id: "ai-processing",
    title: "How AI processing works",
    body: (
      <>
        <p>
          When you generate a proposal, the grant title, organisation type, project goal and any grant description are
          sent to our AI provider to produce the draft. The provider processes this data on our behalf to return the
          result. <strong>We do not use your content to train AI models</strong>, and we select providers whose API
          terms do not permit them to train on your inputs.
        </p>
        <p>AI output is not used to make automated decisions that produce legal or similarly significant effects on you.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share data with",
    body: (
      <>
        <p>We share personal data only with service providers (“processors”) that help us run the Service, under contracts that require them to protect it:</p>
        <div className="not-prose my-4 overflow-x-auto rounded-xl ring-1 ring-zinc-200">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Provider</th>
                <th className="px-4 py-2.5 font-medium">Purpose</th>
                <th className="px-4 py-2.5 font-medium">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {processors.map(([name, purpose, location]) => (
                <tr key={name}>
                  <td className="px-4 py-2.5 font-medium text-zinc-900">{name}</td>
                  <td className="px-4 py-2.5">{purpose}</td>
                  <td className="px-4 py-2.5">{location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          We may also disclose data if required by law or a valid legal request, to protect rights and safety, or as part
          of a merger or acquisition (in which case we will notify you).
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        Our database and AI providers are located outside {legal.country}, mainly in the United States. When we transfer
        personal data across borders we do so in line with {legal.dataProtectionLaw}, relying on safeguards such as
        contractual commitments from our providers to protect the data to an adequate standard, and on the transfer
        being necessary to perform our contract with you.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep data",
    body: (
      <ul>
        <li><strong>Account and proposal data:</strong> for as long as your account is open. When you delete your account, it is erased from our live database immediately and from backups within 30 days.</li>
        <li><strong>Messages and inquiries:</strong> up to 24 months after the conversation ends, then deleted.</li>
        <li><strong>Security logs:</strong> up to 90 days, unless needed to investigate abuse.</li>
        <li>We may keep limited records longer where the law requires it (for example invoices for tax purposes).</li>
      </ul>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Subject to applicable law, you have the right to:</p>
        <ul>
          <li>be informed about and <strong>access</strong> the personal data we hold about you;</li>
          <li>have inaccurate data <strong>corrected</strong>;</li>
          <li>have your data <strong>deleted</strong>;</li>
          <li>receive your data in a portable format (<strong>portability</strong>);</li>
          <li><strong>object</strong> to or <strong>restrict</strong> certain processing;</li>
          <li><strong>withdraw consent</strong> where we rely on it; and</li>
          <li>
            <strong>complain</strong> to {legal.regulator}, or to the supervisory authority where you live.
          </li>
        </ul>
        <p>
          You can exercise most of these yourself in <Link href="/dashboard/settings">Settings</Link>: edit your profile,
          download all your data as JSON, or permanently delete your account. For anything else, email{" "}
          <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>. We respond within 30 days and may need to
          verify your identity.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        We protect your data with encryption in transit (TLS), hashed passwords, access controls that limit each user to
        their own proposals, rate limiting and reputable infrastructure providers. No system is perfectly secure. If a
        personal data breach is likely to put your rights at risk, we will notify you and the regulator as required by
        law.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        The Service is intended for people aged {legal.minimumAge} and over. We do not knowingly collect personal data
        from children. If you believe a child has given us personal data, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We will post any changes on this page with a new effective date. If changes are material we will notify you by
        email or in the Service before they take effect.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Email <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a> for any privacy question or request.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalDoc
      current="/legal/privacy"
      title="Privacy Policy"
      sections={sections}
      summary={
        <>
          <strong className="text-zinc-950">The short version:</strong> we collect only what we need to run Grant
          Genius, we never sell your data or use it to train AI, essential cookies only, and you can export or delete
          everything yourself from Settings.
        </>
      }
    />
  )
}
