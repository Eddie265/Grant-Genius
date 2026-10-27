import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { Providers } from "./providers";
import { CookieNotice } from "@/components/CookieNotice";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>{children}</Providers>
        <CookieNotice />
      </body>
    </html>
  );
}
