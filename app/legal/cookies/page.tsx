import type { Metadata } from "next"
import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { LegalDoc, type LegalSection } from "@/components/site/LegalDoc"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Grant Genius Africa uses only essential cookies to keep you signed in and secure. No analytics or advertising cookies.",
  path: "/legal/cookies",
})

const cookies = [
  ["next-auth.session-token", "Cookie", "Keeps you signed in to your account", "30 days"],
  ["next-auth.csrf-token", "Cookie", "Protects sign-in forms against cross-site request forgery", "Session"],
  ["next-auth.callback-url", "Cookie", "Returns you to the right page after signing in", "Session"],
  ["gg-cookie-notice", "Local storage", "Remembers that you dismissed this cookie notice", "Until cleared"],
]

const sections: LegalSection[] = [
  {
    id: "what",
    title: "What cookies are",
    body: (
      <p>
        Cookies are small text files stored by your browser. Similar technologies, such as local storage, work in a
        comparable way. We use them only where they are strictly necessary to provide the Service you ask for.
      </p>
    ),
  },
  {
    id: "which",
    title: "Cookies we use",
    body: (
      <>
        <p>
          On secure (HTTPS) connections, cookie names may carry a <code>__Secure-</code> or <code>__Host-</code> prefix.
        </p>
        <div className="not-prose my-4 overflow-x-auto rounded-xl ring-1 ring-zinc-200">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Purpose</th>
                <th className="px-4 py-2.5 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cookies.map(([name, type, purpose, duration]) => (
                <tr key={name}>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-zinc-900">{name}</td>
                  <td className="px-4 py-2.5">{type}</td>
                  <td className="px-4 py-2.5">{purpose}</td>
                  <td className="px-4 py-2.5">{duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "no-tracking",
    title: "No analytics or advertising cookies",
    body: (
      <p>
        We do not use analytics, advertising, social media or other tracking cookies, and we do not allow third parties
        to set cookies through our Service. If this changes, we will update this policy and ask for your consent before
        setting any non-essential cookie.
      </p>
    ),
  },
  {
    id: "control",
    title: "Managing cookies",
    body: (
      <p>
        Because these cookies are strictly necessary, they do not require consent. You can block or delete cookies in
        your browser settings, but you will not be able to sign in without the session cookie.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions? Email <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>. See also our{" "}
        <Link href="/legal/privacy">Privacy Policy</Link>.
      </p>
    ),
  },
]

export default function CookiesPage() {
  return (
    <LegalDoc
      current="/legal/cookies"
      title="Cookie Policy"
      sections={sections}
      summary={
        <>
          <strong className="text-zinc-950">The short version:</strong> we use only essential cookies to keep you signed
          in and secure. No analytics, no advertising, no tracking.
        </>
      }
    />
  )
}
