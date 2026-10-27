import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { site } from "@/lib/site"

// The stacked wordmark is 603×480; height drives the size
const RATIO = 603 / 480

export function Logo({
  height = 44,
  inverted = false,
  href = "/",
  className,
}: {
  height?: number
  inverted?: boolean
  href?: string | null
  className?: string
}) {
  const img = (
    <Image
      src={inverted ? "/logo-mark-white.png" : "/logo-mark.png"}
      alt={site.name}
      width={Math.round(RATIO * height)}
      height={height}
      priority
      className={cn("h-auto select-none", className)}
      style={{ height, width: "auto" }}
    />
  )
  return href ? (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label={`${site.name} home`}>
      {img}
    </Link>
  ) : (
    img
  )
}
