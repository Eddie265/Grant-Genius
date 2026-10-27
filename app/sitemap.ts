import type { MetadataRoute } from "next"
import { legal, legalPages, site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const legalUpdated = new Date(legal.termsVersion)

  return [
    { url: `${site.url}/register`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/login`, changeFrequency: "monthly", priority: 0.8 },
    ...legalPages.map((p) => ({
      url: `${site.url}${p.href}`,
      lastModified: legalUpdated,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ]
}
