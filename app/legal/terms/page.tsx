import type { Metadata } from "next"
import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { LegalDoc, type LegalSection } from "@/components/site/LegalDoc"
import { legal, site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of Grant Genius Africa, including ownership of your proposals, AI output and Malawian governing law.",
  path: "/legal/terms",
})

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these Terms",
    body: (
      <>
        <p>
          These Terms of Service (“Terms”) form a binding agreement between you and {legal.entity} (“Grant Genius”,
          “we”, “us”) governing your access to and use of our website, web application and related services (the
          “Service”).
        </p>
        <p>
          By creating an account, ticking the acceptance box at sign-up, or using the Service, you confirm that you have
          read, understood and agree to these Terms, our <Link href="/legal/privacy">Privacy Policy</Link>,{" "}
          <Link href="/legal/acceptable-use">Acceptable Use Policy</Link>,{" "}
          <Link href="/legal/ai-disclaimer">AI & Content Disclaimer</Link> and{" "}
          <Link href="/legal/refunds">Billing & Refund Policy</Link>, which are incorporated by reference. Electronic
          acceptance has the same legal effect as a signature, as recognised by the Electronic Transactions and Cyber
          Security Act, 2016 of Malawi. If you do not agree, do not use the Service.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility and organisational use",
    body: (
      <>
        <p>
          You must be at least {legal.minimumAge} years old and able to form a binding contract to use the Service. If
          you use the Service on behalf of an organisation, you confirm that you are authorised to accept these Terms on
          its behalf, and “you” includes that organisation.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    body: (
      <>
        <p>
          You must provide accurate information when you register and keep it up to date. You are responsible for
          keeping your password confidential and for all activity under your account. Tell us immediately at{" "}
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> if you suspect unauthorised access. We may
          refuse registration or reclaim usernames and accounts where reasonably necessary.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "What the Service does",
    body: (
      <>
        <p>The Service provides tools to:</p>
        <ul>
          <li>browse information about grant and funding opportunities collected from public sources;</li>
          <li>generate draft grant proposals using third-party artificial intelligence (“AI”) models;</li>
          <li>edit, store and export your proposals; and</li>
          <li>access guidance material about grant writing.</li>
        </ul>
        <p>
          We may add, change or remove features at any time. We will give reasonable notice of changes that materially
          reduce the functionality of a paid plan.
        </p>
      </>
    ),
  },
  {
    id: "no-guarantee",
    title: "No guarantee of funding or outcomes",
    body: (
      <>
        <p>
          <strong>
            Grant Genius does not guarantee that any proposal will be accepted, shortlisted or funded, or that any
            grant listing is complete, current or suitable for you.
          </strong>{" "}
          Funding decisions are made solely by funders, over whom we have no control. We are not affiliated with,
          endorsed by, or acting as an agent of any funder listed in the Service unless we expressly say so.
        </p>
        <p>
          You are solely responsible for checking eligibility, deadlines, funder requirements (including any rules about
          the use of AI tools), and the accuracy of everything you submit.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Your content and ownership",
    body: (
      <>
        <p>
          “Your Content” means the information you provide to the Service (such as project descriptions and edits) and
          the drafts generated for you. As between you and us, you own Your Content.
        </p>
        <p>
          You grant us a worldwide, non-exclusive, royalty-free licence to host, store, process, transmit and display
          Your Content solely to operate, secure and improve the Service for you, including sending it to our AI and
          hosting providers as described in our Privacy Policy. This licence ends when Your Content is deleted from our
          systems, except for copies held in routine backups for a limited period.
        </p>
        <p>
          You confirm that you have all rights needed to provide Your Content and that it does not infringe anyone
          else’s rights or breach any law. Do not include sensitive personal information (for example health data or
          national identity numbers) about other people unless you have a lawful basis to do so.
        </p>
      </>
    ),
  },
  {
    id: "ai-output",
    title: "AI-generated output",
    body: (
      <>
        <p>
          AI output is generated automatically and may be inaccurate, incomplete, outdated, or similar to content
          generated for other users. It is a starting point, not professional advice. You must review, verify and edit
          all output before relying on or submitting it, and you are responsible for how you use it. Please read our{" "}
          <Link href="/legal/ai-disclaimer">AI & Content Disclaimer</Link>.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <p>
        You must use the Service lawfully and in line with our{" "}
        <Link href="/legal/acceptable-use">Acceptable Use Policy</Link>. In particular, you must not use the Service to
        mislead funders, fabricate data or credentials, plagiarise, or infringe intellectual property.
      </p>
    ),
  },
  {
    id: "fees",
    title: "Plans, fees and payment",
    body: (
      <>
        <p>
          Some features are available free of charge, subject to usage limits shown in the Service. Paid plans are
          offered at the prices published on our website or in a written quote. Paid plans start only after you accept
          a quote and we confirm activation; we never charge you without your agreement.
        </p>
        <p>
          Fees, renewals, cancellations and refunds are governed by our{" "}
          <Link href="/legal/refunds">Billing & Refund Policy</Link>. Prices exclude applicable taxes unless stated
          otherwise.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services and links",
    body: (
      <p>
        The Service relies on third-party providers (for example database hosting and AI model providers) and links to
        third-party websites such as funders’ application portals. We are not responsible for third-party websites,
        their content, availability or practices. Your use of them is governed by their own terms.
      </p>
    ),
  },
  {
    id: "our-ip",
    title: "Our intellectual property",
    body: (
      <>
        <p>
          The Service, including its software, design, logos, the “Grant Genius” name and our guidance materials, is
          owned by us or our licensors and protected by law. We grant you a limited, non-exclusive, non-transferable,
          revocable licence to use the Service for your internal purposes in line with these Terms. You may not copy,
          resell, or create derivative works of the Service.
        </p>
        <p>If you send us feedback or suggestions, we may use them without obligation to you.</p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Suspension and termination",
    body: (
      <>
        <p>
          You may stop using the Service and delete your account at any time from Settings. We may suspend or terminate
          your access, with notice where practicable, if you materially breach these Terms, if required by law, or to
          protect the Service or other users.
        </p>
        <p>
          On termination your right to use the Service ends. You can export your data before deleting your account.
          Sections that by their nature should survive (including ownership, disclaimers, limitation of liability,
          indemnity and governing law) survive termination.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <p>
        To the fullest extent permitted by law, the Service is provided “as is” and “as available”, without warranties
        of any kind, whether express or implied, including warranties of merchantability, fitness for a particular
        purpose, accuracy and non-infringement. We do not warrant that the Service will be uninterrupted, secure or
        error-free. Nothing in these Terms excludes rights you have as a consumer that cannot be excluded under
        applicable law, including the Consumer Protection Act of Malawi.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <p>To the fullest extent permitted by law:</p>
        <ul>
          <li>
            we are not liable for any indirect, incidental, special, consequential or punitive loss, or for loss of
            profits, revenue, funding, grants, opportunities, goodwill or data, however caused; and
          </li>
          <li>
            our total liability arising out of or relating to the Service or these Terms is limited to the greater of
            (a) the fees you paid us in the 12 months before the event giving rise to the claim and (b) USD 100.
          </li>
        </ul>
        <p>
          These limits do not apply to liability that cannot be limited by law, such as liability for fraud, or for
          death or personal injury caused by negligence.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: (
      <p>
        You agree to indemnify and hold us harmless from claims, losses and expenses (including reasonable legal fees)
        brought by third parties arising from Your Content, your submissions to funders, or your breach of these Terms
        or of the law.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    body: (
      <p>
        We may update these Terms from time to time. If changes are material we will notify you by email or in the
        Service at least 14 days before they take effect, and may ask you to accept the updated version. Continued use
        after the effective date means you accept the changes. If you do not agree, you may close your account.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <>
        <p>
          These Terms are governed by {legal.governingLaw}. Before starting formal proceedings, you and we agree to try
          to resolve any dispute in good faith by written notice and negotiation for at least 30 days.
        </p>
        <p>
          If a dispute is not resolved, it will be subject to the exclusive jurisdiction of {legal.courts}, except that
          either party may seek urgent injunctive relief in any competent court. Nothing in this section limits any
          mandatory consumer rights you may have to bring proceedings where you live.
        </p>
      </>
    ),
  },
  {
    id: "general",
    title: "General",
    body: (
      <p>
        These Terms, together with the policies referenced above, are the entire agreement between you and us about the
        Service. If any provision is found unenforceable, the rest remains in effect. Our failure to enforce a provision
        is not a waiver. You may not assign these Terms without our consent; we may assign them in connection with a
        merger, acquisition or sale of assets. Nothing in these Terms creates a partnership, agency or employment
        relationship.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these Terms? Email <a href={`mailto:${site.legalEmail}`}>{site.legalEmail}</a> or use our{" "}
        <Link href="/dashboard/contact">support form</Link>.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalDoc
      current="/legal/terms"
      title="Terms of Service"
      sections={sections}
      summary={
        <>
          <strong className="text-zinc-950">The short version:</strong> you own your proposals; AI drafts are a starting
          point you must check; we don’t guarantee funding; use the Service lawfully and honestly; Malawian law applies.
          The full Terms below are what count.
        </>
      }
    />
  )
}
