// Single source of truth for brand, contact and legal details used across
// the marketing site, legal pages and dashboard. Update here, not in pages.

export const site = {
  name: "Grant Genius Africa",
  shortName: "Grant Genius",
  description:
    "Find African grant opportunities and draft strong, funder-ready proposals with AI assistance.",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  supportEmail: "support@grantgenius.africa",
  privacyEmail: "privacy@grantgenius.africa",
  legalEmail: "legal@grantgenius.africa",
} as const

export const legal = {
  // Bump TERMS_VERSION whenever Terms or Privacy Policy change materially;
  // users who accepted an older version are asked to accept again.
  termsVersion: "2026-10-27",
  effectiveDate: "27 October 2026",
  entity: "Grant Genius Africa",
  country: "Malawi",
  governingLaw: "the laws of the Republic of Malawi",
  courts: "the courts of the Republic of Malawi",
  dataProtectionLaw: "the Data Protection Act, 2024 of Malawi",
  regulator: "the Malawi Communications Regulatory Authority (MACRA), as the data protection authority",
  minimumAge: 18,
} as const

export const plans = {
  FREE: { name: "Free", monthlyGenerations: 5 },
  PRO: { name: "Pro", monthlyGenerations: 100 },
  ENTERPRISE: { name: "Enterprise", monthlyGenerations: 1000 },
} as const

export const legalPages = [
  { href: "/legal/terms", title: "Terms of Service" },
  { href: "/legal/privacy", title: "Privacy Policy" },
  { href: "/legal/cookies", title: "Cookie Policy" },
  { href: "/legal/acceptable-use", title: "Acceptable Use Policy" },
  { href: "/legal/ai-disclaimer", title: "AI & Content Disclaimer" },
  { href: "/legal/refunds", title: "Billing & Refund Policy" },
] as const
