import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { site } from "@/lib/site"

// Link preview card shown when the site is shared (WhatsApp, LinkedIn, X, Slack…)
export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const root = process.cwd()
  const [bold, regular, logo] = await Promise.all([
    readFile(join(root, "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff")),
    readFile(join(root, "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff")),
    readFile(join(root, "public/logo-mark-white.png")),
  ])
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`
  const host = site.url.replace(/^https?:\/\//, "")

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#09090b",
          // Soft grey glows, painted as background so nothing is clipped
          backgroundImage:
            "radial-gradient(circle at 88% 8%, rgba(113,113,122,0.42) 0%, rgba(9,9,11,0) 42%), radial-gradient(circle at 0% 100%, rgba(82,82,91,0.45) 0%, rgba(9,9,11,0) 45%)",
          fontFamily: "Space Grotesk",
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img tags */}
          <img src={logoSrc} width={151} height={120} alt="" />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.04em", display: "flex", flexDirection: "column" }}>
              <span>Grant proposals for</span>
              <span>African impact,</span>
              <span style={{ color: "#a1a1aa" }}>drafted in minutes.</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#d4d4d8" }}>
            <span>Find funding · AI first drafts · Export to Word & PDF</span>
            <span style={{ color: "#ffffff", fontWeight: 700 }}>{host}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: bold, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: regular, weight: 400, style: "normal" },
      ],
    }
  )
}
