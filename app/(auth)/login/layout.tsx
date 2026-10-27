import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Sign in",
  description: `Sign in to ${site.name} to find grants and draft funder-ready proposals with AI.`,
  path: "/login",
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
