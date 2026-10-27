import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { Providers } from "./providers";
import { CookieNotice } from "@/components/CookieNotice";
import { legal, site } from "@/lib/site";
import { shareImage } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  authors: [{ name: legal.entity }],
  creator: legal.entity,
  publisher: legal.entity,
  category: "business",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: "/",
    locale: "en_GB",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [shareImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

// Structured data so search engines understand what the product is
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: legal.entity,
      url: site.url,
      logo: `${site.url}/logo-mark.png`,
      email: site.supportEmail,
      address: { "@type": "PostalAddress", addressCountry: "MW" },
    },
    {
      "@type": "SoftwareApplication",
      name: site.name,
      url: site.url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: site.description,
      publisher: { "@id": `${site.url}/#organization` },
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
        { "@type": "Offer", name: "Pro", price: "29", priceCurrency: "USD" },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <script
          type="application/ld+json"
          // JSON-LD is built from our own constants, not user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
        <CookieNotice />
      </body>
    </html>
  );
}
