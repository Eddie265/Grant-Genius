import type { MetadataRoute } from "next"

// App-only product: keep it out of search engines, legal pages included
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } }
}
