import { pageMetadata } from "@/lib/seo"
import { plans, site } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Create your free account",
  description: `Join ${site.name}: discover African grant opportunities and get ${plans.FREE.monthlyGenerations} free AI-drafted proposals every month. No card required.`,
  path: "/register",
})

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
